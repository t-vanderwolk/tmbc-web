"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const inviteRoutes_1 = __importDefault(require("./routes/inviteRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/invite', inviteRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`✅ TMBC backend running on port ${PORT}`);
});
