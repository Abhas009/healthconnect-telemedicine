import express from 'express';
import cors from 'cors';
import apptRoutes from './appointment.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apptRoutes);
app.get('/', (_req, res) => res.send('Appointment Service OK'));

const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`Appointment service listening on ${port}`));
