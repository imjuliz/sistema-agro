import prisma from '../../prisma/client.js';

export const listarFornecedores = async (unidadeId) =>{
    try{
        const fornecedores = await prisma.Fornecedor.findMany({
            where:{ unidadeId: Number(unidadeId)},

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