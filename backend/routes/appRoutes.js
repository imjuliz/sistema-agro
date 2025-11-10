import express from "express";
const router = express.Router();

// middlewares -----------------------------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'

// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js'
import { deletarUsuarioController } from "../controllers/UserController.js";
// import {calcularFornecedoresController,
//     mostrarSaldoFController, buscarProdutoMaisVendidoController, listarProdutosController, contarVendasPorMesUltimos6MesesController, criarVendaController,
//     somarQtdTotalEstoqueController, calcularSaldoLiquidoController, listarEstoqueController, listarUsuariosPorUnidadeController, listarSaidasPorUnidadeController
// } from "../controllers/NovasFuncoesController.js";
import { mostrarSaldoFController,buscarProdutoMaisVendidoController, listarProdutosController,contarVendasPorMesUltimos6MesesController,
    criarVendaController,somarQtdTotalEstoqueController,calcularSaldoLiquidoController,listarEstoqueController,listarUsuariosPorUnidadeController,
    listarSaidasPorUnidadeController,calcularFornecedoresController } from "../controllers/financeiro/financeiroController.js";
// tradução
router.post('/translate', translateText)

// rotas usadas para loja --------------------------------------------------------------------------------
router.get("/estoqueSomar",  somarQtdTotalEstoqueController);
router.get("/estoque/listar", listarEstoqueController);
router.get("/saldoLiquido", calcularSaldoLiquidoController);
router.get("/saldo-final", mostrarSaldoFController);
router.get("/saidas/listar", listarSaidasPorUnidadeController);
router.get("/usuarios/listar", listarUsuariosPorUnidadeController);
router.get("/produto-mais-vendido",buscarProdutoMaisVendidoController);
router.get("/produtos", listarProdutosController);
router.get("/vendas/ultimos-6-meses",contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar",  criarVendaController);
router.get("/fornecedoresCalculo",calcularFornecedoresController)
// rotas usadas para _____ ---------------------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
// rotas usadas para _____ ---------------------------------------------------------------------------------


export default router;
