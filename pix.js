// Arquivo: pix.js
// Função auxiliar para formatar campos TLV (Tag, Length, Value)
function formatField(id, value) {
    const length = value.length.toString().padStart(2, "0");
    return `${id}${length}${value}`;
}

// O famoso CRC16-CCITT (0xFFFF) que valida se o Pix é legítimo
function computeCRC(payload) {
    // Adiciona o ID do CRC (63) e o tamanho (04) para o cálculo
    payload += "6304";

    let polynomial = 0x1021;
    let crc = 0xffff;

    for (let i = 0; i < payload.length; i++) {
        let byte = payload.charCodeAt(i);
        crc ^= byte << 8;
        for (let j = 0; j < 8; j++) {
            let bit = (crc & 0x8000) !== 0;
            crc <<= 1;
            if (bit) {
                crc ^= polynomial;
            }
        }
        crc &= 0xffff;
    }

    // Retorna o valor em Hexa maiúsculo
    return "6304" + crc.toString(16).toUpperCase().padStart(4, "0");
}

// Função principal que monta a string do Pix
export function gerarPix(chave, nome, cidade, txid, valor) {
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