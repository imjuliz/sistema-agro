import express from "express";
import { cadastrarSeController, loginController, esqSenhaController, codigoController, updateSenhaController } from "../controllers/UserController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/cadastrar", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), cadastrarSeController);
router.post("/login", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), loginController);
router.post("/esqSenha", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), esqSenhaController);
router.post("/codigo", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), codigoController);
router.put("/updateSenha/:codigo", auth(["gerente_matriz", "gerente_fazenda", "gerente_loja"]), updateSenhaController);

router.get("/teste", (req, res) => {
  res.json({ message: "Rota /auth/teste funcionando!" });
});

export default router;
