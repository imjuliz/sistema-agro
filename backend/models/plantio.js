import prisma from "../prisma/client";

export async function getPlantio() {
    try {
        const plantio = await prisma.plantio.findMany();
        return {
            sucesso: true,
            plantio,
            message: "Plantios listados com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao listar plantio."
        }
    }
};

// colocar filtro para também listar por tipo de plantio
export async function getPlantioCategoria(categoria_plantio) {
    try {
        const plantio_categoria = await prisma.plantio.findMany({
            where: { categoria: categoria_plantio }
        })
        return {
            sucesso: true,
            plantio_categoria,
            message: "Categoria de plantio listados com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao listar categoria de plantio.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createPlantio(data) {
    try {
        const plantio = await prisma.plantio.create({
            data: {
                categoria: data.categoria,
                areaHectares: data.areaHectares,
                tipo: data.tipo,
                unidadeId: data.unidadeId
            }
        })
        return {
            sucesso: true,
            plantio,
            message: "Plantio criado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao criar plantio.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function updatePlantio(id, data) {
    try {
        const plantio = await prisma.plantios.update({
            where: { id },
            data: {
                categoria: data.categoria,
                areaHectares: data.areaHectares,
                tipo: data.tipo,
                unidadeId: data.unidadeId
            }
        })
        return {
            sucesso: true,
            plantio,
            message: "Plantio atualizado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao atualizar plantio.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function deletePlantio(id) {
    try {
        const plantio = await prisma.plantios.delete({ where: { id } });
        return {
            sucesso: true,
            plantio,
            message: "Plantio deletado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            message: "Erro ao deletar plantio.",
            detalhes: error.message // opcional, para debug
        }
    }
}