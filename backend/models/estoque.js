import prisma from "../prisma/client";

export async function getEstoques() {
    try {
        const estoques = await prisma.estoque.findMany();
        return {
            sucesso: true,
            estoques,
            message: "Estoques listados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoques.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function getEstoqueAcimaMinimo(itens_acima_minimo) {
    try {
        const Estoque = await prisma.estoque.findMany({
            where: { itens_acima_minimo }
        })
        return {
            sucesso: true,
            estoqueMinimo,
            message: "Estoque listado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque minimo.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function getEstoqueAbaixoMinimo(itens_abaixo_minimo) {
    try {
        const estoqueMin = await prisma.estoque.findMany({
            where: { itens_abaixo_minimo }
        })
        return {
            sucesso: true,
            estoqueMin,
            message: "Estoque listado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque minimo.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function getEstoqueProximoValorMin(quantidade) {
    try {
        const estoque = await prisma.estoque.findMany({ where: quantidade <= 200});
        return {
            sucesso: true,
            estoque,
            message: "Estoque listado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque minimo.",
            detalhes: error.message // opcional, para debug
        }
    }
}

export async function getValorEstoque(valor_estoque) {
    try {
        const estoque = await prisma.estoque.findMany({ valor_estoque });
        return {
            sucesso: true,
            estoque,
            message: "Estoque listado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque minimo.",
            detalhes: error.message // opcional, para debug
        }
    }
}

export async function getEstoquePorId(id) {
    try {
        const estoque = await prisma.estoque.findUnique({
            where: { id }
        });
        return {
            sucesso: true,
            estoque,
            message: "Estoque listado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque por id.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createEstoque(data) {
    try {
        const novoEstoque = await prisma.estoque.create({
            data: {
                unidadeId: data.unidadeId,
                produtoId: data.produtoId,
                quantidade: data.quantidade,
                estoqueMinimo: data.estoqueMinimo
            }
        });
        return {
            sucesso: true,
            novoEstoque,
            message: "Estoque criado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar estoque.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function updateEstoque(id, data) {
    try {
        const estoqueAtualizado = await prisma.estoque.update({
            where: { id },
            data: {
                unidadeId: data.unidadeId,
                produtoId: data.produtoId,
                quantidade: data.quantidade,
                estoqueMinimo: data.estoqueMinimo
            }
        });
        return {
            sucesso: true,
            estoqueAtualizado,
            message: "Estoque atualizado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar estoque.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function deleteEstoque(id) {
    try {
        await prisma.estoque.delete({
            where: { id }
        });
        return {
            sucesso: true,
            message: "Estoque deletado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao deletar estoque.",
            detalhes: error.message // opcional, para debug
        }
    }
};