import express from 'express';
import environmentRouter from './routes/environment.router';
import {json} from 'body-parser';

const router = express.Router();

router.use('/', json({}));
router.use('/', environmentRouter);

export default router;
