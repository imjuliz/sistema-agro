import { getEstoquesController, getEstoquePorIdController, createEstoqueController, updateEstoqueController, deleteEstoqueController } from "../controllers/EstoqueController.js";
import { buscarProdutoMaisVendidoController, listarProdutosController, getProdutoPorIdController,  } from "../controllers/estoque_produtosController.js";
import { createMovimentoController } from "../controllers/EstoqueController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET todos os estoques (com filtro de unidade) - todos os roles podem ler
router.get("/", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA", "FUNCIONARIO_FAZENDA", "FUNCIONARIO_LOJA"]), getEstoquesController);

// GET um estoque específico - todos os roles podem ler
router.get("/:id", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA", "FUNCIONARIO_FAZENDA", "FUNCIONARIO_LOJA"]), getEstoquePorIdController);

// POST criar estoque - apenas gerentes (matriz/fazenda/loja)
router.post("/", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), createEstoqueController);

// PUT atualizar estoque - apenas gerentes (matriz/fazenda/loja)
router.put("/:id", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), updateEstoqueController);

// DELETE deletar estoque - apenas gerentes (matriz/fazenda/loja)
router.delete("/:id", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), deleteEstoqueController);

// POST registrar movimentação - gerentes e funcionários podem registrar entrada/saída
router.post('/movimento', auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA", "FUNCIONARIO_FAZENDA", "FUNCIONARIO_LOJA"]), createMovimentoController);

// estoque_produtosController.js
// router.get("/estoque-produtos/pedidos/:unidadeId", listarPedidosEntregaController);
// router.get("/estoque-produtos/pedidos-origem/:unidadeId", listarPedidosOrigemController);
// // atualizar quantidade mínima de produto no estoque (qntdMin)
// router.put("/estoque-produtos/:id/minimum", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), atualizarQntdMinController);


export default router;