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
  const perfil = await prisma.perfil.findFirst({
    where: { funcao: "GERENTE_FAZENDA" },
  });
  if (!perfil) {
    throw new Error("Perfil gerente_fazenda não encontrado");
  }

  // cria usuário
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: hash, perfilId: perfil.id },
  });

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
    const usuario = await prisma.usuarios.update({
      where: { id },
      data,
    });

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
        // <<< traz o objeto perfil
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
    if (!senhaValida) {
      return { sucesso: false, erro: "Senha inválida" };
    }

    if (user.status === false || user.status === "inativo") {
      return { sucesso: false, erro: "Usuário inativo" };
    }

    // Perfil como string (nome)
    const perfilFuncao = user.perfil?.funcao ?? null;

    // Gera o token JWT (se quiser incluir perfil no payload)
    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: perfilFuncao },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Normalizar objeto de resposta
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
            funcao: user.perfil.funcao, // ← AQUI o valor certo
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

export async function esqSenha(email, codigo, expira) {
  try {
    const user = await prisma.usuarios.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
    if (user.status === "inativo") {
      throw new Error("Usuário inativo");
    } // Verificar se o usuário está ativo

    // Salvar no banco junto com a validade (10 minutos)
    await prisma.reset_senhas.create({
      data: {
        usuario_id: user.id,
        codigo_reset: codigo,
        codigo_expira: expira,
      },
    });

    return {
      sucesso: true,
      data: {
        id: user.id,
        email: user.email,
      },
      message: "Codigo de alteração de senha enviado.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao encontrar codigo de reset.",
      detalhes: error.message,
    };
  }
}

export async function codigo(codigo_reset) {
  try {
    const resetSenha = await prisma.reset_senhas.findUnique({
      where: { codigo_reset: codigo_reset },
    });

    if (!resetSenha) {
      throw new Error("Código inválido");
    }

    const expirado = resetSenha.codigo_expira < new Date();
    if (expirado) {
      throw new Error("Código expirado");
    }
    if (resetSenha.usado) {
      throw new Error("Código utilizado");
    }

    return {
      sucesso: true,
      data: {
        id: resetSenha.id,
        codigo_reset: resetSenha.codigo_reset,
        codigo_expira: resetSenha.codigo_expira,
      },
      message: "Usuário logado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar",
      detalhes: error.message,
    };
  }
}

export async function updateSenha(codigo, senha, confSenha) {
  try {
    const resetEntry = await prisma.reset_senhas.findUnique({
      where: { codigo_reset: codigo },
    });

    if (confSenha !== senha) {
      return res.status(400).json({ error: "As senhas devem ser iguais" });
    }
    await prisma.usuarios.update({
      data: { senha: await bcrypt.hash(senha, 10) },
      where: { id: resetEntry.usuario_id },
    });

    return {
      sucesso: true,
      data: {
        id: resetEntry.id,
        codigo_reset: resetEntry.codigo_reset,
        codigo_expira: resetEntry.codigo_expira,
      },
      message: "Usuário logado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar",
      detalhes: error.message,
    };
  }
}
