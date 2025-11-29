import express from "express";
import { listarGerentesDisponiveisController, criarUsuarioController, updateUsuarioController, deletarUsuarioController, listarUsuariosPorUnidadeController } from "../controllers/usuarios/usuariosController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para listar gerentes disponíveis
router.get("/gerentes-disponiveis", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), listarGerentesDisponiveisController);

// Rota para criar um novo usuário (gerente ou funcionário)
router.post("/criar", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), criarUsuarioController);

// Rota para atualizar um usuário existente
router.put("/:id", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), updateUsuarioController);

// Rota para deletar um usuário existente
router.delete("/:id", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), deletarUsuarioController);

// Rota para listar usuários da unidade (funcionários e gerentes da loja)
router.get("/unidade/listar", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA", "GERENTE_LOJA"]), listarUsuariosPorUnidadeController);

export default router;
