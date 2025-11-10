import prisma from '../prisma/client.js';

export async function getFazendas() {
  try {
    const fazendas = await prisma.unidade.findMany({
      where: { tipo: 'Fazenda' },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      unidades: fazendas,
      message: "Fazendas listadas com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar fazendas.",
      detalhes: error.message
    };
  }
}

export async function getMatriz() {
  try {
    const matriz = await prisma.unidade.findMany({
      where: { tipo: 'Matriz' },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      unidades: matriz,
      message: "Matriz listadas com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar matriz.",
      detalhes: error.message
    };
  }
}

export async function getLoja() {
  try {
    const loja = await prisma.unidade.findMany({
      where: { tipo: 'Loja' },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      unidades: loja,
      message: "Loja listadas com sucesso."
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar loja.",
      detalhes: error.message
    };
  }
}
