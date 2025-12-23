'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface FormData {
  clienteNome: string
  clienteCpf: string
  clienteEndereco: string
  valor: string
  descricao: string
  dataEmissao: string
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    clienteNome: '',
    clienteCpf: '',
    clienteEndereco: '',
    valor: '',
    descricao: 'Cestas básicas',
    dataEmissao: format(new Date(), 'yyyy-MM-dd'),
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatCurrency = (value: string) => {
    const numero = value.replace(/\D/g, '')
    const valorDecimal = (parseInt(numero) / 100).toFixed(2)
    return valorDecimal.replace('.', ',')
  }

  const formatCpfCnpj = (value: string) => {
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

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setFormData(prev => ({ ...prev, valor: formatted }))
  }

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value)
    setFormData(prev => ({ ...prev, clienteCpf: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/gerar-recibo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar recibo')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recibo_${formData.clienteNome.replace(/\s/g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Erro ao gerar o recibo. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Gerador de Recibos
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="clienteNome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente
              </label>
              <input
                type="text"
                id="clienteNome"
                name="clienteNome"
                value={formData.clienteNome}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label htmlFor="clienteCpf" className="block text-sm font-medium text-gray-700 mb-2">
                CPF/CNPJ do Cliente
              </label>
              <input
                type="text"
                id="clienteCpf"
                name="clienteCpf"
                value={formData.clienteCpf}
                onChange={handleCpfCnpjChange}
                required
                maxLength={18}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="CPF: 000.000.000-00 ou CNPJ: 00.000.000/0000-00"
              />
            </div>

            <div>
              <label htmlFor="clienteEndereco" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço do Cliente
              </label>
              <input
                type="text"
                id="clienteEndereco"
                name="clienteEndereco"
                value={formData.clienteEndereco}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Rua, Número - Bairro - Cidade/UF"
              />
            </div>

            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$)
              </label>
              <input
                type="text"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleValorChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Serviço
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Descrição do serviço prestado"
              />
            </div>

            <div>
              <label htmlFor="dataEmissao" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Emissão
              </label>
              <input
                type="date"
                id="dataEmissao"
                name="dataEmissao"
                value={formData.dataEmissao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Recibo gerado com sucesso!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Gerando...' : 'Gerar Recibo PDF'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Os dados do fornecedor são carregados automaticamente do arquivo .env</p>
        </div>
      </div>
    </main>
  )
}
