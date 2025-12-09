import {getLoteController,getLotePorTipoController,getLotePorIdController,
    updateLoteController,deleteLoteController,
  } from "../controllers/LoteController.js";
import { getAtividadeLoteTipoPlantioController, createAtividadeLoteController } from "../controllers/AtividadeLoteController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getLoteController);
router.get("/tipo", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getLotePorTipoController);
// router.get("/ativo", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getLoteAtividadeController);
// router.get("/vegetal", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), geLotePorTipoVegetaisController);
router.get("/:id", auth(["GERENTE_FAZENDA"]), getLotePorIdController);
// router.post("/", auth(["GERENTE_FAZENDA"]), createLoteController);
// router.post("/:unidadeId/:contratoId", auth(["GERENTE_FAZENDA"]), createLoteController);
router.put("/:id/:unidadeId/:contratoId", auth(["GERENTE_FAZENDA"]), updateLoteController);
router.delete("/:id", auth(["GERENTE_FAZENDA"]), deleteLoteController);

// atividadesLote
router.get("/atividadeLote", auth(["GERENTE_FAZENDA"]), getAtividadeLoteTipoPlantioController);
router.post("/atividadeLote", auth(["GERENTE_FAZENDA"]), createAtividadeLoteController);

export default router;
