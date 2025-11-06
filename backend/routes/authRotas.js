import express from "express";
import { cadastrarSeController, loginController, esqSenhaController, codigoController, updateSenhaController } from "../controllers/UserController.js";

const router = express.Router();

router.post("/cadastrar", cadastrarSeController);

router.post("/login", loginController);

router.post("/esqSenha", esqSenhaController);

router.post("/codigo", codigoController);

router.put("/updateSenha/:codigo", updateSenhaController);

router.get("/teste", (req, res) => {res.json({ message: "Rota /auth/teste funcionando!" });});

export default router;
