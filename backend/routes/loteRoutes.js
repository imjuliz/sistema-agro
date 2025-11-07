import { getLoteController, getLoteAtivoController, getLotePorAnimaliaIdController, getLotePorIdController, createLoteController, updateLoteController, deleteLoteController } from "../controllers/LoteController.js";
import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_fazenda"]), getLoteController);
router.get("/animalia/:tipo", auth(["gerente_matriz", "gerente_fazenda"]), getLotePorAnimaliaIdController);
router.get("/ativo", auth(["gerente_matriz", "gerente_fazenda"]), getLoteAtivoController);
router.get("/:id", auth(["gerente_fazenda"]), getLotePorIdController);
router.post("/", auth(["gerente_fazenda"]), createLoteController);
router.put("/:id", auth(["gerente_fazenda"]), updateLoteController);
router.delete("/:id", auth(["gerente_fazenda"]), deleteLoteController);

export default router;