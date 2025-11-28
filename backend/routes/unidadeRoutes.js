import express from "express";
import { getUnidadesController, getUnidadePorIdController, createUnidadeController, updateUnidadeController, deleteUnidadeController, contarFazendasController, getFazendasController, getLojaController, getMatrizController, getUsuariosPorUnidadeController, getUsuarioPorIdController, contarLojasController, buscarCepController } from "../controllers/UnidadesController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", auth(["gerente_matriz"]), getUnidadesController);

router.get('/fazendas', auth(["gerente_matriz"]), getFazendasController);
router.get('/contar-fazendas', auth(["gerente_matriz"]), contarFazendasController);

router.get('/lojas', auth(), getLojaController);
router.get('/contar-lojas', auth(["gerente_matriz"]), contarLojasController);

router.get('/matrizes', auth(), getMatrizController)

router.get("/cep/:cep", buscarCepController); // Mover para antes de /:id

// GET /cep?cep=12345000
router.get("/cep", buscarCepController); // Mover para antes de /:id

router.get("/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);

router.get("/:id", auth(["gerente_matriz"]), getUnidadePorIdController);
router.post("/", auth(["gerente_matriz"]), createUnidadeController);
router.put("/:id", auth(["gerente_matriz"]), updateUnidadeController);
router.delete("/:id", auth(["gerente_matriz"]), deleteUnidadeController);


// listar usuários de uma unidade (aceita ?q=&perfilId=&status=&page=&perPage=)
router.get("/:unidadeId/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);


// obter usuário por id (detalhe)
router.get("/usuarios/:id", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuarioPorIdController);

export default router;