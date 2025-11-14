import prisma from '../../prisma/client.js';

export const lotesPlantio = async (unidadeId) => {
    try {
        const lotes = await prisma.Lote.findMany({ where: { unidadeId: Number(unidadeId), tipo: "Plantio" } });
        return ({
            sucesso: true,
            lotes,
            message: "Talhões listados com sucesso!"
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "erro ao listar talhões!",
            detalhes: error.message
        }
    }
}