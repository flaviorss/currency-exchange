<div align="center"  >
    <h1 align="center" >
        Currency Exchange - WEB Services
        <br />
    </h1>
    <img src="https://skillicons.dev/icons?i=html" alt="">&nbsp;
    <img src="https://skillicons.dev/icons?i=css" alt="">&nbsp;
    <img src="https://skillicons.dev/icons?i=bootstrap" alt="">&nbsp;
    <img src="https://skillicons.dev/icons?i=nodejs" alt="">&nbsp;
    <img src="https://skillicons.dev/icons?i=express" alt="">
</div>

## Definição do Projeto
#### Plataforma de conversão e análise de moedas utilizando Web Services REST e SOAP.

O sistema tem como objetivo permitir que usuários realizem conversões entre moedas utilizando dois padrões distintos de comunicação, além de acompanhar cotações e analisar o comportamento histórico das moedas por meio de gráficos e indicadores.

Objetivos principais:
- Implementar o consumo de uma API REST pública.
- Implementar o consumo de um Web Service SOAP público baseado em WSDL.
- Comparar os resultados de conversões realizadas pelos dois serviços.
- Analisar diferenças de desempenho, disponibilidade e comportamento entre as integrações.

## Escopo Funcional
O sistema terá um único módulo principal (Conversor), que tem como objetivo, realizar a mesma conversão utilizando REST e SOAP e apresentar os resultados lado a lado.

Funcionalidades:
- Seleção da moeda de origem.
- Seleção da moeda de destino.
- Campo para informar o valor.
- Inversão das moedas.
- Conversão utilizando REST.
- Conversão utilizando SOAP.
- Comparação dos resultados.
- Exibição do tempo de resposta de cada serviço.
- Exibição do serviço mais rápido.

## APIs utilizadas

#### REST — Frankfurter
- Documentação oficial: https://frankfurter.dev
- Endpoint usado: `https://api.frankfurter.dev/v2/rate/{origem}/{destino}`
- Exemplo: `https://api.frankfurter.dev/v2/rate/usd/eur`

#### SOAP — Jazeera Airways
- Documentação/operação: https://webapp.jazeeraairways.com/J9Services/Service.asmx?op=GetExchangeRateData
- WSDL: https://webapp.jazeeraairways.com/J9Services/Service.asmx?WSDL
- Operação chamada: `ExchangeInfo`

## Exemplos de mensagens

#### JSON recebido da API REST
```json
{
  "date": "2026-11-12",
  "base": "USD",
  "quote": "EUR",
  "rate": 0.89987
}
```
#### XML enviado ao serviço SOAP
```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetExchangeRateData xmlns="http://jazeeraairways.com/webservices/">
      <FromCurrencyCode>USD</FromCurrencyCode>
      <ToCurrencyCode>EUR</ToCurrencyCode>
    </GetExchangeRateData>
  </soap:Body>
</soap:Envelope>
```

#### XML recebido do serviço SOAP
```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">
    <soap:Body>
        <GetExchangeRateDataResponse xmlns=\"http://jazeeraairways.com/webservices\">
            <GetExchangeRateDataResult>
                <FromCurrencyCode>USD</FromCurrencyCode>
                <ToCurrencyCode>EUR</ToCurrencyCode>
                <Rate>0.9053356</Rate>
            </GetExchangeRateDataResult>
        </GetExchangeRateDataResponse>
    </soap:Body>
</soap:Envelope>
```

## Como executar o projeto

### Pré-requisitos
- Node.js e npm instalados.

### Backend
1. Abra um terminal na pasta `backend`:
   ```bash
   cd backend
   ```
2. Crie o arquivo `.env` com base no exemplo:
   ```bash
   cp .env.example .env
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   O backend ficará disponível em `http://localhost:3000`.

### Frontend
Com o backend em execução, abra o arquivo `frontend/index.html` no navegador. Use o conversor para selecionar as moedas, informar o valor e comparar os resultados REST e SOAP.


