import { getAnimais, getAnimaisPelaRaca, getAnimaisPorId, createAnimais, updateAnimais, deleteAnimais } from "../models/animais.js";
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
  try {
    const { raca } = req.query;

    // Validações 
    if (!raca) {
      return res.status(400).json({
        sucesso: false,
        erro: "Informe uma raça para busca."
      });
    }

    const animaisRaca = await getAnimaisPelaRaca(raca);
    
    return res.status(200).json({
      sucesso: true,
      animaisRaca,
      message: "Animais da raça listados com sucesso.",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar animais pela raça.",
      detalhes: error.message, // opcional, para debug
    })
  }
}

export async function getAnimaisPorIdController(req, res) {
  try {
    const id = parseInt(req.params.id);

    // Validações 
    if(!id || isNaN(id)) {
      return res.status(500).json({message: "Id nao informado."})
    }

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

    // Converte IDs antes de validar
    const fornecedorId = data.fornecedorId !== null ? Number(data.fornecedorId) : null;
    const unidadeId = Number(data.unidadeId);
    const loteId = data.loteId !== null ? Number(data.loteId) : null;

    // Valida unidade obrigatória
    if (!unidadeId || isNaN(unidadeId)) {
      return res.status(400).json({
        sucesso: false,
        message: "Unidade não é um valor válido."
      });
    }

    // fornecedorId pode ser null
    if (fornecedorId !== null && isNaN(fornecedorId)) {
      return res.status(400).json({
        sucesso: false,
        message: "Fornecedor não é um valor válido."
      });
    }

    // loteId pode ser null
    if (loteId !== null && isNaN(loteId)) {
      return res.status(400).json({
        sucesso: false,
        message: "Lote não é um valor válido."
      });
    }

    const animais = await createAnimais({
      ...data,
      fornecedorId,
      unidadeId,
      loteId
    });
    
    return res.status(201).json({
      sucesso: true,
      animais,
      message: "Animais criados com sucesso.",
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar animais.",
      detalhes: error.message
    });
  }
}


export async function updateAnimaisController(req, res) {
  try {
    const id = Number(req.params.id); // ← CONVERTE AQUI

    if (isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        message: "ID inválido."
      });
    }

    const data = animaisSchema.partial().parse(req.body);

    const resultado = await updateAnimais(id, data);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao atualizar animais.",
      detalhes: error.message,
    });
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
