import prisma from "../../prisma/client.js";
import { listarUsuariosPorUnidade, getPerfilIdByRole, listarGerentesDisponiveis, criarUsuario, updateUsuario } from "../../models/usuarios/usuarios.js";

//listar funcionarios
export const listarFuncionariosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {return res.status(401).json({sucesso: false,erro: "Sessão inválida ou unidade não identificada.",});}

    const resultado = await listarFuncionarios(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro || "Erro ao listar funcionários.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar funcionários:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar funcionários.",
      detalhes: error.message,
    });
  }
};

//  Listar Administradores
export const listarAdminsController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {return res.status(401).json({sucesso: false,erro: "Sessão inválida ou unidade não identificada."});}

    const resultado = await listarAdmins(unidadeId);

    if (!resultado.sucesso) {
      return res.status(400).json({
        sucesso: false,
        erro: resultado.erro || "Erro ao listar administradores.",
        detalhes: resultado.detalhes,
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar administradores:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno ao listar administradores.",
      detalhes: error.message,
    });
  }
};

// ✅ LISTA USUÁRIOS DA UNIDADE
export const listarUsuariosPorUnidadeController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: "Sessão inválida ou unidade não identificada.",
      });
    }

    const resultado = await listarUsuariosPorUnidade(unidadeId);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao listar usuários da unidade:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar usuários da unidade.",
      detalhes: error.message,
    });
  }
};

export const listarGerentesDisponiveisController = async (req, res) => {
  try {
    const resultado = await listarGerentesDisponiveis();
    if (!resultado.sucesso) {
      return res.status(resultado.erro === "Perfil de GERENTE_FAZENDA não encontrado." ? 404 : 500).json(resultado);
    }
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro no controller ao listar gerentes disponíveis:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};

export const criarUsuarioController = async (req, res) => {
  try {
    const { nome, email, senha, telefone, role, unidadeId } = req.body;

    if (!nome || !email || !senha || !telefone || !role) {
      return res.status(400).json({ sucesso: false, erro: "Nome, email, senha, telefone e papel são obrigatórios." });
    }

    const perfilId = await getPerfilIdByRole(role);
    if (!perfilId) {
      return res.status(400).json({ sucesso: false, erro: `Papel "${role}" inválido.` });
    }

    const resultado = await criarUsuario({ nome, email, senha, telefone, perfilId, unidadeId });

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao criar usuário:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};

export const updateUsuarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ sucesso: false, erro: "ID do usuário é obrigatório." });
    }

    const resultado = await updateUsuario(id, data);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Erro no controller ao atualizar usuário:", error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor.",
      detalhes: error.message,
    });
  }
};