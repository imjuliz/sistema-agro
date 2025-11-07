import prisma from "../prisma/client.js";

export async function getLote() {
  try {
    const lotes = await prisma.lote.findMany({
      where: { unidadeId: Number(unidadeId) },
    });
    return {
      sucesso: true,
      lotes,
      message: "Lotes listados com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes!!",
      error: error.message,
    };
  }
}

export async function getLoteAtividade(atividade) {
  //testar para ver se funciona
  try {
    const lotes_ativos = await prisma.lote.findMany({ where: { atividade } });
    return {
      sucesso: true,
      lotes_ativos,
      message: "Lotes ativos listados com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes ativos!!",
      error: error.message,
    };
  }
}

export async function getLotePorAnimaliaId() {
  try {
    const lote_animalia = await prisma.lote.findMany({
      where: { tipo: "Gado" || "Leite" },
    });
    return {
      sucesso: true,
      lote_animalia,
      message: "Lotes de animalia listados com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar lotes de animalia!!",
      error: error.message,
    };
  }
}

export async function getlotePorId(id) {
  try {
    const lote = await prisma.lote.findUnique({ where: { id: id } });
    return {
      sucesso: true,
      lote,
      message: "Lote encontrado com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao encontrar lote!!",
      error: error.message,
    };
  }
}

export async function createLote(data) {
  try {
    const novoLote = await prisma.lote.create({
      data: {
        unidadeId: data.unidadeId,
        responsavelId: data.responsavelId,
        nome: data.nome,
        tipo: data.tipo,
        qntdItens: data.qntdItens,
        observacoes: data.observacoes,
        dataFabricacao: data.dataFabricacao,
        dataValidade: data.dataValidade,
      },
    });
    return {
      sucesso: true,
      novoLote,
      message: "Lote criado com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao criar lote!!",
      error: error.message,
    };
  }
}

export async function updateLote(id, data) {
  try {
    const loteAtualizado = await prisma.lote.update({
      where: { id: id },
    });
    return {
      sucesso: true,
      loteAtualizado,
      message: "Lote atualizado com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao atualizar lote!!",
      error: error.message,
    };
  }
}

export async function deleteLote(id) {
  try {
    const loteDeletado = await prisma.lote.delete({
      where: { id: id },
    });
    return {
      sucesso: true,
      loteDeletado,
      message: "Lote deletado com sucesso!!",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao deletar lote!!",
      error: error.message,
    };
  }
}
