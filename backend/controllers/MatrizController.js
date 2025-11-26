import {
  deleteUnidade,
  getUnidadePorId,
  getUnidades,
  updateStatusUnidade,
  createUnidade,
  getFazendas,
  getLoja,
  getMatriz,
  UnidadeService,
  updateUnidade
} from "../models/Matriz.js";
import { unidadeSchema } from "../schemas/unidadeSchema.js";

// GET /unidades
export async function getUnidadesController(req, res) {
  const resultado = await getUnidades();
  if (!resultado.sucesso) return res.status(500).json(resultado);
  return res.json(resultado);
}

// GET /unidades/:id
export async function getUnidadePorIdController(req, res) {
  const { id } = req.params;
  const resultado = await getUnidadePorId(Number(id));
  if (!resultado.sucesso) return res.status(404).json(resultado);
  return res.json(resultado);
}

// GET /fazendas
export async function getFazendasController(req, res) {
  const resultado = await getFazendas();
  if (!resultado.sucesso) return res.status(500).json(resultado);
  return res.json(resultado);
}

// GET /lojas
export async function getLojaController(req, res) {
  const resultado = await getLoja();
  if (!resultado.sucesso) return res.status(500).json(resultado);
  return res.json(resultado);
}

// GET /matrizes
export async function getMatrizController(req, res) {
  const resultado = await getMatriz();
  if (!resultado.sucesso) return res.status(500).json(resultado);
  return res.json(resultado);
}

// CONTAGEM
export async function contarFazendasController(req, res) {
  try {
    const total = await UnidadeService.contarFazendas();
    const ativas = await UnidadeService.contarFazendasAtivas();
    const inativas = await UnidadeService.contarFazendasInativas();
    return res.json({ total, ativas, inativas });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor', detalhes: error.message });
  }
}

// CRIAR
export async function createUnidadeController(req, res) {
  try {
    // supondo que unidadeSchema retorna os campos da unidade (não { data })
    const data = unidadeSchema.parse(req.body);
    const resultado = await createUnidade(data);
    if (!resultado.sucesso) return res.status(400).json(resultado);
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({ sucesso: false, erro: "Erro ao criar unidade.", detalhes: error.message });
  }
}

// ATUALIZAR
export async function updateUnidadeController(req, res) {
  try {
    const { id } = req.params;
    const data = unidadeSchema.parse(req.body);
    const resultado = await updateUnidade(id, data);
    if (!resultado.sucesso) return res.status(400).json(resultado);
    return res.json(resultado);
  } catch (error) {
    return res.status(400).json({ sucesso: false, erro: "Erro ao atualizar unidade.", detalhes: error.message });
  }
}

// DELETAR
export async function deleteUnidadeController(req, res) {
  try {
    const { id } = req.params;
    const resultado = await deleteUnidade(Number(id));
    if (!resultado.sucesso) return res.status(400).json(resultado);
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: "Erro ao deletar unidade.", detalhes: error.message });
  }
}

// UPDATE STATUS
export const updateStatusUnidadeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { novoStatus } = req.body;
    if (!id || isNaN(Number(id))) return res.status(400).json({ sucesso: false, erro: "ID inválido." });
    if (!novoStatus) return res.status(400).json({ sucesso: false, erro: "O campo 'novoStatus' é obrigatório." });

    const resultado = await updateStatusUnidade(Number(id), novoStatus);
    if (!resultado.sucesso) return res.status(400).json(resultado);
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: "Erro interno ao atualizar status.", detalhes: error.message });
  }
};
