import prisma from '../prisma/client.js';

//Aqui serão feitas as funções relacionadas a outros usuários (ex: listar, filtrar, editar, apagar)

export const listarFuncionarios = async (unidadeId) => { // TESTAR
    try {
        const funcionarios = await prisma.Usuario.findMany({ where: { unidadeId: Number(unidadeId) }, })
        return ({
            sucesso: true,
            funcionarios,
            message: "Funcionarios da unidade listados com sucesso."
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar funcionarios da unidade.",
            detalhes: error.message
        }
    }
};

export const listarAdmins = async (unidadeId) => {
    try {
        const admins = await prisma.Usuario.findMany({
            where: {
                unidadeId: Number(unidadeId),
                perfilId: 3 //os administradores (os que podem acessar o sistema) terão o perfilId. Os funcionarios normais não.
            }
        })
        return ({
            sucesso: true,
            admins,
            message: "Administradores da unidade listados com sucesso."
        })
    }
    catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar administradores da unidade.",
            detalhes: error.message

        }
    }
};