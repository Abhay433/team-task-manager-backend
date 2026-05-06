import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import authMiddleware from '../AuthMiddleware.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

export default router;
