import { getLoteController, getLotePorAnimaliaIdController, getLotePorIdController, createLoteController, updateLoteController, deleteLoteController } from "../controllers/LoteController.js";
import express from "express";

const router = express.Router();

router.get("/", getLoteController);
router.get("/animalia/:tipo", getLotePorAnimaliaIdController);
router.get("/:id", getLotePorIdController);
router.post("/", createLoteController);
router.put("/:id", updateLoteController);
router.delete("/:id", deleteLoteController);

export default router;