'use client'
import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Sparkles, AlertTriangle, Download } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

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
  const [result, setResult] = useState<any>(null)
  const [erro, setErro] = useState('')
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  const chartData = useMemo(() => {
    if (!result?.rows || !Array.isArray(result.rows) || result.rows.length === 0) return []
    const firstRow = result.rows[0]
    const keys = Object.keys(firstRow)
    if (keys.length < 2) return []
    const labelKey = keys.find((k: string) => typeof firstRow[k] === 'string')
    const valueKey = keys.find((k: string) => typeof firstRow[k] === 'number')
    if (!labelKey || !valueKey) return []
    return result.rows
      .filter((row: any) => typeof row?.[labelKey] === 'string' && typeof row?.[valueKey] === 'number')
      .slice(0, 20)
      .map((row: any) => ({ name: row[labelKey], value: row[valueKey] }))
  }, [result])

  async function exportarGrafico() {
    if (!chartContainerRef.current || chartData.length === 0) return
    const svg = chartContainerRef.current.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'grafico-analista.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function enviar(p?: string) {
    const q = (p ?? pergunta).trim()
    if (!q) return
    setPergunta(q); setLoading(true); setResult(null); setErro('')
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
            if (obj.status === 'completed') { setResult(obj.result) }
            else if (obj.status === 'error') { setErro(obj.message ?? 'Erro') }
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
          {erro && <div className="mt-3 text-sm text-destructive flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {erro}</div>}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-lg bg-card shadow-sm p-4">
              <h3 className="font-display font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Resposta</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.resposta}</p>
              {result.error && <p className="text-sm text-destructive mt-2">{result.error}</p>}
            </div>
            {result.rows && result.rows.length > 0 && (
              <div className="rounded-lg bg-card shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Resultado ({result.total} linha{result.total === 1 ? '' : 's'})</h4>
                  <button
                    onClick={exportarGrafico}
                    disabled={chartData.length === 0}
                    className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition"
                  >
                    <Download className="w-3 h-3" /> Exportar gráfico
                  </button>
                </div>

                {chartData.length > 0 && (
                  <div className="h-72" ref={chartContainerRef}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
                        <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} height={70} />
                        <YAxis tickLine={false} tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="value" name="Valor" fill="#B8651E" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

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
