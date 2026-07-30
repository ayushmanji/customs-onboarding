import { Router } from 'express';
import {
  onboardCustomer,
  getBrokerCustomers,
  getCustomerById,
  verifyGstin,
} from '../controllers/customer.controller';
import { validateRequest } from '../middleware/validate';
import { customerOnboardingSchema, verifyGstinSchema } from '../schemas/validation.schemas';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/onboard', validateRequest(customerOnboardingSchema), onboardCustomer);
router.post('/', validateRequest(customerOnboardingSchema), onboardCustomer);
router.get('/', getBrokerCustomers);
router.get('/:id', getCustomerById);
router.post('/verify-gstin', validateRequest(verifyGstinSchema), verifyGstin);

export default router;
