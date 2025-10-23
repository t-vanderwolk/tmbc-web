"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../prisma/client"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, roles_1.authorizeRoles)('ADMIN'));
router.get('/invites', async (_req, res) => {
    const invites = await client_1.default.inviteCode.findMany({
        include: {
            createdBy: {
                select: { id: true, email: true },
            },
        },
    });
    return res.json({ invites });
});
router.post('/invites', async (req, res) => {
    const { code } = req.body;
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!code) {
        return res.status(400).json({ message: 'Invite code required' });
    }
    const invite = await client_1.default.inviteCode.create({
        data: {
            code,
            createdById: req.user.id,
        },
    });
    return res.status(201).json({ invite });
});
router.patch('/invites/:id', async (req, res) => {
    const { id } = req.params;
    const invite = await client_1.default.inviteCode.update({
        where: { id },
        data: { used: true },
    });
    return res.json({ invite });
});
exports.default = router;
