import prisma from "../prisma/client.js";

const startAndEndOfToday = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
};

const buildPagamentoMap = (rows = []) => {
  const base = { PIX: 0, DINHEIRO: 0, CARTAO: 0 };
  for (const row of rows) {
    const key = row.pagamento || "DESCONHECIDO";
    base[key] = Number(row._sum?.total || 0);
  }
  return base;
};

const buildBarData = (rows = [], days = 15) => {
  const map = {};
  rows.forEach((r) => {
    map[r.dia] = Number(r.total || 0);
  });
  const today = new Date();
  const data = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    data.push({ label, valor: map[key] || 0 });
  }
  return data;
};

export const dashboardResumoController = async (req, res) => {
  try {
    const unidadeId = Number(req.params.unidadeId);
    if (!unidadeId || Number.isNaN(unidadeId)) {
      return res.status(400).json({ sucesso: false, erro: "unidadeId inválido" });
    }

    const { start, end } = startAndEndOfToday();
    const quinzeDiasAtras = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 14);

    const [
      vendasHojeCount,
      faturamentoAgg,
      estoqueAgg,
      funcionariosCount,
      caixaHoje,
      pagamentosRows,
      vendasRecentes,
      barrasRows,
    ] = await Promise.all([
      prisma.venda.count({ where: { unidadeId, criadoEm: { gte: start, lte: end } } }),
      prisma.venda.aggregate({ _sum: { total: true }, where: { unidadeId, criadoEm: { gte: start, lte: end } } }),
      prisma.estoqueProduto.aggregate({
        _sum: { qntdAtual: true },
        where: { estoque: { unidadeId } },
      }),
      prisma.usuario.count({ where: { unidadeId, status: true } }),
      prisma.caixa.findFirst({
        where: { unidadeId, abertoEm: { gte: start, lte: end } },
        orderBy: { abertoEm: "desc" },
        select: { saldoFinal: true },
      }),
      prisma.venda.groupBy({
        by: ["pagamento"],
        _sum: { total: true },
        where: { unidadeId, criadoEm: { gte: start, lte: end } },
      }),
      prisma.venda.findMany({
        where: { unidadeId },
        orderBy: { criadoEm: "desc" },
        take: 5,
        select: {
          id: true,
          total: true,
          criadoEm: true,
          itens: true,
          nomeCliente: true,
          cpfCliente: true,
          pagamento: true,
        },
      }),
      prisma.$queryRaw`
        SELECT
          TO_CHAR((("criado_em" AT TIME ZONE 'UTC') AT TIME ZONE 'America/Sao_Paulo')::date, 'YYYY-MM-DD') AS dia,
          COALESCE(SUM("total"), 0) AS total
        FROM "venda"
        WHERE "unidade_id" = ${unidadeId}
          AND "criado_em" >= ${quinzeDiasAtras}
        GROUP BY 1
        ORDER BY 1;
      `,
    ]);

    const estoqueTotal = Number(estoqueAgg?._sum?.qntdAtual || 0);

    const stats = {
      vendasHoje: vendasHojeCount,
      faturamentoHoje: Number(faturamentoAgg._sum.total || 0),
      itensEstoque: estoqueTotal,
      funcionariosAtivos: funcionariosCount,
      saldoFinal: Number(caixaHoje?.saldoFinal || 0),
    };

    const pagamentos = buildPagamentoMap(pagamentosRows);
    const barData = buildBarData(barrasRows, 15);
    const alerts = [];
    if (stats.itensEstoque < 20) alerts.push({ id: "estoque", text: "Estoque baixo em vários itens" });
    if (stats.saldoFinal < 0) alerts.push({ id: "saldo", text: "Saldo do caixa negativo" });
    if (stats.vendasHoje === 0) alerts.push({ id: "sem-vendas", text: "Nenhuma venda registrada hoje" });

    const recentSales = vendasRecentes.map((v) => ({
      id: v.id,
      total: Number(v.total || 0),
      itens: Array.isArray(v.itens) ? v.itens.length : v.itens?.length || 0,
      cliente: v.nomeCliente || v.cpfCliente || "Cliente",
      data: v.criadoEm,
      pagamento: v.pagamento || null,
    }));

    return res.status(200).json({
      sucesso: true,
      stats,
      pagamentos,
      recentSales,
      barData,
      alerts,
    });
  } catch (error) {
    console.error("[dashboard-loja] erro inesperado", error);
    return res.status(500).json({ sucesso: false, erro: "Falha ao carregar dashboard da loja", detalhes: error.message });
  }
};

