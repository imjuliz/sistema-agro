import { cadastrarSe, getUserByEmail, updateUsuario, deletarUsuario, login, esqSenha, codigo, updateSenha } from "../models/User.js";
import { userSchema } from "../schemas/userSchema.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";


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

    const unidadeData = { nomeCompleto, email, funcao, setor, unidade, periodo };

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

export const loginController = async (req, res) => {
  const { email, senha } = userSchema.partial().parse(req.body);
  try {
    // Validações básicas
    if (!email || !senha) { return res.status(400).json({ error: "Email e senha são obrigatórios" }); }

    // Salva em response a resposta do login
    const response = await login(email, senha)

    res
      .status(200)
      .json({ message: "Usuário autenticado com sucesso", response });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// -------------------------------------------- so testando
// export const loginController = async (req, res) => {
//   try {
//     // validacao de entrada via schema
//     const { email, senha } = userSchema.partial().parse(req.body);

//     if (!email || !senha) {
//       return res.status(400).json({ error: "Email e senha são obrigatórios" });
//     }

//     const response = await login({ email, senha });

//     if (!response.success) {
//       return res.status(401).json({ error: response.error || "Credenciais inválidas" });
//     }

//     // Salva o usuário na sessão
//     req.session.user = response.user || null;

//     return res.status(200).json({ message: "Usuário autenticado com sucesso", user: req.session.user });
//   } catch (error) {
//     console.error("Erro ao fazer login:", error);
//     res.status(500).json({ error: "Erro interno do servidor" });
//   }
// };

// // Me - retorna dados do usuário logado
// export const meController = (req, res) => {
//   if (req.session.user) {
//     return res.status(200).json(req.session.user);
//   } else {
//     return res.status(401).json({ error: "Não autenticado" });
//   }
// };

// // Logout - limpa sessão
// export const logoutController = (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       console.error("Erro ao encerrar sessão:", err);
//       return res.status(500).json({ error: "Erro ao deslogar" });
//     }

//     // limpa o cookie
//     res.clearCookie("connect.sid", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
//     });

//     return res.json({ message: "Logout realizado com sucesso" });
//   });
// };
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