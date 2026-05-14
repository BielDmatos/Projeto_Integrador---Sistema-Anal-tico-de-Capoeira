import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SCHEMA_DESC = `
Você é um assistente que converte perguntas em PORTUGUÊS para SQL PostgreSQL para o banco de dados de um grupo de capoeira.

IMPORTANTE - Os nomes das tabelas/colunas são EXATAMENTE estes (case-sensitive entre aspas duplas):

Tabela "Bairro" (id, nome, cidade, regiao)
Tabela "Instrutor" (id, nome, apelido, graduacao, anos_exp)
Tabela "Turma" (id, nome, nivel, dia_semana, horario, instrutor_id)
Tabela "Aluno" (id, nome, apelido, genero, data_nascimento, idade, escolaridade, renda_familiar, bairro_id, turma_id, graduacao, data_ingresso, status, bolsista)
Tabela "Frequencia" (id, aluno_id, turma_id, data, presente)
Tabela "Mensalidade" (id, aluno_id, mes_referencia, valor, pago, data_pagamento)

Valores possíveis:
- genero: 'masculino', 'feminino'
- escolaridade: 'fundamental', 'medio', 'superior_incompleto', 'superior', 'pos'
- graduacao (Aluno): 'corda_crua', 'corda_amarela', 'corda_laranja', 'corda_azul', 'corda_verde', 'corda_roxa'
- nivel (Turma): 'infantil', 'iniciante', 'intermediario', 'avancado'
- status: 'ativo', 'inativo', 'trancado'

REGRAS RÍGIDAS:
1. Gere apenas UMA query SELECT (read-only). Proibido INSERT/UPDATE/DELETE/DROP/ALTER/TRUNCATE/CREATE.
2. Use aspas duplas nos nomes de tabelas e colunas: SELECT "nome", "idade" FROM "Aluno".
3. Use LIMIT 100 sempre que retornar listas.
4. Para porcentagens/contagens use COUNT, AVG, SUM apropriadamente.
5. Responda APENAS em JSON puro: {"sql": "...", "explicacao_curta": "..."}
`

function validateSQL(sql: string): { ok: boolean; error?: string } {
  const s = sql.trim().replace(/;+\s*$/, '')
  if (!/^select\s/i.test(s)) return { ok: false, error: 'Apenas SELECT permitido.' }
  const forbidden = /\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|copy|merge)\b/i
  if (forbidden.test(s)) return { ok: false, error: 'Comando proibido detectado.' }
  if (s.includes(';')) return { ok: false, error: 'Múltiplas statements não permitidas.' }
  return { ok: true }
}

async function callLLM(messages: any[], opts: { json?: boolean } = {}): Promise<string> {
  const body: any = { model: 'gpt-5.4-mini', messages, max_tokens: 1500, stream: false }
  if (opts.json) body.response_format = { type: 'json_object' }
  const r = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}` },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`LLM erro ${r.status}: ${await r.text()}`)
  const data = await r.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

export async function POST(req: NextRequest) {
  const { pergunta } = await req.json()
  if (!pergunta || typeof pergunta !== 'string') {
    return new Response(JSON.stringify({ error: 'pergunta obrigatória' }), { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      const heartbeat = setInterval(() => send({ status: 'processing' }), 4000)
      try {
        send({ status: 'processing', message: 'Convertendo pergunta em SQL...' })
        const sqlGenRaw = await callLLM(
          [
            { role: 'system', content: SCHEMA_DESC + '\nResponda APENAS JSON cru, sem markdown.' },
            { role: 'user', content: pergunta },
          ],
          { json: true },
        )
        let parsed: any
        try { parsed = JSON.parse(sqlGenRaw) } catch {
          parsed = { sql: '', explicacao_curta: 'Não consegui gerar SQL.' }
        }
        const sql = String(parsed?.sql ?? '').trim()
        const v = validateSQL(sql)
        if (!v.ok) {
          send({ status: 'completed', result: { sql, error: v.error, rows: [], resposta: 'Não foi possível executar essa pergunta com segurança: ' + v.error } })
          clearInterval(heartbeat); controller.close(); return
        }

        send({ status: 'processing', message: 'Executando consulta...', sql })
        let rows: any[] = []
        try {
          rows = await prisma.$queryRawUnsafe<any[]>(sql)
          // BigInt-safe
          rows = JSON.parse(JSON.stringify(rows, (_k, v) => typeof v === 'bigint' ? Number(v) : v))
        } catch (e: any) {
          send({ status: 'completed', result: { sql, error: e?.message ?? 'erro SQL', rows: [], resposta: 'Erro ao executar SQL: ' + (e?.message ?? '') } })
          clearInterval(heartbeat); controller.close(); return
        }

        send({ status: 'processing', message: 'Gerando resposta em linguagem natural...' })
        const preview = JSON.stringify(rows.slice(0, 30))
        const explan = await callLLM([
          { role: 'system', content: 'Você é um assistente que explica de forma curta e objetiva, em português brasileiro, o resultado de uma consulta SQL para um grupo de capoeira. Seja direto, em 1-3 frases. Não invente dados.' },
          { role: 'user', content: `Pergunta: ${pergunta}\nSQL: ${sql}\nResultado (até 30 linhas): ${preview}\nTotal de linhas: ${rows.length}\n\nResponda em PT-BR.` },
        ])

        send({ status: 'completed', result: { sql, rows, resposta: explan, total: rows.length } })
        clearInterval(heartbeat); controller.close()
      } catch (e: any) {
        clearInterval(heartbeat)
        send({ status: 'error', message: e?.message ?? 'erro' })
        controller.close()
      }
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } })
}
