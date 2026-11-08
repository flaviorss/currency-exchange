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
- Apresentar cotações e históricos de maneira independente para cada serviço.
- Analisar diferenças de desempenho, disponibilidade e comportamento entre as integrações.

## Escopo Funcional
O sistema terá três módulos principais.

Tela 01 — Conversor

Objetivo: realizar a mesma conversão utilizando REST e SOAP, apresentando os resultados lado a lado.

Funcionalidades:
- Seleção da moeda de origem.
- Seleção da moeda de destino.
- Campo para informar o valor.
- Inversão das moedas.
- Conversão utilizando REST.
- Conversão utilizando SOAP.
- Comparação dos resultados.
- Exibição do tempo de resposta de cada serviço.
- Exibição da diferença entre os valores retornados.

Tela 02 — Dashboard REST

Objetivo: apresentar uma visão geral das cotações e do comportamento histórico disponibilizado pelo serviço REST.

Funcionalidades:
- Seleção da moeda base.
- Seleção da moeda de comparação.
- Exibição da cotação atual.
- Gráfico de variação histórica.
- Filtros de período.
- Cotação máxima e mínima.
- Média da cotação no período.
- Variação percentual.

Tela 03 — Dashboard SOAP

Objetivo: apresentar as informações equivalentes, utilizando exclusivamente os dados obtidos pelo Web Service SOAP.

Funcionalidades:
- Seleção das moedas.
- Exibição da cotação atual.
- Gráfico de variação histórica.
- Filtros de período.
- Cotação máxima e mínima.
- Média da cotação no período.
- Variação percentual.
- Identificação da origem dos dados como SOAP.