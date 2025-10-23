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
router.use(auth_1.authenticate, (0, roles_1.authorizeRoles)('MEMBER'));
router.get('/dashboard', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const profile = await client_1.default.profile.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, createdAt: true, role: true },
    });
    return res.json({
        profile,
        insights: {
            milestonesCompleted: 0,
            nextAppointment: null,
        },
    });
});
exports.default = router;
