"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const hashPassword_1 = require("../utils/hashPassword");
const generateToken_1 = require("../utils/generateToken");
const register = async (req, res) => {
    const { email, password, name, role = 'MEMBER', inviteCode } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!['ADMIN', 'MENTOR', 'MEMBER'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role supplied' });
    }
    try {
        const existing = await client_1.default.profile.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        let finalRole = role;
        if (role !== 'MEMBER') {
            if (!inviteCode) {
                return res.status(400).json({ message: 'Invite code required for elevated roles' });
            }
            const invite = await client_1.default.inviteCode.findUnique({ where: { code: inviteCode } });
            if (!invite || invite.used) {
                return res.status(400).json({ message: 'Invalid or already used invite code' });
            }
            await client_1.default.inviteCode.update({
                where: { id: invite.id },
                data: { used: true },
            });
        }
        else {
            finalRole = 'MEMBER';
        }
        const hashed = await (0, hashPassword_1.hashPassword)(password);
        const profile = await client_1.default.profile.create({
            data: {
                email,
                password: hashed,
                name,
                role: finalRole,
            },
        });
        const token = (0, generateToken_1.generateToken)({ id: profile.id, role: profile.role });
        return res.status(201).json({
            token,
            user: {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to register user' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const profile = await client_1.default.profile.findUnique({ where: { email } });
        if (!profile) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const valid = await (0, hashPassword_1.comparePassword)(password, profile.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, generateToken_1.generateToken)({ id: profile.id, role: profile.role });
        return res.json({
            token,
            user: {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to login' });
    }
};
exports.login = login;
const me = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const profile = await client_1.default.profile.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user: profile });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve profile' });
    }
};
exports.me = me;
