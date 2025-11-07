import express from "express";
const router = express.Router();

// middlewares -----------------------------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'

// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js'
import { deletarUsuarioController } from "../controllers/UserController.js";
import {calcularFornecedoresController,
    mostrarSaldoFController, buscarProdutoMaisVendidoController, listarProdutosController, contarVendasPorMesUltimos6MesesController, criarVendaController,
    somarQtdTotalEstoqueController, calcularSaldoLiquidoController, listarEstoqueController, listarUsuariosPorUnidadeController, listarSaidasPorUnidadeController
} from "../controllers/NovasFuncoesController.js";

// tradução
router.post('/translate', translateText)

// rotas usadas para loja --------------------------------------------------------------------------------
router.get("/estoqueSomar", autenticarSessao, somarQtdTotalEstoqueController);
router.get("/estoque/listar", autenticarSessao, listarEstoqueController);
router.get("/saldoLiquido", autenticarSessao, calcularSaldoLiquidoController);
router.get("/saldo-final", autenticarSessao, mostrarSaldoFController);
router.get("/saidas/listar", autenticarSessao, listarSaidasPorUnidadeController);
router.get("/usuarios/listar", autenticarSessao, listarUsuariosPorUnidadeController);
router.get("/produto-mais-vendido", autenticarSessao, buscarProdutoMaisVendidoController);
router.get("/produtos", autenticarSessao, listarProdutosController);
router.get("/vendas/ultimos-6-meses", autenticarSessao, contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar", autenticarSessao, criarVendaController);
router.get("/fornecedoresCalculo",autenticarSessao, calcularFornecedoresController)
// rotas usadas para _____ ---------------------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
// rotas usadas para _____ ---------------------------------------------------------------------------------


export default router;
