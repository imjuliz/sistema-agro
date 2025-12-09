import PDFDocument from "pdfkit";
import {
  getResumoVendas,
  getTopFazendasProducao,
  buildDashboardPdfData,
  getDashboardKpis,
  getResumoFinanceiroMatriz,
} from "../models/Matriz.js";

export async function getResumoVendasController(req, res) {
  try {
    const { range } = req.query;
    const resultado = await getResumoVendas({ dias: range });
    return res.json(resultado);
  } catch (error) {
    console.error("getResumoVendasController erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao calcular resumo de vendas." });
  }
}

export async function getTopFazendasProducaoController(_req, res) {
  try {
    const resultado = await getTopFazendasProducao({ limite: 5 });
    return res.json(resultado);
  } catch (error) {
    console.error("getTopFazendasProducaoController erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao listar produção das fazendas." });
  }
}

export async function exportDashboardPdfController(_req, res) {
  try {
    const data = await buildDashboardPdfData();

    const doc = new PDFDocument({ margin: 32 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=\"dashboard-matriz.pdf\"");
    doc.pipe(res);

    doc.fontSize(18).text("Dashboard Matriz", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).text(new Date().toLocaleString(), { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("Vendas - Últimos 7 dias");
    data.vendas7.pontos.forEach((p) => {
      doc.fontSize(10).text(`${p.data}: R$ ${p.total.toFixed(2)}`);
    });
    doc.fontSize(10).text(`Total 7 dias: R$ ${data.vendas7.totalPeriodo.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).text("Vendas - Últimos 30 dias");
    data.vendas30.pontos.slice(-10).forEach((p) => {
      doc.fontSize(10).text(`${p.data}: R$ ${p.total.toFixed(2)}`);
    });
    doc.fontSize(10).text(`Total 30 dias: R$ ${data.vendas30.totalPeriodo.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(14).text("Top 5 Fazendas (Produção estimada)");
    data.producao.fazendas.forEach((f, idx) => {
      doc.fontSize(10).text(
        `${idx + 1}º ${f.nome} - ${f.totalEstimado.toFixed(2)} (peso total)`
      );
    });

    doc.end();
  } catch (error) {
    console.error("exportDashboardPdfController erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao gerar PDF do dashboard." });
  }
}

export async function getDashboardKpisController(_req, res) {
  try {
    const resultado = await getDashboardKpis();
    return res.json(resultado);
  } catch (error) {
    console.error("getDashboardKpisController erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao buscar KPIs do dashboard." });
  }
}

export async function getResumoFinanceiroMatrizController(_req, res) {
  try {
    const resultado = await getResumoFinanceiroMatriz();
    return res.json(resultado);
  } catch (error) {
    console.error("getResumoFinanceiroMatrizController erro:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao calcular resumo financeiro." });
  }
}




