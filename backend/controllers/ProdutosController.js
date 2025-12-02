import { getProdutos, getProdutosPelaCategoria, getProdutoPorId, createProduto, deleteProduto } from "../models/estoque_produtos_lotes/produtos.js";
import { produtoSchema, IdsSchema } from "../schemas/produtoSchema.js";

export async function getProdutosController(req, res) {
  try {
    const produto = await getProdutos();

    return res.status(200).json(produto);
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar produtos.",
      detalhes: error.message, // opcional, para debug
    }
  }
}

export async function getProdutosPelaCategoriaController(req, res) {
  try {
    const { categoria } = produtoSchema.partial().parse(req.query);

    const produtos = await getProdutosPelaCategoria(categoria);

    return res.status(200).json({produtos});
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar produtos de animalia.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getProdutoLotePorIdController(req, res) {
  try {
  const { loteId } = req.params;
  
  // Validações
  if(!loteId) {
    return res.status(400).json({erro: "Lote não encontrado."})
  }
  if(isNaN(loteId)) {
    return res.status(400).json({erro: "Lote precisa ser um numero."})
  }

  const produto = await getProdutoLotePorId(loteId);
  return res.status(200).json({
    sucesso: true,
    produto,
    message: "Produto listado com sucesso."
  })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar produto.",
      detalhes: error.message
    })
  }
}

export async function getProdutoPorIdController(req, res) {
  try {
    const { id } = req.params;
    const produto = await getProdutoPorId(id);
    return {
      sucesso: true,
      produto,
      message: "Produto listado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar produto.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function createProdutoController(req, res) {
  try {
    const data = produtoSchema.parse(req.body);
    const produto = await createProduto(data);
    return {
      sucesso: true,
      produto,
      message: "Produto criado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar produto.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function deleteProdutoController(req, res) {
  try {
    const { id } = req.params;
    const produto = await deleteProduto(id);
    return {
      sucesso: true,
      produto,
      message: "Produto deletado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar produto.",
      detalhes: error.message, // opcional, para debug
    };
  }
}
