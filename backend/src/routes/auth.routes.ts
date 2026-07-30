import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate';
import { registerBrokerSchema, loginSchema } from '../schemas/validation.schemas';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', validateRequest(registerBrokerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authenticateToken, getMe);

export default router;
