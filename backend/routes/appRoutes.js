import express from "express";
const router = express.Router();
// middlewares --------------------------------------------------------------------
import { auth } from '../middlewares/authMiddleware.js'
// controllers --------------------------------------------------------------------
import { translateText } from '../controllers/TranslateController.js';
import { deletarUsuarioController } from "../controllers/UserController.js";
import { listarUsuariosPorUnidadeController } from '../controllers/usuarios/usuariosController.js';
import { listarAtividadesLoteController } from "../controllers/estoque_produtos_lotes/estoque_produtosController.js";
import { verificarProducaoLoteController, calcularMediaProducaoPorLoteController, gerarRelatorioLoteController, gerarRelatorioProducaoController } from "../controllers/fazenda.js";
import { verContratosController, listarFornecedoresController, calcularFornecedoresController } from "../controllers/fornecedores/fornecedoresController.js";
import { listarEstoqueController, buscarProdutoMaisVendidoController, listarProdutosController, somarQtdTotalEstoqueController, lotesPlantioController, consultarLoteController } from '../controllers/estoque_produtos_lotes/estoque_produtosController.js'
import {
    mostrarSaldoFController, contarVendasPorMesUltimos6MesesController, criarVendaController, calcularSaldoLiquidoController,
    listarSaidasPorUnidadeController, somarDiariaController, somarSaidasController, calcularLucroController,
    somarEntradaMensalController, listarVendasController
} from "../controllers/financeiro/financeiroController.js";

// tradução
router.post('/translate', translateText)

// rotas usadas para loja --------------------------------------------------------------------
router.get("/vendas/ultimos-6-meses", auth, contarVendasPorMesUltimos6MesesController);
router.post("/vendas/criar", auth, criarVendaController);
router.get("/listarVendas/:unidadeId", listarVendasController);
router.get("/calcularLucro/:unidadeId", calcularLucroController);
router.get("/somarDiaria/:unidadeId", somarDiariaController);

// rotas usadas para _____ --------------------------------------------------------------------
router.delete('/usuarios/:userId', deletarUsuarioController)
router.get("/usuarios/listar", auth, listarUsuariosPorUnidadeController);

//estoques, lotes, produtos, etc --------------------------------------------------------------------
router.get("/atividadesLote", listarAtividadesLoteController);
router.get("/consultarLote", consultarLoteController);
router.get("/lotes/:loteId/producao", verificarProducaoLoteController);
router.get("/produto-mais-vendido", auth, buscarProdutoMaisVendidoController);
router.get("/produtos", auth, listarProdutosController);
router.get("/estoqueSomar", auth, somarQtdTotalEstoqueController);
router.get("/estoque/listar", auth, listarEstoqueController);
router.get("/lotesPlantio/:unidadeId", lotesPlantioController);
router.get("/lote/:loteId/media-producao", calcularMediaProducaoPorLoteController);

//relatório
router.get("/relatorio/lote/:loteId", gerarRelatorioLoteController);
router.get("/relatorio/producao/:loteId", gerarRelatorioProducaoController);

//financeiro (de todos os perfis) --------------------------------------------------------------------
router.get("/saldoLiquido", auth, calcularSaldoLiquidoController);
router.get("/saldo-final", auth, mostrarSaldoFController);
router.get("/saidas/listar", auth, listarSaidasPorUnidadeController);
router.get("/listarSaidas/:unidadeId", listarSaidasPorUnidadeController);
router.get("/somarEntradasMensais/:unidadeId", somarEntradaMensalController);
router.get("/somarSaidas/:unidadeId", somarSaidasController);
router.get("/verContratos/:unidadeId", verContratosController);

//fornecedores --------------------------------------------------------------------
router.get("/fornecedoresCalculo", calcularFornecedoresController);
router.get("/verFornecedores/:unidadeId", listarFornecedoresController);

//perfil --------------------------------------------------------------------

export default router;