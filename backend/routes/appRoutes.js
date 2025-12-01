import express from "express";
const router = express.Router();
// middlewares --------------------------------------------------------------------
import { auth } from "../middlewares/authMiddleware.js";
// controllers --------------------------------------------------------------------
import { translateText } from "../controllers/TranslateController.js";
import { deletarUsuarioController } from "../controllers/UserController.js";
import { listarUsuariosPorUnidadeController } from '../controllers/usuarios/usuariosController.js';
import {listarPedidosEntregaController, listarPedidosOrigemController } from "../controllers/estoque_produtosController.js";
import { verificarProducaoLoteController, calcularMediaProducaoPorLoteController, gerarRelatorioLoteController, gerarRelatorioProducaoController } from "../controllers/fazenda.js";
import { calcularFornecedoresController, criarContratoExternoController, criarContratoInternoController, listarFornecedoresExternosController, listarFornecedoresInternosController, listarLojasAtendidasController, verContratosComFazendasController, verContratosComLojasController, verContratosExternosController, listarMetaContratosController } from "../controllers/fornecedoresController.js";
import { listarEstoqueController,  listarProdutosController, somarQtdTotalEstoqueController, lotesPlantioController, consultarLoteController } from '../controllers/estoque_produtosController.js'
import {
    mostrarSaldoFController, contarVendasPorMesUltimos6MesesController, criarVendaController, calcularSaldoLiquidoController,
    listarSaidasPorUnidadeController, somarDiariaController, somarSaidasController, calcularLucroController,
    somarEntradaMensalController, listarVendasController, calcularMediaPorTransacaoController, divisaoPagamentosController, buscarProdutoMaisVendidoController
} from "../controllers/FinanceiroController.js";
import { getDashboardDataController } from '../controllers/dashboardController.js';

// tradução
router.post("/translate", translateText);

// rotas usadas para loja --------------------------------------------------------------------
router.get("/vendas/ultimos-6-meses",auth,contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar", auth, criarVendaController);
router.get("/listarVendas/:unidadeId", listarVendasController);
router.get("/calcularLucro/:unidadeId", calcularLucroController);
router.get("/somarDiaria/:unidadeId", somarDiariaController);
router.get("/vendas/media-por-transacao", auth, calcularMediaPorTransacaoController);
router.get("/vendas/divisao-pagamentos", auth, divisaoPagamentosController);
router.get("/financeiro/produto-mais-vendido", auth, buscarProdutoMaisVendidoController);

// rotas usadas para _____ --------------------------------------------------------------------
// NOTE: rotas de usuários são definidas em routes/usuariosRoutes.js e routes/unidadeRoutes.js.
// Removemos as rotas duplicadas daqui para evitar conflitos de roteamento.

//estoques, lotes, produtos, etc --------------------------------------------------------------------
// router.get("/atividadesLote", listarAtividadesLoteController);
router.get("/consultarLote", consultarLoteController);
router.get("/lotes/:loteId/producao", verificarProducaoLoteController);
router.get("/produto-mais-vendido", auth, buscarProdutoMaisVendidoController);
router.get("/produtos", auth, listarProdutosController);
router.get("/estoqueSomar", auth, somarQtdTotalEstoqueController);
router.get("/unidade/:unidadeId/produtos", listarEstoqueController);
router.get("/lotesPlantio/:unidadeId", lotesPlantioController);
router.get("/lote/:loteId/media-producao",calcularMediaProducaoPorLoteController);

//relatório
router.get("/relatorio/lote/:loteId", gerarRelatorioLoteController);
router.get("/relatorio/producao/:loteId", gerarRelatorioProducaoController);

//financeiro (de todos os perfis) --------------------------------------------------------------------
router.get("/saldoLiquido", auth, calcularSaldoLiquidoController);
router.get("/saldo-final", auth, mostrarSaldoFController);
// router.get("/saidas/listar", auth, listarSaidasPorUnidadeController);
router.get("/listarSaidas/:unidadeId", listarSaidasController);
router.get("/somarEntradasMensais/:unidadeId", somarEntradaMensalController);
router.get("/somarSaidas/:unidadeId", somarSaidasController);

//fornecedores --------------------------------------------------------------------
router.get("/fornecedoresCalculo", calcularFornecedoresController);
router.get("/listarFornecedoresExternos/:unidadeId", listarFornecedoresExternosController);
router.get("/listarFornecedoresInternos/:unidadeId", listarFornecedoresInternosController);
router.get("/listarLojasParceiras/:unidadeId", listarLojasAtendidasController);
router.get("/verContratosComLojas/:fornecedorUnidadeId", verContratosComLojasController);
router.get("/verContratosExternos/:unidadeId", verContratosExternosController);
router.get("/verContratosComFazendas/:unidadeId", verContratosComFazendasController);
router.post("/criarContratoInterno/:fazendaId", criarContratoInternoController);
router.post("/criarContratoExterno/:unidadeId", criarContratoExternoController);
// metadados para contratos (enums/options)
router.get("/meta/contratos", listarMetaContratosController);

//estoque-produtos (pedidos) --------------------------------------------------------------------
router.get("/estoque-produtos/pedidos/:unidadeId", listarPedidosEntregaController);
router.get("/estoque-produtos/pedidos-origem/:unidadeId", listarPedidosOrigemController);

// dashboard - dados agregados para gráficos (por unidade)
router.get('/dashboard/fazenda/:unidadeId', auth, getDashboardDataController);

//perfil --------------------------------------------------------------------

export default router;
