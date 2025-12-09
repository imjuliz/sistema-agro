import { supabase } from "../config/supabase.js";
import prisma from "../prisma/client.js";
import { hashPassword } from "../utils/passwordHash.js";
import { JWT_SECRET } from "../config/jwt.js";
import { compare } from "../utils/passwordHash.js";

// Criar usuário
export async function cadastrarSe({ nome, email, senha }) {
  // hash da senha
  const hash = await hashPassword(senha);

  // busca o perfil gerente_fazenda
  const perfil = await prisma.perfil.findFirst({where: { funcao: "GERENTE_FAZENDA" },});
  if (!perfil) {throw new Error("Perfil gerente_fazenda não encontrado");}

  // cria usuário
  const usuario = await prisma.usuario.create({data: { nome, email, senha: hash, perfilId: perfil.id },});
  return usuario;
}

// Buscar usuário por email
export async function getUserByEmail(email) {
  console.log(email)
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  return usuario; // pode ser null se não existir
}

// deletar usuario
export async function deletarUsuario(userId) {
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Erro ao deletar usuário:", error.message);
    return { sucesso: false, erro: error.message };
  }

  console.log("Usuário deletado com sucesso:", data);
  return { sucesso: true };
}

// editar informacoes do usuario
export async function updateUsuario(id, data) {
  try {
    const usuario = await prisma.usuario.update({where: { id },data});

    return {
      sucesso: true,
      usuario,
      message: "Perfis atualizados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar perfis",
      detalhes: error.message, // opcional, para debug
    };
  }
};

export async function getUserById(id) {
  // Recebe id (number ou string), retorna null ou objeto com campos públicos
  const userId = Number(id);
  if (Number.isNaN(userId)) return null;

  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      ftPerfil: true,
      id: true,
      nome: true,
      email: true,
      telefone: true,
      perfilId: true,
      unidadeId: true,
      status: true,
      criadoEm: true,
      atualizadoEm: true,
      perfil: {
        select: {
          id: true,
          funcao: true,
          descricao: true,
        },
      },
    },
  });
  return usuario;
}

export async function login(email, senha) {
  try {
    // buscar usuário incluindo perfil
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { perfil: true, unidade: true },
    });

    if (!user) {
      return {
        sucesso: false,
        erro: "Usuário não encontrado",
      };
    }

    // Garantir que ambos são strings (proteção)
    const senhaFornecida = String(senha);
    const senhaHash = String(user.senha ?? "");

    // Comparar senhas
    const senhaValida = await compare(senhaFornecida, senhaHash);
    if (!senhaValida) {return { sucesso: false, erro: "Senha inválida" };}

    if (user.status === false || user.status === "inativo") {return { sucesso: false, erro: "Usuário inativo" };}

    // Perfil como string (nome)
    const perfilFuncao = user.perfil?.funcao ?? null;

    // Gera o token JWT (se quiser incluir perfil no payload)
    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: perfilFuncao },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      sucesso: true,
      data: {
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          unidadeId: user.unidadeId,
          perfil: {
            id: user.perfil.id,
            funcao: user.perfil.funcao, 
            descricao: user.perfil.descricao,
          },
        },
        accessToken: token,
      },
      message: "Usuário logado com sucesso.",
    };
  } catch (error) {
    console.error("[login] erro:", error.stack ?? error);
    return {
      sucesso: false,
      erro: "Erro ao logar usuário",
      detalhes: error.message,
    };
  }
}

// 1 — gerar código e salvar
export async function esqSenha(email, codigo, expira) {
  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {return {sucesso: false,erro: "Usuário não encontrado"};}

    if (user.status === "inativo") {return {sucesso: false,erro: "Usuário inativo"};}

    await prisma.resetSenha.create({
      data: {
        usuarioId: user.id,
        codigoReset: codigo,
        codigoExpira: expira,
      },
    });

    return {
      sucesso: true,
      data: { id: user.id, email: user.email },
      message: "Código de alteração de senha enviado.",
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao gerar código de reset.",
      detalhes: error.message,
    };
  }
}

export async function codigo(codigo_reset) {
  try {
    const resetSenha = await prisma.resetSenha.findFirst({
      where: { codigoReset: codigo_reset }
    });

    if (!resetSenha) return { sucesso: false, erro: "Código inválido" };

    if (resetSenha.codigoExpira < new Date()) return { sucesso: false, erro: "Código expirado" };

    if (resetSenha.usado) return { sucesso: false, erro: "Código já utilizado" };

    return {
      sucesso: true,
      data: resetSenha,
      message: "Código válido",
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao verificar código.",
      detalhes: error.message,
    };
  }
}

export async function updateSenha(codigo, senha, confSenha) {
  try {
    if (senha !== confSenha) {
      return {sucesso: false,erro: "As senhas devem ser iguais"};
    }

    const resetEntry = await prisma.resetSenha.findFirst({where: { codigoReset: codigo }});

    if (!resetEntry) {
      return {sucesso: false,erro: "Código inválido"};
    }

    await prisma.usuario.update({
      where: { id: resetEntry.usuarioId },
      data: { senha: await hashPassword(senha) },
    });

    await prisma.resetSenha.update({
      where: { id: resetEntry.id },
      data: { usado: true },
    });

    return {
      sucesso: true,
      message: "Senha atualizada com sucesso"
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar senha.",
      detalhes: error.message,
    };
  }
}