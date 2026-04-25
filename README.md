# ⚡ CréditoAutônomo — Plataforma de Crédito com Score Alternativo

> Hackathon Semana Ubíqua — Open Finance  
> Crédito justo e rápido para trabalhadores autônomos, usando dados alternativos de comportamento financeiro.

---

## 📋 Visão Geral

### Problema
Motoristas de app, entregadores e autônomos ganham dinheiro mas não conseguem crédito porque o sistema bancário tradicional exige comprovante de renda formal, contracheque e histórico de emprego — dados que esse público não tem.

### Solução
Uma plataforma que usa **Open Finance + dados alternativos** para calcular um **score de crédito comportamental**, analisando:
- Frequência e consistência de recebimentos
- Volume de renda estimado
- Saúde financeira (proporção renda/despesa)
- Tempo de histórico disponível

A decisão é **rápida, automatizada e explicável** — o usuário sempre sabe por que foi aprovado ou negado.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                  │
│  Dashboard | Cadastro | Transações | Score | Crédito │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST (JSON)
┌────────────────────▼────────────────────────────────┐
│                  BACKEND (Node.js/Express)           │
│                                                     │
│  /api/users        → cadastro + consentimento       │
│  /api/transactions → histórico financeiro           │
│  /api/credit       → score + solicitações + loans   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          Score Engine (scoreEngine.js)       │   │
│  │  Frequência + Consistência + Volume +        │   │
│  │  Saúde Financeira + Tempo de Histórico       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────┐                          │
│  │  In-Memory Store     │  (substituível por DB)   │
│  └──────────────────────┘                          │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Modelo de Score (0–1000 pts)

| Critério              | Peso | Como é medido |
|-----------------------|------|---------------|
| Frequência de renda   | 250  | Dias com entrada nos últimos 90 dias |
| Consistência          | 200  | Coeficiente de variação dos valores |
| Volume mensal         | 200  | Renda média mensal estimada |
| Saúde financeira      | 200  | Proporção renda vs despesas |
| Tempo de histórico    | 150  | Dias desde a primeira transação |

**Limite de crédito** = 60% da renda mensal estimada × (score / 1000)

**Classificações:**
- 800–1000: Excelente
- 650–799: Bom  
- 500–649: Regular
- 300–499: Baixo
- 0–299: Muito Baixo

### Transparência (Compliance/LGPD)
Toda decisão de crédito inclui fatores explicativos em linguagem natural — o usuário entende exatamente por que foi aprovado ou negado.

### Detecção de Fraude
- Movimentação circular (mesmo valor entrada/saída no mesmo dia)
- Picos anômalos de renda (> 3x a média)
- Múltiplos cadastros com mesmo device ID

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm start
# Servidor em http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm start
# App em http://localhost:3000
```

---

## 📡 API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Listar usuários |
| POST | `/api/users` | Cadastrar usuário |
| PATCH | `/api/users/:id/consent` | Registrar consentimento |
| GET | `/api/transactions?userId=` | Transações por usuário |
| POST | `/api/transactions` | Adicionar transação |
| POST | `/api/transactions/simulate/:userId` | Simular dados Open Finance |
| GET | `/api/credit/score/:userId` | Calcular score |
| POST | `/api/credit/request` | Solicitar crédito |
| GET | `/api/credit/requests/:userId` | Histórico de solicitações |
| GET | `/api/credit/loans/:userId` | Empréstimos ativos |
| POST | `/api/credit/loans/:loanId/pay` | Registrar pagamento |
| GET | `/api/credit/dashboard` | Resumo geral |

---

## 💻 Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18, Context API |
| Backend | Node.js, Express 4 |
| Score Engine | JavaScript puro (regras explicáveis) |
| Persistência | In-memory (sem necessidade de DB para demo) |
| Comunicação | REST / JSON |
| Deploy sugerido | Vercel (frontend) + Render/Railway (backend) |

---

## 🔐 Segurança e Compliance

- **Consentimento explícito** — nenhum dado é processado sem autorização
- **Minimização de dados** — apenas o necessário para análise de score
- **Decisões explicáveis** — nenhuma "caixa preta"; motivos sempre informados
- **Detecção de fraude** — padrões suspeitos bloqueiam aprovação automática
- **Pronto para LGPD** — base para implementar revogação de consentimento

---

## ⚠️ Limitações e Melhorias Futuras

### Não implementado neste MVP
- Banco de dados persistente (PostgreSQL/MongoDB)
- Autenticação real (JWT/OAuth)
- Integração real com APIs Open Finance (Banco Central)
- Pagamento via Pix real
- Notificações de alerta de inadimplência

### Melhorias futuras
- Modelo ML para score mais preciso (substituindo regras)
- Integração com dados de Uber, iFood via parceiros
- Score dinâmico que se ajusta mensalmente
- Multi-idioma para expansão internacional
- App mobile nativo

---

## 👥 Fluxo do Usuário

1. Cadastro com nome, CPF e profissão
2. Consentimento para compartilhamento de dados (Open Finance)
3. Importação/simulação de histórico de transações
4. Cálculo automático do score alternativo
5. Solicitação de crédito com análise instantânea
6. Recebimento da decisão com motivos claros
7. Acompanhamento e pagamento de parcelas
