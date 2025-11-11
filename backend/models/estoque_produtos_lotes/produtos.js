import prisma from '../../prisma/client.js';

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

//pegar produto mais vendido
export const buscarProdutoMaisVendido = async (unidadeId) => {
    try {
        const resultado = await prisma.itemVenda.groupBy({ // Agrupa os itens de venda por produto e soma a quantidade vendida
            by: ["produtoId"],
            _sum: { quantidade: true, },
            where: { venda: { unidadeId: Number(unidadeId), }, },
            orderBy: { _sum: { quantidade: "desc", }, },
            take: 1, // pega apenas o produto mais vendido
        });

        if (resultado.length === 0) {
            return {
                sucesso: false,
                message: "Nenhum item encontrado para esta unidade.",
            };
        }

        const produtoMaisVendido = resultado[0];

        const produto = await prisma.produto.findUnique({ // Busca informações do produto
            where: { id: produtoMaisVendido.produtoId, },
            select: {
                id: true,
                nome: true,
                descricao: true,
            },
        });

        return {
            sucesso: true,
            produto: {
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao,
                quantidadeVendida: produtoMaisVendido._sum.quantidade,
            },
            message: "Produto mais vendido encontrado com sucesso!",
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao buscar o produto mais vendido",
            detalhes: error.message,
        };
    }
};

export const listarProdutos = async (unidadeId) => {
    try {
        const fornecedores = await prisma.venda.findMany({
            where: { unidadeId: Number(unidadeId) },
        })
        return ({
            sucesso: true,
            fornecedores,
            message: "Fornecedores da unidade listados com sucesso!!"
        })

    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar fornecedores",
            detalhes: error.message
        }
    }
}