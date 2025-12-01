import { getLote, getlotePorId, createLote, updateLote, deleteLote } from "../models/lote.js";
import { getAnimaisPorId } from "../models/animais.js";
import { loteSchema } from "../schemas/loteSchema.js";

export async function getLoteController(req, res) {
  try {
    const lote = await getLote();
    
    return res.status(200).json({
      sucesso: true,
      lote,
      message: "Lotes listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

// N possui coluna atividade
// export async function getLoteAtividadeController(req, res) {
//   const { atividade } = req.query;
//   try {
//     // Validações
//     if (atividade === true) {
//       const lotes_ativos = await getLoteAtividade((atividade = true));
//     } else {
//       const lotes_inativos = await getLoteAtividade((atividade = false));
//     }
//     return res.status(200).json({
//       sucesso: true,
//       lotes_ativos,
//       message: "Lotes ativos listados com sucesso.",
//     })
//   } catch (error) {
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro ao listar lotes ativos.",
//       detalhes: error.message, // opcional, para debug
//     })
//   }
// }

export async function getLotePorTipoController(req, res) {
  try {
    const { tipo } = loteSchema.partial().parse(req.params);

    const lote_animalia = await getLotePorTipo(tipo);
    return res.status(200).json({
      sucesso: true,
      lote_animalia,
      message: "Lotes de animalia listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes de animalia.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getLoteRentabilidadeController(req, res) {
  try {
    const { id_animal } = req.query;
    const { id } = req.params;

    //Validações
    if (isNaN(id) || isNaN(id_animal)) {
    return res.status(400).json({
      sucesso: false,
      erro: "id e id_animal precisam ser números."
    })}
    if (!id || !id_animal) {
    return res.status(400).json({
      sucesso: false,
      erro: "id e id_animal precisam ser informados."
    })}

    const lote = await getlotePorId(id);
    const animal = await getAnimaisPorId(id_animal);

    if (!lote || !animal) {
      return res.status(404).json({
        sucesso: false,
        erro: "Lote ou Animal não encontrado."
      });
    }

    const rentabilidade = lote.qntdItens * animal.custo;
    const lote_rentabilidade = await getLoteRentabilidade(id, rentabilidade);
    return res.status(200).json({
      sucesso: true,
      lote_rentabilidade,
      message: "Lotes com rentabilidade listados com sucesso."
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes com rentabilidade.",
      detalhes: error.message // opcional, para debug
    })
  }
}

// nao funciona pq n existe a coluna dataFabricacao, q é necessaria para listar os lotes criados
// export async function getLotePorDataCriacaoController(req, res) {
//   const { ano } = req.body;
//   const { produtoId } = req.query;
//   try {
//     //Validações
//     if(isNaN(ano) || isNaN(produtoId)) {
//       return res.status(400).json({
//         sucesso: false,
//         erro: "Ano ou produtoId precisa ser um numero."
//       })
//     }
//     if (!ano || !produtoId) {
//       return res.status(400).json({
//         sucesso: false,
//         erro: "Ano ou produtoId precisa ser informado."
//       })
//     }
//     const lote = await getLotePorDataCriacao(ano, produtoId );
//     return res.status(200).json({
//       sucesso: true,
//       lote,
//       message: "Lotes criados na data listados com sucesso."
//     })
//   } catch (error) {
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro ao listar lotes criados na data.",
//       detalhes: error.message // opcional, para debug
//     })
//   }
// }

export async function getLotePorIdController(req, res) {
  try {
    const { id } = req.params;
    const lote = await getlotePorId(id);
    return res.status(200).json({
      sucesso: true,
      lote,
      message: "Lote listado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function createLoteController(req, res) {
  try {
    const data = loteSchema.parse(req.body);
    const { unidadeId, contratoId } = req.params;

    // Validacoes
    if(!unidadeId || isNaN(unidadeId)) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }
    if(!contratoId || isNaN(contratoId)) {
      return res.status(400).json({erro: "Contrato nao encontrado."})
    }
    if(!data.responsavelId || isNaN(data.responsavelId)) {
      return res.status(400).json({erro: "Responsavel nao encontrado."})
    }

    const lote = await createLote(data, unidadeId, contratoId);
    
    return res.status(201).json({
      sucesso: true,
      lote,
      message: "Lote criado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function updateLoteController(req, res) {
  try {
    const data = loteSchema.parse(req.body);
    const { id, unidadeId, contratoId } = req.params;

    //Validações
    if (isNaN(id) || !id) {
      return res.status(400).json({
        sucesso: false,
        erro: "id precisa ser um número."
      })
    }
    if(!unidadeId || isNaN(unidadeId)) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }
    if(!contratoId || isNaN(contratoId)) {
      return res.status(400).json({erro: "Contrato nao encontrado."})
    }
    if(!data.responsavelId || isNaN(data.responsavelId)) {
      return res.status(400).json({erro: "Responsavel nao encontrado."})
    }
    
    const loteAtualizado = await updateLote(id, data, unidadeId, contratoId);

    return res.status(200).json({
      sucesso: true,
      loteAtualizado,
      message: "Lote atualizado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function deleteLoteController(req, res) {
  try {
    const { id } = req.params;

    //Validações
    if (isNaN(id) || !id) {
      return res.status(400).json({
        sucesso: false,
        erro: "id precisa ser um número."
      })
    }

    const loteDeletado = await deleteLote(id);

    return res.status(200).json({
      sucesso: true,
      loteDeletado,
      message: "Lote deletado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}
