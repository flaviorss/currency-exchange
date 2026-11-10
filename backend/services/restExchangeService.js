const API_URL = 'https://api.frankfurter.dev/v2';

async function getExchangeRate(from, to) {
    const url = `${API_URL}/rate/${from}/${to}`;

    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.message || 'Não foi possível consultar a cotação.'
        );
    }

    return await response.json();
}

module.exports = { getExchangeRate };