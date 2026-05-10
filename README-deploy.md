# AlmoXpert Frontend — Guia de Deploy

## Variáveis de Ambiente

| Variável | Descrição | Exemplo (produção) | Padrão |
|---|---|---|---|
| `VITE_API_URL` | URL base da API (backend) | `https://almoxpert-api.onrender.com/api` | `http://localhost:3000/api` |

> ⚠️ Variáveis Vite **devem** ter o prefixo `VITE_` para serem expostas ao código client-side.

---

## Deploy na Vercel

### 1. Criar o projeto

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **Add New → Project**
3. Importe o repositório `almoXpert_Node_Frontend`
4. A Vercel detecta automaticamente que é um projeto Vite. Verifique:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Configurar variáveis de ambiente

1. Antes de fazer o deploy, vá em **Settings → Environment Variables**
2. Adicione:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://almoxpert-api.onrender.com/api` |

3. Selecione os ambientes: **Production**, **Preview** e **Development**

> 💡 Substitua a URL pelo domínio real do seu backend no Render.

### 3. Deploy

- Clique em **Deploy** — a Vercel faz o build e publica automaticamente
- Deploys futuros são automáticos a cada push na branch `main`
- O arquivo `vercel.json` já está configurado para redirecionar todas as rotas para o `index.html` (SPA com react-router)

### 4. Domínio personalizado (opcional)

1. Vá em **Settings → Domains**
2. Adicione seu domínio customizado
3. Siga as instruções para configurar os registros DNS
4. Lembre-se de atualizar `CORS_ORIGIN` no backend (Render) com o novo domínio

---

## Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd almoXpert_Node_Frontend

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# O .env já vem com VITE_API_URL=http://localhost:3000/api

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

> O frontend estará disponível em `http://localhost:5173` (porta padrão do Vite).

---

## Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `npm run dev` | `vite` | Servidor de desenvolvimento com HMR |
| `npm run build` | `vite build` | Build de produção (gera pasta `dist/`) |
| `npm run preview` | `vite preview` | Preview local do build de produção |
| `npm run lint` | `eslint .` | Verificação de código |
