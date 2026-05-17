'use client'
import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#B8651E', '#E0A458', '#80604A', '#D97757', '#A0522D', '#6B4423', '#FF9149', '#80D8C3']

export function Dashboard({ stats }: { stats: any }) {
  if (!stats) return <div className="py-20 text-center text-muted-foreground">Carregando estatísticas...</div>
  if (stats.error) return <div className="py-20 text-center text-destructive">Erro ao carregar as estatísticas: {stats.errorMessage ?? 'erro desconhecido'}</div>

  const porBairro = Array.isArray(stats.porBairro) ? stats.porBairro : []
  const faixaEtaria = Array.isArray(stats.faixaEtaria) ? stats.faixaEtaria : []
  const faixaRenda = Array.isArray(stats.faixaRenda) ? stats.faixaRenda : []
  const porGenero = Array.isArray(stats.porGenero) ? stats.porGenero : []
  const porGraduacao = Array.isArray(stats.porGraduacao) ? stats.porGraduacao : []
  const porTurma = Array.isArray(stats.porTurma) ? stats.porTurma : []
  const porEscolaridade = Array.isArray(stats.porEscolaridade) ? stats.porEscolaridade : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
      <Card title="Alunos por bairro">
        <ChartBar data={porBairro} xKey="bairro" />
      </Card>
      <Card title="Faixa etária">
        <ChartBar data={faixaEtaria} xKey="faixa" />
      </Card>
      <Card title="Faixa de renda familiar">
        <ChartBar data={faixaRenda} xKey="faixa" />
      </Card>
      <Card title="Distribuição por gênero">
        <ChartPie data={porGenero.map((g: any) => ({ name: g.genero, value: g.count }))} />
      </Card>
      <Card title="Alunos por graduação (corda)">
        <ChartBar data={porGraduacao.map((g: any) => ({ x: String(g.graduacao || '').replace('corda_', ''), count: g.count }))} xKey="x" />
      </Card>
      <Card title="Alunos por turma">
        <ChartBar data={porTurma.map((g: any) => ({ x: g.turma, count: g.count }))} xKey="x" />
      </Card>
      <Card title="Escolaridade" full>
        <ChartBar data={porEscolaridade.map((g: any) => ({ x: g.escolaridade, count: g.count }))} xKey="x" />
      </Card>
    </div>
  )
}

function Card({ title, children, full }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      className={`rounded-lg bg-card shadow-sm p-4 hover:shadow-md transition ${full ? 'md:col-span-2' : ''}`}>
      <h3 className="font-display font-semibold mb-2">{title}</h3>
      <div className="h-64">{children}</div>
    </motion.div>
  )
}

function ChartBar({ data, xKey }: { data: any[]; xKey: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
        <XAxis dataKey={xKey} tickLine={false} tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} height={60} />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} allowDecimals={false} />
        <Tooltip wrapperStyle={{ fontSize: 11 }} />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="count" name="Alunos" fill="#B8651E" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function ChartPie({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        <Tooltip wrapperStyle={{ fontSize: 11 }} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} label={{ fontSize: 11 }}>
          {(data ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
