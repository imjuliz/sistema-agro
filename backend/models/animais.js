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
      detalhes: error.message,
    }
  }
}

export async function getAnimaisPelaRaca(raca) {
  try {
    // Normaliza texto digitado na URL
    const normalize = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const racaNormalizada = normalize(raca);

    // Busca todos os animais
    const animais = await prisma.animal.findMany();

    // Filtra ignorando acentos e caixa
    const animaisFiltrados = animais.filter((a) =>
      normalize(a.raca).includes(racaNormalizada)
    );

    return {
      sucesso: true,
      animais: animaisFiltrados,
      message: "Animais listados com sucesso."
    };

  } catch (error) {
    throw {
      sucesso: false,
      erro: "Erro ao listar animais pela raça.",
      detalhes: error.message,
    }
  }
}

export async function calcularRentabilidadeAnimal({ animalId, loteId }) {
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: animalId }
    });

    if (!animal) {
      return { sucesso: false, erro: "Animal não encontrado." };
    }

    const lote = await prisma.lote.findUnique({
      where: { id: loteId }
    });

    if (!lote) {
      return { sucesso: false, erro: "Lote não encontrado." };
    }

    // Regra de negócio → cálculo
    const custoAnimal = Number(animal.custo ?? 0);
    const qntdItens = Number(lote.qntdItens ?? 0);
    const rentabilidade = qntdItens * custoAnimal;

    return {
      sucesso: true,
      rentabilidade
    };

  } catch (e) {
    return {
      sucesso: false,
      erro: "Erro ao calcular rentabilidade.",
      detalhes: e.message
    };
  }
}


export async function getAnimaisPorId(id) {
  try {
    const animais = await prisma.animal.findUnique({
      where: { id: Number(id) },
    })
    return {
      sucesso: true,
      animais,
      message: "Animais listados com sucesso.",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar animais coisinha.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function createAnimais(data) {
  try {
    const animais = await prisma.animal.create({
      data: {
        unidadeId: data.unidadeId,
        loteId: data.loteId,
        fornecedorId: data.fornecedorId,
        ...data
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
    const animal = await prisma.animal.findUnique({ where: { id } });

    if (!animal) {
      return {
        sucesso: false,
        erro: "Animal não encontrado."
      };
    }

    // Atualiza
    const animais = await prisma.animal.update({
      where: { id: parseInt(id) },
      data: {
        ...data, 
        fornecedorId: data.fornecedorId ?? null,
        loteId: data.loteId ?? null,
        unidadeId: data.unidadeId
      }
    });

    return {
      sucesso: true,
      animais,
      message: "Animais atualizados com sucesso."
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar animais.",
      detalhes: error.message,
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
      detalhes: error.message,
    }
  }
}
