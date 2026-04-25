# ⚡ CréditoAutônomo — Guia de Deploy

## Estrutura do Projeto

```
credito-autonomo/
├── backend/       ← API Node.js + Express  → deploy no Render
└── frontend/      ← App React              → deploy no Vercel
```

---

## 🖥️ Rodar Localmente (primeiro teste)

### Pré-requisitos
- Node.js 18+ instalado → https://nodejs.org
- Git (opcional para deploy)

### 1. Backend

```bash
cd backend
npm install
npm start
# → Servidor em http://localhost:3001
# → Teste: abra http://localhost:3001/api/health no navegador
```

### 2. Frontend (novo terminal)

```bash
cd frontend
npm install
npm start
# → Abre automaticamente em http://localhost:3000
```

Se tudo funcionar localmente, siga os passos de deploy abaixo.

---

## 🚀 Deploy Completo (Render + Vercel) — PASSO A PASSO

### ETAPA 1 — Subir o código no GitHub

1. Crie uma conta em https://github.com (se não tiver)
2. Crie **dois repositórios** novos:
   - `credito-autonomo-backend`
   - `credito-autonomo-frontend`
3. Dentro da pasta `backend/`, execute:

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/credito-autonomo-backend.git
git push -u origin main
```

4. Dentro da pasta `frontend/`, execute:

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/credito-autonomo-frontend.git
git push -u origin main
```

---

### ETAPA 2 — Deploy do Backend no Render

1. Acesse https://render.com e crie uma conta gratuita
2. Clique em **"New +"** → **"Web Service"**
3. Conecte sua conta do GitHub
4. Selecione o repositório `credito-autonomo-backend`
5. Configure assim:

| Campo | Valor |
|-------|-------|
| Name | credito-autonomo-api |
| Region | Oregon (US West) |
| Branch | main |
| Root Directory | *(deixe vazio)* |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | Free |

6. Clique em **"Create Web Service"**
7. Aguarde o deploy (2–3 minutos)
8. Anote a URL gerada, parecida com:
   ```
   https://credito-autonomo-api.onrender.com
   ```
9. Teste abrindo: `https://credito-autonomo-api.onrender.com/api/health`
   - Deve retornar `{"status":"ok",...}`

---

### ETAPA 3 — Configurar a URL do Backend no Frontend

Antes de subir o frontend, crie o arquivo `.env.production` dentro da pasta `frontend/`:

```bash
# frontend/.env.production
REACT_APP_API_URL=https://credito-autonomo-api.onrender.com/api
```

> ⚠️ Substitua pela URL real que o Render gerou para você.

Depois comite e suba essa mudança:

```bash
cd frontend
git add .env.production
git commit -m "adiciona url do backend em producao"
git push
```

---

### ETAPA 4 — Deploy do Frontend no Vercel

1. Acesse https://vercel.com e crie uma conta (pode logar com GitHub)
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório `credito-autonomo-frontend`
4. Configure assim:

| Campo | Valor |
|-------|-------|
| Framework Preset | Create React App |
| Root Directory | *(deixe vazio)* |
| Build Command | `npm run build` |
| Output Directory | `build` |

5. Em **"Environment Variables"**, adicione:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://credito-autonomo-api.onrender.com/api` |

> ⚠️ Substitua pela URL real do Render.

6. Clique em **"Deploy"**
7. Aguarde 1–2 minutos
8. Vercel vai gerar uma URL parecida com:
   ```
   https://credito-autonomo.vercel.app
   ```

---

### ETAPA 5 — Verificar CORS no Backend

O backend já tem CORS configurado para aceitar qualquer origem. Mas se quiser restringir apenas ao seu domínio do Vercel, edite `backend/src/server.js`:

```js
// Substitua app.use(cors()); por:
app.use(cors({
  origin: ['https://credito-autonomo.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
}));
```

Depois comite e o Render faz redeploy automático.

---

## ✅ Checklist Final

- [ ] `http://localhost:3001/api/health` retorna OK (local)
- [ ] `http://localhost:3000` abre o app (local)
- [ ] Backend rodando no Render com URL anotada
- [ ] `REACT_APP_API_URL` configurada no Vercel
- [ ] Frontend abrindo no Vercel e comunicando com o backend

---

## 🐛 Problemas Comuns

### "Failed to fetch" no frontend
→ A URL do backend está errada. Verifique `REACT_APP_API_URL` no Vercel.

### Backend no Render "spinning up"
→ O plano Free hiberna após inatividade. Na primeira requisição demora ~30s para acordar. Normal.

### CORS error no console
→ Edite `server.js` com a origem exata do Vercel (Etapa 5).

### `npm install` falha no Render
→ Verifique se o `package.json` do backend está na raiz do repositório, não dentro de uma pasta.

---

## 🔗 Links Úteis

- Render: https://render.com
- Vercel: https://vercel.com
- Node.js: https://nodejs.org
- GitHub: https://github.com
