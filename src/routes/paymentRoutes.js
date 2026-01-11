// src/routes/paymentRoutes.js
import express from 'express';
import { PaymentController } from '../controllers/PaymentController.js';

const router = express.Router();
const controller = new PaymentController();

// Definindo as rotas e ligando aos métodos do controller
// Atenção ao bind ou arrow function para manter o 'this'
router.get('/pagar', (req, res) => controller.createPayment(req, res));
router.get('/historico', (req, res) => controller.getHistory(req, res));
router.post('/webhook/android', (req, res) => controller.handleWebhook(req, res));

export default router;