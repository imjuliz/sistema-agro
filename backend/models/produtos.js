import prisma from '../prisma/client.js';

export async function getProdutos() {
    try {
        const produtos = await prisma.produtos.findMany();
        return {
            sucesso: true,
            produtos,
            message: "Produtos listados com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao listar produtos."
        }
    }
};

export async function getProdutoPorId(id) {
    try {
        const produto = await prisma.produtos.findUnique({ where: { id: id } });
        return {
            sucesso: true,
            produto,
            message: "Produto encontrado com sucesso."
        }
    }
    catch (error) {
        return {
            sucesso: false,
            message: "Erro ao encontrar produto.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createProduto(data) {
    try {
        const produto = await prisma.produtos.create({ data });
        return {
            sucesso: true,
            produto,
            message: "Produto criado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao criar produto.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function deleteProduto(id) {
    try {
        const produto = await prisma.produtos.delete({ where: { id } });
        return {
            sucesso: true,
            produto,
            message: "Produto deletado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao deletar produto.",
            detalhes: error.message // opcional, para debug
        }
    }
};