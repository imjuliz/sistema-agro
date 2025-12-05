import { enviarEmailContato } from "../utils/mailer.js";

export async function enviarContatoController(req, res) {
  try {
    const { firstName, lastName, phone, email, message, agreedToPrivacy } = req.body;

    // Validações
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        sucesso: false,
        erro: "Nome é obrigatório",
      });
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({
        sucesso: false,
        erro: "Sobrenome é obrigatório",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        sucesso: false,
        erro: "Telefone é obrigatório",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        sucesso: false,
        erro: "Email é obrigatório",
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        sucesso: false,
        erro: "Email inválido",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        sucesso: false,
        erro: "Mensagem é obrigatória",
      });
    }

    // Preparar dados do contato
    const contatoData = {
      nome: `${firstName} ${lastName}`,
      email,
      telefone: phone,
      mensagem: message,
      dataContato: new Date().toLocaleString("pt-BR"),
    };

    // Enviar email
    const resultadoEmail = await enviarEmailContato(contatoData);

    if (!resultadoEmail.sucesso) {
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao enviar email. Tente novamente mais tarde.",
        detalhes: resultadoEmail.erro,
      });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.",
      dados: contatoData,
    });

  } catch (error) {
    console.error("Erro ao enviar contato:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno do servidor",
      detalhes: error.message,
    });
  }
}
