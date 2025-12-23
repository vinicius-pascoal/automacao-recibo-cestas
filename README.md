# 🧾 Gerador de Recibos Automatizado

Sistema completo desenvolvido em **Next.js + TypeScript** para geração automática de recibos em PDF. Ideal para profissionais autônomos, prestadores de serviço e pequenas empresas que precisam emitir recibos de forma rápida e profissional.

## ✨ Características

- 📝 Formulário intuitivo para preenchimento dos dados do cliente
- 💰 Conversão automática de valores numéricos para extenso
- 🎨 Template de recibo profissional e elegante
- 📄 Geração de PDF de alta qualidade
- 🔒 Dados do fornecedor protegidos em variáveis de ambiente
- 📱 Interface responsiva e moderna
- ⚡ Geração instantânea de PDFs

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React para aplicações web
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Puppeteer** - Geração de PDFs a partir de HTML
- **date-fns** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd automacao-recibo-cestas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com seus dados:
```env
FORNECEDOR_NOME=Seu Nome Completo
FORNECEDOR_CPF=000.000.000-00
FORNECEDOR_ENDERECO=Rua Exemplo, 123 - Bairro - Cidade/UF
FORNECEDOR_TELEFONE=(00) 00000-0000
FORNECEDOR_EMAIL=seu.email@exemplo.com
FORNECEDOR_PIX=seu-pix@exemplo.com
```

## 🎯 Como Usar

1. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

2. **Acesse a aplicação**

Abra seu navegador e acesse: `http://localhost:3000`

3. **Preencha o formulário**

- Nome do Cliente
- CPF do Cliente
- Endereço do Cliente
- Valor (será formatado automaticamente)
- Descrição do Serviço
- Data de Emissão

4. **Clique em "Gerar Recibo PDF"**

O arquivo PDF será gerado e baixado automaticamente para seu computador.

## 📁 Estrutura do Projeto

```
automacao-recibo-cestas/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── gerar-recibo/
│   │   │       └── route.ts          # API para geração do PDF
│   │   ├── globals.css               # Estilos globais
│   │   ├── layout.tsx                # Layout da aplicação
│   │   └── page.tsx                  # Página principal com formulário
│   └── lib/
│       └── reciboTemplate.ts         # Template HTML do recibo
├── .env.example                      # Exemplo de variáveis de ambiente
├── .gitignore                        # Arquivos ignorados pelo Git
├── next.config.js                    # Configuração do Next.js
├── package.json                      # Dependências do projeto
├── postcss.config.js                 # Configuração do PostCSS
├── tailwind.config.ts                # Configuração do Tailwind CSS
└── tsconfig.json                     # Configuração do TypeScript
```

## 🎨 Funcionalidades do Template

O recibo gerado contém:

- ✅ Cabeçalho profissional com título "RECIBO"
- ✅ Valor em destaque (numeral e por extenso)
- ✅ Dados completos do cliente
- ✅ Dados completos do fornecedor
- ✅ Descrição detalhada do serviço
- ✅ Informações para pagamento (PIX)
- ✅ Data de emissão
- ✅ Linha para assinatura
- ✅ Nota legal sobre validade do documento

## 🔐 Segurança

- Os dados do fornecedor são armazenados em variáveis de ambiente (`.env`)
- O arquivo `.env` está incluído no `.gitignore` e não será versionado
- Nunca compartilhe seu arquivo `.env` com terceiros

## 🏗️ Build para Produção

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start
```

## 🐛 Solução de Problemas

### Erro ao gerar PDF

Se encontrar erros relacionados ao Puppeteer, tente:

```bash
# Reinstalar dependências
rm -rf node_modules
npm install

# No Windows, pode ser necessário instalar as dependências do Chrome
npm install puppeteer --force
```

### Valores de ambiente não carregados

Certifique-se de que:
1. O arquivo `.env` está na raiz do projeto
2. O servidor foi reiniciado após editar o `.env`
3. As variáveis não possuem espaços extras

## 📝 Personalização

### Modificar o template do recibo

Edite o arquivo [src/lib/reciboTemplate.ts](src/lib/reciboTemplate.ts) para alterar:
- Layout
- Cores
- Fontes
- Textos
- Estrutura

### Adicionar novos campos

1. Adicione o campo no formulário ([src/app/page.tsx](src/app/page.tsx))
2. Atualize a interface `ReciboData` ([src/lib/reciboTemplate.ts](src/lib/reciboTemplate.ts))
3. Inclua o campo no template HTML
4. Atualize a API ([src/app/api/gerar-recibo/route.ts](src/app/api/gerar-recibo/route.ts))

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e comercial.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas, abra uma issue no repositório.

---
