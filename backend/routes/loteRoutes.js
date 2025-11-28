import {
    getLoteController,
    getLotePorTipoController,
    getLoteRentabilidadeController,
    geLotePorTipoVegetaisController,
    getLotePorIdController,
    createLoteController,
    updateLoteController,
    deleteLoteController,
  } from "../controllers/LoteController.js";
import { getAtividadeLoteTipoPlantioController, createAtividadeLoteController } from "../controllers/AtividadeLoteController.js";
import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_fazenda"]), getLoteController);
router.get("/animalia/:tipo", auth(["gerente_matriz", "gerente_fazenda"]), getLotePorTipoController);
router.get("/ativo", auth(["gerente_matriz", "gerente_fazenda"]), getLoteAtividadeController);
router.get("/vegetal/:tipo", auth(["gerente_matriz", "gerente_fazenda"]), geLotePorTipoVegetaisController);
router.get("/:id", auth(["gerente_fazenda"]), getLotePorIdController);
router.get("/rentabilidade", auth(["gerente_matriz", "gerente_fazenda"]), getLoteRentabilidadeController);
router.post("/", auth(["gerente_fazenda"]), createLoteController);
router.put("/:id", auth(["gerente_fazenda"]), updateLoteController);
router.delete("/:id", auth(["gerente_fazenda"]), deleteLoteController);

// atividadesLote
router.get("/atividadeLote", auth([ "gerente_fazenda"]), getAtividadeLoteTipoPlantioController);
router.post("/atividadeLote", auth([ "gerente_fazenda"]), createAtividadeLoteController);

export default router;
