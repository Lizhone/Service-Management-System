import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.post('/staff/login', authController.staffLogin);

export default router;
