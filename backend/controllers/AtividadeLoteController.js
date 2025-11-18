import { getAtividadeLoteTipoPlantio } from "../models/atividadeLote.js";

export async function getAtividadeLoteTipoPlantioController(req, res) {
    try {
        const { tipo } = req.params.tipo;
        const atividadeLote = await getAtividadeLoteTipoPlantio(tipo);
        return {
            sucesso: true,
            atividadeLote,
            message: "Atividades do lote listadas com sucesso!!"
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar atividades do lote",
            detalhes: error.message
        }
    }
}

// função exportada para a rota de lote(loteRoutes.js)