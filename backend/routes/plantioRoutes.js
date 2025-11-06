import { getPlantioController, getPlantioCategoriaController, createPlantioController, updatePlantioController, deletePlantioController } from "../controllers/PlantioController.js";
import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", auth(["gerente_matriz", "gerente_fazenda"]), getPlantioController);
router.get("/categoria/:categoria", auth(["gerente_matriz", "gerente_fazenda"]), getPlantioCategoriaController);
router.post("/", auth(["gerente_fazenda"]), createPlantioController);
router.put("/:id", auth(["gerente_fazenda"]), updatePlantioController);
router.delete("/:id", auth(["gerente_fazenda"]), deletePlantioController);

export default router;