import express from "express";
const router = express.Router();

// middlewares -----------------------------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'

// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js'
import { deletarUsuarioController } from "../controllers/UserController.js";
import { mostrarSaldoFController,buscarProdutoMaisVendidoController,listarProdutosController, contarVendasPorMesUltimos6MesesController,
    criarVendaController, somarQtdTotalEstoqueController, calcularSaldoLiquidoController, listarEstoqueController, listarUsuariosPorUnidadeController,
    listarSaidasPorUnidadeController } from "../controllers/NovasFuncoesController.js";

// tradução
router.post('/translate', translateText)

// rotas usadas para loja(precisa ajustar as rotas certinhas) --------------------------------------------------------------------------------
router.get("/estoque/somar", autenticarSessao, somarQtdTotalEstoqueController);
router.get("/saldo/liquido", autenticarSessao, calcularSaldoLiquidoController);
router.get("/estoque/listar", autenticarSessao, listarEstoqueController);
router.get("/usuarios/listar", autenticarSessao, listarUsuariosPorUnidadeController);
router.get("/saidas/listar", autenticarSessao, listarSaidasPorUnidadeController);
router.get("/saldo-final", autenticarSessao, mostrarSaldoFController);
router.get("/produto-mais-vendido", autenticarSessao, buscarProdutoMaisVendidoController);
router.get("/produtos", autenticarSessao, listarProdutosController);
router.get("/vendas/ultimos-6-meses", autenticarSessao, contarVendasPorMesUltimos6MesesController);

router.post("/vendas/criar", autenticarSessao, criarVendaController);

// rotas usadas para _____ ---------------------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
// rotas usadas para _____ ---------------------------------------------------------------------------------


export default router;
