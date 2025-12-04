import { getLote, getLotePorId, getLotePorTipoVegetais, createLote, updateLote, deleteLote, getLotePorTipo } from "../models/lote.js";
import { loteSchema, loteTipoVegetaisSchema, IdsSchema, IdSchema } from "../schemas/loteSchema.js";

export async function getLoteController(req, res) {
  try {
    const lotes = await getLote();

    return res.status(200).json({lotes})
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getLotePorTipoController(req, res) {
  try {
    const { tipo } = req.query;

    //Validações 
    if (!tipo) {
    return res.status(400).json({
      sucesso: false,
      erro: "Tipo precisa ser informado."
    })}

    const lotesAnimalia = await getLotePorTipo(tipo);

    return res.status(200).json({lotesAnimalia})
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes de animalia.",
      detalhes: error.message, // opcional, para debug
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

export async function geLotePorTipoVegetaisController(req, res) {
  try {
    const { tipo } = loteTipoVegetaisSchema.parse(req.query);

    //Validações
    if(!tipo) {
      return res.status(400).json({ sucesso: false, erro: "Tipo precisa ser informado." })
    }

    const lotesVegetais = await getLotePorTipoVegetais(tipo);

    return res.status(200).json({lotesVegetais})
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes de vegetais.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getLotePorIdController(req, res) {
  try {
    const id = Number(req.params.id);

    //Validações
    if (isNaN(id) || !id) {
      return res.status(400).json({
        sucesso: false,
        erro: "id informado incorretamente."
      })
    }

    const lote = await getLotePorId(id);

    return res.status(200).json({lote})
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
    const usuario = req.usuario;
    
    // Pega unidadeId e contratoId do body ou params
    const unidadeId = req.body.unidadeId || req.params.unidadeId;
    const contratoId = req.body.contratoId || req.params.contratoId;
    
    // Validações de IDs
    if (!unidadeId || isNaN(unidadeId)) {
      return res.status(400).json({ 
        sucesso: false,
        erro: "Unidade não informada." 
      });
    }

    if (!contratoId || isNaN(contratoId)) {
      return res.status(400).json({ 
        sucesso: false,
        erro: "Contrato não informado." 
      });
    }

    // Validação de permissão
    if (
      usuario.perfil.nome !== "GERENTE_FAZENDA" &&
      usuario.unidadeId !== parseInt(unidadeId)
    ) {
      return res.status(403).json({
        sucesso: false,
        erro: "Você não tem permissão para criar lotes nesta unidade."
      });
    }

    // Validar dados do lote
    const data = loteSchema.parse(req.body);

    if (!data.responsavelId) {
      return res.status(400).json({ 
        sucesso: false,
        erro: "Responsável inválido." 
      });
    }

    const lote = await createLote(data, parseInt(unidadeId), parseInt(contratoId));

    return res.status(201).json(lote);

  } catch (error) {
    console.error("Erro ao criar lote:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar lote.",
      detalhes: error.message,
    });
  }
}


export async function updateLoteController(req, res) {
  try {
    const data = loteSchema.parse(req.body);
    const usuario = req.usuario;
    const { id } = IdSchema.parse(req.params);
    const { unidadeId, contratoId } = IdsSchema.parse(req.params);

    //Validações
    if (isNaN(id) || !id) {
      return res.status(400).json({
        sucesso: false,
        erro: "id precisa ser um número."
      })
    }

    if (!data.responsavelId) {
      return res.status(400).json({ erro: "Responsável inválido." });
    }

    if (
      usuario.perfil.nome !== "GERENTE_FAZENDA" &&
      usuario.unidadeId !== unidadeId
    ) {
      return res.status(403).json({
        sucesso: false,
        erro: "Você não tem permissão para criar lotes nesta unidade."
      });
    }

    if(!unidadeId || isNaN(unidadeId)) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }

    if(!contratoId || isNaN(contratoId)) {
      return res.status(400).json({erro: "Contrato nao encontrado."})
    }

    
    const loteAtualizado = await updateLote(id, data, unidadeId, contratoId);

    return res.status(200).json({loteAtualizado})
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
    const { id } = IdSchema.parse(req.params);

    //Validações
    if (isNaN(id) || !id) {
      return res.status(400).json({
        sucesso: false,
        erro: "id precisa ser um número."
      })
    }

    const loteDeletado = await deleteLote(id);

    return res.status(200).json({loteDeletado})
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}
