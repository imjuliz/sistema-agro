import prisma from '../../prisma/client.js';

export const mostrarEstoque = async (unidadeId) =>{
    try{
        const estoque = await prisma.Estoque.findMany({
            where:{ unidadeId: Number(unidadeId)},
        })
        return ({
            sucesso: true,
            estoque,
            message: "Estoque listado com sucesso!!"
        })

    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque",
            detalhes: error.message
        }
    }
}

//******************NÃO FORAM TESTADAS******************\\

//SOMA A QUANTIDADE DE ITENS NO ESTOQUE
export const somarQtdTotalEstoque = async (unidadeId) => {
  try {
    const resultado = await prisma.estoque.aggregate({
      _sum: {quantidade: true,},
      where: {unidadeId: Number(unidadeId)},
    });

    const total = resultado._sum.quantidade || 0;

    return {
      sucesso: true,
      totalItens: total,
      message: "Total de itens em estoque calculado com sucesso!",
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao calcular o total de itens no estoque",
      detalhes: error.message,
    };
  }
};

//obter o saldo geral
export const calcularSaldoLiquido = async (unidadeId) => {
  try {
    const totalCaixas = await prisma.caixa.aggregate({
      _sum: {saldoFinal: true,},
      where: {
        unidadeId: Number(unidadeId),
        saldoFinal: {not: null,},
      },
    });

    const totalSaidas = await prisma.saidas.aggregate({// soma dos valores das saídas
      _sum: {valor: true,},
      where: {unidadeId: Number(unidadeId),},
    });

    const somaCaixas = Number(totalCaixas._sum.saldoFinal || 0);
    const somaSaidas = Number(totalSaidas._sum.valor || 0);
    const saldoLiquido = somaCaixas - somaSaidas; // cálculo do saldo líquido

    return {
      sucesso: true,
      unidadeId: Number(unidadeId),
    //   totalCaixas: somaCaixas.toFixed(2),
    //   totalSaidas: somaSaidas.toFixed(2),
      saldoLiquido: saldoLiquido.toFixed(2),
      message: "Saldo líquido calculado com sucesso!",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao calcular saldo líquido",
      detalhes: error.message,
    };
  }
};

//listagem do estoque
export async function getEstoque(unidadeId) {
    try {
        const estoque = await prisma.estoque.findMany({where:{unidadeId:Number(unidadeId)}});
        return {
            sucesso: true,
            estoque: estoque,
            message: "Estoque listado com sucesso."
        }
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar estoque.",
            detalhes: error.message 
        };
    }
};

//mostra os funcionários da unidade
export async function listarUsuariosPorUnidade(unidadeId) {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {unidadeId: Number(unidadeId) }, // filtra todos com a mesma unidade
    
      include: {
        perfil: {select: { nome: true, descricao: true },},
        unidade: {select: { nome: true, tipo: true },},
      },
      orderBy: {nome: "asc",},
    });

    return {
      sucesso: true,
      unidadeId: Number(unidadeId),
      totalUsuarios: usuarios.length,
      usuarios,
    };
  } catch (error) {
    console.error("Erro ao buscar usuários da unidade:", error);
    return {
      sucesso: false,
      erro: error.message,
    };
  }
}


//select de tudo em saidas
export async function listarSaidasPorUnidade(unidadeId) {
  try {
    const saidas = await prisma.saidas.findMany({
      where: {unidadeId: Number(unidadeId) }, // filtra todos com a mesma unidade
      orderBy: {data: "desc",},
    });

    return {
      sucesso: true,
      unidadeId: Number(unidadeId),
      saidas: saidas,
    };
  } catch (error) {
    console.error("Erro ao buscar saidas", error);
    return {
      sucesso: false,
      erro: error.message,
    };
  }
}

export const reporEstoque= async(unidadeId)=>{

}


