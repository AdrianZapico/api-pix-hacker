// server.js
import express from 'express';
import paymentRoutes from './src/routes/paymentRoutes.js';
import cors from 'cors';

const app = express();

// Middlewares globais
app.use(express.json());

// Rotas
app.use('/api', paymentRoutes);
// Note: Adicionei um prefixo '/api' para organizar melhor.
// Agora as rotas serão: 
// GET  http://localhost:3000/api/pagar
// POST http://localhost:3000/api/webhook/android

//Cors
app.use(cors());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Refatorado rodando na porta ${PORT}`);
    console.log(`🔗 Rotas disponíveis em /api/pagar e /api/webhook/android`);
});