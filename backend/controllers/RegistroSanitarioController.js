import { getRegistroSanitario, getRegistroSanitarioPorId, createRegistroSanitario, deleteRegistroSanitario } from "../models/registro_sanitario.js";
import { registroSanitarioSchema } from "../schemas/registro_sanitarioSchema.js";

export async function getRegistroSanitarioController (req, res) {
    try {
        const registros =  await getRegistroSanitario();
        return {
            sucesso: true,
            registros,
            message: "Registros sanitarios listados com sucesso."
        }
    } catch (error) {
        return {
        sucesso: false,
        erro: "Erro ao listar registros sanitarios.",
        detalhes: error.message // opcional, para debug
      };
    }
};

export async function getRegistroSanitarioPorIdController (req, res) {
    try {
        const { id } = req.params;
        const registro = await getRegistroSanitarioPorId(id);
        return {
            sucesso: true,
            registro,
            message: "Registro sanitario listado com sucesso."
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar registro sanitario por id.",
            detalhes: error.message // opcional, para debugs
        }
    }
};

export async function createRegistroSanitarioController (req, res) {
    try {
        const { data } = registroSanitarioSchema.parse(req.body);
        const registro = await createRegistroSanitario(data);
        return {
            sucesso: true,
            registro,
            message: "Registro sanitario criado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar registro sanitario.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function deleteRegistroSanitarioController (req, res) {
    try {
        const { id } = req.params;
        const registro = await deleteRegistroSanitario(id);
        return {
            sucesso: true,
            registro,
            message: "Registro sanitario deletado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao deletar registro sanitario.",
            detalhes: error.message // opcional, para debug
        }
    }
};