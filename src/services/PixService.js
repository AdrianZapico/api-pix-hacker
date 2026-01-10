// src/services/PixService.js

// Funções auxiliares (privadas ao arquivo)
function formatField(id, value) {
    const length = value.length.toString().padStart(2, "0");
    return `${id}${length}${value}`;
}

function computeCRC(payload) {
    payload += "6304";
    let polynomial = 0x1021;
    let crc = 0xffff;

    for (let i = 0; i < payload.length; i++) {
        let byte = payload.charCodeAt(i);
        crc ^= byte << 8;
        for (let j = 0; j < 8; j++) {
            let bit = (crc & 0x8000) !== 0;
            crc <<= 1;
            if (bit) crc ^= polynomial;
        }
        crc &= 0xffff;
    }
    return "6304" + crc.toString(16).toUpperCase().padStart(4, "0");
}

// AQUI ESTÁ O QUE FALTAVA: A exportação da Classe PixService
export class PixService {

    generatePayload(chave, nome, cidade, txid, valor) {
        const payloadKey =
            formatField("00", "br.gov.bcb.pix") +
            formatField("01", chave);

        let payload =
            formatField("00", "01") +
            formatField("26", payloadKey) +
            formatField("52", "0000") +
            formatField("53", "986") +
            formatField("54", valor.toFixed(2)) +
            formatField("58", "BR") +
            formatField("59", nome) +
            formatField("60", cidade) +
            formatField("62", formatField("05", txid));

        return payload + computeCRC(payload);
    }

    processNotification(text) {
        const valorMatch = text && text.match(/R\$\s?([\d,.]+)/);
        if (valorMatch) {
            return { success: true, valor: valorMatch[1] };
        }
        return { success: false };
    }
}