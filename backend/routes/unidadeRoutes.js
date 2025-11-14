import express from "express";
import { getUnidadesController, getUnidadePorIdController, createUnidadeController, updateUnidadeController, deleteUnidadeController, contarFazendasController, getFazendasController, getLojaController, getMatrizController } from "../controllers/MatrizController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz"]), getUnidadesController);
router.get("/:id", auth(["gerente_matriz"]), getUnidadePorIdController);
router.post("/", auth(["gerente_matriz"]), createUnidadeController);
router.put("/:id", auth(["gerente_matriz"]), updateUnidadeController);
router.delete("/:id", auth(["gerente_matriz"]), deleteUnidadeController);

// fazendas
router.get('/fazendas', auth, getFazendasController); // lista todas as fazendas
router.get('/fazendas/contagem', auth, contarFazendasController); // contagens relacionadas a fazendas, ex: total de fazendas, qntd de fazendas ativas, etc

// lojas
router.get('/lojas', auth, getLojaController); // lista de todas as lojas

// matrizes
router.get('/matrizes', auth, getMatrizController); // lista todas as matrizes

export default router;
