import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const total = await prisma.aluno.count()
    const ativos = await prisma.aluno.count({ where: { status: 'ativo' } })
    const bolsistas = await prisma.aluno.count({ where: { bolsista: true } })
    const agg = await prisma.aluno.aggregate({ _avg: { idade: true, rendaFamiliar: true } })

    const porGenero = await prisma.aluno.groupBy({ by: ['genero'], _count: { _all: true } })
    const porGraduacao = await prisma.aluno.groupBy({ by: ['graduacao'], _count: { _all: true } })
    const porEscolaridade = await prisma.aluno.groupBy({ by: ['escolaridade'], _count: { _all: true } })

    const bairros = await prisma.bairro.findMany({ include: { _count: { select: { alunos: true } } } })
    const turmas = await prisma.turma.findMany({ include: { _count: { select: { alunos: true } } } })

    // Faixas etárias
    const alunos = await prisma.aluno.findMany({ select: { idade: true, rendaFamiliar: true } })
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
    console.error(e)
    return NextResponse.json({ error: e?.message ?? 'erro' }, { status: 500 })
  }
}
