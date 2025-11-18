import prisma from "../prisma/client.js";

export async function getAtividadeLoteTipoPlantio(tipo) {
    try {
        const atividadeLote = await prisma.atividadeLote.findMany({ where: { tipo: tipo } });
        return {
            sucesso: true,
            atividadeLote,
            message: "Atividades do lote listadas com sucesso!!"
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar atividades do lote",
            detalhes: error.message
        }
    }
} 