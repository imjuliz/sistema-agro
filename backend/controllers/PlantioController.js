import { getPlantio, getPlantioCategoria, createPlantio, updatePlantio, deletePlantio } from "../models/plantio.js";
import { plantioSchema } from "../schemas/plantioSchemas.js";

export async function getPlantioController(req, res) {
  try {
    const plantios = await getPlantio();
    return {
      sucesso: true,
      plantios,
      message: "Plantios listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar plantios.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function getPlantioCategoriaController(req, res) {
  const { categoria_plantio } = req.params;
  try {
    const plantio_categoria = await getPlantioCategoria(categoria_plantio);
    return {
      sucesso: true,
      plantio_categoria,
      message: "Plantios da categoria listados com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao listar plantios da categoria.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function createPlantioController(req, res) {
  const data = plantioSchema.parse(req.body);
  try {
    const plantio = await createPlantio(data);
    return {
      sucesso: true,
      plantio,
      message: "Plantio criado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao criar plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function updatePlantioController(req, res) {
  const { id } = req.params;
  const data = plantioSchema.parse(req.body);
  try {
    const plantio = await updatePlantio(id, data);
    return {
      sucesso: true,
      plantio,
      message: "Plantio atualizado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}

export async function deletePlantioController(req, res) {
  const { id } = req.params;
  try {
    const plantio = await deletePlantio(id);
    return {
      sucesso: true,
      plantio,
      message: "Plantio deletado com sucesso.",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao deletar plantio.",
      detalhes: error.message, // opcional, para debug
    };
  }
}
