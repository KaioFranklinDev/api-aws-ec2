const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Criar tabelas (se não existirem)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_key TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            tel TEXT NOT NULL,
            password TEXT NOT NULL,
            cpf TEXT NOT NULL,
            stores TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS stores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS user_stores (
            user_id INTEGER NOT NULL,
            store_id INTEGER NOT NULL,
            role TEXT,
            PRIMARY KEY (user_id, store_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
        );
    `);
});

module.exports = db;
