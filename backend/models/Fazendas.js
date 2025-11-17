import prisma from '../../prisma/client.js';

export const lotesPlantio = async (unidadeId) => {
    try {
        const lotes = await prisma.Lote.findMany({ where: { unidadeId: Number(unidadeId), tipo: "Plantio" } });
        return ({
            sucesso: true,
            lotes,
            message: "Talhões listados com sucesso!"
        })
    } catch (error) {
        return {
            sucesso: false,
            erro: "erro ao listar talhões!",
            detalhes: error.message
        }
    }
};

//quando o produto poderá ser colhido
export const verificarProducaoLote = async (loteId) => {
  try {
    const lote = await prisma.lote.findUnique({
      where: { id: Number(loteId) },
      include: {producoes: {orderBy: { dataRegistro: "asc" }}}
    });

    if (!lote) {
      return {sucesso: false,message: "Lote não encontrado."};
    }

    if (lote.producoes.length === 0) {
      return {sucesso: false,message: "Nenhuma produção registrada para este lote."};
    }

    const dataInicioProducao = lote.producoes[0].dataRegistro;

    const diasColheita = {
      GADO: 180,
      SOJA: 120,
      LEITE: 0,
      OUTRO: 90
    };

    const dias = diasColheita[lote.tipo] ?? 90;
    const dataPrevistaColheita = new Date(
      dataInicioProducao.getTime() + dias * 24 * 60 * 60 * 1000
    );

    return {
      sucesso: true,
      dataInicioProducao,
      tipoLote: lote.tipo,
      diasParaColheita: dias,
      dataPrevistaColheita
    };
  } catch (error) {
    console.error(error);
    return {
      sucesso: false,
      message: "Erro ao consultar produção.",
      error
    };
  }
};