const {
    getExchangeRate
} = require('../services/restExchangeService');

async function convertCurrency(req, res) {
    const startTimeREST = performance.now();

    try {
        const { from, to, amount } = req.body;

        // Validação dos campos
        if (!from || !to || amount === undefined) {
            return res.status(400).json({
                error: 'Informe as moedas e o valor.'
            });
        }

        const origin = String(from).toUpperCase();
        const destination = String(to).toUpperCase();
        const value = Number(amount);

        if (
            !/^[A-Z]{3}$/.test(origin) ||
            !/^[A-Z]{3}$/.test(destination)
        ) {
            return res.status(400).json({
                error: 'Informe códigos de moedas válidos.'
            });
        }

        if (!Number.isFinite(value) || value <= 0) {
            return res.status(400).json({
                error: 'O valor deve ser um número positivo.'
            });
        }

        // Consulta a cotação
        const quotation = await getExchangeRate(
            origin,
            destination
        );

        // Calcula a conversão
        const convertedAmount = value * quotation.rate;

        const responseTimeREST = performance.now() - startTimeREST;

        return res.status(200).json({
            provider: 'Frankfurter',
            from: origin,
            to: destination,
            amount: value,
            rate: quotation.rate,
            convertedAmount: Number(convertedAmount.toFixed(2)),
            date: quotation.date,
            time: Number(responseTimeREST.toFixed(2))
        });

    } catch (error) {
        console.error('Erro na conversão:', error.message);

        return res.status(502).json({
            error: 'Não foi possível realizar a conversão.',
            details: error.message
        });
    }
}

module.exports = { convertCurrency };