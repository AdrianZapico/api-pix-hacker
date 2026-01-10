// Arquivo: server.js
import express from 'express';
import QRCode from 'qrcode';
import { gerarPix } from './pix.js';

const app = express();
app.use(express.json());

// --- ROTA 1: CRIAR COBRANÇA ---
app.get('/pagar', async (req, res) => {
    // Dados fixos (Simulando sua conta)
    const minhaChave = "SUA_CHAVE_PIX_AQUI"; // Pode ser CPF, Email, Aleatória
    const meuNome = "SEU NOME NO BANCO";     // Tem que ser igual ao do banco, sem acentos ajuda
    const minhaCidade = "SAO PAULO";         // Sua cidade

    // Vamos cobrar R$ 0.01 para teste
    const valor = 0.01;
    const txid = "TESTE" + Date.now(); // ID único baseado na hora atual

    try {
        const codigoPix = gerarPix(minhaChave, meuNome, minhaCidade, txid, valor);

        // Gera a imagem do QR Code para exibir no navegador
        const qrImage = await QRCode.toDataURL(codigoPix);

        // Retorna um HTML simples pra você testar visualmente
        res.send(`
            <div style="text-align:center; font-family: sans-serif; margin-top: 50px;">
                <h1>Pagamento Pix Hacker</h1>
                <p>Valor: R$ ${valor}</p>
                <img src="${qrImage}" /><br/><br/>
                <textarea rows="4" cols="50">${codigoPix}</textarea><br/>
                <p>Abra o app do seu banco e tente ler este QR Code (Não pague ainda, só veja se lê).</p>
            </div>
        `);
    } catch (e) {
        console.error(e);
        res.status(500).send("Erro ao gerar Pix");
    }
});

// --- ROTA 2: O OUVIDO (Webhook) ---
// É aqui que o MacroDroid vai bater quando chegar notificação
app.post('/webhook/android', (req, res) => {
    const { notificacao } = req.body;
    const segredo = req.headers['secret'];

    // Segurança simples pra ninguém zoar sua API
    if (segredo !== 'MEU_SEGREDO_HACKER') {
        console.log("Tentativa de acesso não autorizado!");
        return res.status(401).send();
    }

    console.log("====================================");
    console.log("🔔 NOTIFICAÇÃO RECEBIDA DO CELULAR!");
    console.log("Mensagem:", notificacao);

    // Tentar ler o valor (Exemplo: "Você recebeu uma transferência de R$ 10,00")
    // O Regex procura por números depois do cifrão
    const valorMatch = notificacao && notificacao.match(/R\$\s?([\d,.]+)/);

    if (valorMatch) {
        console.log(`🤑 PAGAMENTO DETECTADO: R$ ${valorMatch[1]}`);
    } else {
        console.log("🤔 Não consegui ler o valor. Ajuste o Regex.");
    }
    console.log("====================================");

    res.send("Recebido");
});

app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));