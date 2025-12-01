import { getAnimais, getAnimaisPelaRaca, getAnimaisRentabilidade, getAnimaisPorId, createAnimais, updateAnimais, deleteAnimais } from "../models/animais.js";
import { getLotePorId } from "../models/lote.js";
import { animaisSchema, idSchema, loteIdSchema } from "../schemas/animaisSchemas.js";

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

export async function getAnimaisRentabilidadeController(req, res) {
  try {
    const { id } = idSchema.parse(req.params);
    const { id_lote } = loteIdSchema.parse(req.query);
    console.log(id, id_lote)

    // Validações básicas
    if (isNaN(id) || isNaN(id_lote)) {
      return res.status(400).json({ sucesso: false, erro: "id e id_lote precisam ser números." });
    }
    if (id <= 0 || id_lote <= 0) {
      return res.status(400).json({ sucesso: false, erro: "id e id_lote precisam ser informados e maiores que zero." });
    }

    const animalInfo = await getAnimaisPorId(id);
    const loteInfo = await getLotePorId(id_lote);

    if (!animalInfo || !animalInfo.sucesso || !animalInfo.animais || !loteInfo || !loteInfo.sucesso || !loteInfo.lote) {
      return res.status(404).json({ sucesso: false, erro: "Lote ou Animal não encontrado." });
    }

    const custoAnimal = Number(animalInfo.animais.custo ?? 0);
    const qntdItens = Number(lote.qntdItens ?? 0);

    const rentabilidade = qntdItens * custoAnimal;
    const loteRentabilidade = await getAnimaisRentabilidade(id_lote, rentabilidade);
    
    return res.status(200).json({
      sucesso: true,
      loteRentabilidade,
      message: "Lotes com rentabilidade listados com sucesso."
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao listar lotes com rentabilidade.",
      detalhes: error.message // opcional, para debug
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
    const id_lote = data.id_lote !== null ? Number(data.id_lote) : null;

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

    // id_lote pode ser null
    if (id_lote !== null && isNaN(id_lote)) {
      return res.status(400).json({
        sucesso: false,
        message: "Lote não é um valor válido."
      });
    }

    const animais = await createAnimais({
      ...data,
      fornecedorId,
      unidadeId,
      id_lote
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
