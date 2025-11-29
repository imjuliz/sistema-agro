import prisma from '../../prisma/client.js';
import bcrypt from 'bcryptjs'; // Certifique-se de que o bcrypt está importado

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
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar administradores da unidade.",
            detalhes: error.message
        }
    }
};

// Função auxiliar para obter o ID do perfil pelo nome do papel
export const getPerfilIdByRole = async (roleName) => {
  try {
    const perfil = await prisma.perfil.findUnique({
      where: { funcao: roleName }, // Corrigido de 'nome' para 'funcao'
      select: { id: true },
    });
    return perfil?.id;
  } catch (error) {
    console.error(`Erro ao buscar perfil ${roleName}:`, error);
    return null;
  }
};

// Nova função para listar gerentes disponíveis (sem unidadeId associada)
export const listarGerentesDisponiveis = async () => {
  try {
    const gerentePerfilId = await getPerfilIdByRole("GERENTE_FAZENDA");
    if (!gerentePerfilId) {
      return { sucesso: false, erro: "Perfil de GERENTE_FAZENDA não encontrado." };
    }

    const gerentes = await prisma.usuario.findMany({
      where: {
        perfilId: gerentePerfilId,
        unidadeId: null, // Gerentes que não estão associados a uma unidade
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      },
      orderBy: { nome: 'asc' },
    });

    return {
      sucesso: true,
      gerentes,
      message: "Gerentes disponíveis listados com sucesso!",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar gerentes disponíveis",
      detalhes: error.message,
    };
  }
};

// Nova função para criar um novo usuário (gerente ou funcionário)
export const criarUsuario = async (userData) => {
  try {
    const { nome, email, senha, telefone, role, unidadeId } = userData;

    if (!nome || !email || !senha || !telefone || !role) {
      return { sucesso: false, erro: "Nome, email, senha, telefone e papel são obrigatórios.", field: null };
    }

    const perfilId = await getPerfilIdByRole(role);
    if (!perfilId) {
      return { sucesso: false, erro: `Papel "${role}" inválido.`, field: null };
    }

    // Verificar duplicidade por email ou telefone (retorna primeiro encontrado)
    const existing = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: email },
          { telefone: telefone }
        ]
      },
      select: { id: true, email: true, telefone: true }
    });

    if (existing) {
      if (existing.email === email) return { sucesso: false, erro: "Email já cadastrado.", field: "email" };
      if (existing.telefone === telefone) return { sucesso: false, erro: "Telefone já cadastrado.", field: "telefone" };
      return { sucesso: false, erro: "Usuário já cadastrado.", field: null };
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        telefone,
        perfilId,
        unidadeId: unidadeId ? Number(unidadeId) : null,
        status: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      }
    });

    return { sucesso: true, usuario: newUser, message: "Usuário criado com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    // Prisma unique constraint fallback
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return { sucesso: false, erro: "Email já cadastrado.", field: "email" };
    }
    return { sucesso: false, erro: "Erro ao criar usuário.", detalhes: error.message, field: null };
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

export const updateUsuario = async (id, data) => {
  try {
    const { senha, ...updateData } = data; // Evita atualizar a senha diretamente aqui sem hash

    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        perfil: { select: { nome: true } },
        unidade: { select: { nome: true } },
      },
    });

    return {
      sucesso: true,
      usuario: updatedUser,
      message: "Usuário atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return { sucesso: false, erro: "Email já cadastrado." };
    }
    return { sucesso: false, erro: "Erro ao atualizar usuário.", detalhes: error.message };
  }
};