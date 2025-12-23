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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-3 flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header compacto */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg animate-pulse">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Gerador de Recibos</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm border border-indigo-100">
          {/* Barra decorativa */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"></div>

          <div className="p-4 md:p-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Grid principal - 2 colunas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:divide-x lg:divide-gray-200">
                {/* Coluna 1: Dados do Cliente */}
                <div className="space-y-3 lg:pr-4">
                  <h2 className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center border-b-2 border-indigo-100 pb-1.5">
                    <div className="bg-indigo-50 p-1 rounded-md mr-1.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    Dados do Cliente
                  </h2>

                  <div className="space-y-2.5">
                    <div className="group">
                      <label htmlFor="clienteNome" className="block text-xs font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="clienteNome"
                          name="clienteNome"
                          value={formData.clienteNome}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 pl-9 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all outline-none hover:border-indigo-300 hover:shadow-sm bg-gray-50 focus:bg-white"
                          placeholder="Ex: João da Silva"
                        />
                        <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="group">
                        <label htmlFor="clienteCpf" className="block text-xs font-medium text-gray-700 mb-1">
                          CPF/CNPJ
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="clienteCpf"
                            name="clienteCpf"
                            value={formData.clienteCpf}
                            onChange={handleCpfCnpjChange}
                            required
                            maxLength={18}
                            className="w-full px-3 py-2 pl-9 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all outline-none hover:border-indigo-300 hover:shadow-sm bg-gray-50 focus:bg-white"
                            placeholder="000.000.000-00"
                          />
                          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                        </div>
                      </div>

                      <div className="group">
                        <label htmlFor="dataEmissao" className="block text-xs font-medium text-gray-700 mb-1">
                          Data
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="dataEmissao"
                            name="dataEmissao"
                            value={formData.dataEmissao}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 pl-9 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all outline-none hover:border-indigo-300 hover:shadow-sm bg-gray-50 focus:bg-white"
                          />
                          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="clienteEndereco" className="block text-xs font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="clienteEndereco"
                          name="clienteEndereco"
                          value={formData.clienteEndereco}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 pl-9 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all outline-none hover:border-indigo-300 hover:shadow-sm bg-gray-50 focus:bg-white"
                          placeholder="Rua, Nº - Bairro - Cidade/UF"
                        />
                        <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Detalhes do Serviço */}
                <div className="space-y-3 lg:pl-4 lg:border-t-0 border-t-2 border-indigo-100 pt-4 lg:pt-0">
                  <h2 className="text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center border-b-2 border-indigo-100 pb-1.5">
                    <div className="bg-indigo-50 p-1 rounded-md mr-1.5">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Detalhes do Serviço
                  </h2>

                  <div className="space-y-2.5">
                    <div className="group">
                      <label htmlFor="valor" className="block text-xs font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="valor"
                          name="valor"
                          value={formData.valor}
                          onChange={handleValorChange}
                          required
                          className="w-full px-3 py-2 pl-9 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none hover:border-green-300 hover:shadow-sm bg-green-50 focus:bg-white font-semibold text-green-700"
                          placeholder="0,00"
                        />
                        <span className="absolute left-3 top-2.5 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold text-sm">R$</span>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="descricao" className="block text-xs font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all outline-none hover:border-indigo-300 hover:shadow-sm bg-gray-50 focus:bg-white resize-none"
                        placeholder="Descreva o serviço..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensagens e Botão */}
              <div className="space-y-2">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-lg flex items-start text-sm">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-3 py-2 rounded-lg flex items-start text-sm">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Recibo gerado com sucesso!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl flex items-center justify-center relative overflow-hidden group"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Gerar Recibo PDF
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer compacto */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-indigo-100 text-xs text-gray-700 hover:shadow-lg transition-all">
            <div className="bg-indigo-100 p-0.5 rounded-full mr-1.5">
              <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Dados do fornecedor carregados do .env
          </div>
        </div>
      </div>
    </main>
  )
}
