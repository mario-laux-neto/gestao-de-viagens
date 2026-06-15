# Tutorial - Como Rodar a Aplicação Viagens Moretto

Sistema completo de gerenciamento de viagens com autenticação, destinos, roteiros e atividades.

## ⚡ Início Rápido

```bash
# 1. Backend (em um terminal)
git checkout backend
cd viagensback
npm install
cp .env.example .env
# Edite o .env com suas credenciais do banco
npm run db:migrate
npm run db:seed
npm run dev

# 2. Frontend (em outro terminal)
git checkout frontend
cd viagensfront
pnpm install
cp .env.example .env
pnpm dev
```

Acesse: http://localhost:5173

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **pnpm** (gerenciador de pacotes)
  ```bash
  npm install -g pnpm
  ```
- **PostgreSQL** (ou conta no [Supabase](https://supabase.com))
- **Git** - [Download](https://git-scm.com/)

## 🎨 Frontend (React + Vite)

### 1. Instalar Dependências

Navegue até a pasta do frontend e instale as dependências:

```bash
cd viagensfront
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `viagensfront` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Rodar o Frontend

Execute o servidor de desenvolvimento:

```bash
pnpm dev
```

O frontend estará disponível em: **http://localhost:5173**

### 4. Comandos Úteis do Frontend

- **Desenvolvimento**: `pnpm dev` - Inicia servidor com hot reload
- **Build para produção**: `pnpm build` - Gera build otimizado
- **Preview do build**: `pnpm preview` - Visualiza build de produção
- **Lint**: `pnpm lint` - Verifica qualidade do código

## 🔧 Backend (Node.js + Express + Sequelize)

⚠️ **Atenção**: O código do backend está na branch `backend`. Certifique-se de estar nessa branch:

```bash
git checkout backend
```

### 1. Instalar Dependências

```bash
cd viagensback
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `viagensback` baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Servidor
NODE_ENV=development
PORT=3000

# Banco de Dados (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=trocar-por-chave-segura-minimo-32-caracteres
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. Configurar Banco de Dados

O projeto usa **PostgreSQL** (Supabase). Você precisa:

1. Criar uma conta no [Supabase](https://supabase.com)
2. Criar um novo projeto
3. Copiar a connection string do PostgreSQL
4. Configurar no `.env`

Ou use um PostgreSQL local:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/viagens_db
```

### 4. Executar Migrations

Rode as migrations para criar as tabelas no banco:

```bash
npm run db:migrate
```

### 5. (Opcional) Popular Banco com Dados de Teste

```bash
npm run db:seed
```

### 6. Rodar o Servidor

**Modo desenvolvimento** (com hot reload):
```bash
npm run dev
```

**Modo produção**:
```bash
npm start
```

O backend estará disponível em: **http://localhost:3000**

Health check: **http://localhost:3000/health**

### 7. Comandos Úteis do Backend

- **Desenvolvimento**: `npm run dev` - Servidor com nodemon
- **Produção**: `npm start` - Servidor sem auto-reload
- **Testes**: `npm test` - Executar testes com Jest
- **Migrations**: `npm run db:migrate` - Criar tabelas
- **Rollback**: `npm run db:migrate:undo` - Desfazer última migration
- **Seeders**: `npm run db:seed` - Popular dados de teste
- **Reset DB**: `npm run db:reset` - Recriar todo banco de dados

## 📦 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **React Hot Toast** - Notificações

### Backend
- **Node.js 20 LTS** - Runtime JavaScript
- **Express 4** - Framework web
- **Sequelize 6** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados (via Supabase)
- **JWT** - Autenticação com tokens
- **Bcrypt** - Hash de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança HTTP
- **Express Rate Limit** - Proteção contra DDoS

## 🚀 Fluxo de Desenvolvimento

### Modo de Desenvolvimento Completo

Para rodar a aplicação completa, você precisa de **2 terminais**:

#### Terminal 1 - Backend
```bash
# Certifique-se de estar na branch backend
git checkout backend

cd viagensback
npm run dev
```

Backend rodando em: http://localhost:3000

#### Terminal 2 - Frontend
```bash
# Certifique-se de estar na branch frontend (ou main)
git checkout frontend

cd viagensfront
pnpm dev
```

Frontend rodando em: http://localhost:5173

### Estrutura do Projeto

```
viagensmoretto/
├── viagensfront/              # Aplicação React (branch frontend)
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── features/          # Features da aplicação
│   │   ├── routes/            # Configuração de rotas
│   │   ├── services/          # Integrações com API
│   │   ├── contexts/          # Context API
│   │   └── styles/            # Estilos globais
│   ├── public/                # Arquivos estáticos
│   └── package.json
│
└── viagensback/               # API REST (branch backend)
    ├── src/
    │   ├── config/            # Configurações (DB, ambiente)
    │   ├── models/            # Models Sequelize (ORM)
    │   ├── controllers/       # Controllers HTTP
    │   ├── services/          # Lógica de negócio
    │   ├── routes/            # Rotas da API
    │   ├── middlewares/       # Middlewares (auth, validação)
    │   ├── validators/        # Validação Joi
    │   ├── database/          # Migrations e seeders
    │   ├── utils/             # Funções auxiliares
    │   ├── app.js            # Configuração Express
    │   └── server.js         # Entry point
    └── package.json
```

## 🐛 Troubleshooting

### Problema: Porta já em uso

Se a porta 5173 (frontend) ou 3000 (backend) já estiver em uso:

**Windows (PowerShell)**:
```powershell
# Encontrar processo na porta 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Encontrar processo na porta 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess

# Matar processo
Stop-Process -Id <PID> -Force
```

### Problema: Dependências não instaladas

**Frontend**:
```bash
cd viagensfront
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Backend**:
```bash
cd viagensback
rm -rf node_modules package-lock.json
npm install
```

### Problema: Erro de conexão com banco de dados

Certifique-se de que:
1. O PostgreSQL está rodando (ou Supabase está acessível)
2. As credenciais no `.env` estão corretas
3. O banco de dados foi criado
4. As migrations foram executadas: `npm run db:migrate`

### Problema: Erro de CORS

O CORS já está configurado no backend (`src/app.js`):

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

Se ainda houver erro, verifique se a variável `CORS_ORIGIN` no `.env` do backend está correta.

### Problema: JWT Token inválido

Se receber "Token inválido" ou "Não autorizado":
1. Verifique se o `JWT_SECRET` no `.env` tem pelo menos 32 caracteres
2. Faça logout e login novamente no frontend
3. Limpe o localStorage do navegador (F12 > Application > Local Storage)

### Problema: Migrations não executam

```bash
# Verificar se o Sequelize está configurado
cd viagensback
cat .sequelizerc

# Forçar recriação do banco (CUIDADO: apaga todos os dados)
npm run db:reset
```

### Problema: Branch errada

Certifique-se de estar nas branches corretas:

```bash
# Verificar branch atual
git branch

# Backend deve estar em 'backend'
git checkout backend

# Frontend deve estar em 'frontend' ou 'main'
git checkout frontend
```

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

### Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login
- `POST /auth/forgot-password` - Recuperação de senha
- `POST /auth/reset-password` - Reset de senha

### Usuários
- `GET /users/profile` - Perfil do usuário logado
- `PUT /users/profile` - Atualizar perfil
- `PUT /users/password` - Alterar senha

### Destinos
- `GET /destinations` - Listar destinos
- `POST /destinations` - Criar destino
- `GET /destinations/:id` - Detalhes do destino
- `PUT /destinations/:id` - Atualizar destino
- `DELETE /destinations/:id` - Excluir destino

### Roteiros
- `GET /itineraries` - Listar roteiros
- `POST /itineraries` - Criar roteiro
- `GET /itineraries/:id` - Detalhes do roteiro
- `PUT /itineraries/:id` - Atualizar roteiro
- `DELETE /itineraries/:id` - Excluir roteiro

### Atividades
- `GET /activities` - Listar atividades
- `POST /activities` - Criar atividade
- `GET /activities/:id` - Detalhes da atividade
- `PUT /activities/:id` - Atualizar atividade
- `DELETE /activities/:id` - Excluir atividade
- `PATCH /activities/:id/toggle` - Alternar status de conclusão

### Dashboard
- `GET /dashboard` - Estatísticas gerais

## 📝 Próximos Passos

1. ✅ Frontend funcionando
2. ✅ Backend implementado
3. ✅ API REST completa
4. ✅ Autenticação JWT
5. ✅ Banco de dados PostgreSQL
6. ⏳ Integração completa frontend + backend
7. ⏳ Testes unitários e de integração
8. ⏳ Deploy em produção

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs no console do navegador (F12)
- Verifique os logs do terminal onde os servidores estão rodando
- Consulte a documentação das tecnologias utilizadas

---

**Última atualização**: 09/06/2026
