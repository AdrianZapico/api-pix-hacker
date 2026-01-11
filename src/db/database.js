// src/db/database.js
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./financeiro.db');

db.serialize(() => {
    // Criamos uma tabela mais genérica agora
    db.run(`
        CREATE TABLE IF NOT EXISTS transacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT,       -- Vai guardar 'ENTRADA' ou 'SAIDA'
            valor REAL,
            descricao TEXT,
            data DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

export default db;