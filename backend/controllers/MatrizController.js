import { getFazendas, getLoja, getMatriz } from "../models/Matriz.js";

export async function getFazendasController(req, res) {
  try {
    const resultado = await getFazendas();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar fazendas.",
      detalhes: error.message
    });
  }
}

export async function getLojaController(req, res) {
  try {
    const resultado = await getLoja();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lojas.",
      detalhes: error.message
    });
  }
}

export async function getMatrizController(req, res) {
  try {
    const resultado = await getMatriz();
    if (!resultado.sucesso) {
      return res.status(500).json(resultado);
    }
    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar matriz.",
      detalhes: error.message
    });
  }
}