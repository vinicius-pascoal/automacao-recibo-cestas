export interface ReciboData {
  clienteNome: string
  clienteCpf: string
  clienteEndereco: string
  valor: string
  descricao: string
  dataEmissao: string
  fornecedorNome: string
  fornecedorCpf: string
  fornecedorEndereco: string
  fornecedorTelefone: string
  fornecedorEmail: string
  fornecedorPix: string
}

export function numberToWords(numero: number): string {
  if (numero === 0) return 'zero'

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
  const dezADezenove = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']

  function converterGrupo(n: number): string {
    if (n === 0) return ''
    if (n === 100) return 'cem'

    let resultado = ''

    const c = Math.floor(n / 100)
    const d = Math.floor((n % 100) / 10)
    const u = n % 10

    if (c > 0) {
      resultado += centenas[c]
      if (d > 0 || u > 0) resultado += ' e '
    }

    if (d === 1) {
      resultado += dezADezenove[u]
    } else {
      if (d > 0) {
        resultado += dezenas[d]
        if (u > 0) resultado += ' e '
      }
      if (u > 0 || (d === 0 && c === 0)) {
        resultado += unidades[u]
      }
    }

    return resultado
  }

  let parteInteira = Math.floor(numero)
  const parteDecimal = Math.round((numero - parteInteira) * 100)

  let resultado = ''

  if (parteInteira >= 1000000) {
    const milhoes = Math.floor(parteInteira / 1000000)
    resultado += converterGrupo(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões')
    parteInteira %= 1000000
    if (parteInteira > 0) resultado += ' '
  }

  if (parteInteira >= 1000) {
    const milhares = Math.floor(parteInteira / 1000)
    resultado += converterGrupo(milhares) + ' mil'
    parteInteira %= 1000
    if (parteInteira > 0) resultado += ' '
  }

  if (parteInteira > 0) {
    resultado += converterGrupo(parteInteira)
  }

  resultado += parteInteira === 1 ? ' real' : ' reais'

  if (parteDecimal > 0) {
    resultado += ' e ' + converterGrupo(parteDecimal) + (parteDecimal === 1 ? ' centavo' : ' centavos')
  }

  return resultado.trim()
}

export function generateReciboHTML(data: ReciboData): string {
  const valorNumerico = parseFloat(data.valor.replace(',', '.'))
  const valorPorExtenso = numberToWords(valorNumerico)

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: white;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #000;
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    
    .valor-header {
      font-size: 18px;
      margin: 20px 0;
      text-align: center;
    }
    
    .valor-destaque {
      font-weight: bold;
      font-size: 22px;
    }
    
    .content {
      line-height: 1.8;
      font-size: 14px;
      text-align: justify;
    }
    
    .content p {
      margin-bottom: 15px;
    }
    
    .info-block {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-left: 4px solid #333;
    }
    
    .info-block strong {
      display: block;
      margin-bottom: 5px;
    }
    
    .assinatura {
      margin-top: 60px;
      text-align: center;
    }
    
    .linha-assinatura {
      border-top: 1px solid #000;
      width: 300px;
      margin: 0 auto 10px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      font-size: 12px;
      text-align: center;
      color: #666;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .container {
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RECIBO</h1>
    </div>
    
    <div class="valor-header">
      Valor: <span class="valor-destaque">R$ ${data.valor}</span>
    </div>
    
    <div class="content">
      <p>
        Recebi de <strong>${data.clienteNome}</strong>, 
        CPF nº <strong>${data.clienteCpf}</strong>, 
        residente em <strong>${data.clienteEndereco}</strong>, 
        a quantia de <strong>R$ ${data.valor} (${valorPorExtenso})</strong> 
        referente a <strong>${data.descricao}</strong>.
      </p>
      
      <div class="info-block">
        <strong>Dados do Fornecedor:</strong>
        Nome: ${data.fornecedorNome}<br>
        CPF: ${data.fornecedorCpf}<br>
        Endereço: ${data.fornecedorEndereco}<br>
        Telefone: ${data.fornecedorTelefone}<br>
        E-mail: ${data.fornecedorEmail}
      </div>
      
      <div class="info-block">
        <strong>Informações de Pagamento:</strong>
        Chave PIX: ${data.fornecedorPix}
      </div>
      
      <p>
        Para maior clareza, firmo o presente recibo para que produza os seus efeitos legais.
      </p>
      
      <p style="text-align: right; margin-top: 30px;">
        Data: ${new Date(data.dataEmissao).toLocaleDateString('pt-BR')}
      </p>
    </div>
    
    <div class="footer">
      <p>Este documento possui validade legal conforme Art. 999 do Código Civil Brasileiro</p>
    </div>
  </div>
</body>
</html>
  `
}
