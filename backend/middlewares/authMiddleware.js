import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

import prisma from '../prisma/client.js';
import dotenv from 'dotenv';
dotenv.config();


export const auth = (perfisPermitidos = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ mensagem: 'Não autorizado: Token não fornecido' });


    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.usuario.findUnique({ where: { id: decoded.id }, include: { perfil: true } });
      if (!user) return res.status(401).json({ mensagem: 'Usuário não encontrado' });


      if (decoded.tokenVersion !== user.tokenVersion) {
        return res.status(401).json({ mensagem: 'Token inválido (revogado)' });
      }


      if (perfisPermitidos.length > 0 && !perfisPermitidos.includes(user.perfil.nome)) {
        return res.status(403).json({ mensagem: 'Acesso negado para este perfil' });
      }


      req.usuario = { id: user.id, email: user.email, perfil: user.perfil };
      next();
    } catch (err) {
      return res.status(403).json({ mensagem: 'Token inválido' });
    }
  };
};