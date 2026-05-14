import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randFloat(min: number, max: number) { return Math.random() * (max - min) + min }

async function main() {
  // Bairros de Salvador
  const bairrosData = [
    { nome: 'Pelourinho', regiao: 'Centro Histórico' },
    { nome: 'Liberdade', regiao: 'Miolo' },
    { nome: 'Federação', regiao: 'Centro' },
    { nome: 'Itapuã', regiao: 'Orla' },
    { nome: 'Cabula', regiao: 'Miolo' },
    { nome: 'Barra', regiao: 'Orla' },
    { nome: 'Pituba', regiao: 'Orla' },
    { nome: 'Cajazeiras', regiao: 'Suburábio' },
    { nome: 'Brotas', regiao: 'Centro' },
    { nome: 'São Caetano', regiao: 'Suburábio' },
  ]
  const bairros = []
  for (const b of bairrosData) {
    bairros.push(await prisma.bairro.upsert({ where: { nome: b.nome }, update: {}, create: b }))
  }

  // Instrutores
  const instrutoresData = [
    { nome: 'João Carlos Silva', apelido: 'Mestre Beira-Mar', graduacao: 'corda_preta', anosExp: 30 },
    { nome: 'Maria do Carmo Souza', apelido: 'Contramestra Andorinha', graduacao: 'corda_marrom', anosExp: 18 },
    { nome: 'Rafael Pereira', apelido: 'Professor Faísca', graduacao: 'corda_roxa', anosExp: 12 },
    { nome: 'Ana Beatriz Lima', apelido: 'Professora Lua', graduacao: 'corda_roxa', anosExp: 10 },
  ]
  const instrutores = []
  for (const i of instrutoresData) instrutores.push(await prisma.instrutor.create({ data: i }))

  // Turmas
  const turmasData = [
    { nome: 'Infantil A', nivel: 'infantil', diaSemana: 'Segunda/Quarta', horario: '17:00', instrutorId: instrutores[3].id },
    { nome: 'Iniciantes Adulto', nivel: 'iniciante', diaSemana: 'Terça/Quinta', horario: '19:00', instrutorId: instrutores[2].id },
    { nome: 'Intermediário', nivel: 'intermediario', diaSemana: 'Segunda/Quarta', horario: '20:00', instrutorId: instrutores[1].id },
    { nome: 'Avançado', nivel: 'avancado', diaSemana: 'Sexta', horario: '20:00', instrutorId: instrutores[0].id },
    { nome: 'Roda Aberta', nivel: 'intermediario', diaSemana: 'Sábado', horario: '10:00', instrutorId: instrutores[0].id },
  ]
  const turmas = []
  for (const t of turmasData) turmas.push(await prisma.turma.create({ data: t }))

  // Alunos
  const nomesM = ['Lucas', 'Pedro', 'Gabriel', 'Mateus', 'Rafael', 'Bruno', 'Felipe', 'Diego', 'Carlos', 'André', 'Tiago', 'Vinícius', 'Marcos', 'Henrique', 'Daniel', 'Caio', 'Eduardo', 'Ramon', 'Igor', 'Davi']
  const nomesF = ['Ana', 'Maria', 'Beatriz', 'Camila', 'Juliana', 'Larissa', 'Letícia', 'Mariana', 'Patrícia', 'Renata', 'Sofía', 'Yasmin', 'Carla', 'Daniela', 'Fernanda', 'Gabriela', 'Helena', 'Isabela', 'Jamile', 'Kátia']
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Almeida', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Dias', 'Nascimento']
  const apelidos = ['Beija-Flor', 'Tubarão', 'Capoeira', 'Vento', 'Fogo', 'Onda', 'Estrela', null, null, 'Trovoada', 'Corisco', 'Saci', 'Boi', 'Cobra', null]
  const escolaridades = ['fundamental', 'medio', 'superior_incompleto', 'superior', 'pos']
  const graduacoes = ['corda_crua', 'corda_amarela', 'corda_laranja', 'corda_azul', 'corda_verde', 'corda_roxa']
  const generos = ['masculino', 'feminino']

  const totalAlunos = 60
  for (let i = 0; i < totalAlunos; i++) {
    const genero = rand(generos)
    const nome = (genero === 'masculino' ? rand(nomesM) : rand(nomesF)) + ' ' + rand(sobrenomes) + ' ' + rand(sobrenomes)
    const idade = randInt(6, 65)
    const dataNasc = new Date(2026 - idade, randInt(0, 11), randInt(1, 28))
    let escolaridade: string
    if (idade < 14) escolaridade = 'fundamental'
    else if (idade < 18) escolaridade = 'medio'
    else escolaridade = rand(escolaridades.slice(1))
    const rendaFamiliar = Math.round(randFloat(800, 12000) * 100) / 100
    const turma = idade < 14 ? turmas[0] : rand(turmas.slice(1))
    const graduacao = idade < 14 ? rand(['corda_crua', 'corda_amarela']) : rand(graduacoes)
    const dataIngresso = new Date(2026 - randInt(0, 5), randInt(0, 11), randInt(1, 28))
    const status = Math.random() < 0.85 ? 'ativo' : (Math.random() < 0.5 ? 'trancado' : 'inativo')
    const bolsista = rendaFamiliar < 2000 && Math.random() < 0.6

    const aluno = await prisma.aluno.create({
      data: {
        nome, apelido: rand(apelidos), genero, dataNascimento: dataNasc, idade,
        escolaridade, rendaFamiliar, bairroId: rand(bairros).id, turmaId: turma.id,
        graduacao, dataIngresso, status, bolsista,
      },
    })

    // Mensalidades dos últimos 6 meses
    for (let m = 0; m < 6; m++) {
      const d = new Date(); d.setMonth(d.getMonth() - m)
      const mesRef = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const pago = bolsista ? true : Math.random() < 0.85
      await prisma.mensalidade.create({
        data: {
          alunoId: aluno.id, mesReferencia: mesRef,
          valor: bolsista ? 0 : 80, pago,
          dataPagamento: pago ? new Date(d.getFullYear(), d.getMonth(), randInt(1, 28)) : null,
        },
      })
    }

    // Frequências últimas 8 aulas
    for (let f = 0; f < 8; f++) {
      const d = new Date(); d.setDate(d.getDate() - f * 3)
      await prisma.frequencia.create({
        data: { alunoId: aluno.id, turmaId: turma.id, data: d, presente: Math.random() < 0.75 },
      })
    }
  }

  console.log('Seed concluído!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
