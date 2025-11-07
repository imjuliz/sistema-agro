import prisma from '../../prisma/client.js';

export const listarFornecedores = async (unidadeId) =>{
    try{
        const fornecedores = await prisma.Fornecedor.findMany({where:{ unidadeId: Number(unidadeId)},})
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

export const calcularFornecedores = async (unidadeId) => {
  try {
    const totalFornecedores = await prisma.fornecedor.aggregate({where: {unidadeId: Number(unidadeId),},});
    const somaFornecedores = Number(totalFornecedores|| 0);

    return {
      sucesso: true,
      qtdFornecedores: somaFornecedores,
      message: "Quantidade de fornecedores calculada com sucesso!",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao calcular quantidade de fornecedores",
      detalhes: error.message,
    };
  }
};