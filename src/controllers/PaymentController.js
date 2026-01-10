// src/controllers/PaymentController.js
import QRCode from 'qrcode';
import { PixService } from '../services/PixService.js';

const pixService = new PixService();

export class PaymentController {

    async createPayment(req, res) {
        // Dados que poderiam vir de um banco de dados ou do req.body
        const dadosPagamento = {
            chave: "SUA_CHAVE_PIX_AQUI", // Atualize aqui
            nome: "SEU NOME NO BANCO",   // Atualize aqui
            cidade: "SAO PAULO",
            txid: "REFAT" + Date.now(),
            valor: 0.01
        };

        try {
            const payload = pixService.generatePayload(
                dadosPagamento.chave,
                dadosPagamento.nome,
                dadosPagamento.cidade,
                dadosPagamento.txid,
                dadosPagamento.valor
            );

            // Gera a imagem (Controller cuida da apresentação)
            const qrImage = await QRCode.toDataURL(payload);

            res.send(`
                <div style="text-align:center; font-family: sans-serif; margin-top: 50px;">
                    <h1>Pagamento Refatorado</h1>
                    <p>Valor: R$ ${dadosPagamento.valor}</p>
                    <img src="${qrImage}" /><br/>
                    <small>TxID: ${dadosPagamento.txid}</small>
                </div>
            `);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno ao gerar Pix" });
        }
    }

    handleWebhook(req, res) {
        const { notificacao } = req.body;
        const segredo = req.headers['secret']; // Agora vem do header 'secret' que configuramos

        // Validação de segurança
        if (segredo !== 'MEU_SEGREDO_HACKER') {
            console.log("⛔ Tentativa não autorizada no webhook");
            return res.status(401).send();
        }

        console.log("--- 🔔 WEBHOOK ACIONADO ---");
        console.log("Raw:", notificacao);

        // Chama o service para extrair dados úteis
        const resultado = pixService.processNotification(notificacao);

        if (resultado.success) {
            console.log(`✅ PAGAMENTO CONFIRMADO: R$ ${resultado.valor}`);
            // AQUI entraria a chamada para salvar no Banco de Dados
        } else {
            console.log("⚠️ Notificação recebida, mas valor não identificado.");
        }

        return res.status(200).send({ status: "received" });
    }
}