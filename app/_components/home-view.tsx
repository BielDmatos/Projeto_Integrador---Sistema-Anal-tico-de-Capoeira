'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Music2, Users, GraduationCap, Sparkles, MessageSquare, BarChart3 } from 'lucide-react'
import { Dashboard } from './dashboard'
import { ChatNL } from './chat-nl'

export function HomeView() {
  const [tab, setTab] = useState<'dashboard' | 'chat'>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  useEffect(() => {
    setIsLoadingStats(true)
    fetch('/api/stats', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error ?? 'Erro ao carregar estatísticas')
        setStats(data)
      })
      .catch((error: any) => setStats({ error: true, errorMessage: error?.message ?? 'Erro ao carregar estatísticas' }))
      .finally(() => setIsLoadingStats(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight">Capoeira Analytics</div>
              <div className="text-xs text-muted-foreground">Perguntas em linguagem natural</div>
            </div>
          </div>
          <nav className="flex gap-2">
            <button onClick={() => setTab('dashboard')} className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${tab === 'dashboard' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-muted'}`}>
              <BarChart3 className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => setTab('chat')} className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${tab === 'chat' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-muted'}`}>
              <MessageSquare className="w-4 h-4" /> Pergunte em PT-BR
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> NL2SQL para grupos de capoeira
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Conheça seu grupo de <span className="text-primary">capoeira</span> com perguntas simples.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Pergunte em português: “quantos alunos são bolsistas?”, “qual a idade média por bairro?”. O sistema gera SQL com segurança, consulta o banco e devolve resposta + tabela.
          </p>
          {isLoadingStats && (
            <div className="mt-6 text-sm text-muted-foreground">Carregando estatísticas...</div>
          )}
          {stats && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat icon={<Users className="w-4 h-4" />} label="Alunos" value={stats.total} />
              <Stat icon={<Sparkles className="w-4 h-4" />} label="Ativos" value={stats.ativos} />
              <Stat icon={<GraduationCap className="w-4 h-4" />} label="Idade média" value={stats.mediaIdade} suffix=" anos" />
              <Stat icon={<BarChart3 className="w-4 h-4" />} label="Renda média" value={stats.mediaRenda} prefix="R$ " />
            </div>
          )}
        </motion.div>
      </section>

      <main className="max-w-[1200px] mx-auto px-6 pb-20">
        {tab === 'dashboard' ? <Dashboard stats={stats} /> : <ChatNL />}
      </main>

      <footer className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-6 text-sm text-muted-foreground flex flex-wrap gap-4 justify-between">
          <div>Capoeira Analytics — Projeto Integrador (IA · NL2SQL)</div>
          <div className="font-mono text-xs">PostgreSQL · LLM · Next.js</div>
        </div>
      </footer>
    </div>
  )
}

function Stat({ icon, label, value, prefix = '', suffix = '' }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-lg bg-card shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="font-display text-2xl font-bold mt-1 tabular-nums">{prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}</div>
    </motion.div>
  )
}
