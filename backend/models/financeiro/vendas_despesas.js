import prisma from '../../prisma/client.js';

//aqui estarão as funções da questão financeira (entradas, saídas, vendas, caixa, etc.)

export const listarSaidas = async (unidadeId) => {
    try {
        const saidas = await prisma.Saidas.findMany({
            where: { unidadeId: Number(unidadeId) },
        })
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

// Função que soma as vendas do dia atual
export const somarDiaria = async (unidadeId) => {
    const result = await prisma.$queryRaw`
    SELECT COALESCE(SUM(valor), 0) AS total
    FROM "Vendas"
    WHERE DATE("criado_em") = CURRENT_DATE
      AND "unidadeId" = ${unidadeId}
  `;

    // Prisma retorna um array de objetos, então pegamos o primeiro
    return result[0]?.total ?? 0;
};

export const somarSaidas = async (unidadeId) => {
    const result = await prisma.$queryRaw`
    SELECT COALESCE (SUM(valor), 0) AS total
    from "Saídas"
    where date("data") = CURRENT_DATE
    and "unidadeId" = ${unidadeId}`;

    return result[0]?.total ?? 0;

}

export const calcularLucro = async (unidadeId) => {

    const result = await prisma.$queryRaw`

    SELECT
      COALESCE((SELECT SUM(valor)
        FROM "Vendas"
        WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND "unidadeId" = ${unidadeId}), 0) AS total_vendas,
      
      COALESCE((SELECT SUM(valor)
        FROM "Saidas"
        WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND "unidadeId" = ${unidadeId}), 0) AS total_saidas,
      
      (
        COALESCE((SELECT SUM(valor)
          FROM "Vendas"
          WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            AND "unidadeId" = ${unidadeId}), 0)
        -
        COALESCE((SELECT SUM(valor)
          FROM "Saidas"
          WHERE DATE_TRUNC('month', "criado_em") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            AND "unidadeId" = ${unidadeId}), 0)
      ) AS lucro;
  `;

    return result[0];
}

export const listarVendas = async (unidadeId) => {
    try {
        const vendas = await prisma.Venda.findMany({
            where: { unidadeId: Number(unidadeId) },
        })
        return ({
            sucesso: true,
            estoque,
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
            criadoEm: {
                gte: dataLimite,
                lte: hoje,
            },
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


