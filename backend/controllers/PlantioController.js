import { getPlantio, getPlantioCategoria, createPlantio, updatePlantio, deletePlantio } from "../models/plantio.js";
import { plantioSchema } from "../schemas/plantioSchema.js";

export async function getPlantioController(req, res) {
  try {
    const plantios = await getPlantio();
    return res.status(200).json({
      sucesso: true,
      plantios,
      message: "Plantios listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar plantios.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getPlantioCategoriaController(req, res) {
  try {
    const { categoria } = req.params;

    //Validações
    if(!categoria) {
      return res.status(400).json({erro: "Categoria precisa ser informada."})
    }

    const catPlantio = await getPlantioCategoria(categoria);

    return res.status(200).json({
      sucesso: true,
      plantio_categoria,
      message: "Plantios da categoria listados com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar plantios da categoria.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function createPlantioController(req, res) {
  try {
    const data = plantioSchema.parse(req.body);
    const { unidadeId, loteId } = req.params;

    //Validações
    if(isNaN(data.fornecedorId) || !data.fornecedorId) {
      return res.status(400).json({erro: "Fornecedor nao encontrado."})
    }
    if(isNaN(unidadeId) || !unidadeId) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }
    if(isNaN(loteId) || !loteId) {
      return res.status(400).json({erro: "Lote nao encontrado."})
    }

    const plantio = await createPlantio(data, unidadeId, loteId);

    return res.status(201).json({
      sucesso: true,
      plantio,
      message: "Plantio criado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar plantio.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function updatePlantioController(req, res) {
  try {
    const data = plantioSchema.parse(req.body);
    const { id, unidadeId, loteId } = req.params;

    //Validações
    if(isNaN(data.fornecedorId) || !data.fornecedorId) {
      return res.status(400).json({erro: "Fornecedor nao encontrado."})
    }
    if(isNaN(id) || !id) {
      return res.status(400).json({erro: "Id deve ser numero e informado"})
    }
    if(isNaN(unidadeId) || !unidadeId) {
      return res.status(400).json({erro: "Unidade nao encontrada."})
    }
    if(isNaN(loteId) || !loteId) {
      return res.status(400).json({erro: "Lote nao encontrado."})
    }

    const plantio = await updatePlantio(id, data, unidadeId, loteId);

    return res.status(200).json({
      sucesso: true,
      plantio,
      message: "Plantio atualizado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar plantio.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function deletePlantioController(req, res) {
  try {
    const { id } = req.params;

    //Validações
    if(isNaN(id) || !id) {
      return res.status(400).json({erro: "Id deve ser numero e informado"})
    }

    const plantio = await deletePlantio(id);

    return res.status(200).json({
      sucesso: true,
      plantio,
      message: "Plantio deletado com sucesso.",
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao deletar plantio.",
      detalhes: error.message, // opcional, para debug
    })
  }
}
