import prisma from "../../prisma/client.js";
import { listarUsuariosPorUnidade } from "../../models/usuarios/usuarios.js";

//listar funcionarios
export const listarFuncionariosController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({sucesso: false,erro: "Sessão inválida ou unidade não identificada.",});
    }

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

    if (!unidadeId) {
      return res.status(401).json({sucesso: false,erro: "Sessão inválida ou unidade não identificada."});
    }

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