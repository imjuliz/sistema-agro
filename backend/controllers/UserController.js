import { cadastrarSe, getUserByEmail, updateUsuario, deletarUsuario, login, esqSenha, codigo, updateSenha, getUserById } from "../models/User.js";
import { userSchema } from "../schemas/userSchema.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import prisma from '../prisma/client.js';
import { compare } from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_DAYS, refreshTokenExpiryDate, } from '../utils/auth.js';
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
import dotenv from "dotenv";
dotenv.config();

export async function cadastrarSeController(req, res) {
  try {
    const { nome, email, senha } = userSchema.partial().parse(req.body);

    console.log(nome, email, senha);

    if (!nome || !email || !senha) { return res.status(400).json({ error: "Preencha todos os campos obrigatórios" }); }

    // Verifica se email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) { return res.status(400).json({ error: "Email já cadastrado" }); }

    console.log("oi");
    const user = await cadastrarSe({ nome, email, senha });

    res.status(201).json({ message: "Usuário criado com sucesso", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const updateUsuarioController = async (req, res) => {
  console.log("updateUsuarioController - Função chamada.");
  const id = req.usuario.id; // Obter ID do usuário autenticado do token/middleware
  const { nome, telefone, ftPerfil } = req.body; // Campos que o usuário pode atualizar

  console.log("updateUsuarioController - ID do usuário autenticado:", id);
  console.log("updateUsuarioController - Dados do corpo da requisição:", { nome, telefone, ftPerfil });

  try {
    const userDataToUpdate = {};
    if (nome !== undefined) userDataToUpdate.nome = nome;
    if (telefone !== undefined) userDataToUpdate.telefone = telefone;
    if (ftPerfil !== undefined) userDataToUpdate.ftPerfil = ftPerfil;

    console.log("updateUsuarioController - Dados para atualização no Prisma:", userDataToUpdate);

    // Se nenhum campo válido foi fornecido para atualização
    if (Object.keys(userDataToUpdate).length === 0) {
      console.log("updateUsuarioController - Nenhum campo válido fornecido para atualização.");
      return res.status(400).json({ sucesso: false, erro: 'Nenhum campo válido fornecido para atualização' });
    }

    const result = await updateUsuario(parseInt(id), userDataToUpdate);
    console.log("updateUsuarioController - Resultado do updateUsuario:", result);

    if (!result.sucesso) {
      console.log("updateUsuarioController - Erro no updateUsuario, retornando 400.");
      return res.status(400).json(result);
    }

    console.log("updateUsuarioController - Perfil atualizado com sucesso, retornando 200.");
    return res.status(200).json({ sucesso: true, mensagem: 'Perfil atualizado com sucesso', usuario: result.usuario });
  } catch (error) {
    console.error("updateUsuarioController - Erro ao atualizar usuário no controller:", error);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar usuário' });
  }
}

export const deletarUsuarioController = async (req, res) => {
  const { userId } = req.params;

  try {
    const resultado = await deletarUsuario(userId);

    if (!resultado.sucesso) { return res.status(400).json(resultado) }

    return res.status(200).json({ sucesso: true, mensagem: 'Usuário deletado com sucesso' })
  } catch (err) { return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' }) }
}

export async function meController(req, res) {
  try {
    // sua middleware já definiu req.usuario = { id, email, perfil }
    const usuarioContext = req.usuario;
    if (!usuarioContext || !usuarioContext.id) { return res.status(401).json({ mensagem: 'Não autorizado' }); }

    const usuario = await getUserById(usuarioContext.id);
    if (!usuario) { return res.status(404).json({ mensagem: 'Usuário não encontrado' }); }

    // Retorna o usuário em campo "usuario" — consistente com outros endpoints que você usa
    return res.status(200).json({ usuario });
  } catch (err) {
    console.error('meController error:', err);
    return res.status(500).json({ mensagem: 'Erro interno' });
  }
}

// -------------------------------------------- login
const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'refreshToken';

export async function loginController(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    // buscar usuário incluindo perfil
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { perfil: true },
    });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    // validar senha
    const senhaValida = await compare(String(senha), String(user.senha ?? ''));
    if (!senhaValida) return res.status(401).json({ error: 'Credenciais inválidas' });

    if (!user.status) return res.status(403).json({ error: 'Usuário inativo' });

    // gerar access token
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
      perfil: user.perfil?.funcao ?? null,

    });

    // criar sessão de refresh (hash)
    const refreshToken = generateRefreshToken();
    const refreshHash = hashToken(refreshToken);

    await prisma.sessao.create({
      data: {
        usuarioId: user.id,
        refreshTokenHash: refreshHash,
        userAgent: req.get('User-Agent') ?? null,
        ip: req.ip ?? req.headers['x-forwarded-for'] ?? null,
        expiresAt: refreshTokenExpiryDate(),
      },
    });

    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
    };

    // enviar cookie de refresh
    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);

    return res.status(200).json({
      sucesso: true,
      data: {
        accessToken,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          telefone: user.telefone ?? null,
          ftPerfil: user.ftPerfil ?? null,
          perfil: user.perfil?.funcao ?? null,
          unidadeId: user.unidadeId ?? null,
          status: user.status ?? null,
          criadoEm: user.criadoEm ?? null,
          atualizadoEm: user.atualizadoEm ?? null
        },
      },
    });
  } catch (err) {
    console.error('loginController - erro:', err.stack ?? err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

// Substitua sua função refreshController por esta versão instrumentada
export async function refreshController(req, res) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      console.warn("[refreshController] refresh token ausente");
      return res.status(401).json({ error: 'Refresh token não fornecido' });
    }

    let hashed;
    try { hashed = hashToken(token); }
    catch (e) {
      console.error("[refreshController] erro ao hashear token:", e);
      return res.status(500).json({ error: "Erro interno ao processar token" });
    }

    console.log('[refreshController] hashed:', hashed);
    console.log('[refreshController] procurando sessao...');
    // Buscar sessão
    let sessao;
    try {
      sessao = await prisma.sessao.findUnique({
        where: { refreshTokenHash: hashed },
        // include: { usuario: true },
        include: { usuario: { include: { perfil: true } } }
      });
    } catch (e) {
      console.error("[refreshController] erro ao consultar prisma.sessao:", e.stack ?? e);
      return res.status(500).json({ error: "Erro interno ao consultar sessão" });
    }
    // console.log("[refreshController] sessao encontrada:", !!sessao);
    console.log("[refreshController] sessao encontrada:", sessao);

    if (!sessao) {
      console.warn("[refreshController] sessao não encontrada para hash:", hashed);
      return res.status(401).json({ error: 'Sessão inválida' });
    }
    if (sessao.revoked) {
      console.warn("[refreshController] sessao revogada:", sessao.id);
      return res.status(401).json({ error: 'Refresh token revogado' });
    }
    if (new Date(sessao.expiresAt) < new Date()) {
      console.warn("[refreshController] sessao expirada:", sessao.expiresAt);
      return res.status(401).json({ error: 'Refresh token expirado' });
    }

    const user = sessao.usuario;
    if (!user) {
      console.warn("[refreshController] sessao sem usuario associado:", sessao.id);
      return res.status(401).json({ error: 'Sessão sem usuário' });
    }
    console.log("[refreshController] usuario associado:", { id: user.id, email: user.email });

    let accessToken;
    try { accessToken = generateAccessToken({ id: user.id, email: user.email, tokenVersion: user.tokenVersion }); }
    catch (e) {
      console.error("[refreshController] erro ao gerar access token:", e.stack ?? e);
      return res.status(500).json({ error: "Erro interno ao gerar access token" });
    }

    // rotacionar refresh token
    const newRefreshToken = generateRefreshToken();
    const newHash = hashToken(newRefreshToken);
    const newExpiry = refreshTokenExpiryDate();

    try {
      await prisma.sessao.update({
        where: { id: sessao.id },
        data: { refreshTokenHash: newHash, expiresAt: newExpiry },
      });
    } catch (e) {
      console.error("[refreshController] erro ao atualizar sessao no prisma:", e.stack ?? e);
      return res.status(500).json({ error: "Erro interno ao atualizar sessão" });
    }

    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
      // domain: isProd ? '.vercel.app' : undefined,
    };

    // enviar novo cookie
    res.cookie(COOKIE_NAME, newRefreshToken, cookieOptions);
    console.log("[refreshController] refresh rotacionado com sucesso. sessaoId:", sessao.id);

    return res.json({
      accessToken,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone ?? null,
        ftPerfil: user.ftPerfil ?? null,
        perfil: user.perfil?.funcao ?? null,
        unidadeId: user.unidadeId ?? null,
        status: user.status ?? null,
        criadoEm: user.criadoEm ?? null,
        atualizadoEm: user.atualizadoEm ?? null
      }
    });
  } catch (err) {
    console.error("refreshController - erro não tratado:", err.stack ?? err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

export async function logoutController(req, res) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
      const hashed = hashToken(token);
      await prisma.sessao.updateMany({ where: { refreshTokenHash: hashed }, data: { revoked: true } });
    }
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.json({ sucesso: true });
  } catch (err) {
    console.error('logoutController', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
// -------------------------------------------- 


export const esqSenhaController = async (req, res) => {
  try {
    const { email } = req.body;

    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expira = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // transporter sem OAuth2 — usando app password
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // enviar email
    await transport.sendMail({
      from: `RuralTech <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperação de senha",
      html: `
        <h1>Recuperação de senha</h1>
        <p>Seu código de recuperação é:</p>
        <h2 style="color:blue;">${codigo}</h2>
        <p>Este código expira em 10 minutos.</p>
      `,
    });
    
    // salvar no banco
    const result = await esqSenha(email, codigo, expira);
    console.log("Resultado do model esqSenha:", result);
    if (!result.sucesso) return res.status(400).json(result);

    return res.status(200).json({
      sucesso: true,
      message: "Código enviado com sucesso.",
      result,
    });

  } catch (error) {
    console.error("Erro no controller esqueceu senha:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};


export const codigoController = async (req, res) => {
  try {
    const { codigo_reset } = req.body;
    const result = await codigo(codigo_reset);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao verificar código",
      detalhes: error.message
    });
  }
};

export const updateSenhaController = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { senha, confSenha } = req.body;

    const result = await updateSenha(codigo, senha, confSenha);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao atualizar senha",
      detalhes: error.message
    });
  }
};
