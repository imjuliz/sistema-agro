import {
  criarPlanoProducao,
  criarVariosPlanosPorLote,
  obterPlanoProducaoPorId,
  listarPlanosPorContrato,
  listarPlanosPorLote,
  listarPlanosPorItem,
  atualizarPlanoProducao,
  atualizarEtapasPlano,
  confirmarPlanoProducao,
  deletarPlanoProducao,
  listarPlanos,
} from "../models/PlanoProducao.js";

/**
 * Criar plano de produção
 * POST /plano-producao
 */
export const criarPlanoProducaoController = async (req, res) => {
  try {
    const { contratoId, itemId, loteId, usuarioId, nome, descricao, etapas } = req.body;

    if (!contratoId || !itemId) {
      return res.status(400).json({
        sucesso: false,
        erro: "contratoId e itemId são obrigatórios",
      });
    }

    const resultado = await criarPlanoProducao({
      contratoId: Number(contratoId),
      itemId: Number(itemId),
      loteId: loteId ? Number(loteId) : null,
      usuarioId: usuarioId ? Number(usuarioId) : null,
      nome: nome || `Plano ${itemId}`,
      descricao,
      etapas: Array.isArray(etapas) ? etapas : [],
    });

    return res.status(201).json(resultado);
  } catch (erro) {
    console.error("Erro ao criar plano:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao criar plano de produção",
    });
  }
};

/**
 * Criar vários planos para lote (BATCH)
 * POST /plano-producao/lote
 */
export const criarPlanoProducaoParaLoteController = async (req, res) => {
  try {
    const { contratoId, loteId, unidadeId, usuarioId, itens } = req.body;

    if (!contratoId || !loteId || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: "contratoId, loteId e itens são obrigatórios",
      });
    }

    const resultado = await criarVariosPlanosPorLote({
      contratoId: Number(contratoId),
      loteId: Number(loteId),
      unidadeId: unidadeId ? Number(unidadeId) : null,
      usuarioId: usuarioId ? Number(usuarioId) : null,
      itens,
    });

    return res.status(201).json(resultado);
  } catch (erro) {
    console.error("Erro ao criar planos para lote:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao criar planos de produção",
    });
  }
};

/**
 * Obter plano por ID
 * GET /plano-producao/:id
 */
export const obterPlanoProducaoController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID é obrigatório",
      });
    }

    const plano = await obterPlanoProducaoPorId(Number(id));

    if (!plano) {
      return res.status(404).json({
        sucesso: false,
        erro: "Plano de produção não encontrado",
      });
    }

    return res.status(200).json({
      sucesso: true,
      plano,
    });
  } catch (erro) {
    console.error("Erro ao obter plano:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao obter plano de produção",
    });
  }
};

/**
 * Listar planos por contrato
 * GET /plano-producao/contrato/:contratoId
 */
export const listarPlanosPorContratoController = async (req, res) => {
  try {
    const { contratoId } = req.params;

    if (!contratoId) {
      return res.status(400).json({
        sucesso: false,
        erro: "contratoId é obrigatório",
      });
    }

    const planos = await listarPlanosPorContrato(Number(contratoId));

    return res.status(200).json({
      sucesso: true,
      planos,
      quantidade: planos.length,
    });
  } catch (erro) {
    console.error("Erro ao listar planos por contrato:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao listar planos de produção",
    });
  }
};

/**
 * Listar planos por lote
 * GET /plano-producao/lote/:loteId
 */
export const listarPlanosPorLoteController = async (req, res) => {
  try {
    const { loteId } = req.params;

    if (!loteId) {
      return res.status(400).json({
        sucesso: false,
        erro: "loteId é obrigatório",
      });
    }

    const planos = await listarPlanosPorLote(Number(loteId));

    return res.status(200).json({
      sucesso: true,
      planos,
      quantidade: planos.length,
    });
  } catch (erro) {
    console.error("Erro ao listar planos por lote:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao listar planos de produção",
    });
  }
};

/**
 * Listar planos por item
 * GET /plano-producao/item/:itemId
 */
export const listarPlanosPorItemController = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        sucesso: false,
        erro: "itemId é obrigatório",
      });
    }

    const planos = await listarPlanosPorItem(Number(itemId));

    return res.status(200).json({
      sucesso: true,
      planos,
      quantidade: planos.length,
    });
  } catch (erro) {
    console.error("Erro ao listar planos por item:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao listar planos de produção",
    });
  }
};

/**
 * Atualizar plano
 * PUT /plano-producao/:id
 */
export const atualizarPlanoProducaoController = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, etapas, status } = req.body;

    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID é obrigatório",
      });
    }

    const resultado = await atualizarPlanoProducao(Number(id), {
      nome,
      descricao,
      etapas,
      status,
    });

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error("Erro ao atualizar plano:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao atualizar plano de produção",
    });
  }
};

/**
 * Atualizar etapas
 * PUT /plano-producao/:id/etapas
 */
export const atualizarEtapasPlanoController = async (req, res) => {
  try {
    const { id } = req.params;
    const { etapas } = req.body;

    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID é obrigatório",
      });
    }

    if (!Array.isArray(etapas)) {
      return res.status(400).json({
        sucesso: false,
        erro: "etapas deve ser um array",
      });
    }

    const resultado = await atualizarEtapasPlano(Number(id), etapas);

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error("Erro ao atualizar etapas:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao atualizar etapas",
    });
  }
};

/**
 * Confirmar plano
 * POST /plano-producao/:id/confirmar
 */
export const confirmarPlanoProducaoController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID é obrigatório",
      });
    }

    const resultado = await confirmarPlanoProducao(Number(id));

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error("Erro ao confirmar plano:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao confirmar plano de produção",
    });
  }
};

/**
 * Deletar plano
 * DELETE /plano-producao/:id
 */
export const deletarPlanoProducaoController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        sucesso: false,
        erro: "ID é obrigatório",
      });
    }

    const resultado = await deletarPlanoProducao(Number(id));

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error("Erro ao deletar plano:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao deletar plano de produção",
    });
  }
};

/**
 * Listar planos com filtros
 * GET /plano-producao
 */
export const listarPlanosController = async (req, res) => {
  try {
    const { contratoId, loteId, itemId, usuarioId, status } = req.query;

    const filtros = {};
    if (contratoId) filtros.contratoId = contratoId;
    if (loteId) filtros.loteId = loteId;
    if (itemId) filtros.itemId = itemId;
    if (usuarioId) filtros.usuarioId = usuarioId;
    if (status) filtros.status = status;

    const planos = await listarPlanos(filtros);

    return res.status(200).json({
      sucesso: true,
      planos,
      quantidade: planos.length,
    });
  } catch (erro) {
    console.error("Erro ao listar planos:", erro);
    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro ao listar planos de produção",
    });
  }
};
