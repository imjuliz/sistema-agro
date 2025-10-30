import { getEstoques, getEstoquePorId, createEstoque, updateEstoque, deleteEstoque } from "../models/estoque.js";
import { estoqueSchema } from "../schemas/estoqueSchema.js";

export async function getEstoquesController (req, res) {
    try {
        const estoques = await getEstoques();
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

export async function getEstoquePorIdController (req, res) {
    try {
        const { id } = req.params;
        const estoque = await getEstoquePorId(id);
        return {
            sucesso: true,
            estoque,
            message: "Estoque listado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque por id.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function createEstoqueController (req, res) {
    try {
        const { data } = estoqueSchema.parse(req.body);
        const novoEstoque = await createEstoque(data);
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
        };
    }
};

export async function updateEstoqueController (req, res) {
    try {
        const { id } = req.params;
        const { data } = await updateEstoque(id, data);
        return {
            sucesso: true,
            data,
            message: "Estoque atualizado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar estoque.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function deleteEstoqueController (req, res) {
    try {
        const { id } = req.params;
        await deleteEstoque(id);
        return {
            sucesso: true,
            message: "Estoque deletado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao deletar estoque.",
            detalhes: error.message // opcional, para debug
        };
    }
}