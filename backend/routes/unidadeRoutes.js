import { getUnidadesController, getUnidadePorIdController, createUnidadeController, updateUnidadeController, deleteUnidadeController } from "../controllers/UnidadesController.js";
import { auth } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/", auth(["gerente_matriz"]), getUnidadesController());
router.get("/:id", auth(["gerente_matriz"]), getUnidadePorIdController);
router.post("/", auth(["gerente_matriz"]), createUnidadeController);
router.put("/:id", auth(["gerente_matriz"]), updateUnidadeController);
router.delete("/:id", auth(["gerente_matriz"]), deleteUnidadeController);

export default router;