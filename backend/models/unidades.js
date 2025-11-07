import prisma from '../prisma/client.js';

export async function getUnidades() {
    try {
        const unidades = await prisma.unidades.findMany();
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
        };
    }
};

export async function getUnidadePorId(id) {
    try {
        const unidade = await prisma.unidades.findUnique({ where: { id } })
        return ({
            sucesso: true,
            unidade,
            message: "Unidade listada com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar unidade por id.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createUnidade(data) {
    try {
        const unidade = await prisma.unidades.create({ data });
        return ({
            sucesso: true,
            unidade,
            message: "Unidade criada com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar unidade.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function deleteUnidade(id) {
    const unidade = await prisma.unidades.delete({ where: { id } })
    return ({
        sucesso: true,
        unidade,
        message: "Unidade deletada com sucesso."
    })
};