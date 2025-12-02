import prisma from '../../prisma/client.js';

export async function getProdutos() {//tem controller
    try {
        const produtos = await prisma.produto.findMany();

        return {
            sucesso: true,
            produtos,
            message: "Produtos listados com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao listar produtos.",
            detalhes: error.message
        }
    }
}

export async function getProdutosPelaCategoria(categoria) {
  try {
    const produtosCat = await prisma.produto.findMany({
        where: { categoria: categoria }
    })

    if(!produtosCat) {
        return {
            sucesso: true,
            produtosCat,
            message: "Produtos pela categoria foram listados"
        }
    }
  } catch (error) {
    return {
        sucesso: false,
        message: "Erro ao listar produtos pela categoria",
        detalhes: error.message
    }
  }
}

export async function getProdutoPorId(id) {//tem controller
    try {
        const produto = await prisma.produto.findUnique({ where: { id: id } });
        
        return {
            sucesso: true,
            produto,
            message: "Produto encontrado com sucesso."
        }
    }
    catch (error) {
        throw {
            sucesso: false,
            message: "Erro ao encontrar produto.",
            detalhes: error.message 
        }
    }
};

export async function createProduto(data) {//tem controller
    try {
        const produto = await prisma.produto.create({ data });
        return {
            sucesso: true,
            produto,
            message: "Produto criado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao criar produto.",
            detalhes: error.message 
        }
    }
};

export async function deleteProduto(id) {//tem controller
    try {
        const produto = await prisma.produto.delete({ where: { id } });
        return {
            sucesso: true,
            produto,
            message: "Produto deletado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao deletar produto.",
            detalhes: error.message 
        }
    }
};

//pegar produto mais vendido
export const buscarProdutoMaisVendido = async (unidadeId) => {//tem controller
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

        const produto = await prisma.produto.findUnique({ 
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

export const listarProdutos = async (unidadeId) => {//tem controller
    try {
        const fornecedores = await prisma.venda.findMany({where: { unidadeId: Number(unidadeId) },})
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