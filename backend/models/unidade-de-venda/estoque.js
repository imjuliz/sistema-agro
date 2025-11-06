import prisma from '../../prisma/client.js';

export const mostrarEstoque = async (unidadeId) =>{
    try{
        const estoque = await prisma.Estoque.findMany({
            where:{ unidadeId: Number(unidadeId)},

        })
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


