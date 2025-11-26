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
    const animais = await prisma.animal.findMany();
    // Validações 
    if(animais.raca !== raca) {
      return res.json({message: "Raca nao encontrada."})
    }

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
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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

export async function createAnimais(data) {
  try {
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    if(animal.fornecedorId != data.fornecedorId) {
      return res.json({ message: "Fornecedor nao encontrado." });
    }
    if(animal.unidadeId != data.unidadeId) {
      return res.json({ message: "Unidade nao encontrada." });
    }
    if(animal.loteId != data.loteId) {
      return res.json({ message: "Lote nao encontrado." });
    }

    const animais = await prisma.animal.create({
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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
    const animal = await prisma.animal.findUnique({ where: {id: data.id} });
    // Valdidacoes
    if(animal.id != data.id) {
      return res.json({ message: "Animal nao encontrado." });
    }
    if(animal.fornecedorId != data.fornecedorId) {
      return res.json({ message: "Fornecedor nao encontrado." });
    }
    if(animal.unidadeId != data.unidadeId) {
      return res.json({ message: "Unidade nao encontrada." });
    }
    if(animal.loteId != data.loteId) {
      return res.json({ message: "Lote nao encontrado." });
    }
    
    const animais = await prisma.animal.update({
      where: { id },
      data: {
        animal: data.animal,
        raca: data.raca,
        sku: data.sku,
        dataEntrada: data.dataEntrada,
        fornecedorId: data.fornecedorId,
        quantidade: data.quantidade,
        tipo: data.tipo,
        custo: data.custo,
        unidadeId: data.unidadeId,
        loteId: data.loteId
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
