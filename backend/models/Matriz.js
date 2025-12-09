import prisma from "../prisma/client.js";

// BUSCA
export async function getUnidades() {
  try {
    const unidades = await prisma.unidade.findMany();
    return { sucesso: true, unidades, message: "Unidades listadas com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar unidades.", detalhes: error.message };}
}

export async function getUnidadePorId(id) {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: Number(id) } });
    return { sucesso: true, unidade, message: "Unidade listada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar unidade por id.", detalhes: error.message };}
}

// buscar APENAS fazendas 
export async function getFazendas() {
  try {
    const fazendas = await prisma.unidade.findMany({
      where: { tipo: 'FAZENDA' },
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        endereco: true,
        cnpj: true,
        cep: true,
        imagemUrl: true,
        cidade: true,
        estado: true,
        tipo: true,
        status: true,
        latitude: true,
        longitude: true,
        areaTotal: true,
        areaProdutiva: true,
        atualizadoEm: true,
        criadoEm: true,
        email: true,
        telefone: true,
        gerente: {
          select: { nome: true }
        }
      }
    });

    return { sucesso: true, unidades: fazendas };
  }
  catch (error) {
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
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar matriz.", detalhes: error.message };}
}

export async function getLoja() {
  try {
    const lojas = await prisma.unidade.findMany({
      where: { tipo: 'LOJA' },
      orderBy: { nome: 'asc' },
       select: {
        id: true,
        nome: true,
        endereco: true,
        cnpj: true,
        cidade: true,
        estado: true,
        cep: true,
        imagemUrl: true,
        tipo: true,
        status: true,
        latitude: true,
        longitude: true,
        horarioAbertura: true,
        horarioFechamento: true,
        telefone: true,
        email: true,
        atualizadoEm: true,
        criadoEm: true,
        gerente: {
          select: { nome: true }
        }
      }
    });
    return { sucesso: true, unidades: lojas, message: "Loja listadas com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao listar loja.", detalhes: error.message };}
}

// CONTAGEM
export const FazendaService = {
  async contarFazendas() {return await prisma.unidade.count({ where: { tipo: 'FAZENDA' } });},
  async contarFazendasAtivas() {return await prisma.unidade.count({ where: { tipo: 'FAZENDA', status: 'ATIVA' } });},
  async contarFazendasInativas() {return await prisma.unidade.count({ where: { tipo: 'FAZENDA', status: 'INATIVA' } });},
};

export const LojaService = {
  async contarLojas() {return await prisma.unidade.count({ where: { tipo: 'LOJA' } });},
  async contarLojasAtivas() {return await prisma.unidade.count({ where: { tipo: 'LOJA', status: 'ATIVA' } });},
  async contarLojasInativas() {return await prisma.unidade.count({ where: { tipo: 'LOJA', status: 'INATIVA' } });},
};

// --- DASHBOARD MATRIZ ---

function asPlainNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatISODate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export async function getResumoVendas({ dias }) {
  const diasNum = Number.isFinite(Number(dias)) ? Number(dias) : 7;
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - (diasNum - 1));

  const vendas = await prisma.venda.findMany({
    where: {
      criadoEm: { gte: inicio },
      status: { not: 'CANCELADO' },
      unidade: { tipo: 'LOJA' },
    },
    select: {
      criadoEm: true,
      total: true,
    },
  });

  const agrupado = vendas.reduce((acc, venda) => {
    const chave = formatISODate(venda.criadoEm);
    acc[chave] = (acc[chave] || 0) + asPlainNumber(venda.total);
    return acc;
  }, {});

  const pontos = Object.entries(agrupado)
    .map(([data, total]) => ({ data, total }))
    .sort((a, b) => a.data.localeCompare(b.data));

  const totalPeriodo = pontos.reduce((sum, p) => sum + p.total, 0);

  return {
    sucesso: true,
    rangeDias: diasNum,
    pontos,
    totalPeriodo,
  };
}

export async function getTopFazendasProducao({ limite = 5 } = {}) {
  const contratos = await prisma.contrato.findMany({
    where: { unidade: { tipo: 'FAZENDA' } },
    include: {
      unidade: { select: { id: true, nome: true } },
      itens: true,
    },
  });

  const porFazenda = new Map();

  contratos.forEach((contrato) => {
    const unidadeId = contrato.unidade?.id;
    if (!unidadeId) return;
    const atual = porFazenda.get(unidadeId) || {
      unidadeId,
      nome: contrato.unidade?.nome || 'Fazenda',
      totalEstimado: 0,
    };

    const somaItens = contrato.itens.reduce((acc, item) => {
      const peso = asPlainNumber(item.pesoUnidade);
      const qtd = asPlainNumber(item.quantidade);
      return acc + peso * qtd;
    }, 0);

    atual.totalEstimado += somaItens;
    porFazenda.set(unidadeId, atual);
  });

  const ordenado = Array.from(porFazenda.values())
    .sort((a, b) => b.totalEstimado - a.totalEstimado)
    .slice(0, limite);

  return { sucesso: true, fazendas: ordenado };
}

export async function buildDashboardPdfData() {
  const [vendas7, vendas30, producao] = await Promise.all([
    getResumoVendas({ dias: 7 }),
    getResumoVendas({ dias: 30 }),
    getTopFazendasProducao({ limite: 5 }),
  ]);

  return {
    vendas7,
    vendas30,
    producao,
  };
}

// CRIAR
export async function createUnidade(data) {
  try {
    const unidade = await prisma.unidade.create({ data });
    return { sucesso: true, unidade, message: "Unidade criada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao criar unidade.", detalhes: error.message };}
}

// ATUALIZAR (implementei)
export async function updateUnidade(id, data) {
  try {
    const unidade = await prisma.unidade.update({
      where: { id: Number(id) },
      data,
    });
    return { sucesso: true, unidade, message: "Unidade atualizada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao atualizar unidade.", detalhes: error.message };}
}

// DELETAR
export async function deleteUnidade(id) {
  try {
    const unidade = await prisma.unidade.delete({ where: { id: Number(id) } });
    return { sucesso: true, unidade, message: "Unidade deletada com sucesso." };
  }
  catch (error) {return { sucesso: false, erro: "Erro ao deletar unidade.", detalhes: error.message };}
}

// ATUALIZAR STATUS
export async function updateStatusUnidade(id, novoStatus) {
  try {
    const statusPermitidos = ["ATIVA", "INATIVA", "MANUTENCAO"];
    const upper = String(novoStatus).toUpperCase();
    if (!statusPermitidos.includes(upper)) {return { sucesso: false, message: "Status inválido. Use: 'ATIVA', 'INATIVA' ou 'MANUTENCAO'." };}
    const unidade = await prisma.unidade.update({
      where: { id: Number(id) },
      data: { status: upper },
    });
    return { sucesso: true, unidade, message: `Status da unidade atualizado para ${upper}.` };
  }
  catch (error) {return { sucesso: false, message: "Erro ao atualizar status da unidade.", error: error.message };}
}
