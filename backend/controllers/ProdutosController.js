import { getProdutos, getProdutosPelaCategoria, getProdutoPorId, createProduto, deleteProduto } from "../models/produtos.js";
import { produtoSchema } from "../schemas/produtoSchema.js";

export async function getProdutosController(req, res) {
    try {
        const produto = await getProdutos();
        return {
            sucesso: true,
            produto,
            message: "Produtos listados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar produtos.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function getProdutosPelaCategoriaController(req, res) {
    try {
        const { categoria_animalia } = req.params;
        const produto_animalia = await getProdutosPelaCategoria(categoria_animalia);
        return {
            sucesso: true,
            produto_animalia,
            message: "Produtos de animalia listados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar produtos de animalia.",
            detalhes: error.message // opcional, para debug
        }
    }
}

export async function getProdutoPorIdController(req, res) {
    try {
        const { id } = req.params;
        const produto = await getProdutoPorId(id);
        return {
            sucesso: true,
            produto,
            message: "Produto listado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar produto.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function createProdutoController(req, res) {
    try {
        const { data } = produtoSchema.parse(req.body);
        const produto = await createProduto(data);
        return {
            sucesso: true,
            produto,
            message: "Produto criado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar produto.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function deleteProdutoController(req, res) {
    try {
        const { id } = req.params;
        const produto = await deleteProduto(id);
        return {
            sucesso: true,
            produto,
            message: "Produto deletado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao deletar produto.",
            detalhes: error.message // opcional, para debug
        };
    }
};