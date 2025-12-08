import { getLote, getLotePorId,  updateLote, deleteLote, getLotePorTipo, listarLotesPlantio, listarLotesAnimalia, contarLotesPlantioDisponiveis, contarLotesAnimaliaDisponiveis, contarLotesColheita, contarLotesImproprios, contarLotesPlantioImproprios,contarLotesAnimaliaImproprios,contarLotesAnimaliaPorTipo, contarAnimais, updateLoteCampos, listarAtividadesPlantio, listarAtividadesAnimalia, contarQtdColheitasPorMes, criarAtividadeAgricola , criarLote, totalLotesPlantio, totalLotesAnimalia, criarAtividadeAnimalia, listarAtividadesDoLote} from "../models/lote.js";
import { loteSchema, loteTipoVegetaisSchema, IdsSchema, IdSchema } from "../schemas/loteSchema.js";

export async function getLoteController(req, res) {
  try {
    const lotes = await getLote();

    return res.status(200).json({ lotes })
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
      })
    }

    const lotesAnimalia = await getLotePorTipo(tipo);

    return res.status(200).json({ lotesAnimalia })
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

export const listarLotesPlantioController = async (req, res) => {
  try {

    const unidadeId = req.params.unidadeId

    const lotesVegetais = await listarLotesPlantio(unidadeId);

    return res.status(200).json({
      sucesso: true,
      lotesVegetais,
      message: "Lotes de vegetais listados com sucesso.",
    });

  } catch (error) {

    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes de vegetais.",
      detalhes: error.message,
    })
  }
}

export const listarLotesAnimaliaController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const lotesAnimalia = await listarLotesAnimalia(unidadeId);
    return res.status(200).json({
      sucesso: true,
      lotesAnimalia,
      message: "Lotes de animalia listados com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes de animalia.",
      detalhes: error.message,
    });
  }
}

export const totalLotesPlantioController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const quantidade = await totalLotesPlantio(unidadeId);
    return res.status(200).json({
      sucesso: true,
      quantidade,
      message: "Total de lotes de plantio obtido com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao obter total de lotes de plantio!",
      error: error.message
    });
  }
};

export const totalLotesAnimaliaController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const quantidade = await totalLotesAnimalia(unidadeId);
    return res.status(200).json({
      sucesso: true,
      quantidade,
      message: "Total de lotes de animalia obtido com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao obter total de lotes de animalia!",
      error: error.message
    });
  }
};

export const contarLotesPlantioDisponiveisController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;

    const lotesDisponiveis = await contarLotesPlantioDisponiveis(unidadeId);
    return res.status(200).json({
      sucesso: true,
      lotesDisponiveis,
      message: "Lotes disponíveis contados com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao contar lotes disponíveis!",
      error: error.message
    });
  }
};

export const contarLotesAnimaliaDisponiveisController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const lotesDisponiveis = await contarLotesAnimaliaDisponiveis(unidadeId);
    return res.status(200).json({
      sucesso: true,
      lotesDisponiveis,
      message: "Lotes disponíveis de animalia contados com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao contar lotes disponíveis de animalia!",
      error: error.message
    });
  }
};

export const contarLotesColheitaController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const lotesColheita = await contarLotesColheita(unidadeId);

    return res.status(200).json({
      sucesso: true,
      lotesColheita,
      message: "Lotes em colheita contados com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao contar lotes em colheita.",
      detalhes: error.message
    });
  }
};

export const qtdColheitasPorMesController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const mes = parseInt(req.params.mes);
    const ano = parseInt(req.params.ano);

    if (isNaN(mes) || isNaN(ano)) {
      return res.status(400).json({ erro: "Mês ou ano inválido." });
    }

    const resultado = await contarQtdColheitasPorMes(unidadeId, mes, ano);

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao contar quantidade de colheitas por mês.",
      detalhes: error.message
    });
  }
};

export const contarLotesImpropriosController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const quantidade = await contarLotesImproprios(unidadeId);
    return res.status(200).json({
      sucesso: true,
      quantidade,
      message: "Quantidade de lotes impróprios obtida com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao contar lotes impróprios!",
      error: error.message
    });
  }
};

export const lotesPlantioImproprioController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const lotesImproprios = await contarLotesPlantioImproprios(unidadeId);
    return res.status(200).json({
      sucesso: true,
      lotesImproprios,
      message: "Lotes de plantio impróprios listados com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao listar lotes de plantio impróprios!",
      error: error.message
    });
  }
};

export const lotesAnimaliaImproprioController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const lotesImproprios = await contarLotesAnimaliaImproprios(unidadeId);
    return res.status(200).json({
      sucesso: true,
      lotesImproprios,
      message: "Lotes de animalia impróprios listados com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao listar lotes de animalia impróprios!",
      error: error.message
    });
  }
};

export const contarLotesAnimaliaPorTipoController = async (req, res) => {
  try {
    const unidadeId = req.params.unidadeId;
    const resultado = await contarLotesAnimaliaPorTipo(unidadeId);

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao contar lotes de animalia por tipo!",
      error: error.message
    });
  }
};

export const contarAnimaisController = async (req, res) => {
  try{
    const unidadeId = req.params.unidadeId;

    const resultado = await contarAnimais(unidadeId);

    return res.status(200).json({
      sucesso: true,
      quantidade: resultado,
      message: "Quantidade de animais contada com sucesso!"
    }); 
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao contar animais!",
      error: error.message
    });
  }
};

export async function listarAtividadesPlantioController(req, res) {
  try {
    const unidadeId = Number(req.params.unidadeId);

    if (isNaN(unidadeId)) {
      return res.status(400).json({ error: "unidadeId inválido" });
    }

    const atividades = await listarAtividadesPlantio(unidadeId);

    return res.status(200).json({
      sucesso: true,
      atividades,
      message: "Atividades de plantio listadas com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao buscar atividades de plantio:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function listarAtividadesAnimaliaController(req, res) {
  try {
    const unidadeId = Number(req.params.unidadeId);

    if (isNaN(unidadeId)) {
      return res.status(400).json({ error: "unidadeId inválido" });
    }

    const atividades = await listarAtividadesAnimalia(unidadeId);

    return res.status(200).json({
      sucesso: true,
      atividades,
      message: "Atividades de animalia listadas com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao buscar atividades de animalia:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export const criarAtividadeAgricolaController = async (req, res) => {
  try {
    const {
      descricao,
      tipo,
      loteId,
      dataInicio,
      dataFim,
      responsavelId,
      status
    } = req.body;

    // Validação simples
    if (!descricao || !tipo || !loteId || !dataInicio || !responsavelId) {
      return res.status(400).json({
        sucesso: false,
        message: "Campos obrigatórios não foram enviados."
      });
    }

    const resultado = await criarAtividadeAgricola({
      descricao,
      tipo,
      loteId,
      dataInicio,
      dataFim,
      responsavelId,
      status
    });

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro interno ao criar atividade agrícola.",
      error: error.message
    });
  }
};

export const criarAtividadeAnimaliaController = async (req, res) => {
  try {
    const {
      descricao,
      tipo,
      loteId,
      dataInicio,
      dataFim,
      responsavelId,
      status
    } = req.body;

    // Validação simples
    if (!descricao || !tipo || !loteId || !dataInicio || !responsavelId) {
      return res.status(400).json({
        sucesso: false,
        message: "Campos obrigatórios não foram enviados."
      });
    }

    const resultado = await criarAtividadeAnimalia({
      descricao,
      tipo,
      loteId,
      dataInicio,
      dataFim,
      responsavelId,
      status
    });

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro interno ao criar atividade animalia.",
      error: error.message
    });
  }
};

export const listarAtividadesDoLoteController = async (req, res) => {
  try {
    const loteId = req.params.loteId;

    if (isNaN(loteId)) {
      return res.status(400).json({ error: "loteId inválido." });
    }

    const result = await listarAtividadesDoLote(loteId);

    return res.json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar atividades do lote." });
  }
};

export const atualizarCamposLoteController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !id) {
      return res.status(400).json({ sucesso: false, erro: 'id informado incorretamente.' });
    }

    const { status, preco, statusQualidade } = req.body;

    // Monta objeto com os campos permitidos
    const campos = {};
    if (status !== undefined) campos.status = status;
    if (preco !== undefined) {
      // tenta converter para number, mas aceita string caso o front envie formato com simbolos
      const n = Number(preco);
      campos.preco = Number.isFinite(n) ? n : preco;
    }
    if (statusQualidade !== undefined) campos.statusQualidade = statusQualidade;

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum campo para atualizar.' });
    }

    const resultado = await updateLoteCampos(id, campos);

    if (!resultado || !resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json({ sucesso: true, lote: resultado.loteAtualizado, message: 'Lote atualizado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar lote.', detalhes: error.message });
  }
};

export const criarLoteController = async (req, res) => {
  try {
    const resultado = await criarLote(req.body);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro interno ao criar lote.",
      error: error.message
    });
  }
};

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

    return res.status(200).json({ lote })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}



// export async function createLoteController(req, res) {
//   try {
//     const usuario = req.usuario;

//     // Pega unidadeId e contratoId do body ou params
//     const unidadeId = req.body.unidadeId || req.params.unidadeId;
//     const contratoId = req.body.contratoId || req.params.contratoId;

//     // Validações de IDs
//     if (!unidadeId || isNaN(unidadeId)) {
//       return res.status(400).json({
//         sucesso: false,
//         erro: "Unidade não informada."
//       });
//     }

//     if (!contratoId || isNaN(contratoId)) {
//       return res.status(400).json({
//         sucesso: false,
//         erro: "Contrato não informado."
//       });
//     }

//     // Validação de permissão
//     if (
//       usuario.perfil.nome !== "GERENTE_FAZENDA" &&
//       usuario.unidadeId !== parseInt(unidadeId)
//     ) {
//       return res.status(403).json({
//         sucesso: false,
//         erro: "Você não tem permissão para criar lotes nesta unidade."
//       });
//     }

//     // Preparar dados - adicionar responsávelId e tipo se não fornecido
//     const bodyData = {
//       ...req.body,
//       responsavelId: req.body.responsavelId || usuario.id,
//       tipo: req.body.tipo || "OUTRO",
//     };

//     // Validar dados do lote
//     const data = loteSchema.parse(bodyData);

//     const lote = await createLote(data, parseInt(unidadeId), parseInt(contratoId));

//     return res.status(201).json(lote);

//   } catch (error) {
//     console.error("Erro ao criar lote:", error);
//     return res.status(500).json({
//       sucesso: false,
//       erro: "Erro ao criar lote.",
//       detalhes: error.message,
//     });
//   }
// }


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

    if (!unidadeId || isNaN(unidadeId)) {
      return res.status(400).json({ erro: "Unidade nao encontrada." })
    }

    if (!contratoId || isNaN(contratoId)) {
      return res.status(400).json({ erro: "Contrato nao encontrado." })
    }


    const loteAtualizado = await updateLote(id, data, unidadeId, contratoId);

    return res.status(200).json({ loteAtualizado })
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

    return res.status(200).json({ loteDeletado })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar lote.",
      detalhes: error.message, // opcional, para debug
    })
  }
}
