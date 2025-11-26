import {getAnimaisController, getAnimaisPelaRacaController, createAnimaisController, getAnimaisPorIdController, updateAnimaisController, deleteAnimaisController } from "../controllers/AnimaisController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_fazenda"]), getAnimaisController);
router.get("/raca", auth(["gerente_matriz", "gerente_fazenda"]), getAnimaisPelaRacaController);
router.get("/:id", auth(["gerente_fazenda"]), getAnimaisPorIdController);
router.post("/", auth(["gerente_fazenda"]), createAnimaisController);
router.put("/:id", auth(["gerente_fazenda"]), updateAnimaisController);
router.delete("/:id", auth(["gerente_fazenda"]), deleteAnimaisController);

export default router;
