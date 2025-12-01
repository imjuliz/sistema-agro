import express from "express";
import { getUnidadesController, getUnidadePorIdController, createUnidadeController, updateUnidadeController, deleteUnidadeController, contarFazendasController, getFazendasController, getLojaController, getMatrizController, getUsuariosPorUnidadeController, getUsuarioPorIdController, contarLojasController, buscarCepController, atualizarFotoUnidadeController, removerFotoUnidadeController, getCitySuggestionsController } from "../controllers/UnidadesController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ROTAS NÃO-DINÂMICAS PRIMEIRO (antes de /:id)
router.get("/", auth(["gerente_matriz"]), getUnidadesController);
router.post("/", auth(["gerente_matriz"]), createUnidadeController);

router.get('/fazendas', auth(["gerente_matriz"]), getFazendasController);
router.get('/cidades', auth(), getCitySuggestionsController);
router.get('/contar-fazendas', auth(["gerente_matriz"]), contarFazendasController);

router.get('/lojas', auth(), getLojaController);
router.get('/contar-lojas', auth(["gerente_matriz"]), contarLojasController);

router.get('/matrizes', auth(), getMatrizController);

router.get("/cep/:cep", buscarCepController);
router.get("/cep", buscarCepController);

router.get("/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);

// ROTAS DINÂMICAS COM SUBROTAS (:id/...)
// Foto DEVE vir antes de :id para não ser interceptada
router.post("/:id/foto", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), upload.single('foto'), atualizarFotoUnidadeController);
router.delete("/:id/foto", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), removerFotoUnidadeController);

router.get("/:unidadeId/usuarios", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuariosPorUnidadeController);
router.get("/usuarios/:id", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), getUsuarioPorIdController);

// ROTAS DINÂMICAS :id (por último para não interceptar subrotas)
router.get("/:id", auth(["gerente_matriz"]), getUnidadePorIdController);
router.put("/:id", auth(["gerente_matriz"]), updateUnidadeController);
router.delete("/:id", auth(["gerente_matriz"]), deleteUnidadeController);

export default router;