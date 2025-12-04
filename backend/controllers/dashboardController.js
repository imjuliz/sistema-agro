import prisma from '../prisma/client.js'

export async function getDashboardDataController(req, res) {
  const { unidadeId } = req.params;

  if (!unidadeId) {return res.status(400).json({ sucesso: false, erro: 'unidadeId ausente' });}

  try {
    const id = parseInt(unidadeId, 10);

    const grouped = await prisma.lote.groupBy({
      by: ['tipo'],
      where: { unidadeId: id },
      _count: { _all: true },
    });

    const chart = grouped.map((g) => ({ label: g.tipo, value: g._count._all }));

    return res.json({ sucesso: true, chart });
  } catch (err) {
    console.error('Erro getDashboardDataController:', err);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao obter dados do dashboard.' });
  }
};

export async function getLotesPorStatusController(req, res) {
  const { unidadeId } = req.params;
  if (!unidadeId) return res.status(400).json({ sucesso: false, erro: 'unidadeId ausente' });

  try {
    const id = parseInt(unidadeId, 10);

    const grouped = await prisma.lote.groupBy({
      by: ['status'],
      where: { unidadeId: id },
      _count: { _all: true },
    });

    // normaliza status null/undefined
    const chart = grouped.map(g => ({ label: g.status || 'SEM_STATUS', value: g._count._all }));

    return res.json({ sucesso: true, chart });
  } catch (err) {
    console.error('Erro getLotesPorStatusController:', err);
    return res.status(500).json({ sucesso: false, erro: 'Erro ao obter lotes por status.' });
  }
}
