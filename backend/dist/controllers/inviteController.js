"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markInviteUsed = exports.validateInvite = exports.createInvite = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const client_1 = __importDefault(require("../prisma/client"));
const generateCode = () => node_crypto_1.default.randomBytes(4).toString('hex').toUpperCase();
const createInvite = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const code = generateCode();
        const invite = await client_1.default.inviteCode.create({
            data: {
                code,
                createdById: req.user.id,
            },
        });
        return res.status(201).json({ invite });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to create invite' });
    }
};
exports.createInvite = createInvite;
const validateInvite = async (req, res) => {
    const { code } = req.params;
    if (!code) {
        return res.status(400).json({ message: 'Invite code is required' });
    }
    try {
        const invite = await client_1.default.inviteCode.findUnique({ where: { code } });
        if (!invite || invite.used) {
            return res.status(404).json({ valid: false });
        }
        return res.json({ valid: true, invite });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to validate invite' });
    }
};
exports.validateInvite = validateInvite;
const markInviteUsed = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Invite code is required' });
    }
    try {
        const invite = await client_1.default.inviteCode.findUnique({ where: { code } });
        if (!invite || invite.used) {
            return res.status(404).json({ message: 'Invite not available' });
        }
        const updated = await client_1.default.inviteCode.update({
            where: { id: invite.id },
            data: { used: true },
        });
        return res.json({ invite: updated });
    }
    catch (error) {
        return res.status(500).json({ message: 'Unable to update invite' });
    }
};
exports.markInviteUsed = markInviteUsed;
