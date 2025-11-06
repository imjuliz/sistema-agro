import { getProdutosController, getProdutoPorIdController, createProdutoController, deleteProdutoController } from "../controllers/ProdutosController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_loja"]), getProdutosController);
router.get("/:id", auth(["gerente_matriz", "gerente_loja"]), getProdutoPorIdController);
router.post("/", auth(["gerente_matriz"]), createProdutoController);
router.delete("/:id", auth(["gerente_matriz"]), deleteProdutoController);

export default router;