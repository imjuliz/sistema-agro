import { listarFornecedores, updateFornecedor } from "../models/fornecedores.js";


export async function listarFornecedoresController(req, res) {
    const { unidadeId } = req.params
    try {
        const fornecedores = await listarFornecedores(unidadeId)
        return {
            sucesso: true,
            fornecedores,
            message: "Fornecedores da unidade listados com sucesso!!"
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar fornecedores",
            detalhes: error.message
        }
    }
}

export async function updateFornecedorController(req, res) {
    const { id } = req.params;
    const data = fornecedorSchema.parse(req.body);
    try {
        const fornecedor = await updateFornecedor(id, data);
        return {
            sucesso: true,
            fornecedor,
            message: "Fornecedor atualizado com sucesso!!",
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar fornecedor",
            detalhes: error.message
        }
    }
}