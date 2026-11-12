const form = document.querySelector('#conversionForm');
const amountInput = document.querySelector('#amount');
const convertButton = document.querySelector('#converter');

const results = {
    rest: {
        value: document.querySelector('#rest-valor'),
        time: document.querySelector('#rest-tempo'),
        rate: document.querySelector('#rest-cotacao')
    },
    soap: {
        value: document.querySelector('#soap-valor'),
        time: document.querySelector('#soap-tempo'),
        rate: document.querySelector('#soap-cotacao')
    }
};

const differenceOutput = document.querySelector('#diferenca');
const fastestOutput = document.querySelector('#mais-rapido');

function formatCurrency(value, currency) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency
    }).format(value);
}

async function requestConversion(url, payload, timeField) {
    const startedAt = performance.now();
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Não foi possível realizar a conversão.');
    }

    // Usa o tempo medido no cliente para comparar o tempo total percebido
    // pelo usuário em cada chamada.
    data.comparisonTime = performance.now() - startedAt;
    data.timeLabel = timeField;
    return data;
}

function showServiceError(output, error) {
    output.value.textContent = 'Erro';
    output.time.textContent = '—';
    output.rate.textContent = error.message;
}

function showResult(output, data, timeLabel) {
    output.value.textContent = formatCurrency(data.convertedAmount, data.to);
    output.time.textContent = `${data[timeLabel]} ms`;
    output.rate.textContent = `1 ${data.from} = ${data.rate} ${data.to}`;
}

function showComparison(rest, soap) {
    const difference = Math.abs(rest.convertedAmount - soap.convertedAmount);
    differenceOutput.textContent = formatCurrency(difference, rest.to);

    if (rest.comparisonTime === soap.comparisonTime) {
        fastestOutput.textContent = 'Os serviços tiveram o mesmo tempo de resposta.';
        return;
    }

    const fastest = rest.comparisonTime < soap.comparisonTime ? 'REST' : 'SOAP';
    fastestOutput.textContent = `${fastest} respondeu mais rápido.`;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const from = document.querySelector('#from').value;
    const to = document.querySelector('#to').value;
    const amount = Number(amountInput.value);

    if (from === to) {
        alert('Selecione moedas diferentes.');
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert('Informe um valor válido.');
        return;
    }

    const payload = { from, to, amount };
    differenceOutput.textContent = '—';
    fastestOutput.textContent = '';
    Object.values(results).forEach((output) => {
        output.value.textContent = 'Consultando...';
        output.time.textContent = '—';
        output.rate.textContent = 'Aguardando resposta...';
    });

    convertButton.disabled = true;
    convertButton.textContent = 'Convertendo...';

    try {
        // As duas chamadas usam os mesmos dados e começam em paralelo.
        const [restResult, soapResult] = await Promise.allSettled([
            requestConversion('http://localhost:3000/api/convert', payload, 'time'),
            requestConversion('http://localhost:3000/api/soap/convert', payload, 'responseTime')
        ]);

        if (restResult.status === 'fulfilled') {
            showResult(results.rest, restResult.value, 'time');
        } else {
            showServiceError(results.rest, restResult.reason);
        }

        if (soapResult.status === 'fulfilled') {
            showResult(results.soap, soapResult.value, 'responseTime');
        } else {
            showServiceError(results.soap, soapResult.reason);
        }

        if (restResult.status === 'fulfilled' && soapResult.status === 'fulfilled') {
            showComparison(restResult.value, soapResult.value);
        } else {
            differenceOutput.textContent = 'Indisponível: ambos os serviços precisam responder.';
            fastestOutput.textContent = '';
        }
    } finally {
        convertButton.disabled = false;
        convertButton.textContent = 'Converter';
    }
});
