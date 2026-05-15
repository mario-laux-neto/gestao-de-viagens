# Travel Organization System - Backend

Sistema de gerenciamento de viagens desenvolvido como projeto acadêmico.

## Equipe

- **Maria Hoppe** - Autenticação & Gerenciamento de Usuários
- **Mario Laux Neto** - Módulos de Destinos & Atividades
- **Vitor Caldas** - Roteiros & Dashboard

## Tecnologias

- Node.js 20 LTS
- Express 4
- Sequelize 6 (ORM)
- MySQL 8
- JWT (Autenticação)
- Bcrypt (Hash de senhas)
- Joi (Validação)

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações do banco e ambiente
│   ├── models/          # Modelos Sequelize
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── middlewares/     # Middlewares (auth, validação)
│   ├── validators/      # Schemas de validação Joi
│   ├── utils/           # Funções auxiliares
│   ├── database/        # Migrations e seeders
│   ├── app.js          # Configuração do Express
│   └── server.js       # Entry point do servidor
└── tests/              # Testes unitários e integração
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no .env

# Criar banco de dados
# Execute no MySQL: CREATE DATABASE viagens_db;

# Executar migrations
npx sequelize-cli db:migrate

# (Opcional) Executar seeders
npx sequelize-cli db:seed:all
```

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test

# Criar migration
npx sequelize-cli migration:generate --name migration-name

# Criar seeder
npx sequelize-cli seed:generate --name seeder-name
```

## Variáveis de Ambiente

Consulte o arquivo `.env.example` para as variáveis necessárias.

## Entidades

- **Users** - Usuários do sistema
- **Destinos** - Destinos de viagem
- **Roteiros** - Roteiros/itinerários
- **Atividades** - Atividades dentro dos roteiros

## API Endpoints

Base URL: `http://localhost:3000/api`

### Autenticação
- POST `/auth/register` - Cadastro
- POST `/auth/login` - Login
- POST `/auth/forgot-password` - Recuperação de senha
- POST `/auth/reset-password` - Reset de senha

### Usuários
- GET `/users/profile` - Perfil do usuário
- PUT `/users/profile` - Atualizar perfil
- PUT `/users/password` - Alterar senha

### Destinos
- GET `/destinations` - Listar destinos
- POST `/destinations` - Criar destino
- GET `/destinations/:id` - Detalhes do destino
- PUT `/destinations/:id` - Atualizar destino
- DELETE `/destinations/:id` - Excluir destino

### Roteiros
- GET `/itineraries` - Listar roteiros
- POST `/itineraries` - Criar roteiro
- GET `/itineraries/:id` - Detalhes do roteiro
- PUT `/itineraries/:id` - Atualizar roteiro
- DELETE `/itineraries/:id` - Excluir roteiro

### Atividades
- GET `/activities` - Listar atividades
- POST `/activities` - Criar atividade
- GET `/activities/:id` - Detalhes da atividade
- PUT `/activities/:id` - Atualizar atividade
- DELETE `/activities/:id` - Excluir atividade
- PATCH `/activities/:id/toggle` - Alternar status de conclusão

## Licença

Projeto acadêmico - 2026
