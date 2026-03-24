# Nest Clean - API de Fórum Q&A

API REST de um fórum de perguntas e respostas construído com NestJS, seguindo **Clean Architecture** e **Domain-Driven Design (DDD)**.

---

## Tecnologias

| Categoria    | Tecnologia                 | Versão                |
| ------------ | -------------------------- | --------------------- |
| Runtime      | Node.js + TypeScript       | TS ~5.1               |
| Framework    | NestJS                     | 10.x                  |
| ORM / DB     | Prisma + PostgreSQL        | Prisma 5.7            |
| Cache        | Redis (ioredis)            | 5.3                   |
| Autenticação | JWT (RS256) via Passport   | `@nestjs/jwt` 10.2    |
| Validação    | Zod                        | 3.22                  |
| Upload       | AWS S3 SDK (Cloudflare R2) | 3.478                 |
| Testes       | Vitest + Supertest + Faker | Vitest 1.x            |
| Build        | SWC (compilação rápida)    | via `unplugin-swc`    |
| Lint         | ESLint (config Rocketseat) | 8.x                   |
| Documentação | Swagger (OpenAPI)          | `@nestjs/swagger` 7.x |

---

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

---

## Instalação

```bash
# Clonar o repositório
git clone <repositorio>
cd nest-clean

# Instalar dependências
npm install

# Subir Postgres + Redis
docker compose up -d

# Rodar migrations
npx prisma migrate dev

# Gerar as chaves JWT (RSA)
# Gere um par de chaves RSA e codifique em Base64
# Defina as variáveis de ambiente no arquivo .env
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável                 | Tipo   | Padrão      | Descrição                    |
| ------------------------ | ------ | ----------- | ---------------------------- |
| `PORT`                   | number | `3333`      | Porta do servidor            |
| `DATABASE_URL`           | string | —           | URL de conexão do PostgreSQL |
| `JWT_PRIVATE_KEY`        | string | —           | Chave privada RSA (Base64)   |
| `JWT_PUBLIC_KEY`         | string | —           | Chave pública RSA (Base64)   |
| `CLOUDFLARE_ACCOUNT`     | string | —           | ID da conta Cloudflare       |
| `CLOUDFLARE_R2_ENDPOINT` | string | —           | Endpoint do R2               |
| `AWS_BUCKET_NAME`        | string | —           | Nome do bucket S3/R2         |
| `AWS_ACCESS_KEY_ID`      | string | —           | ID de acesso AWS             |
| `AWS_SECRET_ACCESS_KEY`  | string | —           | Chave secreta AWS            |
| `REDIS_HOST`             | string | `127.0.0.1` | Host do Redis                |
| `REDIS_DB`               | number | `0`         | Banco de dados Redis         |
| `REDIS_PORT`             | number | `6379`      | Porta do Redis               |

Consulte o arquivo `.env.example` para isso.

---

## Executando o Projeto

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

### Testes

```bash
npm run test           # Testes unitários
npm run test:watch     # Testes unitários em watch mode
npm run test:e2e       # Testes E2E
npm run test:cov       # Cobertura de testes
```

---

## Documentação da API

A documentação da API está disponível via Swagger em:

```
http://localhost:3333/api
```

### Endpoints

#### Autenticação

| Método | Rota        | Descrição                    | Auth |
| ------ | ----------- | ---------------------------- | ---- |
| `POST` | `/accounts` | Criar conta de usuário       | ❌   |
| `POST` | `/sessions` | Autenticar e obter token JWT | ❌   |

#### Perguntas

| Método   | Rota                                | Descrição                  | Auth |
| -------- | ----------------------------------- | -------------------------- | ---- |
| `POST`   | `/questions`                        | Criar nova pergunta        | ✅   |
| `GET`    | `/questions`                        | Listar perguntas recentes  | ✅   |
| `GET`    | `/questions/:slug`                  | Obter pergunta pelo slug   | ✅   |
| `PUT`    | `/questions/:id`                    | Editar pergunta            | ✅   |
| `DELETE` | `/questions/:id`                    | Excluir pergunta           | ✅   |
| `PATCH`  | `/answers/:answerId/choose-as-best` | Selecionar melhor resposta | ✅   |

#### Respostas

| Método   | Rota                     | Descrição          | Auth |
| -------- | ------------------------ | ------------------ | ---- |
| `POST`   | `/questions/:id/answers` | Responder pergunta | ✅   |
| `GET`    | `/questions/:id/answers` | Listar respostas   | ✅   |
| `PUT`    | `/answers/:id`           | Editar resposta    | ✅   |
| `DELETE` | `/answers/:id`           | Excluir resposta   | ✅   |

#### Comentários

| Método   | Rota                      | Descrição                      | Auth |
| -------- | ------------------------- | ------------------------------ | ---- |
| `POST`   | `/questions/:id/comments` | Comentar na pergunta           | ✅   |
| `GET`    | `/questions/:id/comments` | Listar comentários da pergunta | ✅   |
| `POST`   | `/answers/:id/comments`   | Comentar na resposta           | ✅   |
| `GET`    | `/answers/:id/comments`   | Listar comentários da resposta | ✅   |
| `DELETE` | `/questions/comments/:id` | Excluir comentário de pergunta | ✅   |
| `DELETE` | `/answers/comments/:id`   | Excluir comentário de resposta | ✅   |

#### Notificações

| Método  | Rota                      | Descrição                    | Auth |
| ------- | ------------------------- | ---------------------------- | ---- |
| `PATCH` | `/notifications/:id/read` | Marcar notificação como lida | ✅   |

#### Anexos

| Método | Rota           | Descrição               | Auth |
| ------ | -------------- | ----------------------- | ---- |
| `POST` | `/attachments` | Fazer upload de arquivo | ✅   |

---

## Autenticação

O projeto utiliza **JWT com algoritmo RS256** (chaves assimétricas).

### Fluxo de Autenticação

1. **Criar conta**: `POST /accounts`

   ```json
   {
     "name": "João Silva",
     "email": "joao@exemplo.com",
     "password": "senha123"
   }
   ```

2. **Login**: `POST /sessions`

   ```json
   {
     "email": "joao@exemplo.com",
     "password": "senha123"
   }
   ```

3. **Utilizar o token**: Incluir no header:
   ```
   Authorization: Bearer <token_jwt>
   ```

### Decorators

- `@Public()` - Rota pública (não requer autenticação)
- `@CurrentUser()` - Obtém o usuário autenticado

---

## Arquitetura

```
src/
├── core/                    # Utilidades compartilhadas
│   ├── entities/           # Entidades base (Entity, AggregateRoot)
│   ├── errors/             # Classes de erro
│   ├── events/             # Sistema de eventos de domínio
│   ├── repositories/       # Interfaces de repositório
│   └── types/              # Tipos utilitários
│
├── domain/                  # Regras de negócio (DDD)
│   ├── forum/
│   │   ├── enterprise/     # Entidades, eventos de domínio
│   │   └── aplication/    # Use cases, repositórios (interfaces)
│   │
│   └── notification/
│       ├── enterprise/     # Entidade Notification
│       └── aplication/    # Use cases de notificação
│
└── infra/                  # Implementações concretas (NestJS)
    ├── auth/              # JWT Strategy, Guard, Decorators
    ├── cache/             # Implementação Redis
    ├── cryptography/     # Implementação bcrypt
    ├── database/         # Prisma (mappers, repositórios)
    ├── env/              # Validação de variáveis de ambiente (Zod)
    ├── events/           # Event handlers
    ├── http/             # Controllers, Presenters, Pipes
    └── storage/          # Upload S3/R2
```

### Princípios

- **Clean Architecture** — Separação entre `domain` (regras de negócio puras) e `infra` (implementações).
- **DDD** — Camadas `enterprise` (entidades, value objects, eventos) e `application` (use cases).
- **Either Pattern** — Use cases retornam `Either<Error, Success>` ao invés de lançar exceções.
- **Inversão de dependência** — Repositórios definidos como interfaces no `domain`, implementados na `infra`.

---

## Modelo de Dados

```
User (Student/Instructor)
├── Questions (perguntas)
│   ├── Answers (respostas)
│   ├── Comments (comentários)
│   └── Attachments (anexos)
└── Notifications (notificações)
```

---

## Contribuição

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

### Convenções de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `refactor`: Refatoração
- `test`: Adição de testes
- `chore`: Tarefas de manutenção

---

## Licença

MIT License
