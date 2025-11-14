import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {JWT_SECRET} from '../config/jwt.js'
dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || 'troque_isto_por_env';
export const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP || '15m';
export const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);

export function generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
}

export function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshTokenExpiryDate() {
    const d = new Date();
    d.setDate(d.getDate() + REFRESH_TOKEN_DAYS);
    return d;
}