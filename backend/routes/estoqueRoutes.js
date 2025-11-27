import { getEstoquesController, getEstoquePorIdController, createEstoqueController, updateEstoqueController, deleteEstoqueController } from "../controllers/EstoqueController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getEstoquesController);
router.get("/:id", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getEstoquePorIdController);
router.post("/", auth(["gerente_fazenda", "gerente_loja"]), createEstoqueController);
router.put("/:id", auth(["gerente_fazenda", "gerente_loja"]), updateEstoqueController);
router.delete("/:id", auth(["gerente_fazenda", "gerente_loja"]), deleteEstoqueController);

export default router;