import express from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cadastrarSeController } from "../controllers/UserController.js";
import { JWT_SECRET } from "../config/jwt.js";
import { userSchema } from "../schemas/userSchema.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const router = express.Router();

router.post("/cadastrar", cadastrarSeController);

router.post("/login", async (req, res) => {
  const { email, senha } = userShema.partial().parse(req.body);

  try {
    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Buscar usuário
    const user = await prisma.usuarios.findUnique({
      where: { email: email },
      include: { perfil: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    // Verificar se o usuário está ativo
    if (user.status === "inativo") {
      return res
        .status(403)
        .json({
          mensagem: "Usuário inativo. Entre em contato com o administrador.",
        });
    }

    // DEBUG: Verificar tipos dos dados
    console.log("Tipo da senha fornecida:", typeof senha);
    console.log("Tipo da senha no banco:", typeof user.senha);
    console.log("Senha no banco existe?:", user.senha ? "Sim" : "Não");

    // Garantir que ambos são strings
    const senhaFornecida = String(senha);
    const senhaHash = String(user.senha);

    // Comparar senhas
    const senhaValida = await bcrypt.compare(senhaFornecida, senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil.nome },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Retornar dados do usuário (sem a senha) e o token
    const userData = {
      id: user.id,
      email: user.email,
      perfil: user.perfil.nome,
    };

    res
      .status(200)
      .json({ message: "Usuário autenticado com sucesso", userData, token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/esqSenha", async (req, res) => {
  const { email } = userSchema.partial().parse(req.body);
  try {
    const user = await prisma.usuarios.findUnique({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Verificar se o usuário está ativo
    if (user.status === "inativo") {
      return res
        .status(403)
        .json({
          mensagem: "Usuário inativo. Entre em contato com o administrador.",
        });
    }

    // Gerar código de 6 dígitos
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expira = new Date(Date.now() + 10 * 60 * 1000); // expira em 10 minutos

    // Salvar no banco junto com a validade (10 minutos)
    await prisma.reset_senhas.create({
      data: {
        usuario_id: user.id,
        codigo_reset: codigo,
        codigo_expira: expira,
      },
    });

    const oAuth2Client = new google.auth.OAuth2(
      process.env.SMTP_CLIENT_ID,
      process.env.SMTP_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials({
      refresh_token: process.env.SMTP_REFRESH_TOKEN,
    });
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

    res.status(200).json({ message: "Código enviado com sucesso" });
  } catch {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

router.post("/codigo", async (req, res) => {
  const { codigo_reset } = req.body;
  try {
    const resetSenha = await prisma.reset_senhas.findUnique({
      where: { codigo_reset: codigo_reset },
    });

    if (!resetSenha) {
      return res.status(401).json({ error: "Código inválido" });
    }

    const expirado = resetSenha.codigo_expira < new Date();

    if (expirado) {
      return res.status(400).json({ error: "Código expirado" });
    }
    if (resetSenha.usado) {
      return res.status(400).json({ error: "Código já utilizado" });
    }
  } catch (error) {
    console.error("Erro ao buscar codigo:", error);
    res.status(500).json({ error: "Erro ao buscar codigo" });
  }
});

router.put("/updateSenha/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { senha, confSenha } = userSchema.partial().parse(req.body);

    const resetEntry = await prisma.reset_senhas.findUnique({ where: { codigo_reset: codigo }, });

    if (confSenha !== senha) {
      return res.status(400).json({ error: "As senhas devem ser iguais" });
    }
    await prisma.usuarios.update({
      data: { senha: await bcrypt.hash(senha, 10) },
      where: { id: resetEntry.usuario_id },
    });
    res.status(200).json({
      message: "Senha atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao buscar codigo:", error);
    res.status(500).json({ error: "Erro ao buscar codigo" });
  }
});

router.get("/teste", (req, res) => {
  res.json({ message: "Rota /auth/teste funcionando!" });
});

export default router;
