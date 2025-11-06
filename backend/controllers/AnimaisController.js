import { getAnimais, getAnimaisPelaRaca, createAnimais, updateAnimais, deleteAnimais     } from "../models/animais.js";
import { animaisSchema } from "../schemas/animaisSchemas.js";

export async function getAnimaisController(req, res) {
    try {
        const animais = await getAnimais();
        return {
            sucesso: true,
            animais,
            message: "Animais listados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar animais.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function getAnimaisPelaRacaController(req, res) {
    const { raca } = req.params;
    try {
        const animais_raca = await getAnimaisPelaRaca(raca);
        return {
            sucesso: true,
            animais_raca,
            message: "Animais da raça listados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar animais pela raça.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createAnimaisController(req, res) {
    const data = animaisSchema.parse(req.body);
    try {
        const animais = await createAnimais(data);
        return {
            sucesso: true,
            animais,
            message: "Animais criados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar animais.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function updateAnimaisController(req, res) {
    const { id } = req.params;
    const data = animaisSchema.parse(req.body);
    try {
        const animais = await updateAnimais(id, data);
        return {
            sucesso: true,
            animais,
            message: "Animais atualizados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao atualizar animais.",
            detalhes: error.message // opcional, para debug
        };
    }
};

export async function deleteAnimaisController(req, res) {
    const { id } = req.params;
    try {
        const animais = await deleteAnimais(id);
        return {
            sucesso: true,
            animais,
            message: "Animais deletados com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao deletar animais.",
            detalhes: error.message // opcional, para debug
        }
    }
}