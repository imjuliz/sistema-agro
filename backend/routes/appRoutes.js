import express from "express";
const router = express.Router();
// middlewares --------------------------------------------------------------------
import { auth } from "../middlewares/authMiddleware.js";
// controllers --------------------------------------------------------------------
import { translateText } from "../controllers/TranslateController.js";
import {listarPedidosEntregaController, listarPedidosOrigemController, atualizarQntdMinController } from "../controllers/estoque_produtosController.js";
import { verificarProducaoLoteController, calcularMediaProducaoPorLoteController, gerarRelatorioLoteController, gerarRelatorioProducaoController} from "../controllers/fazenda.js";
import { calcularFornecedoresController, criarContratoExternoController, criarContratoInternoController, listarFornecedoresExternosController, listarFornecedoresInternosController, listarLojasAtendidasController, verContratosComFazendasController, verContratosComFazendasAsFornecedorController, verContratosComLojasController, verContratosExternosController, listarMetaContratosController, buscarPedidosExternosController, getFornecedoresKpisController, updateFornecedorController, deleteFornecedorController } from "../controllers/FornecedorController.js";
import { listarEstoqueController,  listarProdutosController, somarQtdTotalEstoqueController, lotesPlantioController, consultarLoteController } from '../controllers/estoque_produtosController.js'
import {
    mostrarSaldoFController, contarVendasPorMesUltimos6MesesController, criarVendaController, calcularSaldoLiquidoController,
    listarSaidasPorUnidadeController, somarDiariaController, somarSaidasController, calcularLucroController,
    somarEntradaMensalController, listarVendasController,  calcularMediaPorTransacaoController, divisaoPagamentosController, buscarProdutoMaisVendidoController,
    listarDespesasController, abrirCaixaController,getDashboardFinanceiroController
} from "../controllers/FinanceiroController.js";
import {
    criarCategoriaController,
    listarCategoriasController,
    obterCategoriaController,
    atualizarCategoriaController,
    deletarCategoriaController,
    criarSubcategoriaController,
    listarSubcategoriasController,
    obterSubcategoriaController,
    atualizarSubcategoriaController,
    deletarSubcategoriaController
} from "../controllers/CategoriaFinanceiraController.js";
import {
    criarContaController,
    listarContasController,
    obterContaController,
    atualizarContaController,
    marcarComoPagaController,
    marcarComoRecebidaController,
    deletarContaController,
    obterResumoController,
    obterSaldoPorCategoriaController
} from "../controllers/ContaFinanceiraController.js";
// import { getDashboardDataController } from '../controllers/dashboardController.js';
import { getProdutosController, produtosDoEstoqueController } from "../controllers/ProdutosController.js";
import { getDashboardDataController, getLotesPorStatusController } from '../controllers/dashboardController.js';

// tradução
router.post("/translate", translateText);

// rotas usadas para loja --------------------------------------------------------------------
router.post("/caixa/abrir", auth(), abrirCaixaController);
router.get("/vendas/ultimos-6-meses",auth(),contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar", auth(), criarVendaController);
router.get("/listarVendas/:unidadeId", listarVendasController);
router.get("/listarDespesas/:unidadeId", listarDespesasController);
router.get("/calcularLucro/:unidadeId", calcularLucroController);
router.get("/somarDiaria/:unidadeId", somarDiariaController);
router.get("/vendas/media-por-transacao/:unidadeId", calcularMediaPorTransacaoController);
router.get("/vendas/divisao-pagamentos/:unidadeId", divisaoPagamentosController);
router.get("/financeiro/produto-mais-vendido/:unidadeId", buscarProdutoMaisVendidoController);

// rotas usadas para _____ --------------------------------------------------------------------
// NOTE: rotas de usuários são definidas em routes/usuariosRoutes.js e routes/unidadeRoutes.js.
// Removemos as rotas duplicadas daqui para evitar conflitos de roteamento.

//estoques, lotes, produtos, etc --------------------------------------------------------------------
// router.get("/atividadesLote", listarAtividadesLoteController);
router.get("/consultarLote", consultarLoteController);
router.get("/lotes/:loteId/producao", verificarProducaoLoteController);
router.get("/produto-mais-vendido", auth, buscarProdutoMaisVendidoController);
// router.get("/produtos/:unidadeId",  listarProdutosController);
router.get("/listarProdutos/:unidadeId", getProdutosController);

router.get('/listarProdutosEstoque/:unidadeId', produtosDoEstoqueController);

router.get("/estoqueSomar", auth, somarQtdTotalEstoqueController);
router.get("/produto-mais-vendido", auth(), buscarProdutoMaisVendidoController);
router.get("/produtos", auth(), listarProdutosController);
router.get("/estoqueSomar", auth(), somarQtdTotalEstoqueController);
router.get("/unidade/:unidadeId/produtos", listarEstoqueController);
router.get("/lotesPlantio/:unidadeId", lotesPlantioController);
router.get("/lote/:loteId/media-producao",calcularMediaProducaoPorLoteController);
router.get('/lotes/:unidadeId/status-counts', getLotesPorStatusController);
//relatório
router.get("/relatorio/lote/:loteId", gerarRelatorioLoteController);
router.get("/relatorio/producao/:loteId", gerarRelatorioProducaoController);

//financeiro (de todos os perfis) --------------------------------------------------------------------
router.get("/saldoLiquido", auth(), calcularSaldoLiquidoController);
router.get("/saldo-final", auth(), mostrarSaldoFController);
router.get("/listarSaidas/:unidadeId", listarSaidasPorUnidadeController);
// router.get("/listarSaidas/:unidadeId", listarSaidasController);
router.get("/somarEntradasMensais/:unidadeId", somarEntradaMensalController);
router.get("/somarSaidas/:unidadeId", somarSaidasController);

//fornecedores --------------------------------------------------------------------
router.get("/fornecedoresCalculo", calcularFornecedoresController);
router.get("/listarFornecedoresExternos/:unidadeId", listarFornecedoresExternosController);
router.get("/listarFornecedoresInternos/:unidadeId", listarFornecedoresInternosController);
router.get("/listarLojasParceiras/:unidadeId", listarLojasAtendidasController);
router.get("/verContratosComLojas/:fornecedorUnidadeId", verContratosComLojasController);
router.get("/verContratosExternos/:unidadeId", verContratosExternosController);
router.get("/pedidos-externos/:unidadeId", buscarPedidosExternosController);
router.get("/verContratosComFazendas/:unidadeId", verContratosComFazendasController);
router.get("/verContratosComFazendasAsFornecedor/:unidadeId", verContratosComFazendasAsFornecedorController);
router.post("/criarContratoInterno/:fazendaId", criarContratoInternoController);
router.post("/criarContratoExterno/:unidadeId", criarContratoExternoController);
// metadados para contratos (enums/options)
router.get("/meta/contratos", listarMetaContratosController);
// KPI de fornecedores
router.get("/fornecedores/kpis/:unidadeId", auth(), getFornecedoresKpisController);
// editar e deletar fornecedor (apenas GERENTE_MATRIZ)
router.put("/fornecedores/:id", auth(["GERENTE_MATRIZ"]), updateFornecedorController);
router.delete("/fornecedores/:id", auth(["GERENTE_MATRIZ"]), deleteFornecedorController);

//estoque-produtos (pedidos) --------------------------------------------------------------------
router.get("/estoque-produtos/pedidos/:unidadeId", listarPedidosEntregaController);
router.get("/estoque-produtos/pedidos-origem/:unidadeId", listarPedidosOrigemController);
// atualizar quantidade mínima de produto no estoque (qntdMin)
router.put("/estoque-produtos/:id/minimum", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), atualizarQntdMinController);

// dashboard - dados agregados para gráficos (por unidade)
router.get('/dashboard/fazenda/:unidadeId', auth(), getDashboardDataController);

//categorias financeiras --------------------------------------------------------------------
router.post("/categorias", auth(), criarCategoriaController);
router.get("/categorias", auth(), listarCategoriasController);
router.get("/categorias/:categoriaId", auth(), obterCategoriaController);
router.put("/categorias/:categoriaId", auth(), atualizarCategoriaController);
router.delete("/categorias/:categoriaId", auth(), deletarCategoriaController);

// subcategorias financeiras
router.post("/categorias/:categoriaId/subcategorias", auth(), criarSubcategoriaController);
router.get("/categorias/:categoriaId/subcategorias", auth(), listarSubcategoriasController);
router.get("/subcategorias/:subcategoriaId", auth(), obterSubcategoriaController);
router.put("/subcategorias/:subcategoriaId", auth(), atualizarSubcategoriaController);
router.delete("/subcategorias/:subcategoriaId", auth(), deletarSubcategoriaController);

// contas financeiras
router.post("/contas-financeiras", auth(), criarContaController);
router.get("/contas-financeiras", auth(), listarContasController);
router.get("/contas-financeiras/:contaId", auth(), obterContaController);
router.put("/contas-financeiras/:contaId", auth(), atualizarContaController);
router.post("/contas-financeiras/:contaId/pagar", auth(), marcarComoPagaController);
router.post("/contas-financeiras/:contaId/receber", auth(), marcarComoRecebidaController);
router.delete("/contas-financeiras/:contaId", auth(), deletarContaController);

// resumos e relatórios financeiros
router.get("/financeiro/resumo", auth(), obterResumoController);
router.get("/financeiro/saldo-por-categoria", auth(), obterSaldoPorCategoriaController);
router.get("/financeiro/dashboard", auth(), getDashboardFinanceiroController);
// compatibilidade: rota usada pelo frontend moderno
router.get("/financeiro/dashboard", auth(), obterResumoController);
// compatibilidade: rota para listar contas usada pelo frontend
router.get("/financeiro/contas", auth(), listarContasController);

//perfil --------------------------------------------------------------------

export default router;
