import express from 'express';
import { login } from '../controllers/adminController.js';

const router = express.Router();

router.post('/admin/login', login);

export default router;

