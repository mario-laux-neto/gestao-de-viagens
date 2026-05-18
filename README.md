<p align="center">
  <img src="docs/logo.png" alt="Logo Gestão de Viagens" width="180">
</p>

<h1 align="center">Sistema de Organização de Viagens</h1>

<p align="center">
  Sistema web para planejamento e gerenciamento de viagens pessoais.<br>
  Projeto acadêmico — Desenvolvimento Web — 2026
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express">
</p>

---

Permite cadastrar destinos, montar roteiros com datas e acompanhar atividades em cada viagem — tudo com autenticação segura e painel de controle.

## Equipe

| Integrante | Responsabilidade |
|---|---|
| **Maria Hoppe** | Frontend — telas e componentes React |
| **Mario Laux Neto** | Frontend — integração com API e rotas |
| **Vitor Caldas** | Backend — API REST completa |

## Tecnologias

### Frontend
- React 18 com Vite
- React Router DOM 6
- React Hook Form + Zod (validação de formulários)
- Axios (requisições HTTP)
- React Hot Toast (notificações)

### Backend
- Node.js + Express 4
- Sequelize 6 (ORM)
- PostgreSQL (Supabase)
- JWT + bcrypt (autenticação)
- Joi (validação de dados)
- Helmet + Rate Limiting (segurança)

## Estrutura do Repositório

```
gestao-de-viagens/
├── viagensfront/          # Aplicação React (Vite)
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Chamadas à API (Axios)
│   │   └── ...
│   └── package.json
│
├── viagensback/           # API REST (Node.js)
│   ├── src/
│   │   ├── config/        # Configuração do banco
│   │   ├── models/        # Modelos Sequelize
│   │   ├── controllers/   # Controladores HTTP
│   │   ├── services/      # Lógica de negócio
│   │   ├── routes/        # Definição de rotas
│   │   ├── middlewares/   # Auth, validação, rate limit
│   │   ├── validators/    # Schemas Joi
│   │   ├── database/      # Migrations e seeders
│   │   └── utils/         # Tratamento de erros
│   └── package.json
│
└── README.md
```

## Como Rodar

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Backend

```bash
cd viagensback
npm install

# Criar arquivo .env baseado no exemplo
cp .env.example .env
# Preencher as variáveis (ver viagensback/README.md)

# Iniciar em modo desenvolvimento
npm run dev
# Servidor roda em http://localhost:3000
```

### Frontend

```bash
cd viagensfront
pnpm install

# Iniciar em modo desenvolvimento
pnpm dev
# Aplicação roda em http://localhost:5173
```

## Funcionalidades

- Cadastro e login de usuários com JWT
- Recuperação de senha com token temporário
- Dashboard com resumo geral (totais, próxima viagem, atividades pendentes)
- CRUD completo de destinos com filtros por cidade, país e faixa de custo
- CRUD de roteiros vinculados a destinos, com status (rascunho, planejando, confirmado, concluído)
- CRUD de atividades dentro dos roteiros, com marcação de concluída
- Painel administrativo para gestão de usuários
- Proteção por ownership — cada usuário só acessa seus próprios dados
- Rate limiting e headers de segurança

## Banco de Dados

O sistema usa PostgreSQL hospedado no Supabase (região São Paulo).

### Entidades

```
Usuario 1:N Destino 1:N Roteiro 1:N Atividade
```

- **Usuário** → nome, email, senha (bcrypt), perfil (admin/comum)
- **Destino** → cidade, país, descrição, custo estimado
- **Roteiro** → nome, destino, datas de ida/volta, status
- **Atividade** → nome, local, horário, custo, concluída (sim/não)

## API

Base URL: `http://localhost:3000/api`

| Módulo | Endpoints | Autenticação |
|---|---|---|
| Auth | `POST /auth/registro`, `/login`, `/esqueci-senha`, `/redefinir-senha` | Pública |
| Dashboard | `GET /dashboard` | JWT |
| Destinos | CRUD em `/destinos` | JWT |
| Roteiros | CRUD em `/roteiros` + `GET /:id/resumo` | JWT |
| Atividades | CRUD em `/atividades` + `PATCH /:id/toggle` | JWT |
| Usuários | Perfil, troca de senha, gestão (admin) em `/usuarios` | JWT / Admin |

Documentação detalhada dos endpoints no [README do backend](viagensback/README.md).

---

<p align="center">
  Feito com dedicação pela equipe Gestão de Viagens — 2026
</p>
