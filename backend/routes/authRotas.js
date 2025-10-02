import express from 'express';
import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from "../config/supabase.js";
import { cadastrarSeController } from '../controllers/UserController.js'

const router = express.Router();

router.post("/cadastrar", cadastrarSeController);

router.post("/login", async (req, res) => {
const { email, senha } = req.body;
try {
    // Validações basicas
    const user = await prisma.usuarios.findUnique({
        where: { email: email }
    });
        
    if (!user) {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    const domainEmailRegex = /^[\w.-]+@(gmail|hotmail|outlook|exemplo)\.com$/;
    if (!domainEmailRegex.test(email)) {
        return res.status(400).json({ mensagem: "O email é inválido. Por favor, use @gmail, @hotmail, @outlook ou @exemplo." });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    if (senha.length > 6) {
        return res.status(400).json({ mensagem: "A senha deve ter no máximo 6 caracteres." });
    }

    // Verificar se o usuário está ativo
    if (user.status === "inativo") {
        return res.status(403).json({ mensagem: "Usuário inativo. Entre em contato com o administrador." });
    }

// Gerar o token JWT
    const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    JWT_SECRET,
    {
        expiresIn: "1h",
    }
    );
  
    // Retornar dados do usuário (sem a senha) e o token
    const userData = {
        id: user.id,
        email: user.email
    };

        res.status(200).json({ message: "Usuário autenticado com sucesso", userData, token });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

router.post("/forgotSenha", async (req, res) => {    
const { email } = req.body;
try {
    const user = await prisma.usuarios.findUnique({
        where: { email: email }
    });
        
    if (!user) {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }
    
    // Verificar se o usuário está ativo
    if (user.status === "inativo") {
        return res.status(403).json({ mensagem: "Usuário inativo. Entre em contato com o administrador." });
    }

    // Gerar código de 6 dígitos
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expira = new Date(Date.now() + 10 * 60 * 1000); // expira em 10 minutos


    // Salvar no banco junto com a validade (10 minutos)
    await prisma.reset_senhas.create({
        data: {
            usuario_id: user.id,
            codigo_reset: codigo,
            codigo_expira: expira
        }
    });

    const oAuth2Client = new google.auth.OAuth2( process.env.SMTP_CLIENT_ID, process.env.SMTP_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI );
    oAuth2Client.setCredentials({ refresh_token: process.env.SMTP_REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();
        
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: 'ruraltech91@gmail.com',
                clientId: process.env.SMTP_CLIENT_ID,
                clientSecret: process.env.SMTP_CLIENT_SECRET,
                refreshToken: process.env.SMTP_REFRESH_TOKEN,
                accessToken: oAuth2Client.getAccessToken(),
            }
        });

        const mailOptions = {
            from: 'RuralTech <ruraltech91@gmail.com>',
            to: email,
            subject: 'Recuperação de senha',
            text: `Seu código de recuperação é: ${codigo}`,
            html: `
            <h1>Recuperação de senha</h1>
            <p>Seu código de recuperação é:</p>
            <h2 style="color:blue;">${codigo}</h2>
            <p>Este código expira em 10 minutos.</p>
        `
        };
        await transport.sendMail(mailOptions);

    res.status(200).json({ message: "Código enviado com sucesso" });
} catch {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
}
});

router.get('/codigo', async (req, res) => {
    const { codigo } = req.body;
try {
    const resetSenha = await prisma.reset_senhas.findUnique({
        where: { codigo_reset: codigo }
    });

    if (!resetSenha) {
        return res.status(401).json({ error: "Código inválido" });
    }

    const codigo_expira = resetSenha.codigo_expira;
    const codigo_expirado = codigo_expira < new Date();

    if (codigo_expirado === false) {
        return res.status(400).json({ error: "Código expirado" });
    } else {
        return res.status(200).json({ message: "Código valido" });
    }
} catch (error) {
    console.error("Erro ao buscar codigo:", error);
    res.status(500).json({ error: "Erro ao buscar codigo" });
}
})

router.put('/updateSenha', async (req, res) => {
const { senha, confSenha } = req.body;
try {

// Validações 
if (senha.length > 6 || confSenha.length > 6) {
    return res.status(400).json({ mensagem: "A senha deve ter no máximo 6 caracteres." });
}
    const senhaData = await prisma.usuarios.create({
        data: {
            senha: senha, 
            confSenha: confSenha
        }
    });

} catch (error) {
    console.error("Erro ao buscar codigo:", error);
    res.status(500).json({ error: "Erro ao buscar codigo" });
}
});

// router.post('/login', (req, res, next) => {
//   try {
//     const { username } = req.body;

//     // Se o username for numérico → LDAP (não precisa de nome, é default)
//     // Senão → Local
//     const estrategia = /^\d+$/.test(username) ? "ldapauth" : "local-db";

//     passport.authenticate(estrategia, { session: true }, (err, user, info) => {
//       if (err) {
//         console.error("Erro na autenticação:", err);
//         return res.status(500).json({ error: "Erro interno no servidor" });
//       }

//       if (!user) {
//         console.warn("Falha na autenticação:", info?.message || "Credenciais inválidas");
//         return res.status(401).json({ error: info?.message || "Autenticação falhou" });
//       }

//       // Loga o usuário manualmente para garantir a sessão
//       req.logIn(user, (loginErr) => {
//         if (loginErr) {
//           console.error("Erro ao criar sessão:", loginErr);
//           return res.status(500).json({ error: "Erro ao criar sessão" });
//         }
//         console.log("Sessão criada:", req.session);
//         console.log("Usuário autenticado:", user.username);

//         return res.json({
//           message: "Autenticado com sucesso",
//           user: {
//             nome: user.displayName || user.cn || user.nome || "", // Nome real LDAP ou do banco
//             username: user.sAMAccountName || user.uid || user.username || "", // Login
//             email: user.mail || user.email || "", // Email
//             funcao: user.funcao || "usuario"
//           }
//         });
//       });
//     })(req, res, next);

//   } catch (error) {
//     console.error("Erro inesperado:", error);
//     res.status(500).json({ error: "Erro inesperado no servidor" });
//   }
// });


// // Rota de Logout
// router.post('/logout', (req, res) => {
//   if (!req.isAuthenticated()){return res.status(401).json({ error: 'Nenhum usuário autenticado'});}

//   console.log('Usuário deslogando:', req.user?.username);

//   req.logout((err) => {
//     if (err) {
//       console.error('Erro no logout:', err);
//       return res.status(500).json({ error: 'Erro ao realizar logout' });
//     }

//     // Destrói a sessão completamente
//     req.session.destroy((destroyErr) => {
//       if (destroyErr) {
//         console.error('Erro ao destruir sessão:', destroyErr);
//         return res.status(500).json({ error: 'Erro ao encerrar sessão' });
//       }

//       res.clearCookie('connect.sid', { path: '/' }); // Remove o cookie de sessão
//       res.json({ message: 'Logout realizado com sucesso' });
//     });
//   });
// });

// import { read } from '../config/database.js';
// router.get('/check-auth', async (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ authenticated: false });
//   }

//   try {
//     const username = req.user.sAMAccountName || req.user.username;

//     const usuarioDB = await read('usuarios', `username = '${username}'`);

//     if (!usuarioDB) {return res.status(404).json({ error: 'Usuário não encontrado no banco'});}

//     res.json({
//       authenticated: true,
//       user:{id: usuarioDB.id, nome: usuarioDB.nome, username: usuarioDB.username,
//         email: usuarioDB.email, funcao: usuarioDB.funcao, ftPerfil: usuarioDB.ftPerfil}
//     });

//   } catch (err) {
//     console.error('Erro ao buscar usuário do banco:', err);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

export default router;