import express from 'express';
import EnvironmentController from '../controllers/environment.controller';

const router = express.Router({ mergeParams: true });
const controller = new EnvironmentController();

router.get('/', controller.getAll);

export default router;
