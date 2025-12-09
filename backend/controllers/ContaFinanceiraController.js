import {criarContaFinanceira,listarContasFinanceirasComFiltros,obterContaFinanceiraPorId,atualizarContaFinanceira,marcarComoPaga,marcarComoRecebida,deletarContaFinanceira,obterResumoFinanceiroPorPeriodo,obterSaldoPorCategoria} from '../models/contaFinanceira.js';
import { getUserById } from '../models/User.js';
import { getUnidadePorId } from '../models/Unidades.js';
import { getDashboardStats } from '../models/Financeiro.js';
import XLSX from 'xlsx';
import PDFDocument from 'pdfkit';

// ============ CONTAS FINANCEIRAS ============

export const criarContaController = async (req, res) => {
  try {
    const criadoPorId = req.usuario?.id;
    const unidadeId = req.usuario?.unidadeId;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Sessão inválida ou unidade não identificada'
      });
    }

    const {descricao,tipoMovimento,categoriaId,subcategoriaId,formaPagamento,valor,competencia,vencimento,documento,observacao  } = req.body;

    // Para ENTRADA, vencimento não é obrigatório
    if (tipoMovimento === 'ENTRADA') {
      if (!descricao || !tipoMovimento || !valor) {
        return res.status(400).json({sucesso: false,erro: 'Campos obrigatórios faltando: descricao, tipoMovimento, valor'});
      }
    } else {
      // Para SAIDA, vencimento é obrigatório
      if (!descricao || !tipoMovimento || !valor || !vencimento) {
        return res.status(400).json({sucesso: false,erro: 'Campos obrigatórios faltando: descricao, tipoMovimento, valor, vencimento'});
      }
    }

    const conta = await criarContaFinanceira({unidadeId,criadoPorId,descricao,tipoMovimento,categoriaId,subcategoriaId,formaPagamento,valor,competencia,vencimento,documento,observacao});

    return res.status(201).json({sucesso: true,mensagem: 'Conta criada com sucesso',dados: conta});
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return res.status(500).json({sucesso: false,erro: 'Erro ao criar conta',detalhes: error.message});
  }
};

export const listarContasController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;

    if (!unidadeId) {return res.status(401).json({sucesso: false,erro: 'Unidade não identificada'});}

    const {mes,ano,tipoMovimento,tipo,status,categoriaId,subcategoriaId} = req.query;

    const filtros = {};
    if (mes) filtros.mes = parseInt(mes);
    if (ano) filtros.ano = parseInt(ano);
    
    // Suportar tanto 'tipoMovimento' quanto 'tipo' (compatibilidade)
    if (tipoMovimento) {
      filtros.tipoMovimento = tipoMovimento;
    } else if (tipo) {
      // Converter 'pagar' -> 'SAIDA' e 'receber' -> 'ENTRADA'
      if (tipo === 'pagar') {
        filtros.tipoMovimento = 'SAIDA';
      } else if (tipo === 'receber') {
        filtros.tipoMovimento = 'ENTRADA';
      }
    }
    
    if (status) filtros.status = status;
    if (categoriaId) filtros.categoriaId = categoriaId;
    if (subcategoriaId) filtros.subcategoriaId = subcategoriaId;

    const contas = await listarContasFinanceirasComFiltros(unidadeId, filtros);
    return res.status(200).json({sucesso: true,dados: contas});
  } catch (error) {
    console.error('Erro ao listar contas:', error);
    return res.status(500).json({sucesso: false,erro: 'Erro ao listar contas',detalhes: error.message});
  }
};

export const obterContaController = async (req, res) => {
  try {
    const { contaId } = req.params;

    const conta = await obterContaFinanceiraPorId(contaId);

    if (!conta) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Conta não encontrada'
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao obter conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter conta',
      detalhes: error.message
    });
  }
};

export const atualizarContaController = async (req, res) => {
  try {
    const { contaId } = req.params;
    const dados = req.body;

    const conta = await atualizarContaFinanceira(contaId, dados);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta atualizada com sucesso',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar conta',
      detalhes: error.message
    });
  }
};

export const marcarComoPagaController = async (req, res) => {
  try {
    const { contaId } = req.params;
    const { dataPagamento } = req.body;

    const conta = await marcarComoPaga(contaId, dataPagamento);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta marcada como paga',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao marcar como paga:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao marcar como paga',
      detalhes: error.message
    });
  }
};

export const marcarComoRecebidaController = async (req, res) => {
  try {
    const { contaId } = req.params;
    const { dataRecebimento } = req.body;

    const conta = await marcarComoRecebida(contaId, dataRecebimento);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta marcada como recebida',
      dados: conta
    });
  } catch (error) {
    console.error('Erro ao marcar como recebida:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao marcar como recebida',
      detalhes: error.message
    });
  }
};

export const deletarContaController = async (req, res) => {
  try {
    const { contaId } = req.params;

    const conta = await deletarContaFinanceira(contaId);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar conta',
      detalhes: error.message
    });
  }
};

// ============ RELATÓRIOS ============

export const obterResumoController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const { mes, ano } = req.query;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    if (!mes || !ano) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Mês e ano são obrigatórios'
      });
    }

    const resumo = await obterResumoFinanceiroPorPeriodo(unidadeId, parseInt(mes), parseInt(ano));

    return res.status(200).json({
      sucesso: true,
      dados: resumo
    });
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter resumo',
      detalhes: error.message
    });
  }
};

export const obterSaldoPorCategoriaController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const { mes, ano, tipoMovimento } = req.query;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    if (!mes || !ano || !tipoMovimento) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Mês, ano e tipo de movimento são obrigatórios'
      });
    }

    const saldo = await obterSaldoPorCategoria(
      unidadeId,
      parseInt(mes),
      parseInt(ano),
      tipoMovimento
    );

    return res.status(200).json({
      sucesso: true,
      dados: saldo
    });
  } catch (error) {
    console.error('Erro ao obter saldo por categoria:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter saldo por categoria',
      detalhes: error.message
    });
  }
};

export const exportarContasExcelController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const usuarioId = req.usuario?.id;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    const { mes, ano, tipoMovimento } = req.query;

    const filtros = {};
    if (mes) filtros.mes = parseInt(mes);
    if (ano) filtros.ano = parseInt(ano);
    if (tipoMovimento) filtros.tipoMovimento = tipoMovimento;

    const contas = await listarContasFinanceirasComFiltros(unidadeId, filtros);

    // Buscar informações do usuário e unidade para o cabeçalho
    let nomeUsuario = 'Não informado';
    let nomeUnidade = 'Não informado';
    
    try {
      if (usuarioId) {
        const usuario = await getUserById(usuarioId);
        if (usuario) {
          nomeUsuario = usuario.nome || 'Não informado';
        }
      }
      
      const unidade = await getUnidadePorId(unidadeId);
      if (unidade && unidade.sucesso && unidade.unidade) {
        nomeUnidade = unidade.unidade.nome || 'Não informado';
      }
    } catch (error) {
      console.warn('[exportarContasExcelController] Erro ao buscar informações do usuário/unidade:', error);
    }

    // Preparar dados para Excel
    const data = contas.map(conta => {
      // Montar nome da categoria completa (Categoria > Subcategoria)
      let categoriaNome = '';
      if (conta.categoria?.nome && conta.subcategoria?.nome) {
        categoriaNome = `${conta.categoria.nome} > ${conta.subcategoria.nome}`;
      } else if (conta.categoria?.nome) {
        categoriaNome = conta.categoria.nome;
      } else if (conta.subcategoria?.nome) {
        categoriaNome = conta.subcategoria.nome;
      } else if (conta.descricao) {
        categoriaNome = conta.descricao;
      }

      // Se for ENTRADA, não incluir vencimento, pagamento e status
      if (tipoMovimento === 'ENTRADA') {
        return {
          'Competência': conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '',
          'Valor': conta.valor ? parseFloat(conta.valor) : 0,
          'Categoria': categoriaNome,
          'Obs': conta.observacao || ''
        };
      }

      // Se for SAIDA, incluir todos os campos
      return {
        'Emissão': conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '',
        'Vencimento': conta.vencimento ? new Date(conta.vencimento).toLocaleDateString('pt-BR') : '',
        'Pagamento': conta.dataRecebimento || conta.dataPagamento ? new Date(conta.dataRecebimento || conta.dataPagamento).toLocaleDateString('pt-BR') : '',
        'Valor': conta.valor ? parseFloat(conta.valor) : 0,
        'Categoria': categoriaNome,
        'Obs': conta.observacao || '',
        'Status': conta.status === 'PAGA' || conta.status === 'RECEBIDA' ? 'Recebida' : 'Pendente'
      };
    });

    // Preparar cabeçalho do relatório
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' - ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const anoExportacao = ano || dataAtual.getFullYear().toString();

    // Criar array de arrays para incluir cabeçalho
    const rows = [];
    
    // Título do relatório
    const tituloRelatorio = tipoMovimento === 'ENTRADA' 
      ? 'Relatório de Receitas - RuralTech - ' + anoExportacao
      : 'Relatório de Despesas - RuralTech - ' + anoExportacao;
    
    const numColunas = tipoMovimento === 'ENTRADA' ? 4 : 7;
    const colunasVazias = Array(numColunas - 1).fill('');
    
    rows.push([tituloRelatorio, ...colunasVazias]);
    
    // Informações da unidade e usuário
    rows.push(['Unidade: ' + nomeUnidade, 'Usuario: ' + nomeUsuario, ...colunasVazias.slice(1)]);
    
    // Data e hora da exportação
    rows.push([dataFormatada, ...colunasVazias]);
    rows.push([]); // Linha em branco
    
    // Cabeçalho das colunas
    if (tipoMovimento === 'ENTRADA') {
      rows.push(['Competência', 'Valor', 'Categoria', 'Obs']);
    } else {
      rows.push(['Emissão', 'Vencimento', 'Pagamento', 'Valor', 'Categoria', 'Obs', 'Status']);
    }
    
    // Dados das contas
    data.forEach(conta => {
      if (tipoMovimento === 'ENTRADA') {
        rows.push([
          conta['Competência'],
          conta['Valor'],
          conta['Categoria'],
          conta['Obs']
        ]);
      } else {
        rows.push([
          conta['Emissão'],
          conta['Vencimento'],
          conta['Pagamento'],
          conta['Valor'],
          conta['Categoria'],
          conta['Obs'],
          conta['Status']
        ]);
      }
    });

    // Criar workbook e worksheet usando array of arrays
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    const nomeAba = tipoMovimento === 'ENTRADA' ? 'Receitas' : 'Despesas';
    XLSX.utils.book_append_sheet(workbook, worksheet, nomeAba);

    // Configurar largura das colunas
    const colWidths = tipoMovimento === 'ENTRADA' 
      ? [
          { wch: 15 }, // Competência
          { wch: 15 }, // Valor
          { wch: 30 }, // Categoria
          { wch: 40 }  // Obs
        ]
      : [
          { wch: 12 }, // Emissão
          { wch: 12 }, // Vencimento
          { wch: 12 }, // Pagamento
          { wch: 15 }, // Valor
          { wch: 30 }, // Categoria
          { wch: 40 }, // Obs
          { wch: 12 }  // Status
        ];
    worksheet['!cols'] = colWidths;

    // Gerar buffer do arquivo Excel
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Configurar headers para download
    const filename = `receitas_${mes || 'all'}_${ano || 'all'}_${new Date().getTime()}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', excelBuffer.length);
    
    return res.send(excelBuffer);
  } catch (error) {
    console.error('Erro ao exportar contas para Excel:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao exportar contas para Excel',
      detalhes: error.message
    });
  }
};

// Exportar Dashboard CSV
export const exportarDashboardCSVController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const usuarioId = req.usuario?.id;
    const { mes, ano } = req.query;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    // Buscar dados do dashboard
    const dashboardData = await getDashboardStats(unidadeId);
    
    // Buscar contas do período
    const filtros = {};
    if (mes) filtros.mes = parseInt(mes);
    if (ano) filtros.ano = parseInt(ano);

    const contasPagar = await listarContasFinanceirasComFiltros(unidadeId, { ...filtros, tipoMovimento: 'SAIDA' });
    const contasReceber = await listarContasFinanceirasComFiltros(unidadeId, { ...filtros, tipoMovimento: 'ENTRADA' });

    // Buscar informações do usuário e unidade
    let nomeUsuario = 'Não informado';
    let nomeUnidade = 'Não informado';
    
    try {
      if (usuarioId) {
        const usuario = await getUserById(usuarioId);
        if (usuario) nomeUsuario = usuario.nome || 'Não informado';
      }
      const unidade = await getUnidadePorId(unidadeId);
      if (unidade && unidade.sucesso && unidade.unidade) {
        nomeUnidade = unidade.unidade.nome || 'Não informado';
      }
    } catch (error) {
      console.warn('[exportarDashboardCSVController] Erro ao buscar informações:', error);
    }

    // Preparar CSV usando ponto-e-vírgula como separador (melhor para Excel)
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const periodo = mes && ano ? `${mes}/${ano}` : 'Todos os períodos';
    const separador = ';'; // Ponto-e-vírgula para melhor compatibilidade com Excel

    let csv = 'Relatório Financeiro - Dashboard\n';
    csv += `Unidade;${nomeUnidade}\n`;
    csv += `Usuário;${nomeUsuario}\n`;
    csv += `Período;${periodo}\n`;
    csv += `Data de Exportação;${dataFormatada}\n\n`;

    csv += '=== RESUMO GERAL ===\n';
    csv += `Descrição;Valor\n`;
    csv += `A Pagar (Pendentes);${(dashboardData.totalPayable || 0).toFixed(2).replace('.', ',')}\n`;
    csv += `Recebido;${(dashboardData.totalReceived || 0).toFixed(2).replace('.', ',')}\n`;
    csv += `Pago;${(dashboardData.totalPaid || 0).toFixed(2).replace('.', ',')}\n\n`;

    csv += '=== DESPESAS ===\n';
    csv += `Emissão${separador}Vencimento${separador}Pagamento${separador}Valor${separador}Categoria${separador}Status\n`;
    contasPagar.forEach(conta => {
      const categoria = conta.categoria?.nome && conta.subcategoria?.nome 
        ? `${conta.categoria.nome} > ${conta.subcategoria.nome}`
        : (conta.categoria?.nome || conta.subcategoria?.nome || '');
      const status = conta.dataPagamento || conta.status === 'PAGA' ? 'Paga' : 'Pendente';
      const valor = (conta.valor || 0).toFixed(2).replace('.', ',');
      const emissao = conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '';
      const vencimento = conta.vencimento ? new Date(conta.vencimento).toLocaleDateString('pt-BR') : '';
      const pagamento = conta.dataPagamento ? new Date(conta.dataPagamento).toLocaleDateString('pt-BR') : '';
      
      csv += `${emissao}${separador}${vencimento}${separador}${pagamento}${separador}${valor}${separador}"${categoria.replace(/"/g, '""')}"${separador}${status}\n`;
    });

    csv += '\n=== RECEITAS ===\n';
    csv += `Competência${separador}Valor${separador}Categoria\n`;
    contasReceber.forEach(conta => {
      const categoria = conta.categoria?.nome && conta.subcategoria?.nome 
        ? `${conta.categoria.nome} > ${conta.subcategoria.nome}`
        : (conta.categoria?.nome || conta.subcategoria?.nome || '');
      const valor = (conta.valor || 0).toFixed(2).replace('.', ',');
      const competencia = conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '';
      
      csv += `${competencia}${separador}${valor}${separador}"${categoria.replace(/"/g, '""')}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="dashboard_financeiro_${periodo.replace(/\//g, '_')}_${new Date().getTime()}.csv"`);
    return res.send('\ufeff' + csv); // BOM para Excel
  } catch (error) {
    console.error('Erro ao exportar dashboard CSV:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao exportar dashboard CSV',
      detalhes: error.message
    });
  }
};

// Exportar Dashboard PDF
export const exportarDashboardPDFController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const usuarioId = req.usuario?.id;
    const { mes, ano } = req.query;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    // Buscar dados
    const dashboardData = await getDashboardStats(unidadeId);
    
    const filtros = {};
    if (mes) filtros.mes = parseInt(mes);
    if (ano) filtros.ano = parseInt(ano);

    const contasPagar = await listarContasFinanceirasComFiltros(unidadeId, { ...filtros, tipoMovimento: 'SAIDA' });
    const contasReceber = await listarContasFinanceirasComFiltros(unidadeId, { ...filtros, tipoMovimento: 'ENTRADA' });

    // Buscar informações
    let nomeUsuario = 'Não informado';
    let nomeUnidade = 'Não informado';
    
    try {
      if (usuarioId) {
        const usuario = await getUserById(usuarioId);
        if (usuario) nomeUsuario = usuario.nome || 'Não informado';
      }
      const unidade = await getUnidadePorId(unidadeId);
      if (unidade && unidade.sucesso && unidade.unidade) {
        nomeUnidade = unidade.unidade.nome || 'Não informado';
      }
    } catch (error) {
      console.warn('[exportarDashboardPDFController] Erro ao buscar informações:', error);
    }

    // Criar PDF com margens adequadas
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      layout: 'portrait'
    });
    const periodo = mes && ano ? `${mes}/${ano}` : 'Todos os períodos';
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Cabeçalho
    doc.fontSize(20).font('Helvetica-Bold').text('Relatório Financeiro - Dashboard', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Unidade: ${nomeUnidade}`, { align: 'left' });
    doc.text(`Usuário: ${nomeUsuario}`, { align: 'left' });
    doc.text(`Período: ${periodo}`, { align: 'left' });
    doc.text(`Data de Exportação: ${dataFormatada}`, { align: 'left' });
    doc.moveDown(1.5);

    // Resumo Geral
    doc.fontSize(14).font('Helvetica-Bold').text('Resumo Geral', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text(`A Pagar (Pendentes): R$ ${(dashboardData.totalPayable || 0).toFixed(2).replace('.', ',')}`, { align: 'left' });
    doc.text(`Recebido: R$ ${(dashboardData.totalReceived || 0).toFixed(2).replace('.', ',')}`, { align: 'left' });
    doc.text(`Pago: R$ ${(dashboardData.totalPaid || 0).toFixed(2).replace('.', ',')}`, { align: 'left' });
    doc.moveDown(1.5);

    // Contas a Pagar
    doc.fontSize(12).font('Helvetica-Bold').text('Despesas', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(8).font('Helvetica-Bold');
    
    // Definir posições das colunas com espaçamento adequado
    const colWidths = {
      emissao: 50,
      vencimento: 110,
      pagamento: 170,
      valor: 240,
      categoria: 310,
      status: 480
    };
    
    let yPos = doc.y;
    doc.text('Emissão', colWidths.emissao, yPos, { width: 55, ellipsis: true });
    doc.text('Vencimento', colWidths.vencimento, yPos, { width: 55, ellipsis: true });
    doc.text('Pagamento', colWidths.pagamento, yPos, { width: 65, ellipsis: true });
    doc.text('Valor', colWidths.valor, yPos, { width: 65, ellipsis: true });
    doc.text('Categoria', colWidths.categoria, yPos, { width: 165, ellipsis: true });
    doc.text('Status', colWidths.status, yPos, { width: 50, ellipsis: true });
    // draw a separator line a bit lower to leave clear space under the headers
    doc.moveTo(50, yPos + 10).lineTo(530, yPos + 10).stroke();
    // move the cursor down to leave space between the line and the first row
    doc.moveDown(1);

    doc.fontSize(8).font('Helvetica');
    contasPagar.slice(0, 25).forEach((conta, index) => {
      const categoria = conta.categoria?.nome && conta.subcategoria?.nome 
        ? `${conta.categoria.nome} > ${conta.subcategoria.nome}`
        : (conta.categoria?.nome || conta.subcategoria?.nome || '');
      const status = conta.dataPagamento || conta.status === 'PAGA' ? 'Paga' : 'Pendente';
      const valor = (conta.valor || 0).toFixed(2).replace('.', ',');
      
      const emissao = conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '-';
      const vencimento = conta.vencimento ? new Date(conta.vencimento).toLocaleDateString('pt-BR') : '-';
      const pagamento = conta.dataPagamento ? new Date(conta.dataPagamento).toLocaleDateString('pt-BR') : '-';
      
      // Verificar se precisa de nova página antes de adicionar linha
      if (doc.y > 750) {
        doc.addPage();
        yPos = doc.y;
        doc.fontSize(8).font('Helvetica-Bold');
        doc.text('Emissão', colWidths.emissao, yPos, { width: 55, ellipsis: true });
        doc.text('Vencimento', colWidths.vencimento, yPos, { width: 55, ellipsis: true });
        doc.text('Pagamento', colWidths.pagamento, yPos, { width: 65, ellipsis: true });
        doc.text('Valor', colWidths.valor, yPos, { width: 65, ellipsis: true });
        doc.text('Categoria', colWidths.categoria, yPos, { width: 165, ellipsis: true });
        doc.text('Status', colWidths.status, yPos, { width: 50, ellipsis: true });
        doc.moveDown(0.2);
        doc.moveTo(50, yPos + 5).lineTo(530, yPos + 5).stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).font('Helvetica');
      }
      
      yPos = doc.y;
      doc.text(emissao, colWidths.emissao, yPos, { width: 55, ellipsis: true });
      doc.text(vencimento, colWidths.vencimento, yPos, { width: 55, ellipsis: true });
      doc.text(pagamento, colWidths.pagamento, yPos, { width: 65, ellipsis: true });
      doc.text(`R$ ${valor}`, colWidths.valor, yPos, { width: 65, ellipsis: true });
      doc.text(categoria, colWidths.categoria, yPos, { width: 165, ellipsis: true });
      doc.text(status, colWidths.status, yPos, { width: 50, ellipsis: true });
      doc.moveDown(0.5);
    });

    if (contasPagar.length > 25) {
      doc.text(`... e mais ${contasPagar.length - 25} contas`, { align: 'left' });
    }

    doc.moveDown(1);

    // Contas a Receber
    // Avoid forcing a page break: only add a new page if there isn't enough space.
    // Otherwise leave extra vertical space so the section is visually separated.
    const requiredSpaceForReceitas = 180; // estimate header + a few rows
    const pageBottom = doc.page.height - (doc.page.margins?.bottom ?? 50);
    if (doc.y + requiredSpaceForReceitas > pageBottom) {
      doc.addPage();
    } else {
      // leave extra space between despesas and receitas when staying on same page
      doc.moveDown(2);
    }
    // Write the title explicitly at the left margin to avoid accidental right alignment
    const leftX = doc.page.margins?.left ?? 50;
    doc.fontSize(12).font('Helvetica-Bold').text('Receitas', leftX, doc.y);
    doc.moveDown(0.5);
    doc.fontSize(8).font('Helvetica-Bold');
    
    const colWidthsReceber = {
      competencia: 50,
      valor: 200,
      categoria: 280
    };
    
    yPos = doc.y;
    doc.text('Competência', colWidthsReceber.competencia, yPos, { width: 145, ellipsis: true });
    doc.text('Valor', colWidthsReceber.valor, yPos, { width: 75, ellipsis: true });
    doc.text('Categoria', colWidthsReceber.categoria, yPos, { width: 250, ellipsis: true });
    doc.moveDown(0.2);
    // draw separator line slightly lower to avoid overlapping the header text
    doc.moveTo(50, yPos + 10).lineTo(530, yPos + 10).stroke();
    doc.moveDown(1);

    doc.fontSize(8).font('Helvetica');
    contasReceber.slice(0, 35).forEach((conta, index) => {
      const categoria = conta.categoria?.nome && conta.subcategoria?.nome 
        ? `${conta.categoria.nome} > ${conta.subcategoria.nome}`
        : (conta.categoria?.nome || conta.subcategoria?.nome || '');
      const valor = (conta.valor || 0).toFixed(2).replace('.', ',');
      const competencia = conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '-';
      
      // Verificar se precisa de nova página antes de adicionar linha
      if (doc.y > 750) {
        doc.addPage();
        yPos = doc.y;
        doc.fontSize(8).font('Helvetica-Bold');
        doc.text('Competência', colWidthsReceber.competencia, yPos, { width: 145, ellipsis: true });
        doc.text('Valor', colWidthsReceber.valor, yPos, { width: 75, ellipsis: true });
        doc.text('Categoria', colWidthsReceber.categoria, yPos, { width: 250, ellipsis: true });
        doc.moveTo(50, yPos + 5).lineTo(530, yPos + 5).stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).font('Helvetica');
      }
      
      yPos = doc.y;
      doc.text(competencia, colWidthsReceber.competencia, yPos, { width: 145, ellipsis: true });
      doc.text(`R$ ${valor}`, colWidthsReceber.valor, yPos, { width: 75, ellipsis: true });
      doc.text(categoria, colWidthsReceber.categoria, yPos, { width: 250, ellipsis: true });
      doc.moveDown(0.5);
    });

    if (contasReceber.length > 35) {
      doc.text(`... e mais ${contasReceber.length - 35} contas`, { align: 'left' });
    }

    // Rodapé: escrever em cinza claro no final da página
    const footerText = `Gerado em ${dataFormatada} - RuralTech Sistema Agro`;
    const footerY = doc.page.height - (doc.page.margins?.bottom ?? 50) - 20;
    // usar cor cinza clara
    doc.fillColor('#9CA3AF').fontSize(8).font('Helvetica').text(footerText, 50, footerY, { width: doc.page.width - 100, align: 'center' });
    // restaurar cor padrão
    doc.fillColor('black');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="dashboard_financeiro_${periodo.replace(/\//g, '_')}_${new Date().getTime()}.pdf"`);
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('Erro ao exportar dashboard PDF:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao exportar dashboard PDF',
      detalhes: error.message
    });
  }
};

// Dashboard financeiro (resumo simples)
export const getDashboardFinanceiroController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada',
      });
    }

    const stats = await getDashboardStats(unidadeId);

    // Se getDashboardStats retornou erro interno, ainda devolvemos 200 com flag de erro para não quebrar o frontend
    return res.status(200).json({
      sucesso: !stats?.erro,
      dados: stats,
    });
  } catch (error) {
    console.error('[getDashboardFinanceiroController] erro:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao obter dashboard financeiro',
      detalhes: error.message,
    });
  }
};

// Exportar Contas CSV (para AccountsPayable)
export const exportarContasCSVController = async (req, res) => {
  try {
    const unidadeId = req.usuario?.unidadeId;
    const usuarioId = req.usuario?.id;

    if (!unidadeId) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Unidade não identificada'
      });
    }

    const { mes, ano, tipoMovimento } = req.query;

    const filtros = {};
    if (mes) filtros.mes = parseInt(mes);
    if (ano) filtros.ano = parseInt(ano);
    if (tipoMovimento) filtros.tipoMovimento = tipoMovimento;

    const contas = await listarContasFinanceirasComFiltros(unidadeId, filtros);

    // Buscar informações
    let nomeUsuario = 'Não informado';
    let nomeUnidade = 'Não informado';
    
    try {
      if (usuarioId) {
        const usuario = await getUserById(usuarioId);
        if (usuario) nomeUsuario = usuario.nome || 'Não informado';
      }
      const unidade = await getUnidadePorId(unidadeId);
      if (unidade && unidade.sucesso && unidade.unidade) {
        nomeUnidade = unidade.unidade.nome || 'Não informado';
      }
    } catch (error) {
      console.warn('[exportarContasCSVController] Erro ao buscar informações:', error);
    }

    // Preparar CSV usando ponto-e-vírgula como separador
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR') + ' ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const periodo = mes && ano ? `${mes}/${ano}` : 'Todos os períodos';
    const tipo = tipoMovimento === 'ENTRADA' ? 'Receitas' : 'Despesas';
    const separador = ';'; // Ponto-e-vírgula para melhor compatibilidade com Excel

    let csv = `Relatório de ${tipo} - RuralTech\n`;
    csv += `Unidade;${nomeUnidade}\n`;
    csv += `Usuário;${nomeUsuario}\n`;
    csv += `Período;${periodo}\n`;
    csv += `Data de Exportação;${dataFormatada}\n\n`;

    if (tipoMovimento === 'ENTRADA') {
      csv += `Competência${separador}Valor${separador}Categoria${separador}Observação\n`;
      contas.forEach(conta => {
        const categoria = conta.categoria?.nome && conta.subcategoria?.nome 
          ? `${conta.categoria.nome} > ${conta.subcategoria.nome}`
          : (conta.categoria?.nome || conta.subcategoria?.nome || '');
        const valor = (conta.valor || 0).toFixed(2).replace('.', ',');
        const competencia = conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '';
        const observacao = (conta.observacao || '').replace(/"/g, '""');
        
        csv += `${competencia}${separador}${valor}${separador}"${categoria.replace(/"/g, '""')}"${separador}"${observacao}"\n`;
      });
    } else {
      csv += `Emissão${separador}Vencimento${separador}Pagamento${separador}Valor${separador}Categoria${separador}Observação${separador}Status\n`;
      contas.forEach(conta => {
        const categoria = conta.categoria?.nome && conta.subcategoria?.nome 
          ? `${conta.categoria.nome} > ${conta.subcategoria.nome}`
          : (conta.categoria?.nome || conta.subcategoria?.nome || '');
        const status = conta.dataPagamento || conta.status === 'PAGA' ? 'Paga' : 'Pendente';
        const valor = (conta.valor || 0).toFixed(2).replace('.', ',');
        const emissao = conta.competencia ? new Date(conta.competencia).toLocaleDateString('pt-BR') : '';
        const vencimento = conta.vencimento ? new Date(conta.vencimento).toLocaleDateString('pt-BR') : '';
        const pagamento = conta.dataPagamento ? new Date(conta.dataPagamento).toLocaleDateString('pt-BR') : '';
        const observacao = (conta.observacao || '').replace(/"/g, '""');
        
        csv += `${emissao}${separador}${vencimento}${separador}${pagamento}${separador}${valor}${separador}"${categoria.replace(/"/g, '""')}"${separador}"${observacao}"${separador}${status}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    const filename = `${tipo.toLowerCase()}_${periodo.replace(/\//g, '_')}_${new Date().getTime()}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send('\ufeff' + csv); // BOM para Excel
  } catch (error) {
    console.error('Erro ao exportar contas CSV:', error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao exportar contas CSV',
      detalhes: error.message
    });
  }
};