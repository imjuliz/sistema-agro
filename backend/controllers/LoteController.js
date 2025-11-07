import {
  getLote,
  getLoteAtividade,
  getLotePorAnimaliaId,
  getlotePorId,
  createLote,
  updateLote,
  deleteLote,
  getLoteAtividade,
} from "../models/lote.js";
import { loteSchema } from "../schemas/loteSchema.js";

export async function getLoteController(req, res) {
  try {
    const lote = await getLote();
    return {
      sucesso: true,
      lote,
      message: "Lotes listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar lotes.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getLoteAtividadeController(req, res) {
  const { atividade } = req.query;
  try {
    // Validações
    if (atividade === true) {
      const lotes_ativos = await getLoteAtividade((atividade = true));
    } else {
      const lotes_inativos = await getLoteAtividade((atividade = false));
    }
    return {
      sucesso: true,
      lotes_ativos,
      message: "Lotes ativos listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar lotes ativos.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getLotePorAnimaliaIdController(req, res) {
  const { tipo } = req.params;
  try {
    const lote_animalia = await getLotePorAnimaliaId(tipo);
    return {
      sucesso: true,
      lote_animalia,
      message: "Lotes de animalia listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar lotes de animalia.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getLotePorIdController(req, res) {
  const { id } = req.params;
  try {
    const lote = await getlotePorId(id);
    return {
      sucesso: true,
      lote,
      message: "Lote listado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar lote.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function createLoteController(req, res) {
  const data = loteSchema.parse(req.body);
  try {
    const lote = await createLote(data);
    return {
      sucesso: true,
      lote,
      message: "Lote criado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar lote.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function updateLoteController(req, res) {
  const { id } = req.params;
  try {
    const data = loteSchema.parse(req.body);
    const loteAtualizado = await updateLote(id, data);
    return {
      sucesso: true,
      lote: loteAtualizado,
      message: "Lote atualizado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar lote.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function deleteLoteController(req, res) {
  const { id } = req.params;
  try {
    const loteDeletado = await deleteLote(id);
    return {
      sucesso: true,
      lote: loteDeletado,
      message: "Lote deletado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar lote.",
      detalhes: error.message, // opcional, para debug
    };
  }
}
