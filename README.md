# Oficina Mecânica API & Web App

Aplicação fullstack para gerenciamento de uma oficina mecânica, com API REST em Node.js/Express e frontend em React. A solução cobre autenticação JWT, gestão de peças, clientes e ordens de serviço.

## Sumário
- [Arquitetura Geral](#arquitetura-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Backend](#backend)
  - [Dependências](#dependências-do-backend)
  - [Variáveis de Ambiente](#variáveis-de-ambiente-do-backend)
  - [Execução](#execução-do-backend)
  - [Principais Rotas](#principais-rotas)
- [Frontend](#frontend)
  - [Dependências](#dependências-do-frontend)
  - [Variáveis de Ambiente](#variáveis-de-ambiente-do-frontend)
  - [Execução](#execução-do-frontend)
  - [Fluxo de Telas](#fluxo-de-telas)
- [Testes com Insomnia](#testes-com-insomnia)
- [Banco de Dados](#banco-de-dados)
- [Próximos Passos](#próximos-passos)

## Arquitetura Geral
```
oficina-mecanica/
├── backend/   → API REST (Node.js, Express, MongoDB)
└── frontend/  → SPA (React + Context API + React Router)
```

A autenticação usa JWT. O backend valida tokens e controla acesso por `role` (`admin` ou `client`). O frontend consome a API via Axios com interceptador que injeta o token.

## Estrutura de Pastas
```
oficina-mecanica/
├── backend/
│   ├── src/
│   │   ├── config/        # Seed do admin
│   │   ├── controllers/   # Lógica de cada recurso (auth, peças, clientes, ordens)
│   │   ├── middlewares/   # Autenticação e autorização
│   │   ├── models/        # Schemas Mongoose
│   │   ├── routes/        # Rotas Express
│   │   ├── utils/         # Helpers (JWT)
│   │   └── server.js      # Servidor Express + conexão MongoDB
│   ├── .env               # Variáveis de ambiente (não versionado)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/           # Axios client e serviços REST
    │   ├── components/    # Navbar, ProtectedRoute etc.
    │   ├── contexts/      # AuthContext (token/usuário)
    │   ├── hooks/         # Hooks de consumo (ex.: usePieces)
    │   ├── pages/         # Login, Painel Admin, Painel Cliente, 404
    │   ├── routes/        # AppRoutes.jsx (React Router)
    │   ├── styles/        # Estilos globais e utilitários
    │   └── index.js       # Entrada React
    ├── .env               # Config do frontend (REACT_APP_API_URL)
    └── package.json
```

## Backend

### Dependências do Backend
- `express`: API HTTP.
- `mongoose`: ODM para MongoDB.
- `cors`: liberação de requisições do frontend.
- `dotenv`: gestão de variáveis de ambiente.
- `bcrypt`: hash de senhas.
- `jsonwebtoken`: geração/validação de JWT.
- `nodemon` (dev): reload automático em desenvolvimento.

### Variáveis de Ambiente do Backend
Arquivo `backend/.env` (não versionado):
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/oficina_db
JWT_SECRET=sua_chave_super_secreta
ADMIN_EMAIL=admin@oficina.com
ADMIN_PASSWORD=senha123
```

### Execução do Backend
```bash
cd backend
npm install
npm run dev
```
- `src/server.js` conecta ao MongoDB e executa `ensureAdminExists()` para criar o administrador padrão.
- Logs esperados: `MongoDB conectado` e `Servidor rodando na porta 4000`.

### Principais Rotas
| Método | Rota                 | Descrição                                   | Proteção            |
| ------ | -------------------- | ------------------------------------------- | ------------------- |
| POST   | `/api/auth/login`    | Autentica usuário, retorna JWT e role       | Pública             |
| GET    | `/api/pieces`        | Lista peças                                 | JWT (qualquer role) |
| POST   | `/api/pieces`        | Cria peça                                   | JWT + role admin    |
| PUT    | `/api/pieces/:id`    | Atualiza peça                               | JWT + role admin    |
| DELETE | `/api/pieces/:id`    | Remove peça                                 | JWT + role admin    |
| GET    | `/api/clients`       | Lista clientes                              | JWT + role admin    |
| POST   | `/api/clients`       | Cria cliente                                | JWT + role admin    |
| GET    | `/api/orders`        | Lista ordens (populate de cliente/peças)    | JWT (qualquer role) |
| POST   | `/api/orders`        | Cria ordem                                  | JWT + role admin    |
| PUT    | `/api/orders/:id`    | Atualiza ordem                              | JWT + role admin    |
| DELETE | `/api/orders/:id`    | Remove ordem                                | JWT + role admin    |

Todos os endpoints protegidos utilizam `authMiddleware` (`Authorization: Bearer <token>`). Rotas de criação/edição/exclusão exigem `adminOnly`.

## Frontend

### Dependências do Frontend
- `react`, `react-dom`, `react-scripts`
- `axios`: consumo HTTP
- `react-router-dom`: roteamento SPA

### Variáveis de Ambiente do Frontend
Arquivo `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:4000/api
```

### Execução do Frontend
```bash
cd frontend
npm install
npm start
```
O app inicia em `http://localhost:3000`.

### Fluxo de Telas
- **Login** (`/`): formulário que chama `AuthContext.signIn()`. Após sucesso, redireciona conforme `user.role` (`/admin` ou `/cliente`).
- **Painel Admin** (`/admin`): abas para Peças, Clientes e Ordens de Serviço. Permite CRUD completo via serviços em `src/api/`.
- **Painel Cliente** (`/cliente`): lista ordens vinculadas ao usuário logado e permite filtrar por status.
- **404** (`*`): rota fallback.

## Testes com Insomnia
1. Criar coleção “Oficina Mecânica API”.
2. Configurar ambiente:
   ```json
   {
     "baseUrl": "http://localhost:4000/api",
     "adminEmail": "admin@oficina.com",
     "adminPassword": "senha123",
     "token": ""
   }
   ```
3. `POST {{ baseUrl }}/auth/login` com `{{ adminEmail }}`/`{{ adminPassword }}`. Copiar token para `token` no ambiente.
4. Adicionar header `Authorization: Bearer {{ token }}` nas demais requests e testar CRUDs.

## Banco de Dados
- URI local `mongodb://localhost:27017/oficina_db`.
- Collections principais: `users`, `pieces`, `clients`, `orders`.
- Visualização recomendada: MongoDB Compass ou `mongosh`.
- Admin padrão criado automaticamente (`admin@oficina.com` / `senha123`).

## Próximos Passos
- **Fluxo de cadastro de usuários clientes**: criar endpoint/GUI para registrar logins de clientes (hoje apenas admin está pronto).
- **Validações adicionais**: mensagens específicas no backend e feedbacks visuais no frontend.
- **Testes automatizados**: adicionar `jest/supertest` para a API e `React Testing Library` para componentes.
- **Deploy**: preparar scripts para deploy (Docker ou serviços gerenciados) e configurar variáveis de ambiente seguras.
