"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteToMentor = exports.listUsers = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const listUsers = async (_req, res) => {
    try {
        const users = await client_1.default.profile.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ users });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to fetch users' });
    }
};
exports.listUsers = listUsers;
const promoteToMentor = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'User id is required' });
    }
    try {
        const updated = await client_1.default.profile.update({
            where: { id },
            data: { role: 'MENTOR' },
            select: { id: true, email: true, name: true, role: true },
        });
        return res.json({ user: updated });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to promote user' });
    }
};
exports.promoteToMentor = promoteToMentor;
