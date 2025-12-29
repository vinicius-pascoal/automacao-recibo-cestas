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
  logoBase64?: string
}

export function formatCpfCnpj(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')

  // CPF: 000.000.000-00
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  // CNPJ: 00.000.000/0000-00
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
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

  // Formatar CPF/CNPJ para exibição
  const clienteCpfCnpjFormatado = formatCpfCnpj(data.clienteCpf)
  const fornecedorCpfFormatado = formatCpfCnpj(data.fornecedorCpf)

  // Detectar se é CPF ou CNPJ
  const tipoDocumentoCliente = data.clienteCpf.replace(/\D/g, '').length <= 11 ? 'CPF' : 'CNPJ'

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
      position: relative;
      text-align: center;
      margin-bottom: 30px;
      min-height: 80px;
    }
    
    .logo {
      position: absolute;
      left: 0;
      top: 0;
      max-width: 120px;
      max-height: 80px;
      object-fit: contain;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      padding-top: 10px;
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
      ${data.logoBase64 ? `<img src="${data.logoBase64}" alt="Logo" class="logo" />` : ''}
      <h1>RECIBO</h1>
    </div>
    
    <div class="valor-header">
      Valor: <span class="valor-destaque">R$ ${data.valor}</span>
    </div>
    
    <div class="content">
      <p>
        Recebi de <strong>${data.clienteNome}</strong>, 
        ${tipoDocumentoCliente} nº <strong>${clienteCpfCnpjFormatado}</strong>, 
        residente em <strong>${data.clienteEndereco}</strong>, 
        a quantia de <strong>R$ ${data.valor} (${valorPorExtenso})</strong> 
        referente a <strong>${data.descricao}</strong>.
      </p>
      
      <div class="info-block">
        <strong>Dados do Fornecedor:</strong>
        Nome: ${data.fornecedorNome}<br>
        CPF: ${fornecedorCpfFormatado}<br>
        Endereço: ${data.fornecedorEndereco}<br>
        Telefone: ${data.fornecedorTelefone}<br>
        E-mail: ${data.fornecedorEmail}
      </div>
      
      <div class="info-block">
        <strong>Informações de Pagamento:</strong>
        Chave PIX: ${data.fornecedorPix}
      </div>
      
      <p style="text-align: right; margin-top: 30px;">
        Data: ${formatarDataLocal(data.dataEmissao)}
      </p>
    </div>
  </div>
</body>
</html>

  `
}

// Função para converter yyyy-MM-dd para data local corretamente
function formatarDataLocal(dataISO: string): string {
  // dataISO esperado: yyyy-MM-dd
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  if (!ano || !mes || !dia) return dataISO
  const data = new Date(ano, mes - 1, dia)
  return data.toLocaleDateString('pt-BR')
}
