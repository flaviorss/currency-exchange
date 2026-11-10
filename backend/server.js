require('dotenv').config();

const express = require('express');
const cors = require('cors');

const conversionRoutes = require('./routes/conversionRoutes');

const soapRoutes = require('./routes/soapRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        message: 'Currency Exchange API funcionando!'
    });
});

// Trata JSON malformado enviado no body
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido no corpo da requisição.' });
    }
    next(err);
});

// Rotas de conversão
app.use('/api', conversionRoutes);
app.use('/api/soap', soapRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});