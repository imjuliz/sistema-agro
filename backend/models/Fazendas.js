import prisma from '../prisma/client.js';

export const lotesPlantio = async (unidadeId) => {
  try {
    const lotes = await prisma.lote.findMany({ where: { unidadeId: Number(unidadeId), tipo: "Plantio" } });
    return ({
      sucesso: true,
      lotes,
      message: "Talhões listados com sucesso!"
    })
  } catch (error) {
    return {
      sucesso: false,
      erro: "erro ao listar talhões!",
      detalhes: error.message
    }
  }
};

export const verificarProducaoLote = async (loteId) => {
  try {
    const lote = await prisma.lote.findUnique({
      where: { id: Number(loteId) },
      include: { producoes: { orderBy: { dataRegistro: "asc" } } }
    });

    if (!lote) { return { sucesso: false, message: "Lote não encontrado." }; }

    if (lote.producoes.length === 0) { return { sucesso: false, message: "Nenhuma produção registrada para este lote." }; }

    const dataInicioProducao = lote.producoes[0].dataRegistro;

    const diasColheita = {
      GADO: 180,
      SOJA: 120,
      LEITE: 0,
      OUTRO: 90
    };

    const dias = diasColheita[lote.tipo] ?? 90;
    const dataPrevistaColheita = new Date(dataInicioProducao.getTime() + dias * 24 * 60 * 60 * 1000);

    return {
      sucesso: true,
      dataInicioProducao,
      tipoLote: lote.tipo,
      diasParaColheita: dias,
      dataPrevistaColheita
    };
  } catch (error) {
    console.error(error);
    return {
      sucesso: false,
      message: "Erro ao consultar produção.",
      error
    };
  }
};

//media de produção por lote
export const calcularMediaProducaoPorLote = async (loteId) => {
  try {
    const produtos = await prisma.produto.findMany({// Buscar os produtos do lote e seus estoques
      where: { loteId: Number(loteId) },
      include: { estoques: true }
    });

    if (produtos.length === 0) { return { sucesso: false, message: "Nenhum produto encontrado para este lote." } }

    // Somar quantidade de todos os estoques dos produtos
    let somaTotal = 0;
    let totalItens = 0;

    produtos.forEach((produto) => {
      produto.estoques.forEach((estoque) => {
        somaTotal += estoque.quantidade;
        totalItens++;
      });
    });

    if (totalItens === 0) { return { sucesso: false, message: "Nenhum registro de estoque para produtos deste lote." } }
    const media = somaTotal / totalItens;

    return {
      sucesso: true,
      loteId,
      totalProdutos: produtos.length,
      totalRegistrosEstoque: totalItens,
      somaTotalEstoque: somaTotal,
      mediaProducao: media
    };

  } catch (error) {
    console.error(error);
    return {
      sucesso: false,
      message: "Erro ao calcular média de produção do lote.",
      erro: error.message
    };
  }
};

//relatório por lote
export const buscarAtividadesLoteService = async (loteId, unidadeId) => {
  // O model gerado pelo Prisma para atividades de lote é `atvdLote`.
  // Também corrigimos a referência à relação do lote no where (usar "lote" minúsculo).
  const atividades = await prisma.atvdLote.findMany({
    where: { loteId: Number(loteId), lote: { unidadeId: Number(unidadeId) } },
    select: {
      id: true,
      descricao: true,
      tipo: true,
      data: true,
      responsavel: { select: { id: true, nome: true } }
    },
    orderBy: { data: "asc" }
  });

  return atividades;
};

//relatório de produção
export const buscarProducaoLoteService = async (loteId, unidadeId) => {
  const producoes = await prisma.producao.findMany({
    where: {loteId: Number(loteId),lote: { unidadeId: Number(unidadeId) }},
    select: {
      id: true,
      tipoProduto: true,
      quantidade: true,
      unidadeMedida: true,
      dataRegistro: true
    },
    orderBy: { dataRegistro: "asc" }
  });

  return producoes;
};