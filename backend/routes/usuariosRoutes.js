import express from "express";
import { listarGerentesDisponiveisController, criarUsuarioController, updateUsuarioController } from "../controllers/usuarios/usuariosController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para listar gerentes disponíveis
router.get("/gerentes-disponiveis", auth(["gerente_matriz", "gerente_fazenda"]), listarGerentesDisponiveisController);

// Rota para criar um novo usuário (gerente ou funcionário)
router.post("/criar", auth(["gerente_matriz", "gerente_fazenda"]), criarUsuarioController);

// Rota para atualizar um usuário existente
router.put("/:id", auth(["gerente_matriz", "gerente_fazenda"]), updateUsuarioController);

export default router;
