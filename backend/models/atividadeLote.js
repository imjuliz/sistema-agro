import prisma from "../prisma/client.js";

export async function getAtividadeLoteTipoPlantio(tipo) {
  try {
    const atividadeLote = await prisma.atividadeLote.findMany({ where: { tipo: tipo } });
    
    return {
      sucesso: true,
      atividadeLote,
      message: "Atividades do lote listadas com sucesso!!"
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar atividades do lote",
      detalhes: error.message
    }
  }
}

export async function createAtividadeLote(data, loteId, responsavelId) {
  try {
    const atividadeLote = await prisma.atividadesLote.create({
      data: {
        descricao: data.descricao,
        tipo: data.tipo,
        loteId: Number(loteId),
        data: data.data,
        responsavelId: Number(responsavelId)
      }
    })

    return {
        sucesso: true,
        atividadeLote,
        message: "Atividade do lote criada com sucesso!!"
      }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar atividade do lote",
      detalhes: error.message
    }
  }
}