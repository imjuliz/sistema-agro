import { getPlantioController, getPlantioCategoriaController, createPlantioController, updatePlantioController, deletePlantioController } from "../controllers/PlantioController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getPlantioController);
router.get("/categoria", auth(["GERENTE_MATRIZ", "GERENTE_FAZENDA"]), getPlantioCategoriaController);
router.post("/:unidadeId/:loteId", auth(["GERENTE_FAZENDA"]), createPlantioController);
router.put("/:id/:unidadeId/:loteId", auth(["GERENTE_FAZENDA"]), updatePlantioController);
router.delete("/:id", auth(["GERENTE_FAZENDA"]), deletePlantioController);

export default router;
