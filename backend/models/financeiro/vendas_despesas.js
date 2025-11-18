import prisma from '../../prisma/client.js';

//aqui estarão as funções da questão financeira (entradas, saídas, vendas, caixa, etc.)

export const listarSaidas = async (unidadeId) => {//tem controller
    try {
        const saidas = await prisma.Saidas.findMany({ where: { unidadeId: Number(unidadeId) }, })
        return ({
            sucesso: true,
            saidas,
            message: "Saidas listadas com sucesso!!"
        })
    }
    catch (error) {
        return {
            sucesso: false,
            erro: "erro ao listar saidas",
            detalhes: error.message
        }
    }
}

export const buscarProdutoMaisVendido = async (unidadeId) => {
    try {
        const resultado = await prisma.itemVenda.groupBy({ // Agrupa os itens de venda por produto e soma a quantidade vendida
            by: ["produtoId"],
            _sum: { quantidade: true, },
            where: { venda: { unidadeId: Number(unidadeId), }, },
            orderBy: { _sum: { quantidade: "desc", }, },
            take: 1, // pega apenas o produto mais vendido
        });

        if (resultado.length === 0) {
            return {
                sucesso: false,
                message: "Nenhum item encontrado para esta unidade.",
            };
        }

        const produtoMaisVendido = resultado[0];
        const produto = await prisma.produto.findUnique({ // Busca informações do produto
            where: { id: produtoMaisVendido.produtoId, },
            select: {
                id: true,
                nome: true,
                descricao: true,
            },
        });

        return {
            sucesso: true,
            produto: {
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao,
                quantidadeVendida: produtoMaisVendido._sum.quantidade,
            },
            message: "Produto mais vendido encontrado com sucesso!",
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao buscar o produto mais vendido",
            detalhes: error.message,
        };
    }
};

// Função que soma as vendas do dia atual
export const somarDiaria = async (unidadeId) => {//tem controller
    const result = await prisma.$queryRaw`
    SELECT COALESCE(SUM("total"), 0) AS total
    FROM "vendas"
    WHERE DATE("criado_em") = CURRENT_DATE
      AND "unidade_id" = ${unidadeId};
  `;
    return result[0]?.total ?? 0;
};

export const somarEntradaMensal = async (unidadeId) => { //nao funciona
    const result = await prisma.$queryRaw`
    SELECT
    TO_CHAR(DATE_TRUNC('month', "criado_em"), 'YYYY-MM') AS mes,
    SUM("total") AS total_vendas
    FROM "vendas"
    WHERE "unidade_id" = 1  -- opcional
    GROUP BY DATE_TRUNC('month', "criado_em")
    ORDER BY mes DESC;`;

    return result[0]?.total ?? 0;
}


export const somarSaidas = async (unidadeId) => {
    const result = await prisma.$queryRaw`
    SELECT COALESCE (SUM(valor), 0) AS total
    from "Saidas"
    where date("data") = CURRENT_DATE
    and "unidadeId" = ${unidadeId}`;

    return result[0]?.total ?? 0;

}

export const calcularLucroDoMes = async (unidadeId) => {

    const unidadeIdNum = Number(unidadeId); // força número

    const [vendas] = await prisma.$queryRaw`
    SELECT COALESCE(SUM(total), 0) AS total
    FROM "vendas"
    WHERE "unidade_id" = ${unidadeIdNum}
      AND DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
  `;

    const [saidas] = await prisma.$queryRaw`
    SELECT COALESCE(SUM(valor), 0) AS total
    FROM "Saidas"
    WHERE "unidadeId" = ${unidadeIdNum}
      AND DATE_TRUNC('month', "data") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
  `;

    return {
        total_vendas: vendas.total,
        total_saidas: saidas.total,
        lucro: vendas.total - saidas.total,
    };
}

export const listarVendas = async (unidadeId) => {
    try {
        const vendas = await prisma.Venda.findMany({where: { unidadeId: Number(unidadeId) },})
        return ({
            sucesso: true,
            vendas,
            message: "Vendas listadas com sucesso!!"
        })
    } catch (error) {
        return ({
            sucesso: false,
            erro: "Erro ao listar vendas",
            detalhes: error.message
        })
    }
}

//do arquivo Loja.js
//MOSTRA O SALDO FINAL DO DIA DA UNIDADE
export const mostrarSaldoF = async (unidadeId) => {
    try {
        const agora = new Date();
        const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        const fimDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

        const caixaDeHoje = await prisma.caixa.findFirst({ // busca o caixa aberto hoje para a unidade informada
            where: {
                unidadeId: Number(unidadeId),
                abertoEm: { gte: inicioDoDia, lte: fimDoDia, },
            },
            select: {
                id: true,
                saldoFinal: true,
                abertoEm: true,
            },
            orderBy: { abertoEm: "desc" }, // caso haja mais de um caixa no dia, pega o mais recente
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

//agrupado por mês
export async function contarVendasPorMesUltimos6Meses(unidadeId) {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - 6);

    const vendas = await prisma.venda.findMany({
        where: {
            criadoEm: {gte: dataLimite,lte: hoje,},
            unidadeId
        },
        select: { criadoEm: true, },
    });

    const meses = Array.from({ length: 6 }, (_, i) => {
        const data = new Date();
        data.setMonth(data.getMonth() - (5 - i)); // gera os últimos 6 meses
        return {
            chave: data.getMonth(),
            nome: data.toLocaleString("pt-BR", { month: "long" }),
            ano: data.getFullYear(),
            total: 0,
        };
    });

    vendas.forEach((venda) => {
        const data = new Date(venda.criadoEm);
        const mesVenda = data.getMonth();
        const anoVenda = data.getFullYear();
        const mesEncontrado = meses.find((m) => m.chave === mesVenda && m.ano === anoVenda);
        if (mesEncontrado) { mesEncontrado.total++; }
    });

    return meses.map((m) => ({
        mes: `${m.nome.charAt(0).toUpperCase() + m.nome.slice(1)}`,
        total: m.total,
    }));
}

//insert na tabela de venda
export async function criarVenda(req, res) {
    try {
        const { caixaId, usuarioId, unidadeId, pagamento, itens } = req.body;

        if (!caixaId || !usuarioId || !unidadeId || !pagamento || !itens || itens.length === 0) {
            return res.status(400).json({
                sucesso: false,
                erro: "Dados incompletos. Verifique os campos enviados.",
            });
        }

        const itensCalculados = itens.map((item) => {
            const subtotal = (Number(item.precoUnitario) - Number(item.desconto || 0)) * Number(item.quantidade);
            return { ...item, subtotal };
        });

        const totalVenda = itensCalculados.reduce((acc, item) => acc + item.subtotal, 0);

        const novaVenda = await prisma.venda.create({
            data: {
                caixaId: Number(caixaId),
                usuarioId: Number(usuarioId),
                unidadeId: Number(unidadeId),
                pagamento,
                total: totalVenda,
                itens: {
                    create: itensCalculados.map((item) => ({
                        produtoId: Number(item.produtoId),
                        quantidade: Number(item.quantidade),
                        precoUnitario: Number(item.precoUnitario),
                        desconto: Number(item.desconto || 0),
                        subtotal: item.subtotal,
                    })),
                },
            },
            include: { itens: { include: { produto: true }, }, },
        });
        return res.status(201).json({
            sucesso: true,
            message: "Venda criada com sucesso!",
            venda: novaVenda,
        });
    } catch (error) {
        console.error("Erro ao criar venda:", error);
        return res.status(500).json({
            sucesso: false,
            erro: "Erro ao criar venda.",
            detalhes: error.message,
        });
    }
}

//obter o saldo geral
export const calcularSaldoLiquido = async (unidadeId) => {
    try {
        const totalCaixas = await prisma.caixa.aggregate({
            _sum: { saldoFinal: true, },
            where: {
                unidadeId: Number(unidadeId),
                saldoFinal: { not: null, },
            },
        });

        const totalSaidas = await prisma.saidas.aggregate({// soma dos valores das saídas
            _sum: { valor: true, },
            where: { unidadeId: Number(unidadeId), },
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

//select de tudo em saidas
export async function listarSaidasPorUnidade(unidadeId) {
    try {
        const saidas = await prisma.saidas.findMany({
            where: { unidadeId: Number(unidadeId) }, // filtra todos com a mesma unidade
            orderBy: { data: "desc", },
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

