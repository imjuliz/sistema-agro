import prisma from "../prisma/client.js";

/**
 * Criar um novo plano de produção
 * @param {Object} data - Dados do plano
 * @returns {Promise<Object>}
 */
export async function criarPlanoProducao(data) {
  try {
    const plano = await prisma.planoProducao.create({
      data: {
        contratoId: data.contratoId,
        itemId: data.itemId,
        loteId: data.loteId,
        usuarioId: data.usuarioId,
        nome: data.nome,
        descricao: data.descricao || null,
        etapas: data.etapas || [],
        status: "RASCUNHO",
      },
    });

    return {
      sucesso: true,
      plano,
      message: "Plano de produção criado com sucesso",
    };
  } catch (erro) {
    console.error("Erro ao criar plano de produção:", erro);
    throw erro;
  }
}

/**
 * Criar múltiplos planos para os itens de um lote (BATCH)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function criarVariosPlanosPorLote(data) {
  try {
    const { contratoId, loteId, unidadeId, usuarioId, itens } = data;

    if (!Array.isArray(itens) || itens.length === 0) {
      return {
        sucesso: false,
        message: "Nenhum item fornecido",
      };
    }

    const planosData = itens.map((item) => ({
      contratoId,
      loteId,
      itemId: item.itemId,
      usuarioId,
      nome: `${item.nome} - Lote ${loteId}`,
      descricao: null,
      etapas: (item.etapasProducao || []).map((etapa, idx) => ({
        id: `etapa-${item.itemId}-${idx}`,
        nome: etapa.nome,
        descricao: etapa.descricao || null,
        duracaoDias: etapa.duracao ? parseInt(etapa.duracao, 10) : null,
        ordem: idx + 1,
        quantidadeEsperada: item.quantidade,
        unidadeMedida: item.unidadeMedida,
      })),
      status: "RASCUNHO",
    }));

    const planos = await Promise.all(
      planosData.map((pData) =>
        prisma.planoProducao.create({
          data: pData,
        })
      )
    );

    return {
      sucesso: true,
      planos,
      quantidade: planos.length,
      message: `${planos.length} planos de produção criados com sucesso`,
    };
  } catch (erro) {
    console.error("Erro ao criar vários planos de produção:", erro);
    throw erro;
  }
}

/**
 * Buscar plano de produção por ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function obterPlanoProducaoPorId(id) {
  try {
    const plano = await prisma.planoProducao.findUnique({
      where: { id },
    });

    return plano;
  } catch (erro) {
    console.error("Erro ao buscar plano de produção:", erro);
    throw erro;
  }
}

/**
 * Listar planos de produção por contrato
 * @param {number} contratoId
 * @returns {Promise<Array>}
 */
export async function listarPlanosPorContrato(contratoId) {
  try {
    const planos = await prisma.planoProducao.findMany({
      where: { contratoId },
      orderBy: { criadoEm: "desc" },
    });

    return planos;
  } catch (erro) {
    console.error("Erro ao listar planos de produção por contrato:", erro);
    throw erro;
  }
}

/**
 * Listar planos de produção por lote
 * @param {number} loteId
 * @returns {Promise<Array>}
 */
export async function listarPlanosPorLote(loteId) {
  try {
    const planos = await prisma.planoProducao.findMany({
      where: { loteId },
      orderBy: { criadoEm: "desc" },
    });

    return planos;
  } catch (erro) {
    console.error("Erro ao listar planos de produção por lote:", erro);
    throw erro;
  }
}

/**
 * Listar planos de produção por item
 * @param {number} itemId
 * @returns {Promise<Array>}
 */
export async function listarPlanosPorItem(itemId) {
  try {
    const planos = await prisma.planoProducao.findMany({
      where: { itemId },
      orderBy: { criadoEm: "desc" },
    });

    return planos;
  } catch (erro) {
    console.error("Erro ao listar planos de produção por item:", erro);
    throw erro;
  }
}

/**
 * Atualizar plano de produção
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function atualizarPlanoProducao(id, data) {
  try {
    const updateData = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.etapas !== undefined) updateData.etapas = data.etapas;
    if (data.status !== undefined) updateData.status = data.status;

    const plano = await prisma.planoProducao.update({
      where: { id },
      data: updateData,
    });

    return {
      sucesso: true,
      plano,
      message: "Plano de produção atualizado com sucesso",
    };
  } catch (erro) {
    console.error("Erro ao atualizar plano de produção:", erro);
    throw erro;
  }
}

/**
 * Atualizar etapas de um plano
 * @param {number} id
 * @param {Array} etapas
 * @returns {Promise<Object>}
 */
export async function atualizarEtapasPlano(id, etapas) {
  try {
    const plano = await prisma.planoProducao.update({
      where: { id },
      data: {
        etapas: Array.isArray(etapas) ? etapas : [],
      },
    });

    return {
      sucesso: true,
      plano,
      message: "Etapas atualizadas com sucesso",
    };
  } catch (erro) {
    console.error("Erro ao atualizar etapas:", erro);
    throw erro;
  }
}

/**
 * Confirmar plano de produção (mudar status para CONFIRMADO)
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function confirmarPlanoProducao(id) {
  try {
    const plano = await prisma.planoProducao.update({
      where: { id },
      data: { status: "CONFIRMADO" },
    });

    return {
      sucesso: true,
      plano,
      message: "Plano de produção confirmado com sucesso",
    };
  } catch (erro) {
    console.error("Erro ao confirmar plano de produção:", erro);
    throw erro;
  }
}

/**
 * Deletar plano de produção
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deletarPlanoProducao(id) {
  try {
    await prisma.planoProducao.delete({
      where: { id },
    });

    return {
      sucesso: true,
      message: "Plano de produção deletado com sucesso",
    };
  } catch (erro) {
    console.error("Erro ao deletar plano de produção:", erro);
    throw erro;
  }
}

/**
 * Listar todos os planos de produção com filtros opcionais
 * @param {Object} filtros
 * @returns {Promise<Array>}
 */
export async function listarPlanos(filtros = {}) {
  try {
    const where = {};

    if (filtros.contratoId) where.contratoId = Number(filtros.contratoId);
    if (filtros.loteId) where.loteId = Number(filtros.loteId);
    if (filtros.itemId) where.itemId = Number(filtros.itemId);
    if (filtros.usuarioId) where.usuarioId = Number(filtros.usuarioId);
    if (filtros.status) where.status = filtros.status;

    const planos = await prisma.planoProducao.findMany({
      where,
      orderBy: { criadoEm: "desc" },
    });

    return planos;
  } catch (erro) {
    console.error("Erro ao listar planos de produção:", erro);
    throw erro;
  }
}
