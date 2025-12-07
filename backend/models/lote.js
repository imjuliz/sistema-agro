import prisma from "../prisma/client.js";

export async function getLote() {
  try {
    const lotes = await prisma.lote.findMany();

    return {
      sucesso: true,
      lotes,
      message: "Lotes listados com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes!!",
      error: error.message,
    }
  }
}

export async function getLotePorTipo(tipo) {
  try {
    const loteTipo = await prisma.lote.findMany({
      where: { tipo: tipo }
    });

    return {
      sucesso: true,
      loteTipo,
      message: "Lotes de animalia listados com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes de animalia!!",
      error: error.message,
    }
  }
}



// nao funciona pq n existe a coluna dataFabricacao, q é necessaria para listar os lotes criados
// export async function getLotePorDataCriacao(ano, produtoId) { // testar
//   try {
//     const lote_data_criacao = await prisma.lote.findMany({
//       where: {
//         produtoId: Number(produtoId),   
//         dataFabricacao: {
//           gte: new Date(`${ano}-01-01`),
//           lte: new Date(`${ano}-12-31`)
//         },
//       },
//       select: {
//         nome: true,
//         tipo: true,
//         qntdItens: true,
//         preco: true,
//         unidadeMedida: true,
//         observacoes: true,
//         statusQualidade: true,
//         bloqueadoParaVenda: true,
//         status: true,
//         contratoId: true,
//         dataEnvioReferencia: true,
//         itensEsperados: true
//       }
//     });
//     return {
//       sucesso: true,
//       lote_data_criacao,
//       message: "Lotes criados na data listados com sucesso!!",
//     }
//   } catch (error) {
//     return {
//       sucesso: false,
//       message: "Erro ao listar lotes criados na data!!",
//       error: error.message
//     }
//   }
// }

export const listarLotesPlantio = async (unidadeId) => {
  try {
    const loteVegetais = await prisma.lote.findMany({
      where: {
        tipoProduto: "PLANTIO",
        unidadeId: Number(unidadeId),
      },
      orderBy: {
        dataCriacao: "desc",
      },
    });

    return {
      sucesso: true,
      loteVegetais,
      message: "Lotes de vegetais listados com sucesso!!"
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes de vegetais!!",
      error: error.message
    };
  }
};

export const listarLotesAnimalia = async(unidadeId) =>{
  try{
    const lotesAnimalia = await prisma.lote.findMany({
      where : {
        tipoProduto: "ANIMALIA",
        unidadeId: Number (unidadeId),}
    })

    return {
      sucesso: true,
      lotesAnimalia,
      message: "Lotes de animalia listados com sucesso!!"
    };
  } catch (error){
    return {
      sucesso: false,
      message: "Erro ao listar lotes de animalia!!",
      error: error.message
    }
  }
}

export const contarLotesDisponiveis = async (unidadeId) => {
  try {
    const quantidade = await prisma.lote.count({
      where: {
        status: "PRONTO",
        unidadeId: Number(unidadeId),
      }
    });

    return {
      sucesso: true,
      quantidade,
      message: "Quantidade de lotes disponíveis obtida com sucesso!"
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao contar lotes disponíveis!",
      error: error.message
    };
  }
};

export const contarLotesColheita = async (unidadeId) => {
  try{
    const lotesColheita = await prisma.lote.count({
      where: {
        status: "COLHEITA",
        unidadeId: Number(unidadeId),
      }
    });

    return {
      sucesso: true,
      lotesColheita,
      message: "Lotes em colheita contados com sucesso!"
    };
  }
  catch (error){
    return {
      sucesso: false,
      message: "Erro ao contar lotes em colheita!",
      error: error.message
    
  }
}
};

export const contarQtdColheitasPorMes = async (unidadeId, mes, ano) => {
  try {
    const inicioMes = new Date(ano, mes - 1, 1);
    const fimMes = new Date(ano, mes, 1);

    const quantidade = await prisma.atvdAgricola.count({
      where: {
        tipo: "COLHEITA",
        dataInicio: {
          gte: inicioMes,
          lt: fimMes,
        },
        lote: {
          unidadeId: Number(unidadeId),
        },
      },
    });

    return {
      sucesso: true,
      quantidade,
      message: "Quantidade de colheitas do mês obtida com sucesso!"
    };

  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao contar quantidade de colheitas por mês!",
      error: error.message
    };
  }
}

// export async function listarAtividadesPlantio(unidadeId) {
//   return prisma.atvdAgricola.findMany({
//     where: {
//       lote: {
//         unidadeId: unidadeId,
//       },
//     },
//     include: {
//       lote: true,
//       responsavel: true,
//     },
//     orderBy: {
//       dataInicio: "desc",
//     },
//   });
// }

export async function listarAtividadesPlantio(unidadeId) {
  try {
    const atividadesPlantio = await prisma.atvdAgricola.findMany({
    where: {
      lote: {
        unidadeId: unidadeId,
      },
    },
    include: {
      lote: true,
      responsavel: true,
    },
    orderBy: {
      dataInicio: "desc",
    },
  });
    return {
      sucesso: true,
      atividadesPlantio,
      message: "Atividades de plantio listadas com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar atividades de plantio!!",
      error: error.message,
    }
  }
}

export const criarAtividadeAgricola = async ({
  descricao,
  tipo,
  loteId,
  dataInicio,
  dataFim,
  responsavelId,
  status
}) => {
  try {
    // Verificar se o lote existe
    const lote = await prisma.lote.findUnique({
      where: { id: Number(loteId) }
    });

    if (!lote) {
      return {
        sucesso: false,
        message: "Lote não encontrado."
      };
    }

    // Verificar se o responsável existe
    const responsavel = await prisma.usuario.findUnique({
      where: { id: Number(responsavelId) }
    });

    if (!responsavel) {
      return {
        sucesso: false,
        message: "Responsável não encontrado."
      };
    }

    // Criar a atividade
    const novaAtividade = await prisma.atvdAgricola.create({
      data: {
        descricao,
        tipo,          // Enum TipoAtvd
        loteId: Number(loteId),
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        responsavelId: Number(responsavelId),
        status         // Enum StatusAtvdPlantio
      }
    });

    return {
      sucesso: true,
      message: "Atividade criada com sucesso!",
      atividade: novaAtividade
    };

  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao criar atividade agrícola.",
      error: error.message
    };
  }
};



export async function getLotePorId(id) {
  try {
    const lote = await prisma.lote.findUnique({ where: { id } });
    return {
      sucesso: true,
      lote,
      message: "Lote encontrado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao encontrar lote!!",
      error: error.message,
    }
  }
}

export const criarLote = async (dados) => {
  try {
    const {
      unidadeId,
      responsavelId,
      nome,
      tipo,
      tipoProduto,
      quantidade,
      preco,
      unidadeMedida,
      observacoes
    } = dados;

    // validações básicas
    if (!unidadeId || !responsavelId || !nome || !tipo || !preco || !unidadeMedida) {
      return {
        sucesso: false,
        message: "Campos obrigatórios ausentes."
      };
    }

    // criar lote
    const novoLote = await prisma.lote.create({
      data: {
        unidadeId: Number(unidadeId),
        responsavelId: Number(responsavelId),
        nome,
        tipo,            // enum TipoLote
        tipoProduto,     // enum TipoProduto (PLANTIO ou ANIMALIA)
        quantidade,
        preco,
        unidadeMedida,   // enum UnidadesDeMedida
        observacoes: observacoes ?? null
      }
    });

    return {
      sucesso: true,
      message: "Lote criado com sucesso!",
      lote: novoLote
    };

  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao criar lote.",
      error: error.message
    };
  }
};

export async function createLote(data, unidadeId, contratoId) {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: unidadeId } });
    if (!unidade) {
      return { sucesso: false, message: "Unidade não encontrada!" };
    }

    const contrato = await prisma.contrato.findUnique({ where: { id: contratoId } });
    if (!contrato) {
      return { sucesso: false, message: "Contrato não encontrado!" };
    }

    const responsavel = await prisma.usuario.findUnique({ where: { id: data.responsavelId } });
    if (!responsavel) {
      return { sucesso: false, message: "Responsavel nao encontrado!!" }
    }

    if (responsavel.unidadeId !== unidadeId) {
      return { sucesso: false, message: "Responsável não pertence a esta unidade!" };
    }

    // Separar itens do data para colocar como itensEsperados
    const { itens, ...dataWithoutItens } = data;

    const novoLote = await prisma.lote.create({
      data: {
        unidadeId: unidadeId,
        contratoId: contratoId,
        ...dataWithoutItens,
        itensEsperados: itens || null
      },
    });

    return {
      sucesso: true,
      id: novoLote.id,
      ...novoLote,
      message: "Lote criado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao criar lote!!",
      error: error.message,
    }
  }
}

export async function updateLote(id, data, unidadeId, contratoId) {
  try {
    const unidade = await prisma.unidade.findUnique({ where: { id: unidadeId } });
    if (!unidade) {
      return { sucesso: false, message: "Unidade não encontrada!" };
    }

    const contrato = await prisma.contrato.findUnique({ where: { id: contratoId } });
    if (!contrato) {
      return { sucesso: false, message: "Contrato não encontrado!" };
    }

    const responsavel = await prisma.usuario.findUnique({ where: { id: data.responsavelId } });
    if (!responsavel) {
      return { sucesso: false, message: "Responsavel nao encontrado!!" }
    }

    if (responsavel.unidadeId !== unidadeId) {
      return { sucesso: false, message: "Responsável não pertence a esta unidade!" };
    }

    const loteAtualizado = await prisma.lote.update({
      where: { id },
      data: {
        unidadeId: unidadeId,
        contratoId: contratoId,
        ...data
      }
    })
    return {
      sucesso: true,
      loteAtualizado,
      message: "Lote atualizado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao atualizar lote!!",
      error: error.message,
    }
  }
}

// Atualiza campos específicos de um lote (parcial)
export async function updateLoteCampos(id, fields) {
  try {
    // Permitir apenas campos controlados
    const allowed = ["status", "preco", "statusQualidade"];
    const data = {};
    Object.keys(fields || {}).forEach((k) => {
      if (allowed.includes(k)) data[k] = fields[k];
    });

    if (Object.keys(data).length === 0) {
      return { sucesso: false, message: "Nenhum campo válido para atualizar." };
    }

    const loteAtualizado = await prisma.lote.update({
      where: { id: Number(id) },
      data,
    });

    return {
      sucesso: true,
      loteAtualizado,
      message: "Lote atualizado com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao atualizar lote (parcial)!!",
      error: error.message,
    };
  }
}

export async function deleteLote(id) {
  try {
    const lote = await prisma.lote.findUnique({ where: { id: id } });
    if (!lote) {
      return { sucesso: false, message: "Lote nao encontrado!" };
    }

    const loteDeletado = await prisma.lote.delete({
      where: { id },
    })

    return {
      sucesso: true,
      loteDeletado,
      message: "Lote deletado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao deletar lote!!",
      error: error.message,
    }
  }
}
