import prisma from "../prisma/client.js";

export const listarFornecedores = async (unidadeId) => {
  try {
    const fornecedores = await prisma.Fornecedor.findMany({
      where: { unidadeId: Number(unidadeId) },
    })
    return {
      sucesso: true,
      fornecedores,
      message: "Fornecedores da unidade listados com sucesso!!",
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar fornecedores",
      detalhes: error.message,
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