import { deleteUnidade, getUnidadePorId, getUnidades, createUnidade } from "../models/unidades.js";
import { unidadeSchema } from "../schemas/unidadeSchema.js";

export async function getUnidadesController(req, res) {
    try {
        const unidades = await getUnidades();
        return {
            sucesso: true,
            unidades,
            message: "Unidades listadas com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidades.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function getUnidadePorIdController(req, res) {
    try {
        const { id } = req.params;
        const unidade = await getUnidadePorId(id);
        return {
            sucesso: true,
            unidade,
            message: "Unidade listada com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidade por id.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createUnidadeController(req, res) {
    try {
        const data = unidadeSchema.parse(req.body);
        const unidade = await createUnidade(data);
        return {
            sucesso: true,
            unidade,
            message: "Unidade criada com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar unidade.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function updateUnidadeController(req, res) {
try {
    const { id } = req.params;
    const data = unidadeSchema.parse(req.body);
    const unidade = await updateUnidade(id, data);
    return {
        sucesso: true,
        unidade,
        message: "Unidade atualizada com sucesso."
    }
} catch (error) {
    return {
        sucesso: false,
        erro: "Erro ao atualizar unidade.",
        detalhes: error.message // opcional, para debug
    }
}
};

export async function deleteUnidadeController(req, res) {
try {
    const { id } = req.params;
    const unidade = await deleteUnidade(id);
    return {
        sucesso: true,
        unidade,
        message: "Unidade deletada com sucesso."
    }
} catch (error) {
    return {
        sucesso: false,
        erro: "Erro ao deletar unidade.",
        detalhes: error.message // opcional, para debug
    }
}
};