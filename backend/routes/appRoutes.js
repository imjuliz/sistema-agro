import express from "express";
const router = express.Router();

// middlewares -----------------------------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'

// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js'
import { deletarUsuarioController } from "../controllers/UserController.js";
import { mostrarSaldoFController, contarVendasPorMesUltimos6MesesController, criarVendaController, calcularSaldoLiquidoController, listarSaidasPorUnidadeController,calcularFornecedoresController, somarDiariaController, somarSaidasController, calcularLucroController, somarEntradaMensalController, listarVendasController } from "../controllers/financeiro/financeiroController.js";
import { listarEstoqueController,buscarProdutoMaisVendidoController, listarProdutosController, somarQtdTotalEstoqueController, lotesPlantioController } from '../controllers/estoque_produtos_lotes/estoque_produtosController.js'
import { listarUsuariosPorUnidadeController } from '../controllers/usuarios/usuariosController.js'
import { verContratosController, listarFornecedoresController } from "../controllers/fornecedores/fornecedoresController.js";
import { listarFornecedoresController, verContratosController, c } from "../controllers/fornecedores/fornecedoresController.js";
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
router.get("/listarVendas/:unidadeId", listarVendasController);
router.get ("/listarSaidas/:unidadeId", listarSaidasPorUnidadeController);
router.get("/fornecedoresCalculo", auth, calcularFornecedoresController);
router.get("/somarDiaria/:unidadeId", somarDiariaController);
router.get("/somarEntradasMensais/:unidadeId", somarEntradaMensalController);
router.get("/somarSaidas/:unidadeId", somarSaidasController);
router.get("/calcularLucro/:unidadeId", calcularLucroController);

router.get("/verContratos/:unidadeId", verContratosController);
router.get("/verFornecedores/:unidadeId", listarFornecedoresController);
router.get("/lotesPlantio/:unidadeId", lotesPlantioController);

// rotas usadas para _____ ---------------------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
router.get("/usuarios/listar", auth, listarUsuariosPorUnidadeController);



export default router;
