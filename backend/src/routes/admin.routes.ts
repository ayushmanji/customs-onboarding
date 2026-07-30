import { Router } from 'express';
import { getAdminOverview, getAllUsers, getAllCustomers } from '../controllers/admin.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.get('/customers', getAllCustomers);

export default router;
