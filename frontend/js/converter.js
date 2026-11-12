const fromInput = document.querySelector('#from');
const toInput = document.querySelector('#to');

// Inverte as moedas selecionadas.
document.querySelector('#trocar').addEventListener('click', () => {
    const previousFrom = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = previousFrom;
});
