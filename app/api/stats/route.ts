import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

async function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout ao consultar banco. Verifique DATABASE_URL no Vercel e use a URL de Pooler do Supabase.')), ms)),
  ])
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL não configurada no ambiente de produção.' }, { status: 500 })
    }

    const [
      total,
      ativos,
      bolsistas,
      agg,
      porGenero,
      porGraduacao,
      porEscolaridade,
      bairros,
      turmas,
    ] = await withTimeout(Promise.all([
      prisma.aluno.count(),
      prisma.aluno.count({ where: { status: 'ativo' } }),
      prisma.aluno.count({ where: { bolsista: true } }),
      prisma.aluno.aggregate({ _avg: { idade: true, rendaFamiliar: true } }),
      prisma.aluno.groupBy({ by: ['genero'], _count: { _all: true } }),
      prisma.aluno.groupBy({ by: ['graduacao'], _count: { _all: true } }),
      prisma.aluno.groupBy({ by: ['escolaridade'], _count: { _all: true } }),
      prisma.bairro.findMany({ include: { _count: { select: { alunos: true } } } }),
      prisma.turma.findMany({ include: { _count: { select: { alunos: true } } } }),
    ]))

    const alunos = await withTimeout(prisma.aluno.findMany({ select: { idade: true, rendaFamiliar: true } }))
    const faixas = [
      { faixa: '0-12', count: 0 }, { faixa: '13-17', count: 0 },
      { faixa: '18-25', count: 0 }, { faixa: '26-40', count: 0 },
      { faixa: '41-60', count: 0 }, { faixa: '60+', count: 0 },
    ]
    const rendas = [
      { faixa: 'Até 1 SM', count: 0 }, { faixa: '1-3 SM', count: 0 },
      { faixa: '3-5 SM', count: 0 }, { faixa: '5-10 SM', count: 0 }, { faixa: '10+ SM', count: 0 },
    ]
    const SM = 1412
    for (const a of alunos) {
      if (a.idade <= 12) faixas[0].count++
      else if (a.idade <= 17) faixas[1].count++
      else if (a.idade <= 25) faixas[2].count++
      else if (a.idade <= 40) faixas[3].count++
      else if (a.idade <= 60) faixas[4].count++
      else faixas[5].count++

      const r = a.rendaFamiliar
      if (r <= SM) rendas[0].count++
      else if (r <= 3 * SM) rendas[1].count++
      else if (r <= 5 * SM) rendas[2].count++
      else if (r <= 10 * SM) rendas[3].count++
      else rendas[4].count++
    }

    return NextResponse.json({
      total, ativos, bolsistas,
      mediaIdade: Number((agg._avg.idade ?? 0).toFixed(1)),
      mediaRenda: Number((agg._avg.rendaFamiliar ?? 0).toFixed(2)),
      porGenero: porGenero.map(g => ({ genero: g.genero, count: g._count._all })),
      porGraduacao: porGraduacao.map(g => ({ graduacao: g.graduacao, count: g._count._all })),
      porEscolaridade: porEscolaridade.map(g => ({ escolaridade: g.escolaridade, count: g._count._all })),
      porBairro: bairros.map(b => ({ bairro: b.nome, count: b._count.alunos })),
      porTurma: turmas.map(t => ({ turma: t.nome, count: t._count.alunos })),
      faixaEtaria: faixas,
      faixaRenda: rendas,
    })
  } catch (e: any) {
    console.error('GET /api/stats error:', e)
    const message = String(e?.message ?? 'erro')
    const hint = /timeout|connect|connection|socket|database|ssl|postgres|prisma/i.test(message)
      ? ' Verifique no Vercel: DATABASE_URL usando Supabase Pooler (porta 6543) e SSL habilitado.'
      : ''
    return NextResponse.json({ error: `${message}${hint}` }, { status: 500 })
  }
}
