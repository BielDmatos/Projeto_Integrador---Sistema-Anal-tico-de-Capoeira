'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Database, Sparkles, AlertTriangle } from 'lucide-react'

const SUGESTOES = [
  'Quantos alunos estão ativos?',
  'Qual a idade média dos alunos por bairro?',
  'Quantos alunos são bolsistas e qual a renda média deles?',
  'Distribuição de alunos por graduação',
  'Quais bairros têm mais alunos?',
  'Total de mensalidades pagas no último mês',
  'Quantos alunos por escolaridade?',
  'Qual a média de presença por turma?',
]

export function ChatNL() {
  const [pergunta, setPergunta] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<any>(null)
  const [erro, setErro] = useState('')

  async function enviar(p?: string) {
    const q = (p ?? pergunta).trim()
    if (!q) return
    setPergunta(q); setLoading(true); setStatus('Iniciando...'); setResult(null); setErro('')
    try {
      const r = await fetch('/api/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pergunta: q }) })
      const reader = r.body!.getReader()
      const dec = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const obj = JSON.parse(line.slice(6))
            if (obj.status === 'processing') setStatus(obj.message ?? 'Processando...')
            else if (obj.status === 'completed') { setResult(obj.result); setStatus('') }
            else if (obj.status === 'error') { setErro(obj.message ?? 'Erro'); setStatus('') }
          } catch {}
        }
      }
    } catch (e: any) {
      setErro(e?.message ?? 'Erro de rede')
    } finally { setLoading(false) }
  }

  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-lg bg-card shadow-sm p-4">
          <label className="text-sm font-medium flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-primary" /> Pergunte em português</label>
          <div className="flex gap-2">
            <input value={pergunta} onChange={e => setPergunta(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()}
              placeholder="Ex: quantos alunos do bairro Liberdade são bolsistas?"
              className="flex-1 px-4 py-3 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary" />
            <button onClick={() => enviar()} disabled={loading} className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Enviar
            </button>
          </div>
          {status && <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> {status}</div>}
          {erro && <div className="mt-3 text-sm text-destructive flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {erro}</div>}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-lg bg-card shadow-sm p-4">
              <h3 className="font-display font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Resposta</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.resposta}</p>
              {result.error && <p className="text-sm text-destructive mt-2">{result.error}</p>}
            </div>
            {result.sql && (
              <div className="rounded-lg bg-card shadow-sm p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-2"><Database className="w-3 h-3" /> SQL gerado</h4>
                <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap">{result.sql}</pre>
              </div>
            )}
            {result.rows && result.rows.length > 0 && (
              <div className="rounded-lg bg-card shadow-sm p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Resultado ({result.total} linha{result.total === 1 ? '' : 's'})</h4>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>{Object.keys(result.rows[0] ?? {}).map(k => <th key={k} className="text-left px-3 py-2 font-medium">{k}</th>)}</tr>
                    </thead>
                    <tbody>
                      {result.rows.slice(0, 100).map((row: any, i: number) => (
                        <tr key={i} className="border-t border-border hover:bg-muted/50">
                          {Object.values(row).map((v: any, j: number) => <td key={j} className="px-3 py-2 font-mono text-xs">{v === null ? '—' : String(v)}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <aside className="rounded-lg bg-card shadow-sm p-4 h-fit">
        <h3 className="font-display font-semibold mb-3">Sugestões</h3>
        <div className="space-y-2">
          {SUGESTOES.map(s => (
            <button key={s} onClick={() => enviar(s)} disabled={loading} className="w-full text-left text-sm px-3 py-2 rounded-md bg-muted hover:bg-accent/30 transition disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <strong>Segurança:</strong> apenas SELECT é permitido. Comandos DDL/DML são bloqueados.
        </div>
      </aside>
    </div>
  )
}
