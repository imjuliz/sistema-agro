import { getEstoquesController, getEstoquePorIdController, createEstoqueController, updateEstoqueController, deleteEstoqueController } from "../controllers/EstoqueController.js";
import express from "express";

const router = express.Router();

router.get("/", getEstoquesController); 
router.get("/:id", getEstoquePorIdController);
router.post("/", createEstoqueController);
router.put("/:id", updateEstoqueController);
router.delete("/:id", deleteEstoqueController);