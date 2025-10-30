import prisma from '../prisma/client.js';

export async function getRegistroSanitario() {
    try {
        const resgistroSanitario = await prisma.registroSanitario.findMany();
        return {
            sucesso: true,
            resgistroSanitario,
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

export async function getRegistroSanitarioPorId (id) {
    try {
        const resgistroSanitario = await prisma.registroSanitario.findUnique({
            where: { id }    
        })
        return ({
            sucesso: true,
            resgistroSanitario,
            message: "Registro sanitario listado com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar registro sanitario por id.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function createRegistroSanitario (data) {
    try {
        const resgistroSanitario = await prisma.registroSanitario.create({data});
        return ({
            sucesso: true,
            resgistroSanitario,
            message: "Registro sanitario criado com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao criar registro sanitario.",
            detalhes: error.message // opcional, para debug
        }
    }
};

export async function deleteRegistroSanitario (id) {
    const resgistroSanitario = await prisma.registroSanitario.delete({
        where: { id }
    })
    return ({
        sucesso: true,
        resgistroSanitario,
        message: "Registro sanitario deletado com sucesso."
    })
};