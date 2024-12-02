const express = require('express')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');
const db = require('./src/database/database');
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.post('/create/user', async (req, res) => {
    const { name, email, tel, cpf, password, stores } = req.body;

    // Verifica se todos os campos estão presentes
    if (!name || !email || !tel || !cpf || !password || !stores) {
        return res.status(400).json({ error: 'Algum dado está faltando!' });
    }

    // Validação simples do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido!' });
    }

    try {
        // Gera um UUID
        const uuid = uuidv4();

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Consulta para inserir usuário
        const query = 'INSERT INTO users (id_key, name, email, tel, cpf, password, stores) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.run(query, [uuid, name, email, tel, cpf, hashedPassword, JSON.stringify(stores)], function (err) {
            if (err) {
                console.error('Erro ao executar a query:', err.message);
                return res.status(500).json({ error: 'Erro ao adicionar usuário' });
            }
            return res.status(201).json({ id: this.lastID, name, email });
        });
    } catch (error) {
        console.error('Erro no servidor:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
})