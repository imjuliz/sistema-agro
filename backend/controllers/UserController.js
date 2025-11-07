import { cadastrarSe, getUserByEmail, updateUsuario, deletarUsuario, login, esqSenha, codigo, updateSenha } from "../models/User.js";
import { userSchema } from "../schemas/userSchema.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import prisma from '../prisma/client.js';
import { compare } from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_DAYS, refreshTokenExpiryDate, } from '../utils/auth.js';

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function cadastrarSeController(req, res) {
  try {
    const { nome, email, senha } = userShema.partial().parse(req.body);
    const id = req.usuario.id

    if (!nome || !email || !senha) { return res.status(400).json({ error: "Preencha todos os campos obrigatórios" }); }

    // Verifica se email já existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) { return res.status(400).json({ error: "Email já cadastrado" }); }

    const user = await cadastrarSe({ nome, email, senha });

    res.status(201).json({ message: "Usuário criado com sucesso", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const updateUsuarioController = async (req, res) => {
  const { id } = req.params.id;
  const { nomeCompleto, email, funcao, setor, unidade, periodo } = userShema.partial().parse(req.body);
  try {
    // Validação dos campos obrigatórios
    if (!nomeCompleto || !email || !funcao || !setor || !unidade || !periodo) { return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios' }); }

    const unidadeData = {
      nomeCompleto,
      email,
      funcao,
      setor,
      unidade,
      periodo
    };

    const result = await updateUsuario(id, unidadeData);

    return res.status(200).json({ sucesso: true, mensagem: 'Usuário atualizado com sucesso', result });
  } catch (error) { return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar usuário' }); }
}

export const deletarUsuarioController = async (req, res) => {
  const { userId } = req.params

  try {
    const resultado = await deletarUsuario(userId)

    if (!resultado.sucesso) { return res.status(400).json(resultado) }

    return res.status(200).json({ sucesso: true, mensagem: 'Usuário deletado com sucesso' })
  } catch (err) { return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' }) }
}

// export const loginController = async (req, res) => {
//   const { email, senha } = userSchema.partial().parse(req.body);
//     if (!email || !senha) {
//       return res.status(400).json({ error: "Email e senha são obrigatórios" });
//     }

//     // Salva em response a resposta do login
//     const response =  await login(email, senha)

//     res
//       .status(200)
//       .json({ message: "Usuário autenticado com sucesso", response });
//   } catch (error) {
//     console.error("Erro ao fazer login:", error);
//     res.status(500).json({ error: "Erro interno do servidor" });
//   }
// };

// -------------------------------------------- so testando
const COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'refreshToken';

export async function loginController(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const senhaValida = await compare(String(senha), String(user.senha));
    if (!senhaValida) return res.status(401).json({ error: "Credenciais inválidas" });
    if (!user.status) return res.status(403).json({ error: "Usuário inativo" });

    const accessToken = generateAccessToken({ id: user.id, email: user.email, tokenVersion: user.tokenVersion });

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);

    res.status(200).json({
      sucesso: true,
      data: ({ accessToken, usuario: { id: user.id, email: user.email } })
    })
  } catch (err) {
    console.error('loginController', err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

export async function refreshController(req, res) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Refresh token não fornecido' });


    const hashed = hashToken(token);
    const sessao = await prisma.sessao.findUnique({ where: { refreshTokenHash: hashed }, include: { usuario: true } });
    if (!sessao) return res.status(401).json({ error: 'Sessão inválida' });
    if (sessao.revoked) return res.status(401).json({ error: 'Refresh token revogado' });
    if (new Date(sessao.expiresAt) < new Date()) return res.status(401).json({ error: 'Refresh token expirado' });


    const user = sessao.usuario;
    const accessToken = generateAccessToken({ id: user.id, email: user.email, tokenVersion: user.tokenVersion });


    // rotacionar refresh token
    const newRefreshToken = generateRefreshToken();
    const newHash = hashToken(newRefreshToken);
    const newExpiry = refreshTokenExpiryDate();


    await prisma.sessao.update({ where: { id: sessao.id }, data: { refreshTokenHash: newHash, expiresAt: newExpiry } });


    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
    };


    res.cookie(COOKIE_NAME, newRefreshToken, cookieOptions);
    res.json({ accessToken });
  } catch (err) {
    console.error('refreshController', err);
    res.status(500).json({ error: 'Erro interno' });
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
  const { email } = userSchema.partial().parse(req.body);
  try {
    // Gerar código de 6 dígitos
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expira = new Date(Date.now() + 10 * 60 * 1000); // expira em 10 minutos

    const oAuth2Client = new google.auth.OAuth2(
      process.env.SMTP_CLIENT_ID,
      process.env.SMTP_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.SMTP_REFRESH_TOKEN, });
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "ruraltech91@gmail.com",
        clientId: process.env.SMTP_CLIENT_ID,
        clientSecret: process.env.SMTP_CLIENT_SECRET,
        refreshToken: process.env.SMTP_REFRESH_TOKEN,
        accessToken: oAuth2Client.getAccessToken(),
      },
    });

    const mailOptions = {
      from: "RuralTech <ruraltech91@gmail.com>",
      to: email,
      subject: "Recuperação de senha",
      text: `Seu código de recuperação é: ${codigo}`,
      html: `
        <h1>Recuperação de senha</h1>
        <p>Seu código de recuperação é:</p>
        <h2 style="color:blue;">${codigo}</h2>
        <p>Este código expira em 10 minutos.</p>
    `,
    };
    await transport.sendMail(mailOptions);
    const token = await esqSenha(email, codigo, expira);

    res.status(200).json({ message: "Código enviado com sucesso", token });
  } catch {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const codigoController = async (req, res) => {
  const { codigo_reset } = req.body;
  try {
    const criarCodigo = await codigo(codigo_reset);
    res.status(200).json({ message: "Código verificado com sucesso", criarCodigo });
  } catch (error) {
    console.error("Erro ao buscar codigo:", error);
    res.status(500).json({ error: "Erro ao buscar codigo" });
  }
};

export const updateSenhaController = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { senha, confSenha } = userSchema.partial().parse(req.body);

    const result = await updateSenha(codigo, senha, confSenha);
    res.status(200).json({ message: "Senha atualizada com sucesso", result });
  } catch (error) {
    console.error("Erro ao buscar codigo:", error);
    res.status(500).json({ error: "Erro ao buscar codigo" });
  }
};