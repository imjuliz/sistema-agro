import express from "express";
const router = express.Router();

// middlewares -----------------------------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'

// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js'
import { deletarUsuarioController } from "../controllers/UserController.js";
import { mostrarSaldoFController,buscarProdutoMaisVendidoController, listarProdutosController,contarVendasPorMesUltimos6MesesController,
    criarVendaController,somarQtdTotalEstoqueController,calcularSaldoLiquidoController,listarEstoqueController,listarUsuariosPorUnidadeController,
    listarSaidasPorUnidadeController,calcularFornecedoresController, 
    somarSaidasController,
    somarDiariaController} from "../controllers/financeiro/financeiroController.js";
import { calcularFornecedoresController, mostrarSaldoFController, buscarProdutoMaisVendidoController, contarVendasPorMesUltimos6MesesController, criarVendaController, calcularSaldoLiquidoController, listarSaidasPorUnidadeController } from "../controllers/financeiro/financeiroController.js";
import { listarEstoqueController, listarProdutosController, somarQtdTotalEstoqueController } from '../controllers/estoque_produtos_lotes/estoque_produtosController.js'
import { listarUsuariosPorUnidadeController } from '../controllers/usuarios/usuariosController.js'

// tradução
router.post('/translate', translateText)

// rotas usadas para loja --------------------------------------------------------------------------------
router.get("/estoqueSomar", auth, somarQtdTotalEstoqueController);
router.get("/estoque/listar", auth, listarEstoqueController);
router.get("/saldoLiquido", auth, calcularSaldoLiquidoController);
router.get("/saldo-final", auth, mostrarSaldoFController);
router.get("/saidas/listar", auth, listarSaidasPorUnidadeController);
router.get("/produto-mais-vendido", auth, buscarProdutoMaisVendidoController);
router.get("/produtos", auth, listarProdutosController);
router.get("/vendas/ultimos-6-meses", auth, contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar", auth, criarVendaController);
router.get("/fornecedoresCalculo", auth, calcularFornecedoresController)
router.get("/somarDiaria/:unidadeId", somarDiariaController);
router.get("/somarSaidas/:unidadeId", somarSaidasController);
// rotas usadas para _____ ---------------------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
router.get("/usuarios/listar", auth, listarUsuariosPorUnidadeController);

// rotas usadas para _____ ---------------------------------------------------------------------------------


export default router;
