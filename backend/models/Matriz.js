import prisma from '../prisma/client.js';

// BUSCA
export async function getUnidades() {
  try {
    const unidades = await prisma.unidade.findMany();
    return { sucesso: true, unidades, message: "Unidades listadas com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar unidades.", detalhes: error.message };
  }
}

export async function getUnidadePorId(id) {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: Number(id) } });
    return { sucesso: true, unidade, message: "Unidade listada com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar unidade por id.", detalhes: error.message };
  }
}

// buscar APENAS fazendas (use o valor do enum exato)
export async function getFazendas() {
  try {
    const fazendas = await prisma.unidade.findMany({
      where: { tipo: 'FAZENDA' },
      orderBy: { nome: 'asc' },
    });
    return { sucesso: true, unidades: fazendas, message: "Fazendas listadas com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar fazendas.", detalhes: error.message };
  }
}

export async function getMatriz() {
  try {
    const matrizes = await prisma.unidade.findMany({
      where: { tipo: 'MATRIZ' },
      orderBy: { nome: 'asc' },
    });
    return { sucesso: true, unidades: matrizes, message: "Matriz listadas com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar matriz.", detalhes: error.message };
  }
}

export async function getLoja() {
  try {
    const lojas = await prisma.unidade.findMany({
      where: { tipo: 'LOJA' },
      orderBy: { nome: 'asc' },
    });
    return { sucesso: true, unidades: lojas, message: "Loja listadas com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao listar loja.", detalhes: error.message };
  }
}

// CONTAGEM
export const UnidadeService = {
  async contarFazendas() {
    return await prisma.unidade.count({ where: { tipo: 'FAZENDA' } });
  },
  async contarFazendasAtivas() {
    return await prisma.unidade.count({ where: { tipo: 'FAZENDA', status: 'ATIVA' } });
  },
  async contarFazendasInativas() {
    return await prisma.unidade.count({ where: { tipo: 'FAZENDA', status: 'INATIVA' } });
  },
};

// CRIAR
export async function createUnidade(data) {
  try {
    const unidade = await prisma.unidade.create({ data });
    return { sucesso: true, unidade, message: "Unidade criada com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao criar unidade.", detalhes: error.message };
  }
}

// ATUALIZAR (implementei)
export async function updateUnidade(id, data) {
  try {
    const unidade = await prisma.unidade.update({
      where: { id: Number(id) },
      data,
    });
    return { sucesso: true, unidade, message: "Unidade atualizada com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao atualizar unidade.", detalhes: error.message };
  }
}

// DELETAR
export async function deleteUnidade(id) {
  try {
    const unidade = await prisma.unidade.delete({ where: { id: Number(id) } });
    return { sucesso: true, unidade, message: "Unidade deletada com sucesso." };
  } catch (error) {
    return { sucesso: false, erro: "Erro ao deletar unidade.", detalhes: error.message };
  }
}

// ATUALIZAR STATUS
export async function updateStatusUnidade(id, novoStatus) {
  try {
    const statusPermitidos = ["ATIVA", "INATIVA", "MANUTENCAO"];
    const upper = String(novoStatus).toUpperCase();
    if (!statusPermitidos.includes(upper)) {
      return { sucesso: false, message: "Status inválido. Use: 'ATIVA', 'INATIVA' ou 'MANUTENCAO'." };
    }
    const unidade = await prisma.unidade.update({
      where: { id: Number(id) },
      data: { status: upper },
    });
    return { sucesso: true, unidade, message: `Status da unidade atualizado para ${upper}.` };
  } catch (error) {
    return { sucesso: false, message: "Erro ao atualizar status da unidade.", error: error.message };
  }
}
