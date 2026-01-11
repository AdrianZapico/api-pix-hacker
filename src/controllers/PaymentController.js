import QRCode from 'qrcode';
import { PixService } from '../services/PixService.js';
import db from '../db/database.js';

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
        // 1. Captura o 'tipo' que vem do MacroDroid (SAIDA ou ENTRADA)
        const { notificacao, tipo } = req.body;
        const segredo = req.headers['secret'];

        if (segredo !== 'MEU_SEGREDO_HACKER') {
            return res.status(401).send();
        }

        const resultado = pixService.processNotification(notificacao);

        if (resultado.success) {
            // 2. Se o MacroDroid disse que é SAIDA, usamos SAIDA. Se não, é ENTRADA.
            const tipoFinal = tipo || "ENTRADA";

            // 3. Muda a cor/texto do log dependendo do tipo
            if (tipoFinal === "SAIDA") {
                console.log(`💸 GASTO DETECTADO: - R$ ${resultado.valor}`);
            } else {
                console.log(`🤑 DINHEIRO ENTROU: + R$ ${resultado.valor}`);
            }

            // 4. Salva no banco com o tipo correto
            const sql = `INSERT INTO transacoes (tipo, valor, descricao) VALUES (?, ?, ?)`;
            db.run(sql, [tipoFinal, resultado.valor, resultado.raw], function (err) {
                if (err) {
                    console.error("Erro ao salvar:", err.message);
                } else {
                    console.log(`💾 Salvo no banco com ID: ${this.lastID}`);
                }
            });
        } else {
            console.log("⚠️ Notificação recebida, mas sem valor legível.");
        }

        return res.status(200).send({ status: "received" });
    }

    getHistory(req, res) {
        db.all("SELECT * FROM pagamentos ORDER BY data DESC", [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
    }
}