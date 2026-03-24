import express from 'express';
import { registerAdmin, loginRequest, verifyLogin, verifyRegistration } from '../Controllers/authController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/verify-registration', verifyRegistration);
router.post('/login', loginRequest);
router.post('/verify-login', verifyLogin);

export default router;
