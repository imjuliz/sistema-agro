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
  const perfil = await prisma.perfis.findUnique({
    where: { nome: "gerente_fazenda" },
  });

  if (!perfil) {
    throw new Error("Perfil gerente_fazenda não encontrado");
  }

  // cria usuário
  const usuario = await prisma.usuarios.create({
    data: {
      nome,
      email,
      senha: hash,
      perfilId: perfil.id,
    },
  });

  return usuario;
};

// Buscar usuário por email
export async function getUserByEmail(email) {
  const usuario = await prisma.usuarios.findUnique({
    where: { email },
  });
  return usuario; // pode ser null se não existir
};

// deletar usuario
export async function deletarUsuario(userId) {
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Erro ao deletar usuário:", error.message);
    return { sucesso: false, erro: error.message };
  }

  console.log("Usuário deletado com sucesso:", data);
  return { sucesso: true };
};

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

export async function login(email, senha) {
  try {
    const user = await prisma.usuarios.findUnique({
      where: { email: email },
      include: { perfil: true },
    });

    // Garantir que ambos são strings
    const senhaFornecida = String(senha);
    const senhaHash = String(user.senha);

    // Comparar senhas
    const senhaValida = await compare(senhaFornecida, senhaHash);
    if (!senhaValida) {
      throw new Error("Senha inválida")
    }

    if (user.status === "inativo") {
      throw new Error("Usuário inativo");
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil.nome },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return {
      sucesso: true,
      data: {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        token,
      },
      message: "Usuário logado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao logar usuário",
      detalhes: error.message, // opcional, para debug
    };
  }
};

export async function esqSenha(email, codigo, expira) {
  try {
    const user = await prisma.usuarios.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Verificar se o usuário está ativo
    if (user.status === "inativo") {
      throw new Error("Usuário inativo");
    }

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
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao encontrar codigo de reset.",
      detalhes: error.message, // opcional, para debug
    }
  }
};

export async function codigo(codigo_reset) {
  try {
    const resetSenha = await prisma.reset_senhas.findUnique({ where: { codigo_reset: codigo_reset }});

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
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar",
      detalhes: error.message, // opcional, para debug
    }
  }
};

export async function updateSenha(codigo, senha, confSenha) {
  try {
    const resetEntry = await prisma.reset_senhas.findUnique({ where: { codigo_reset: codigo }, });

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
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar",
      detalhes: error.message, // opcional, para debug
    }
  }
};