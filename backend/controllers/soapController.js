const {
    getSoapExchangeRate,
    UnsupportedPairError
} = require('../services/soapExchangeService');

async function convertCurrencySOAP(req, res) {
    const startTime = performance.now();

    try {
        const { from, to, amount } = req.body ?? {};

        // Validação dos dados
        if (!from || !to || amount === undefined) {
            return res.status(400).json({
                error: 'Informe as moedas e o valor.'
            });
        }

        const origin = String(from).toUpperCase();
        const destination = String(to).toUpperCase();
        const value = Number(amount);

        if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
            return res.status(400).json({
                error: 'Códigos de moedas inválidos.'
            });
        }

        if (!Number.isFinite(value) || value <= 0) {
            return res.status(400).json({
                error: 'Informe um valor positivo.'
            });
        }

        if (origin === destination) {
            return res.status(400).json({
                error: 'Selecione moedas diferentes.'
            });
        }

        // Consulta SOAP
        const quotation = await getSoapExchangeRate(origin, destination);

        // Calcula a conversão
        const convertedAmount = value * quotation.rate;

        const responseTime = performance.now() - startTime;

        return res.status(200).json({
            provider: 'Jazeera SOAP',
            from: origin,
            to: destination,
            amount: value,
            rate: quotation.rate,
            convertedAmount: Number(convertedAmount.toFixed(2)),
            responseTime: Number(responseTime.toFixed(2)),
            // Com ?debug=1 retorna o XML enviado e recebido (útil para o README)
            ...(req.query.debug === '1' && {
                xmlEnviado: quotation.rawRequest,
                xmlRecebido: quotation.rawResponse
            })
        });

    } catch (error) {
        // Serviço respondeu, mas não tem cotação para o par
        if (error instanceof UnsupportedPairError) {
            return res.status(422).json({
                error: error.message
            });
        }

        console.error('Erro SOAP:', error);

        return res.status(502).json({
            error: 'Não foi possível realizar a conversão SOAP.',
            details: error.message
        });
    }
}

module.exports = { convertCurrencySOAP };