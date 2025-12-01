import prisma from "../prisma/client.js";

export async function getLote() {
  try {
    const lotes = await prisma.lote.findMany({
      include: {
        unidade: true,
        responsavel: true
      }
    })
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

// N possui coluna atividade
// export async function getLoteAtividade(atividade) {
//   //testar para ver se funciona
//   try {
//     const lotes_ativos = await prisma.lote.findMany({ where: { atividade } })
//     return {
//       sucesso: true,
//       lotes_ativos,
//       message: "Lotes ativos listados com sucesso!!",
//     }
//   } catch (error) {
//     return {
//       sucesso: false,
//       message: "Erro ao listar lotes ativos!!",
//       error: error.message,
//     }
//   }
// }

export async function getLotePorTipo(tipo) {
  try {
    const lote_tipo = await prisma.lote.findMany({
      where: { tipo }
    });

    return {
      sucesso: true,
      lote_tipo,
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

export async function getLoteRentabilidade(id_lote, rentabilidade) {
  try {
    const lote_rentabilidade = await prisma.lote.findMany({ 
      where: { id_lote, rentabilidade }
    });
    return {
      sucesso: true,
      lote_rentabilidade,
      message: "Lotes com rentabilidade listados com sucesso!!"
    }
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes com rentabilidade!!",
      error: error.message
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

export async function getlotePorId(id) {
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

export async function createLote(data, unidadeId, contratoId) {
  try {
    const unidade = await prisma.unidade.findUnique({where: { id: unidadeId }});
    if (!unidade) {
      return { sucesso: false, message: "Unidade não encontrada!" };
    }

    const contrato = await prisma.contrato.findUnique({where: { id: contratoId }});
    if (!contrato) {
      return { sucesso: false, message: "Contrato não encontrado!" };
    }

    const responsavel = await prisma.usuario.findUnique({ where: { id: data.responsavelId } });
    if (!responsavel) {
      return {sucesso: false, message: "Responsavel nao encontrado!!"}
    }

    const novoLote = await prisma.lote.create({
      data: {
        unidadeId: unidadeId,
        contratoId: contratoId,
        ...data
      },
    });

    return {
      sucesso: true,
      novoLote,
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
    const unidade = await prisma.unidade.findUnique({where: { id: unidadeId }});
    if (!unidade) {
      return { sucesso: false, message: "Unidade não encontrada!" };
    }

    const contrato = await prisma.contrato.findUnique({where: { id: contratoId }});
    if (!contrato) {
      return { sucesso: false, message: "Contrato não encontrado!" };
    }

    const responsavel = await prisma.usuario.findUnique({ where: { id: data.responsavelId } });
    if (!responsavel) {
      return {sucesso: false, message: "Responsavel nao encontrado!!"}
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
