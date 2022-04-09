import express from 'express';
import environmentRouter from './routes/environment.router';

const router = express.Router();

router.use('/', environmentRouter);

export default router;
