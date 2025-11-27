import { getAtividadeLoteTipoPlantio, createAtividadeLote } from "../models/atividadeLote.js";

export async function getAtividadeLoteTipoPlantioController(req, res) {
    try {
        const { tipo } = req.query;
        const atividadeLote = await getAtividadeLoteTipoPlantio(tipo);
        return res.status(200).json({
            sucesso: true,
            atividadeLote,
            message: "Atividades do lote listadas com sucesso!!"
        })
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            erro: "Erro ao listar atividades do lote",
            detalhes: error.message
        })
    }
}

export async function createAtividadeLoteController(req, res) {
  try {
    const data = req.body;
    const { loteId } = req.params;
    const responsavelId = req.usuario.id;

    // Validacoes
    if(!loteId || isNaN(loteId)) {
      return res.status(400).json({erro: "Lote nao encontrado."})
    }

    if(!responsavelId || isNaN(responsavelId)) {
      return res.status(400).json({erro: "Responsavel nao encontrado."})
    }

    const insert = await createAtividadeLote(data, loteId, responsavelId);

    return res.status(201).json({
      sucesso: true,
      insert,
      message: "Atividade do lote criada com sucesso!!"
    })
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar atividade do lote",
      detalhes: error.message
    })
  }
}

// função exportada para a rota de lote(loteRoutes.js)