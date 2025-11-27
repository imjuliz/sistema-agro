import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import connectPgSimple from 'connect-pg-simple';
import cookieParser from "cookie-parser";
// rotas
import authRotas from './routes/authRotas.js';
import appRoutes from './routes/appRoutes.js';
import unidadeRoutes from './routes/unidadeRoutes.js';
// import matrizRoutes from './routes/MatrizRoutes.js';
import estoqueRoutes from './routes/estoqueRoutes.js';

dotenv.config({ path: ".env", quiet: true });

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();

// --- CORS DINÂMICO ---
const allowedOrigins = [
  "http://localhost:3000",
  "https://sistema-agro.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem "origin" (ex: Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {return callback(null, true);}

      else {
        console.warn("Origem bloqueada pelo CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

const PgSession = connectPgSimple(session);

app.use(session({
  store: new PgSession({conString: process.env.DATABASE_URL,}),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // em dev use false
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true 
  }
}));


// Rotas
app.use('/auth', authRotas);
app.use('/', appRoutes);
app.use('/unidades', unidadeRoutes);
// app.use('/matriz', matrizRoutes);
app.use('/estoque', estoqueRoutes)

app.get('/', (req, res) => {res.json({ message: 'Backend online!' });});

app.get('/health', (req, res) => res.status(200).json({ status: 'online' }));

app.use('/uploads', express.static(path.resolve('uploads')));

app.listen(8080, () => {
  console.log('Servidor rodando na http://localhost:8080',);
});

export default app;  // aqui exporta o app puro, sem serverless
