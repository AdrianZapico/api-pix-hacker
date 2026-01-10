# 💸 API Pix Hacker (Taxa Zero)

Uma API RESTful desenvolvida em Node.js que gera cobranças Pix Nativas (padrão EMV BR Code) e processa confirmações de pagamento via Webhook Android, eliminando intermediários e taxas por transação.

> **Status:** 🚀 Funcional (MVP Refatorado)

## 🧠 A Engenharia por trás
Diferente de APIs tradicionais que dependem de gateways (Mercado Pago, Stripe), este projeto implementa:
1.  **Geração Manual de Payload:** Implementação pura do algoritmo **CRC16-CCITT** e estruturação TLV (Tag-Length-Value) conforme manual do Banco Central.
2.  **Gateway Mobile:** Utiliza um dispositivo Android como "escuta" bancária via notificações push.
3.  **Arquitetura MSC:** Refatorado em Camadas (Model-Service-Controller) para escalabilidade.

## 🛠️ Tecnologias
- **Node.js & Express**: Servidor Backend.
- **QRCode**: Geração visual da cobrança.
- **Ngrok**: Túnel para expor o localhost à internet.
- **MacroDroid**: Automação Android para interceptar notificações bancárias.

## 📂 Estrutura do Projeto
```bash
api-pix-hacker/
├── src/
│   ├── controllers/   # Gerencia Requisições e Respostas
│   ├── services/      # Lógica Matemática (CRC16) e Regras de Negócio
│   └── routes/        # Definição dos Endpoints
├── server.js          # Ponto de entrada (Entry Point)
└── package.json