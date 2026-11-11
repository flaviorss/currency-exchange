const soap = require('soap');

// No WSDL (.asmx), a operação se chama "ExchangeInfo", mas a mensagem SOAP
// trocada com o servidor usa MessageName="GetExchangeRateData".
// O node-soap indexa pelo nome da operação do WSDL, por isso usamos ExchangeInfo.
const OPERATION_NAME = 'ExchangeInfo';

let clientPromise;

// Erro específico: o serviço respondeu, mas não possui cotação para o par
class UnsupportedPairError extends Error {
    constructor(from, to) {
        super(`O serviço não possui cotação para ${from} → ${to}.`);
        this.name = 'UnsupportedPairError';
    }
}

// Cria o cliente SOAP uma única vez e reaproveita nas próximas chamadas
async function getSoapClient() {
    if (!process.env.SOAP_WSDL_URL) {
        throw new Error('Variável SOAP_WSDL_URL não configurada no .env.');
    }

    if (!clientPromise) {
        clientPromise = soap
            .createClientAsync(process.env.SOAP_WSDL_URL)
            .catch(error => {
                clientPromise = null; // permite tentar de novo na próxima requisição
                throw error;
            });
    }

    return clientPromise;
}

// Localiza a operação no WSDL, independente de como o node-soap a expõe.
// Procura em client.describe() -> Service -> Port -> Operation
function findOperation(client, operationName) {
    const description = client.describe();
    const available = [];

    for (const serviceName of Object.keys(description)) {
        for (const portName of Object.keys(description[serviceName])) {
            const operations = Object.keys(description[serviceName][portName]);
            available.push(`${serviceName}.${portName}: ${operations.join(', ')}`);

            if (operations.includes(operationName)) {
                const port = client[serviceName][portName];
                const operation = port[operationName];

                if (typeof operation !== 'function') {
                    throw new Error(
                        `Operação "${operationName}" existe no WSDL, mas não está disponível no cliente.`
                    );
                }

                // Usa a versão com callback (sempre presente) e converte em Promise
                return (args, options) =>
                    new Promise((resolve, reject) => {
                        operation.call(
                            port,
                            args,
                            (err, result) => (err ? reject(err) : resolve([result])),
                            options
                        );
                    });
            }
        }
    }

    throw new Error(
        `Operação "${operationName}" não encontrada no WSDL. ` +
        `Disponíveis -> ${available.join(' | ') || 'nenhuma'}`
    );
}

async function getSoapExchangeRate(from, to) {
    const client = await getSoapClient();

    const parameters = {
        FromCurrencyCode: from,
        ToCurrencyCode: to
    };

    // Executa a operação SOAP
    const getExchangeRateData = findOperation(client, OPERATION_NAME);

    const [response] = await getExchangeRateData(
        parameters,
        { timeout: 10000 }
    );

    const result = response?.GetExchangeRateDataResult;

    if (!result || result.Rate === undefined) {
        throw new Error('Resposta SOAP inválida.');
    }

    const rate = Number(result.Rate);

    if (!Number.isFinite(rate) || rate < 0) {
        throw new Error('Cotação SOAP inválida.');
    }

    // O serviço devolve Rate = 0 quando não suporta a moeda
    if (rate === 0) {
        throw new UnsupportedPairError(from, to);
    }

    return {
        from: result.FromCurrencyCode,
        to: result.ToCurrencyCode,
        rate,
        // XML bruto (usado apenas no modo debug; pode se misturar
        // entre requisições simultâneas, serve para testes/README)
        rawRequest: client.lastRequest,
        rawResponse: client.lastResponse
    };
}

module.exports = { getSoapExchangeRate, UnsupportedPairError };