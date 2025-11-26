import prisma from "../prisma/client.js";

export async function getAnimais() {
  try {
    const animais = await prisma.animal.findMany();
    return {
      sucesso: true,
      animais,
      message: "Animais listados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar animais.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getAnimaisPelaRaca(raca) {
  try {
    const animais_raca = await prisma.animal.findMany({
      where: {
        raca: raca,
      },
    })
    return {
      sucesso: true,
      animais_raca,
      message: "Animais listados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar animais pela raça.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getAnimaisPorId(id) {
  try {
    const animais = await prisma.animal.findUnique({
      where: { id },
    })
    return {
      sucesso: true,
      animais,
      message: "Animais listados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar animais.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function createAnimais(data) {
  try {
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        quantidade: data.quantidade,
        tipo: data.tipo,
        unidadeId: data.unidadeId,
      },
    })
    return {
      sucesso: true,
      animais,
      message: "Animais criados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar animais.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function updateAnimais(id, data) {
  try {
    const animais = await prisma.animal.update({
      where: { id },
      data: {
        animal: data.animal,
        raca: data.raca,
        quantidade: data.quantidade,
        tipo: data.tipo,
        unidadeId: data.unidadeId,
      },
    })
    return {
      sucesso: true,
      animais,
      message: "Animais atualizados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar animais.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function deleteAnimais(id) {
  try {
    await prisma.animal.delete({
      where: { id: parseInt(id) },
    })
    return {
      sucesso: true,
      message: "Animais deletados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar animais.",
      detalhes: error.message, // opcional, para debug
    }
  }
}
