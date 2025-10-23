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
router.use(auth_1.authenticate, (0, roles_1.authorizeRoles)('MENTOR'));
router.get('/mentees', async (_req, res) => {
    const mentees = await client_1.default.profile.findMany({
        where: { role: 'MEMBER' },
        select: { id: true, email: true, name: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });
    return res.json({ mentees });
});
exports.default = router;
