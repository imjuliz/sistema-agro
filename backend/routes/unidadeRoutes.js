import express from "express";
import { getUnidadesController, getUnidadePorIdController, createUnidadeController, updateUnidadeController, deleteUnidadeController, contarFazendasController, getFazendasController, getLojaController, getMatrizController, getUsuariosPorUnidadeController, getUsuarioPorIdController, contarLojasController } from "../controllers/UnidadesController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz"]), getUnidadesController);
router.get("/:id", auth(["gerente_matriz"]), getUnidadePorIdController);
router.post("/", auth(["gerente_matriz"]), createUnidadeController);
router.put("/:id", auth(["gerente_matriz"]), updateUnidadeController);
router.delete("/:id", auth(["gerente_matriz"]), deleteUnidadeController);


// listar usuários de uma unidade (aceita ?q=&perfilId=&status=&page=&perPage=)
router.get("/:unidadeId/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);

// alternativa: permitir consulta por query `?unidadeId=..`
router.get("/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);

// obter usuário por id (detalhe)
router.get("/usuarios/:id", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuarioPorIdController);


// router.get('/unidades', auth(), getUnidadesController);
// router.get('/unidades/:id', auth(), getUnidadePorIdController);


router.get('/fazendas', auth(), getFazendasController);
router.get('/contar-fazendas', contarFazendasController);


router.get('/lojas', auth(), getLojaController);
router.get('/contar-lojas', contarLojasController);

router.get('/matrizes', auth(), getMatrizController)

export default router;