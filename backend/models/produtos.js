import prisma from "../prisma/client.js";

export async function getProdutos() {
  try {
    const produtos = await prisma.produto.findMany();
    return {
      sucesso: true,
      produtos,
      message: "Produtos listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar produtos.",
    };
  }
}

export async function getProdutosPelaCategoria(categoria) {
  try {
    const produto_categoria = await prisma.produto.findMany({
      where: { categoria: categoria },
    });
    return {
      sucesso: true,
      produto_categoria,
      message: "Produtos de animalia listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao listar produtos de animalia.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getProdutoPorId(id) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: id },
    });
    return {
      sucesso: true,
      produto,
      message: "Produto encontrado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao encontrar produto.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function createProduto(data) {
  try {
    const produto = await prisma.produto.create({
      data: {
        loteId: data.loteId,
        nome: data.nome,
        categoria: data.categoria,
        descricao: data.descricao,
        preco: data.preco,
        criadoEm: new Date(),
      },
    });
    return {
      sucesso: true,
      produto,
      message: "Produto criado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao criar produto.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function deleteProduto(id) {
  try {
    const produto = await prisma.produto.delete({
      where: { id },
    });
    return {
      sucesso: true,
      produto,
      message: "Produto deletado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      message: "Erro ao deletar produto.",
      detalhes: error.message, // opcional, para debug
    };
  }
}
