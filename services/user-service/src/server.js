import express from 'express';
import cors from 'cors';
import authRoutes from './auth.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.get('/', (_req, res) => res.send('User Service OK'));

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`User service listening on ${port}`));
