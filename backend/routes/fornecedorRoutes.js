import express from "express";
import { listarTodosFornecedoresExternosController, criarFornecedorExternoController } from "../controllers/FornecedoresController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para listar todos os fornecedores externos
router.get("/externos", auth(["gerente_matriz", "gerente_fazenda"]), listarTodosFornecedoresExternosController);

// Rota para criar um novo fornecedor externo
router.post("/externos", auth(["gerente_matriz", "gerente_fazenda"]), criarFornecedorExternoController);

export default router;










