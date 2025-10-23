"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const roles_1 = require("../types/roles");
const router = (0, express_1.Router)();
const createToken = (id, role) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret not configured');
    }
    return jsonwebtoken_1.default.sign({ id, role }, secret, { expiresIn: '7d' });
};
router.post('/register', async (req, res) => {
    const { email, password, name, role, inviteCode } = req.body;
    const normalizedRole = (0, roles_1.isRole)(role) ? role : 'MEMBER';
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const existing = await client_1.default.profile.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
    }
    if (normalizedRole !== 'MEMBER') {
        if (!inviteCode) {
            return res.status(400).json({ message: 'Invite code required for elevated roles' });
        }
        const invite = await client_1.default.inviteCode.findUnique({ where: { code: inviteCode } });
        if (!invite || invite.used) {
            return res.status(400).json({ message: 'Invalid invite code' });
        }
        await client_1.default.inviteCode.update({
            where: { id: invite.id },
            data: { used: true },
        });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const profile = await client_1.default.profile.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: normalizedRole,
        },
    });
    const token = createToken(profile.id, profile.role);
    return res.status(201).json({
        token,
        profile: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
        },
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const profile = await client_1.default.profile.findUnique({ where: { email } });
    if (!profile) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, profile.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = createToken(profile.id, profile.role);
    return res.json({
        token,
        profile: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
        },
    });
});
router.post('/logout', (_, res) => {
    return res.json({ message: 'Logged out' });
});
exports.default = router;
