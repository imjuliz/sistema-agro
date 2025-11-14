import { getLoteController, getLoteAtividadeController, getLotePorAnimaliaIdController, getLoteRentabilidadeController, getLotePorIdController, createLoteController, updateLoteController, deleteLoteController, getLotePorDataCriacaoController } from "../controllers/LoteController.js";
import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_fazenda"]), getLoteController);
router.get("/animalia/:tipo", auth(["gerente_matriz", "gerente_fazenda"]), getLotePorAnimaliaIdController);
router.get("/ativo", auth(["gerente_matriz", "gerente_fazenda"]), getLoteAtividadeController);
router.get("/:id", auth(["gerente_fazenda"]), getLotePorIdController);
router.get("/rentabilidade", auth(["gerente_matriz", "gerente_fazenda"]), getLoteRentabilidadeController);
router.post("/", auth(["gerente_fazenda"]), createLoteController);
router.put("/:id", auth(["gerente_fazenda"]), updateLoteController);
router.delete("/:id", auth(["gerente_fazenda"]), deleteLoteController);
router.get("/dataCriacao/:dataCriacao", auth(["gerente_matriz", "gerente_fazenda"]), getLotePorDataCriacaoController);

export default router;
