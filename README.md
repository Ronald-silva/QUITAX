# Quitax - Gerenciador de Quitação de Moto

Aplicativo web mobile-first para gerenciar e motivar a quitação de uma moto comprada diretamente, sem juros.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **shadcn/ui** como sistema de componentes
- **Lucide React** para ícones

### Backend
- **Google Apps Script** como API intermediária
- **Google Sheets** como banco de dados na nuvem

## 📁 Estrutura do Projeto

```
Quitax/
├── backend/
│   └── google-apps-script.js    # Script para Google Sheets
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes UI reutilizáveis
│   │   │   ├── ui/             # Componentes base (Button, Card, etc.)
│   │   │   ├── Header.tsx
│   │   │   ├── FinancialSummary.tsx
│   │   │   ├── CountdownCard.tsx
│   │   │   ├── OpportunityCostCard.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/
│   │   │   └── utils.ts        # Utilitários (cn helper)
│   │   ├── types/
│   │   │   └── index.ts        # Tipos TypeScript
│   │   ├── App.tsx             # Componente principal
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Design system (CSS variables)
│   ├── tailwind.config.ts      # Configuração Tailwind
│   ├── tsconfig.json           # Configuração TypeScript
│   ├── vite.config.ts          # Configuração Vite
│   └── package.json
└── README.md
```

## 🎨 Design System

O projeto utiliza um design system completo baseado em tokens CSS:

### Cores Principais
- **Primary (Emerald)**: `hsl(158 64% 52%)` - Progresso e sucesso
- **Danger (Rose)**: `hsl(346 77% 58%)` - Saldo devedor
- **Accent (Indigo)**: `hsl(245 58% 51%)` - Contagem regressiva
- **Background**: `hsl(222.2 84% 4.9%)` - Fundo escuro premium

### Gradientes
- `--gradient-primary`: Gradiente principal para botões e progresso
- `--gradient-hero`: Gradiente sutil para backgrounds

### Sombras
- `--shadow-glow`: Efeito glow para elementos de destaque
- `--shadow-elegant`: Sombra suave para cards
- `--shadow-card`: Sombra padrão para cards

## 🛠️ Instalação e Execução

### 1. Configurar Backend (Google Apps Script)

1. Abra sua planilha do Google Sheets
2. Crie uma aba chamada **"Pagamentos"** com as colunas:
   - `id` (coluna A)
   - `descricao` (coluna B)
   - `valor` (coluna C)
   - `data` (coluna D)

3. Vá em **Extensões > Apps Script**
4. Cole o código completo do arquivo `backend/google-apps-script.js`
5. Clique em **Implantar > Nova implantação**
6. Selecione tipo: **App da Web**
7. Em "Quem pode acessar", selecione **"Qualquer pessoa"**
8. Copie a URL gerada

### 2. Configurar Frontend

```bash
# Navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure a API URL
# Edite o arquivo src/App.tsx e substitua:
const API_URL = "SUA_URL_DO_APPS_SCRIPT_AQUI"
# Pela URL obtida no passo anterior
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

### 4. Build para Produção

```bash
npm run build
```

Os arquivos estáticos estarão na pasta `dist/`

## 📱 Funcionalidades

### Gatilhos Comportamentais Implementados

1. **Efeito de Progresso Concedido**
   - Barra de progresso imponente no topo
   - Transição suave de 700ms com animação
   - Mensagens motivacionais dinâmicas baseadas no % de progresso

2. **Gatilho do Custo de Oportunidade**
   - Card destacando economia real por pagar sem juros
   - Comparação implícita com taxas de locadoras

3. **Âncora de Propósito**
   - Footer fixo com frase motivacional sobre futuro como desenvolvedor
   - Sempre visível durante a navegação

4. **Contador Regressivo**
   - Cálculo automático de quintas-feiras restantes
   - Visual destacado com gradiente Indigo/Purple

### Cálculos Automáticos

- **Total Pago**: Soma de todos os pagamentos registrados
- **Saldo Devedor**: R$ 20.000 - Total Pago
- **Progresso %**: (Total Pago / 20.000) × 100
- **Semanas Restantes**: ceil(Saldo Devedor / 400)

## 🔧 Arquitetura Técnica

### Mobile-First Design
- Touch targets mínimo de 48px (acessibilidade WCAG)
- Layout responsivo otimizado para celular
- Fontes legíveis em telas pequenas

### Performance
- Lazy loading de componentes
- Animações otimizadas com CSS transforms
- useMemo para cálculos financeiros

### Acessibilidade
- Contraste adequado (WCAG AA)
- Focus states visíveis
- Semântica HTML correta

## 📊 Dados Iniciais

O app já inicializa com seu histórico atual:
- Caução Inicial: R$ 1.000,00 (14/05/2026)
- Parcela 1: R$ 400,00 (21/05/2026)
- Parcela 2: R$ 400,00 (28/05/2026)
- **Total Pago**: R$ 1.800,00 (9%)
- **Saldo Devedor**: R$ 18.200,00
- **Semanas Restantes**: ~46 quintas-feiras

## 🎯 Como Usar

1. Abra o app no celular ou navegador
2. Visualize seu progresso atual na barra superior
3. Clique em "Registrar Pagamento desta Quinta"
4. Preencha o valor (padrão: R$ 400,00) e data
5. Confirme o pagamento
6. Acompanhe a atualização automática de todos os indicadores

## 🌟 Destaques do Design

- **Dark Mode Premium**: Paleta Slate/Zinc escuro com destaques vibrantes
- **Animações Suaves**: Transições em todos os elementos interativos
- **Hierarquia Visual Clara**: Tipografia escalonada e espaçamento sistemático
- **Feedback Visual Imediato**: Loading states, hover effects, active states
- **Componentes Reutilizáveis**: Sistema modular fácil de estender

## 📝 Licença

Projeto pessoal para gerenciamento financeiro.

---

Desenvolvido com ❤️ para conquistar liberdade financeira.
