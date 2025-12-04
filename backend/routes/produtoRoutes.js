import { getProdutosController, getProdutosPelaCategoriaController, getProdutoLotePorIdController, getProdutoPorIdController, createProdutoController, deleteProdutoController } from "../controllers/ProdutosController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", auth(["GERENTE_MATRIZ", "GERENTE_LOJA"]), getProdutosController);
router.get("/categoria", auth([ "GERENTE_MATRIZ", "GERENTE_LOJA"]), getProdutosPelaCategoriaController);
router.get("/lote/:id", auth(["GERENTE_MATRIZ", "GERENTE_LOJA"]), getProdutoLotePorIdController);
router.get("/:id", auth(["GERENTE_MATRIZ", "GERENTE_LOJA"]), getProdutoPorIdController);
router.post("/", auth(["GERENTE_MATRIZ"]), createProdutoController);
router.delete("/:id", auth(["GERENTE_MATRIZ"]), deleteProdutoController);

export default router;
