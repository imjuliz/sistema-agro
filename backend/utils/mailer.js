import { transporter } from "../config/nodemailer.js";
import fs from "fs/promises";
import path from "path";

export async function sendResetPasswordEmail(to, token) {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "resources",
    "reset-password-email.html"
  );

  const template = await fs.readFile(templatePath, "utf-8");
  let html;

  html = template.replace(/{{TOKEN}}/g, token);
  html = html.replace(
    /{{FRONTEND_BASE_URL}}/g,
    process.env.FRONTEND_URL || "http://localhost:3001"
  );

  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: "Redefinição de senha - RuralTech",
    html,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Envia email de contato para a empresa
 * @param {Object} contatoData - Dados do contato
 * @returns {Promise<{sucesso: boolean, erro?: string}>}
 */
export async function enviarEmailContato(contatoData) {
  try {
    // Validar se as credenciais de email estão configuradas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn("⚠️ Email não configurado. Credenciais SMTP não encontradas.");
      return {
        sucesso: true,
        mensagem: "Mensagem recebida com sucesso! (Email não configurado)",
      };
    }

    const { nome, email, telefone, mensagem, dataContato } = contatoData;

    // HTML do email de contato
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #99BF0F 0%, #7aa00d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #99BF0F; }
            .field-value { color: #555; margin-top: 5px; }
            .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; text-align: center; }
            .divider { border-top: 1px solid #ddd; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Novo Contato Recebido - RuralTech</h2>
            </div>
            <div class="content">
              <p><strong>Olá,</strong></p>
              <p>Um novo contato foi enviado através do formulário no site da RuralTech. Confira os detalhes abaixo:</p>
              
              <div class="divider"></div>
              
              <div class="field">
                <div class="field-label">Nome Completo:</div>
                <div class="field-value">${nome}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="field-label">Telefone:</div>
                <div class="field-value">${telefone}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Mensagem:</div>
                <div class="field-value">${mensagem.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Data do Contato:</div>
                <div class="field-value">${dataContato}</div>
              </div>
              
              <div class="divider"></div>
              <p style="color: #999; font-size: 12px;">Para responder este contato, clique no email acima ou use o telefone fornecido.</p>
            </div>
            <div class="footer">
              <p>© 2025 RuralTech - Sistema de Gestão Agropecuária</p>
              <p>Email gerado automaticamente. Não responda este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "ruraltech052@gmail.com", // Email da empresa
      replyTo: email, // Responder vai pro email do contato
      subject: `Novo Contato: ${nome}`,
      html,
    };

    await transporter.sendMail(mailOptions);

    return {
      sucesso: true,
      mensagem: "Email enviado com sucesso",
    };
  } catch (erro) {
    console.error("Erro ao enviar email de contato:", erro);
    return {
      sucesso: false,
      erro: erro.message,
    };
  }
}
