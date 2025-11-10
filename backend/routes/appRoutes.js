import express from "express";
const router = express.Router();

// middlewares -----------------------------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'

// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js'
import { deletarUsuarioController } from "../controllers/UserController.js";
import { calcularFornecedoresController, mostrarSaldoFController, buscarProdutoMaisVendidoController, listarProdutosController, contarVendasPorMesUltimos6MesesController, criarVendaController, somarQtdTotalEstoqueController, calcularSaldoLiquidoController, listarEstoqueController, listarUsuariosPorUnidadeController, listarSaidasPorUnidadeController } from "../controllers/financeiro/financeiroController.js";

// tradução
router.post('/translate', translateText)

// rotas usadas para loja --------------------------------------------------------------------------------
router.get("/estoqueSomar", auth, somarQtdTotalEstoqueController);
router.get("/estoque/listar", auth, listarEstoqueController);
router.get("/saldoLiquido", auth, calcularSaldoLiquidoController);
router.get("/saldo-final", auth, mostrarSaldoFController);
router.get("/saidas/listar", auth, listarSaidasPorUnidadeController);
router.get("/usuarios/listar", auth, listarUsuariosPorUnidadeController);
router.get("/produto-mais-vendido", auth, buscarProdutoMaisVendidoController);
router.get("/produtos", auth, listarProdutosController);
router.get("/vendas/ultimos-6-meses", auth, contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar", auth, criarVendaController);
router.get("/fornecedoresCalculo", auth, calcularFornecedoresController)
// rotas usadas para _____ ---------------------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
// rotas usadas para _____ ---------------------------------------------------------------------------------


export default router;
