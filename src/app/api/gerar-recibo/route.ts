import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { generateReciboHTML, ReciboData } from '@/lib/reciboTemplate'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Dados do cliente vindos do formulário
    const { clienteNome, clienteCpf, clienteEndereco, valor, descricao, dataEmissao } = body

    // Validações básicas
    if (!clienteNome || !clienteCpf || !clienteEndereco || !valor || !descricao || !dataEmissao) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Converter logo para base64
    let logoBase64: string | undefined
    try {
      const logoPath = path.join(process.cwd(), 'src', 'imgs', 'Cestaseafetos.jpg')
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath)
        logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`
      }
    } catch (error) {
      console.log('Logo não encontrada, continuando sem logo')
    }

    // Dados do fornecedor do .env
    const reciboData: ReciboData = {
      clienteNome,
      clienteCpf,
      clienteEndereco,
      valor,
      descricao,
      dataEmissao,
      fornecedorNome: process.env.FORNECEDOR_NOME || 'Nome do Fornecedor',
      fornecedorCpf: process.env.FORNECEDOR_CPF || '000.000.000-00',
      fornecedorEndereco: process.env.FORNECEDOR_ENDERECO || 'Endereço não configurado',
      fornecedorTelefone: process.env.FORNECEDOR_TELEFONE || '(00) 00000-0000',
      fornecedorEmail: process.env.FORNECEDOR_EMAIL || 'email@exemplo.com',
      fornecedorPix: process.env.FORNECEDOR_PIX || 'PIX não configurado',
      logoBase64,
    }

    // Gerar HTML do recibo
    const html = generateReciboHTML(reciboData)

    // Criar PDF com Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    })

    await browser.close()

    // Retornar PDF
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recibo_${clienteNome.replace(/\s/g, '_')}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar o recibo' },
      { status: 500 }
    )
  }
}
