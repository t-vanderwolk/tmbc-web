import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import mentorRoutes from './routes/mentor';
import memberRoutes from './routes/member';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.json({ status: 'ok', message: 'Taylor-Made Baby Co. API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/member', memberRoutes);

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 TMBC backend on port ${port}`);
});
