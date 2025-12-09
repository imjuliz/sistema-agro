import { listarDadosGerais, criarDadoGeral, atualizarDadoGeral, deletarDadoGeral } from "../models/dadosGerais.js";

// GET /unidades/:unidadeId/dados-gerais
export async function listarDadosGeraisController(req, res) {
  try {
    const { unidadeId } = req.params;
    const data = await listarDadosGerais(unidadeId);
    return res.status(200).json({ sucesso: true, dados: data });
  } catch (err) {
    console.error("[listarDadosGerais]", err);
    return res.status(500).json({ sucesso: false, erro: "Erro ao listar dados gerais" });
  }
}

// POST /unidades/:unidadeId/dados-gerais
export async function criarDadoGeralController(req, res) {
  try {
    const { unidadeId } = req.params;
    const { dado, valor, descricao } = req.body;
    if (!dado || !valor) {
      return res.status(400).json({ sucesso: false, erro: "Campos 'dado' e 'valor' são obrigatórios" });
    }
    const novo = await criarDadoGeral(unidadeId, { dado, valor, descricao });
    return res.status(201).json({ sucesso: true, dado: novo });
  } catch (err) {
    console.error("[criarDadoGeral]", err);
    return res.status(500).json({ sucesso: false, erro: "Erro ao criar dado geral", detalhes: err.message });
  }
}

// PUT /unidades/:unidadeId/dados-gerais/:id
export async function atualizarDadoGeralController(req, res) {
  try {
    const { unidadeId, id } = req.params;
    const { dado, valor, descricao } = req.body;
    const atualizado = await atualizarDadoGeral(id, unidadeId, { dado, valor, descricao });
    return res.status(200).json({ sucesso: true, dado: atualizado });
  } catch (err) {
    console.error("[atualizarDadoGeral]", err);
    return res.status(500).json({ sucesso: false, erro: "Erro ao atualizar dado geral", detalhes: err.message });
  }
}

// DELETE /unidades/:unidadeId/dados-gerais/:id
export async function deletarDadoGeralController(req, res) {
  try {
    const { unidadeId, id } = req.params;
    await deletarDadoGeral(id, unidadeId);
    return res.status(200).json({ sucesso: true });
  } catch (err) {
    console.error("[deletarDadoGeral]", err);
    return res.status(500).json({ sucesso: false, erro: "Erro ao deletar dado geral", detalhes: err.message });
  }
}

