import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//**********************NENHUMA DESTAS FUNÇÕES FOI TESTADA**********************//

//DASHBOARD ------------------------------------------------------------------------------------------------------------------

//MOSTRA O SALDO FINAL DO DIA DA UNIDADE
export const mostrarSaldoF = async (unidadeId) => {
  try {
    const agora = new Date();
    const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

    const caixaDeHoje = await prisma.caixa.findFirst({ // busca o caixa aberto hoje para a unidade informada
      where: {
        unidadeId: Number(unidadeId),
        abertoEm: {gte: inicioDoDia,lte: fimDoDia,},
      },
      select: {
        id: true,
        saldoFinal: true,
        abertoEm: true,
      },
      orderBy: {abertoEm: "desc" }, // caso haja mais de um caixa no dia, pega o mais recente
    });

    if (!caixaDeHoje) {
      return {
        sucesso: false,
        message: "Nenhum caixa encontrado para hoje.",
      };
    }

    return {
      sucesso: true,
      saldoFinal: caixaDeHoje.saldoFinal ?? 0,
      message: "Saldo final do caixa de hoje encontrado com sucesso!",
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao ver saldo final",
      detalhes: error.message,
    };
  }
};



