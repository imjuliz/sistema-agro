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


//pegar produto mais vendido
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

//listar produtos
export const listarProdutos = async (unidadeId) => {
    try {
        const fornecedores = await prisma.venda.findMany({
            where: { unidadeId: Number(unidadeId) },
        })
        return ({
            sucesso: true,
            fornecedores,
            message: "Fornecedores da unidade listados com sucesso!!"
        })

    } catch (error) {
        return {
            sucesso: false,
            erro: "Erro ao listar fornecedores",
            detalhes: error.message
        }
    }
}


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