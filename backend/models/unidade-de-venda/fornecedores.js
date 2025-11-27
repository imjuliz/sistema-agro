import prisma from '../../prisma/client.js';

export const listarFornecedores = async (unidadeId) =>{ //tem controller
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

export const calcularFornecedores = async (unidadeId) => { //ok
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

export const verContratos = async(unidadeId)=>{
  try{
    const contratos = await prisma.Contratos.findMany({where:{unidadeId: Number(unidadeId)}});
    return ({
      sucesso: true,
      contratos: contratos,
      message: "Contratos listados com sucesso!"
    })
  }catch(error){
    return{
      sucesso: false,
      erro:"Erro ao listar fornecedores",
      detalhes: error.message
    }
  }
}

export async function updateFornecedor(id, data) {
  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { id },
      data: {
        nomeEmpresa: data.nomeEmpresa,
        descricaoEmpresa: data.descricaoEmpresa,
        material: data.material,
        cnpj: data.cnpj,
        contato: data.contato,
        email: data.email,
        endereco: data.endereco
      }
    })
    return {
      sucesso: true,
      fornecedor,
      message: "Fornecedor atualizado com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar fornecedor",
      detalhes: error.message,
    }
  }
}