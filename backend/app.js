import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import connectPgSimple from 'connect-pg-simple';

import authRotas from './routes/authRotas.js';
import appRoutes from './routes/appRoutes.js';

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const PgSession = connectPgSimple(session);

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // em dev use false
    sameSite: 'lax', 
    httpOnly: true 
  }
}));


// Rotas
app.use('/auth', authRotas);
app.use('/', appRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend online!' });
});

app.get('/health', (req, res) => res.status(200).json({ status: 'online' }));

app.use('/uploads', express.static(path.resolve('uploads')));

export default app;  // aqui exporta o app puro, sem serverless
