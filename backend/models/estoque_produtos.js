import { success } from 'zod';
import prisma from '../prisma/client.js';

export const mostrarEstoque = async (unidadeId) => { //ok
    try {
        const estoque = await prisma.estoque.findMany({ where: { unidadeId: Number(unidadeId) } })
        return ({
            sucesso: true,
            estoque,
            message: "Estoque listado com sucesso!!"
        })

    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque",
            detalhes: error.message
        }
    }
}

//******************NÃO FORAM TESTADAS******************\\

//SOMA A QUANTIDADE DE ITENS NO ESTOQUE
export const somarQtdTotalEstoque = async (unidadeId) => { //ok
    try {
        // The schema stores current quantities on EstoqueProduto.qntdAtual.
        // First find the estoque record for this unidade (unique by unidadeId), then sum qntdAtual from EstoqueProduto.
        const estoque = await prisma.estoque.findUnique({ where: { unidadeId: Number(unidadeId) } });
        if (!estoque) {
            return { sucesso: true, totalItens: 0, message: "Nenhum estoque encontrado para a unidade." };
        }

        const resultado = await prisma.estoqueProduto.aggregate({
            _sum: { qntdAtual: true },
            where: { estoqueId: Number(estoque.id) }
        });

        const total = Number(resultado._sum.qntdAtual ?? 0);

        return {
            sucesso: true,
            totalItens: total,
            message: "Total de itens em estoque calculado com sucesso!",
        };

    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao calcular o total de itens no estoque",
            detalhes: error.message,
        };
    }
};


export const getEstoque = async (unidadeId) => {
    try {
        // Buscar o estoque da unidade (você tem unique([unidadeId]))
        const estoque = await prisma.estoque.findUnique({
            where: { unidadeId: Number(unidadeId) },
            include: {
                estoqueProdutos: {
                    include: {
                        produto: {
                            include: {
                                origemUnidade: true
                            }
                        },
                        fornecedorUnidade: true,
                        fornecedorExterno: true
                    }
                }
            }
        });

        if (!estoque) {
            return {
                sucesso: false,
                estoque: [],
                message: `Nenhum estoque encontrado para a unidade ${unidadeId}`
            };
        }

        return {
            sucesso: true,
            estoque: estoque.estoqueProdutos,
            message: "Produtos do estoque listados com sucesso!!"
        };

    } catch (error) {
        return {
            sucesso: false,
            estoque: [],
            message: "Erro ao listar produtos do estoque",
            detalhes: error.message
        };
    }
};

export const reporEstoque = async (dados) => {
    try {
        // Localiza o estoque da unidade
        const estoque = await prisma.estoque.findUnique({ where: { unidadeId: Number(dados.unidadeId) } });
        if (!estoque) {
            return { sucesso: false, erro: `Estoque não encontrado para unidade ${dados.unidadeId}` };
        }

        // Cria um movimento de estoque (entrada/saida) em EstoqueMovimento
        const movimento = await prisma.estoqueMovimento.create({
            data: {
                estoqueId: estoque.id,
                tipoMovimento: dados.tipo || 'ENTRADA',
                quantidade: Number(dados.quantidade || 0),
                producaoId: dados.producaoId ? Number(dados.producaoId) : undefined,
                pedidoId: dados.pedidoId ? Number(dados.pedidoId) : undefined,
                vendaId: dados.vendaId ? Number(dados.vendaId) : undefined,
                origemUnidadeId: dados.origemUnidadeId ? Number(dados.origemUnidadeId) : undefined,
                destinoUnidadeId: dados.destinoUnidadeId ? Number(dados.destinoUnidadeId) : undefined,
                data: dados.data ? new Date(dados.data) : new Date()
            }
        });

        return { sucesso: true, movimento };

    } catch (error) {
        return { sucesso: false, erro: 'Erro ao repor estoque', detalhes: error.message };
    }
};

//PRODUTOS
export async function getProdutos() { //ok
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
};

export async function getProdutoPorId(id) { // tem controller
    try {
        const produto = await prisma.produto.findUnique({ where: { id: id } });
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
            detalhes: error.message
        }
    }
};

export async function createProduto(data) {// tem controller
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

export async function deleteProduto(id) { //tem controller 
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

export const buscarProdutoMaisVendido = async (unidadeId) => { //ok tem controller
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

export const listarProdutos = async (unidadeId) => { //ok controller feito
    try {
        const fornecedores = await prisma.venda.findMany({ where: { unidadeId: Number(unidadeId) }, })
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

export const listarAtividadesLote = async (unidadeId) => {
    try {
        const atividades = await prisma.atvdLote.findMany({ where: { loteId: Number(unidadeId) }, })
        return {
            sucesso: true,
            atividades,
            message: "Atividades listadas com sucesso!!"
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar atividades.",
            detalhes: error.message
        }
    }
}

export const consultarLoteAgricola = async ( loteId) => {
    try {
        const atividadesLote = await prisma.atvdAgricola.findMany({where: {loteId: Number(loteId),}});

        return {
            sucesso: true,
            atividadesLote,
            message: "Consulta das atividades realizadas no lote concluida com sucesso!"
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "erro ao consultar atividades do lote especificado.",
            detalhes: error.message
        }
    }
}

// Atualiza a quantidade mínima (qntdMin) de um EstoqueProduto
export const atualizarQntdMin = async (estoqueProdutoId, qntdMin) => {
    try {
        if (!estoqueProdutoId || isNaN(Number(estoqueProdutoId))) {return { sucesso: false, erro: 'ID do produto em estoque inválido.' };}

        const produto = await prisma.estoqueProduto.update({
            where: { id: Number(estoqueProdutoId) },
            data: { qntdMin: Number(qntdMin) },
        });

        return {
            sucesso: true,
            produto,
            message: 'Quantidade mínima atualizada com sucesso.'
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: 'Erro ao atualizar quantidade mínima.',
            detalhes: error.message
        };
    }
};
