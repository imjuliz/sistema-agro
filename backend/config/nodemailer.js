import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configurar o transporter do Nodemailer
const config = {
  service: process.env.SMTP_SERVICE || "gmail",
};

// Adicionar autenticação apenas se as credenciais estiverem disponíveis
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  config.auth = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  };
}

export const transporter = nodemailer.createTransport(config);

// Verificar conexão ao iniciar apenas se houver credenciais
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("⚠️ Erro ao conectar com o servidor de email:", error.message);
    } else {
      // console.log("✅ Servidor de email conectado com sucesso");
    }
  });
} else {
  console.warn("⚠️ Variáveis EMAIL_USER e EMAIL_PASS não configuradas. Emails não serão enviados.");
}
