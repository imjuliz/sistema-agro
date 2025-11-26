import { getAnimais, getAnimaisPelaRaca, createAnimais, updateAnimais, deleteAnimais } from "../models/animais.js";
import { animaisSchema } from "../schemas/animaisSchemas.js";

export async function getAnimaisController(req, res) {
  try {
    const animais = await getAnimais();
    
    return res.status(200).json({
      sucesso: true,
      animais,
      message: "Animais listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar animais.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getAnimaisPelaRacaController(req, res) {
  const { raca } = req.query;
  try {
    const animais_raca = await getAnimaisPelaRaca(raca);
    
    return res.status(200).json({
      sucesso: true,
      animais_raca,
      message: "Animais da raça listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar animais pela raça.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getAnimaisPorIdController(req, res) {
  const { id } = req.params;
  try {
    const animais = await getAnimaisPorId(id);
    
    return res.status(200).json({
      sucesso: true,
      animais,
      message: "Animais listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar animais.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function createAnimaisController(req, res) {
  try {
    const data = animaisSchema.parse(req.body);
    
    //Validações 
    if(isNaN(data.fonecedorId) || isNaN(data.unidadeId) || isNaN(data.loteId)) {
      res.status(400).json({erro: "Fonecedor, Unidade ou Lote nao é um valor valido."})
    }
    if(!data.fonecedorId || !data.unidadeId || !data.loteId) {
      res.status(400).json({erro: "Fonecedor, Unidade ou Lote nao encontrado."})
    }
    const animais = await createAnimais(data);
    
    return res.status(201).json({
      sucesso: true,
      animais,
      message: "Animais criados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar animais.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function updateAnimaisController(req, res) {
  try {
    const { id } = req.params;
    const data = animaisSchema.parse(req.body);
    
    //Validações 
    if(isNaN(data.fonecedorId) || isNaN(data.unidadeId) || isNaN(data.loteId)) {
      res.status(400).json({erro: "Fonecedor, Unidade ou Lote nao é um valor valido."})
    }
    if(!data.fonecedorId || !data.unidadeId || !data.loteId) {
      res.status(400).json({erro: "Fonecedor, Unidade ou Lote nao encontrado."})
    }
    const animais = await updateAnimais(id, data);

    return res.status(200).json({
      sucesso: true,
      animais,
      message: "Animais atualizados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar animais.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function deleteAnimaisController(req, res) {
  try {
    const { id } = req.params;
    const animais = await deleteAnimais(id);

    return res.status(200).json({
      sucesso: true,
      animais,
      message: "Animais deletados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar animais.",
      detalhes: error.message, // opcional, para debug
    })
  }
}
