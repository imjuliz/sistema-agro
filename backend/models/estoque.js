import prisma from "../prisma/client";

export async function getEstoques() {
  try {
    const estoques = await prisma.estoque.findMany();
    return {
      sucesso: true,
      estoques,
      message: "Estoques listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoques.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getEstoquePorId(id) {
  try {
    const estoque = await prisma.estoque.findUnique({
      where: { id },
    });
    return {
      sucesso: true,
      estoque,
      message: "Estoque listado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar estoque por id.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function createEstoque(data) {
  try {
    const estoque = await prisma.estoque.findUnique({ where: { id: data.id } });
    // Valdidacoes
    if(estoque.id != data.id) {
      return res.json({ message: "Estoque nao encontrado." });
    }
    if(estoque.unidadeId != data.unidadeId) {
      return res.json({ message: "Unidade nao encontrada." });
    }
    
    const novoEstoque = await prisma.estoque.create({
      data: {
        unidadeId: data.unidadeId,
        descricao: data.descricao,
        qntdItens: data.qntdItens
      }
    });
    return {
      sucesso: true,
      novoEstoque,
      message: "Estoque criado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar estoque.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function updateEstoque(id, data) {
  try {
    const estoque = await prisma.estoque.findUnique({ where: { id: data.id } });
    // Valdidacoes
    if(estoque.id != data.id) {
      return res.json({ message: "Estoque nao encontrado." });
    }

    const estoqueAtualizado = await prisma.estoque.update({
      where: { id },
      data: {
        unidadeId: data.unidadeId,
        descricao: data.descricao,
        qntdItens: data.qntdItens
      },
    });
    return {
      sucesso: true,
      estoqueAtualizado,
      message: "Estoque atualizado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar estoque.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function deleteEstoque(id) {
  try {
    const estoque = await prisma.estoque.findUnique({ where: { id: id } });
    // Valdidacoes
    if(estoque.id != id) {
      return res.json({ message: "Estoque nao encontrado." });
    }
    await prisma.estoque.delete({
      where: { id },
    });
    return {
      sucesso: true,
      message: "Estoque deletado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar estoque.",
      detalhes: error.message, // opcional, para debug
    };
  }
}
