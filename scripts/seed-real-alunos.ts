import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Dados dos alunos do CSV
const alunosCSV = [
  { nome: 'Agatha Bianca S. Conceição', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Agatha Moreira da Cruz', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Alana Souza do Nascimento', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Alexia Felipe Annino Marinatto', genero: 'feminino', escolaridade: 'superior', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Alice Campos Santos', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Alice Santos Queiroz', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Aline Elias Sousa', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Alycia Valentina Avelino dos Santos', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Ana Clara de Paula Sales', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Andréia Gomes Bezerra', genero: 'feminino', escolaridade: 'superior', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Angelina Mirelly', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Antony Abração Muri de O.', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Antony Lima de Oliveira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Ariane Inácio Maranzani', genero: 'feminino', escolaridade: 'superior', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Arthur Calebe Silva Queiroz', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Bernardo Santos de Souza', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Cadu Santos Marcolino Albano', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Caetano Dominoni Gomes Silva', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Calebe Soares Ferreira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Caroline Vitória Inácio da Silva', genero: 'feminino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Cecília dos Anjos Amorim', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: true },
  { nome: 'Célio Silva Júnior', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Dandara Ribeiro Moraes', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Daniel Victor de Moreira Oliveira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Augusto Soares Ferreira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Campos Santos', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Davi Figueiredo Alves', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Henrique de Paula Sales', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Inácio da Silva', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Luis Theodoro', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Miguel Fernandes', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Davi Pereira França', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Deivid Duarte Santos', genero: 'masculino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Diene Brandão Santhiago', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Diego Machado Brandão Santhiago', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Eduarda Fernandes Toledo', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Eduardo H. S. Bicudo', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Elisângela Souza Matos', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Enzo Costa Lima', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Enzo Gabriel Fernandes Toledo', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Enzo Gabriel Guedes Ferreira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Enzo Miguel A. da Silva', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Enzo Souza Farias', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Felipe Gabriel Rocha', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Gabriel de Matos', genero: 'masculino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Gabriel Telles de Castro', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Gabrielle M. Borborema', genero: 'feminino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Gabrielly Lima da Silva', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Gabrielly Thaís de Campos', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Guilherme Fernandes Toledo', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Guilherme Ferreira Rocha', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Guilherme Pereira da Silva', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Gustavo Soares Ferreira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Heitor Amorim Nobrega', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Heitor Ribeiro Moraes', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Heloisa de Souza Carneiro', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Heloisa Elias Sousa', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Hozaney Pereira de Oliveira', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Iara R. Souza Cardoso', genero: 'feminino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Isabela Inácio da Silva', genero: 'feminino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Isabella Bárbara Miranda de Alcântara', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Isadora de Matos', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Italo Miguel da Silva', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'João Pedro de Andrade Theodoro', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'José Henrique Vieira da Silva', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Julie da Silva Rolim', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Kaike Paulino Vieira', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Kaio Amorim Batista Lopes', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Kaique Aparecido Souza', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: true },
  { nome: 'Leandro de Souza Raimundo', genero: 'masculino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Lívia de Souza Cardoso', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: true },
  { nome: 'Lorena Lima de Araújo', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Lorena Victória Moreira de Castro', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Lorenna Brandão Santhiago Ferraz', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Luan Henrique Porfério de Brito', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Lucca Montovani de Almeida', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Luiz Felipe Oliveira Barbosa', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Luiz Fernando Soares Machado', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Maísa de Souza Peroni', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Maria Alice Renée Mendonça', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Maria Luiza Camargo Ribeiro', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Michael Lorenzo Alves', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: true },
  { nome: 'Miguel de Souza Cardoso', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: true },
  { nome: 'Nicolas Anjos Arruda', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Nicollas Henrique de Paula Sales', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Nicolle Adriely de Souza Santos', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Pedro Gonçalves Carvalho', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Pedro Henrique Carvalho', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Pedro Luis Elias da Silva', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Pedro Vasconcelos Guimaraes', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Pierre Pietro Porfirio', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Pietra Emanuelly Brandão Santhiago Silva', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Rafael Ricardo Pinto de Oliveira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Rafaella Victoria Costa Santos', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Raquel Ferigato Mendonça', genero: 'feminino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Rebeca Felipe Annino Hoffman Marinatto', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Renan Crespo Arantes', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Rian Amorim Nobrega', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Rodrigo Pinto de Oliveira', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Samantha Amy Moura', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Samuel Arthur Olaia Sampaio', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Samuel Telles de Castro', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Samuel Thiago Leite Maranzani', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Sarah Soares Ferreira', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Sophia Louise Bueno de Araújo', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Tainá Adriely Zaniquele Jacob', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Theo Bezerra Pires', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Thereza Lopes Gustavo', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Tito César Mendonça', genero: 'masculino', escolaridade: 'medio', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Valentina Sophia Dis Fessine', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Vanessa Alves dos Santos', genero: 'feminino', escolaridade: 'superior_incompleto', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: false },
  { nome: 'Victor Hugo dos Santos Raso', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Vitor Henrique de Almeida Silva', genero: 'masculino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
  { nome: 'Vitor Hoffman Marinatto', genero: 'masculino', escolaridade: 'superior', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Wellington Franklin Costa Santos', genero: 'masculino', escolaridade: 'superior', bairro: 'Santa Gertrudes', turma: 'Adolescente - Adulto', bolsista: true },
  { nome: 'Yasmim Pereira Funchal', genero: 'feminino', escolaridade: 'fundamental', bairro: 'Santa Gertrudes', turma: 'Infantil', bolsista: false },
]

function getDateNascimento(turma: string): Date {
  const year = turma === 'Infantil' ? 2016 : 2010
  return new Date(year, 4, 1)
}

function getIdade(turma: string): number {
  return turma === 'Infantil' ? 10 : 16
}

function getRendaFamiliar(escolaridade: string): number {
  const valores: Record<string, number> = {
    fundamental: 1200,
    medio: 2200,
    superior_incompleto: 3000,
    superior: 4500,
  }
  return valores[escolaridade] ?? 1500
}

async function main() {
  try {
    console.log('🌱 Limpando e semeando apenas os alunos do Excel...')

    await prisma.mensalidade.deleteMany()
    await prisma.frequencia.deleteMany()
    await prisma.aluno.deleteMany()
    await prisma.turma.deleteMany()
    await prisma.instrutor.deleteMany()
    await prisma.bairro.deleteMany()

    const bairro = await prisma.bairro.create({
      data: {
        nome: 'Santa Gertrudes',
        cidade: 'Salvador',
        regiao: 'Miolo',
      },
    })

    const instrutor = await prisma.instrutor.create({
      data: {
        nome: 'Mestre da Turma',
        apelido: 'Mestre Principal',
        graduacao: 'corda_preta',
        anosExp: 20,
      },
    })

    const infantil = await prisma.turma.create({
      data: {
        nome: 'Infantil',
        nivel: 'infantil',
        diaSemana: 'Segunda/Quarta',
        horario: '17:00',
        instrutorId: instrutor.id,
      },
    })

    const adulto = await prisma.turma.create({
      data: {
        nome: 'Adolescente - Adulto',
        nivel: 'intermediario',
        diaSemana: 'Terça/Quinta',
        horario: '19:30',
        instrutorId: instrutor.id,
      },
    })

    let criados = 0
    for (const alunoData of alunosCSV) {
      const turma = alunoData.turma === 'Infantil' ? infantil : adulto
      await prisma.aluno.create({
        data: {
          nome: alunoData.nome,
          apelido: null,
          genero: alunoData.genero,
          dataNascimento: getDateNascimento(alunoData.turma),
          idade: getIdade(alunoData.turma),
          escolaridade: alunoData.escolaridade,
          rendaFamiliar: getRendaFamiliar(alunoData.escolaridade),
          bairroId: bairro.id,
          turmaId: turma.id,
          graduacao: 'crua',
          dataIngresso: new Date('2026-05-01'),
          status: 'ativo',
          bolsista: alunoData.bolsista,
        },
      })
      criados++
    }

    console.log(`✓ ${criados} alunos criados!`)
    console.log('✨ Banco atualizado apenas com os dados do Excel.')
  } catch (error) {
    console.error('❌ Erro ao semear:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
