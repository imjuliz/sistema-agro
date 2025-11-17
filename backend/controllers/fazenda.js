import prisma from "../../prisma/client.js";
import PDFDocument from "pdfkit";
import { verificarProducaoLote } from "../../services/lote/verificarProducao.js";
import { calcularMediaProducaoPorLote, buscarAtividadesLoteService, buscarProducaoLoteService } from "../models/Fazendas.js";

export const verificarProducaoLoteController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {return res.status(401).json({sucesso: false,message: "Usuário não possui unidade vinculada à sessão."})}

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

export const calcularMediaProducaoPorLoteController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({sucesso: false,message: "Usuário não possui unidade vinculada à sessão."});
    }

    const { loteId } = req.params;

    const resultado = await calcularMediaProducaoPorLote(loteId);

    if (!resultado.sucesso) {return res.status(400).json(resultado);}

    return res.json({
      sucesso: true,
      message: "Média de produção calculada com sucesso!",
      dados: resultado
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao calcular média de produção.",
      detalhes: error.message
    });
  }
};

//relatório do lote

export const buscarAtividadesDoLoteController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        message: "Usuário não possui unidade vinculada."
      });
    }

    const { loteId } = req.params;

    const resultado = await buscarAtividadesDoLote(loteId);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.json({
      sucesso: true,
      message: "Atividades do lote carregadas com sucesso!",
      dados: resultado
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      message: "Erro ao buscar atividades do lote.",
      detalhes: error.message
    });
  }
};

export const gerarRelatorioLoteController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;
    const { loteId } = req.params;

    if (!unidadeId) {return res.status(401).json({sucesso: false,message: "Usuário não possui unidade vinculada à sessão."})}

    // Buscar o lote
    const lote = await prisma.lote.findFirst({
      where: { id: Number(loteId), unidadeId: Number(unidadeId) },
      select: {
        id: true,
        nome: true,
        tipo: true,
        qntdItens: true,
        observacoes: true,
        dataCriacao: true
      }
    });

    if (!lote) {return res.status(404).json({sucesso: false,message: "Lote não encontrado para esta unidade."});}

    // Buscar atividades
    const atividades = await buscarAtividadesLoteService(loteId, unidadeId);

    // Criar o PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=lote-${loteId}.pdf`);

    doc.pipe(res);

    // CABEÇALHO
    doc.fontSize(22).text(`Relatório do Lote: ${lote.nome}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`ID do Lote: ${lote.id}`);
    doc.text(`Tipo: ${lote.tipo}`);
    doc.text(`Quantidade de Itens: ${lote.qntdItens}`);
    doc.text(`Data de Criação: ${new Date(lote.dataCriacao).toLocaleDateString("pt-BR")}`);
    if (lote.observacoes) {doc.text(`Observações: ${lote.observacoes}`);}
    doc.moveDown().moveDown();

    // LISTA DE ATIVIDADES
    doc.fontSize(18).text("Atividades Registradas", { underline: true });
    doc.moveDown();

    if (atividades.length === 0) {doc.fontSize(12).text("Nenhuma atividade registrada para este lote.");}
    else {
      atividades.forEach((atv) => {
        doc.fontSize(14).text(`• ${atv.tipo}`, { continued: false });
        doc.fontSize(12).text(`Descrição: ${atv.descricao}`);
        doc.text(`Data: ${new Date(atv.data).toLocaleString("pt-BR")}`);
        doc.text(`Responsável: ${atv.responsavel?.nome || "N/D"}`);
        doc.moveDown();
      });
    }

    doc.end();
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao gerar relatório do lote",
      detalhes: error.message
    });
  }
};

//relatório de produção 
export const gerarRelatorioProducaoController = async (req, res) => {
  try {
    const unidadeId = req.session?.usuario?.unidadeId;
    const { loteId } = req.params;

    if (!unidadeId) {
      return res.status(401).json({sucesso: false,message: "Usuário não possui unidade vinculada à sessão."})}

    // Buscar informações básicas do lote
    const lote = await prisma.lote.findFirst({
      where: { id: Number(loteId), unidadeId: Number(unidadeId) },
      select: {
        id: true,
        nome: true,
        tipo: true,
        qntdItens: true,
        observacoes: true,
        dataCriacao: true
      }
    });

    if (!lote) {return res.status(404).json({sucesso: false,message: "Lote não encontrado para esta unidade."})}

    // Buscar produções do lote
    const producoes = await buscarProducaoLoteService(loteId, unidadeId);

    // Criar PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=producao-lote-${loteId}.pdf`);

    doc.pipe(res);

    // CABEÇALHO
    doc.fontSize(22).text(`Relatório de Produção - Lote: ${lote.nome}`, { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`ID do Lote: ${lote.id}`);
    doc.text(`Tipo do Lote: ${lote.tipo}`);
    doc.text(`Quantidade de Itens: ${lote.qntdItens}`);
    doc.text(`Data de Criação: ${new Date(lote.dataCriacao).toLocaleDateString("pt-BR")}`);
    if (lote.observacoes) {doc.text(`Observações: ${lote.observacoes}`);}

    doc.moveDown().moveDown();

    // SEÇÃO DE PRODUÇÕES
    doc.fontSize(18).text("Registros de Produção", { underline: true });
    doc.moveDown();

    if (producoes.length === 0) {doc.fontSize(12).text("Nenhum registro de produção encontrado para este lote.")}
    else {
      producoes.forEach((prod) => {
        doc.fontSize(14).text(`• ${prod.tipoProduto}`, { continued: false });

        doc.fontSize(12).text(`Quantidade: ${prod.quantidade} ${prod.unidadeMedida}`);
        doc.text(`Data: ${new Date(prod.dataRegistro).toLocaleString("pt-BR")}`);

        doc.moveDown();
      });
    }

    doc.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao gerar relatório de produção do lote",
      detalhes: error.message
    });
  }
};