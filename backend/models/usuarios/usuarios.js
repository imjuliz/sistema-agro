import prisma from '../../prisma/client.js';

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

export async function listarUsuariosPorUnidade(unidadeId) { //tem controller
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {unidadeId: Number(unidadeId) }, // filtra todos com a mesma unidade
    
      include: {
        perfil: {select: { nome: true, descricao: true },},
        unidade: {select: { nome: true, tipo: true },},
      },
      orderBy: {nome: "asc",},
    });

    return {
      sucesso: true,
      unidadeId: Number(unidadeId),
      totalUsuarios: usuarios.length,
      usuarios,
    };
  } catch (error) {
    console.error("Erro ao buscar usuários da unidade:", error);
    return {
      sucesso: false,
      erro: error.message,
    };
  }
}