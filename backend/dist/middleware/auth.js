"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const roles_1 = require("../types/roles");
const parseCookieToken = (cookieHeader) => {
    if (!cookieHeader) {
        return undefined;
    }
    const tokenCookie = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith('token='));
    if (!tokenCookie) {
        return undefined;
    }
    return decodeURIComponent(tokenCookie.split('=')[1] ?? '');
};
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.substring('Bearer '.length)
        : undefined;
    const cookieToken = parseCookieToken(req.headers.cookie);
    const token = bearerToken ?? cookieToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: 'JWT secret not configured' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded.id || !(0, roles_1.isRole)(decoded.role)) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
