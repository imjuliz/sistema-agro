import prisma from "../../prisma/client.js";

import { verificarProducaoLote } from "../../services/lote/verificarProducao.js";

export const verificarProducaoLoteController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({sucesso: false,message: "Usuário não possui unidade vinculada à sessão."});
    }

    const { loteId } = req.params;

    const resultado = await verificarProducaoLote(loteId);

    if (!resultado.sucesso) {return res.status(400).json(resultado);}

    return res.json({
      sucesso: true,
      message: "Informações de produção encontradas com sucesso!",
      ...resultado
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao verificar informações de produção.",
      detalhes: error.message
    });
  }
};