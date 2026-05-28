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

---

## 🎨 Design System & Componentes Reutilizáveis

Como parte do aprimoramento da interface e padronização visual, o projeto conta com um **Design System** modular implementado sob a pasta `viagensfront/src/components` e configurado com tokens globais em `viagensfront/src/styles/tokens.css`.

### 📌 Tokens Globais de Estilo (`tokens.css`)

Os estilos são regidos por variáveis CSS nativas que facilitam a consistência e possíveis manutenções visuais:

*   **Paleta de Cores:**
    *   Accent Principal (Marca): `--accent: #8a3a1f;`
    *   Fundo Alternativo / Paper: `--paper: #faf8f3;`
    *   Texto Escuro Principal: `--ink: #1a1a1a;`
    *   Sucesso Semântico: `--ok: #3c5a20;`
    *   Aviso Semântico: `--warn: #8a6b1f;`
*   **Tipografia:**
    *   Títulos e Destaques (Serif): `--font-serif: "Fraunces", Georgia, serif;` (carregado via Google Fonts)
    *   Textos Gerais (Sans): `--font-sans: "Source Sans 3", system-ui, sans-serif;` (carregado via Google Fonts)
*   **Espaçamentos e Bordas:**
    *   Arredondamentos: `--radius-md: 6px;` | `--radius-lg: 10px;`
    *   Escala de Espaçamento Harmônica:
        *   `--spacing-xs: 4px;`
        *   `--spacing-sm: 8px;`
        *   `--spacing-md: 16px;`
        *   `--spacing-lg: 24px;`
        *   `--spacing-xl: 32px;`
        *   `--spacing-xxl: 48px;`
        *   `--spacing-3xl: 64px;`

---

### 🚀 Exemplos de Uso dos Componentes (UI)

Todos os componentes seguem a estrutura moderna de pasta própria contendo `.jsx` + `.module.css` (CSS Modules), garantindo isolamento de escopo sem afetar outras telas do sistema.

#### 1. Button (Botão Reutilizável)
Suporta as variantes `primary` (padrão), `accent`, `ghost` e `link`, além de estados de carregamento (`loading`) e desabilitado.
```jsx
import { Button } from './components/Button';

// Uso padrão
<Button variant="accent" onClick={handleClick}>Confirmar Roteiro</Button>

// Estado de carregamento
<Button variant="primary" loading={true}>Enviar</Button>
```

#### 2. Input (Entrada de Texto)
Componente de formulário contendo tratamento nativo para labels e exibição elegante de erros de validação.
```jsx
import { Input } from './components/Input';

<Input 
  id="email"
  label="Endereço de E-mail"
  type="email"
  placeholder="exemplo@email.com"
  error="Insira um e-mail válido."
/>
```

#### 3. PasswordInput (Entrada de Senha com Visibilidade)
Encapsula o botão de alternância ocular para exibir/ocultar a senha de forma automática.
```jsx
import { PasswordInput } from './components/PasswordInput';

<PasswordInput
  id="senha"
  label="Sua Senha"
  placeholder="Crie uma senha forte"
  showToggleText={true} // Se false, exibe apenas o ícone do olho
/>
```

#### 4. Modal (Diálogos Flutuantes Premium)
Componente com backdrop desfocado (blur), controle automático de escopo de teclado, trava de scroll no body e animações de transição suaves.
```jsx
import { Modal } from './components/Modal';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Adicionar Novo Destino"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
      <Button variant="accent">Salvar Destino</Button>
    </>
  }
>
  <p>Preencha os dados do seu próximo destino dos sonhos...</p>
</Modal>
```

#### 5. Toast (Notificações Flutuantes Semânticas)
Oferece layout semântico estruturado para exibir toasts de `success`, `error` e `info`.
```jsx
import { Toast } from './components/Toast';

<Toast 
  type="success" 
  message="Roteiro de viagem cadastrado com sucesso!" 
  onClose={closeToast}
/>
```

#### 6. Card (Containers Elegantes)
Container premium com controle de borda e sombra sutil, rodapé sutilmente contrastado em `--paper` e suporte a cabeçalho com ações horizontais rápidas.
```jsx
import { Card } from './components/Card';

<Card 
  title="França & Suíça" 
  subtitle="Viagem planejada para Outubro/2026"
  actions={<Button variant="ghost">Editar</Button>}
>
  <p>Roteiro focado em gastronomia e Alpes.</p>
</Card>
```

#### 7. StatusTag (Tags Semânticas de Pílula)
Substitui de forma modular as tags antigas, mapeando automaticamente strings para classes semânticas ideais.
```jsx
import { StatusTag } from './components/StatusTag';

<StatusTag status="confirmado" /> // renderiza verde (success)
<StatusTag status="planejando" /> // renderiza amarelo (warning)
```

#### 8. EmptyState (Estados Sem Registro)
Layout de placeholder amigável para quando o usuário não tiver destinos ou roteiros criados.
```jsx
import { EmptyState } from './components/EmptyState';
import { Button } from './components/Button';

<EmptyState 
  title="Nenhum Roteiro Encontrado"
  description="Comece a tirar seus sonhos do papel montando o seu primeiro roteiro de viagem."
  action={<Button variant="accent">Montar Roteiro</Button>}
/>
```

#### 9. Breadcrumb (Navegação Estrutural)
Componente nativo para guiar o usuário na estrutura de páginas hierárquica usando `React Router DOM`.
```jsx
import { Breadcrumb } from './components/Breadcrumb';

const items = [
  { label: 'Início', path: '/' },
  { label: 'Destinos', path: '/destinos' },
  { label: 'Paris' }
];

<Breadcrumb items={items} />
```

