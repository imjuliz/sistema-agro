import prisma from '../prisma/client.js';

//aqui estarão as funções da questão financeira (entradas, saídas, vendas, caixa, etc.)

export const listarSaidas = async (unidadeId) =>{
    try{
        const saidas = await prisma.Saidas.findMany({
            where: {unidadeId: Number(unidadeId)},
        })
        return ({
            sucesso: true,
            saidas,
            message: "Saidas listadas com sucesso!!"
        })
    }

    catch (error) {
        return {
            sucesso: false,
            erro: "erro ao listar saidas",
            detalhes: error.message
        }
    }
}