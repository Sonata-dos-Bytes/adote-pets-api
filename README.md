# 🐾 Adote Pets API

Bem-vindo à **API do Sistema Adote Pets**! 🎯 Uma solução completa para facilitar a adoção de pets e conectar animais com novos lares.

## 🛠️ Tecnologias Utilizadas
- 🟢 **Node.js + Express** - Framework backend robusto e performático
- 📘 **TypeScript** - Tipagem estática para código mais seguro
- 🗄️ **Prisma ORM** - Gerenciamento moderno de banco de dados
- 🐳 **Docker** - Containerização do ambiente
- ☁️ **AWS S3 (Supabase)** - Armazenamento de arquivos e imagens
- 🔐 **JWT** - Autenticação segura
- ✅ **Zod** - Validação de dados

## 📖 Sumário
- [🐾 Adote Pets API](#-adote-pets-api)
  - [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [📖 Sumário](#-sumário)
  - [🚀 Instalação](#-instalação)
  - [📌 Comandos Essenciais](#-comandos-essenciais)
  - [📂 Estrutura do Projeto](#-estrutura-do-projeto)
  - [🔑 Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [📡 Endpoints Disponíveis](#-endpoints-disponíveis)
  - [👥 Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)
  - [📞 Contato](#-contato)

## 🚀 Instalação
Siga os passos abaixo para configurar e iniciar o projeto:

1️⃣ **Clone o repositório:**
```sh
git clone https://github.com/Sonata-dos-Bytes/adote-pets-api.git
cd adote-pets-api
```

2️⃣ **Instale as dependências:**
```sh
npm install
```

3️⃣ **Configure as variáveis de ambiente:**
```sh
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4️⃣ **Gere o Prisma Client:**
```sh
npx prisma generate
```

5️⃣ **Crie e sincronize o banco de dados:**
```sh
npx prisma db push
```
> ⚠️ **Nota:** Use `npx prisma db push` para desenvolvimento rápido ou `npm run migrate` para criar migrações versionadas.

6️⃣ **Inicie o servidor de desenvolvimento:**
```sh
npm run dev
```

7️⃣ **Acesse a API no navegador:**
```
http://localhost:3000/api/
```

---

### 🐳 **Alternativa com Docker**

Se preferir usar Docker, siga estes passos:

1️⃣ **Configure as variáveis de ambiente:**
```sh
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

2️⃣ **Suba os contêineres:**
```sh
docker compose up -d
```

3️⃣ **Acesse:**
- **API:** `http://localhost:3000/api/`
- **Prisma Studio:** `http://localhost:5555`

## 📌 Comandos Essenciais

- **🚀 Iniciar servidor em modo desenvolvimento:**
  ```sh
  npm run dev
  ```
  > Inicia o servidor com hot-reload usando tsx watch

- **📊 Abrir Prisma Studio (Interface visual do banco):**
  ```sh
  npx prisma studio
  ```
  > Acesse em `http://localhost:5555` para visualizar e editar dados

- **🗄️ Sincronizar schema com o banco (desenvolvimento):**
  ```sh
  npx prisma db push
  ```
  > Aplica mudanças do schema diretamente no banco

- **🔄 Criar migração (produção):**
  ```sh
  npm run migrate
  # ou
  npx prisma migrate dev --name nome_da_migracao
  ```

- **⚙️ Gerar Prisma Client:**
  ```sh
  npm run prisma:generate
  # ou
  npx prisma generate
  ```

- **🏗️ Build para produção:**
  ```sh
  npm run build
  ```

- **▶️ Iniciar em produção:**
  ```sh
  npm start
  ```

- **🐳 Docker - Subir contêineres:**
  ```sh
  docker-compose up -d
  ```
  > Inicia a API na porta 3000 e o Prisma Studio na porta 5555

- **🐳 Docker - Parar contêineres:**
  ```sh
  docker-compose down
  ```

- **🐳 Docker - Ver logs:**
  ```sh
  docker-compose logs -f
  # ou logs de um serviço específico
  docker-compose logs -f app
  docker-compose logs -f prisma-studio
  ```

## 📂 Estrutura do Projeto
```
adote-pets-api/
├── 📁 src/
│   ├── 📁 config/          # Configurações (servidor, cache, CORS, etc)
│   ├── 📁 controllers/     # Controladores da aplicação
│   ├── 📁 exceptions/      # Classes de exceções customizadas
│   ├── 📁 middlewares/     # Middlewares (auth, error handling)
│   ├── 📁 repository/      # Camada de acesso aos dados
│   ├── 📁 resources/       # Transformadores de dados para API
│   ├── 📁 routes/          # Definição de rotas
│   ├── 📁 schemas/         # Schemas de validação (Zod)
│   ├── 📁 services/        # Serviços (AWS S3, etc)
│   ├── 📁 types/           # Tipos TypeScript
│   ├── 📁 utils/           # Utilitários e helpers
│   └── 📄 index.ts         # Ponto de entrada da aplicação
├── 📁 prisma/
│   ├── 📁 migrations/      # Histórico de migrações do banco
│   └── 📄 schema.prisma    # Schema do banco de dados
├── 📄 package.json         # Dependências e scripts
├── 📄 tsconfig.json        # Configuração TypeScript
├── 📄 docker-compose.yaml  # Configuração Docker
└── 📄 .env                 # Variáveis de ambiente
```

## 🔑 Variáveis de Ambiente
Configure as seguintes variáveis no arquivo `.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development
CORS_ORIGIN="*"

# Cache
TTL_CACHE=300

# Logs
LOG_LEVEL=debug

# Autenticação
JWT_SECRET="sua_chave_secreta_aqui"

# Banco de Dados
DATABASE_URL="file:./dev.db"

# AWS S3 (Supabase Storage)
AWS_DEFAULT_REGION="sa-east-1"
AWS_USE_PATH_STYLE_ENDPOINT=true
AWS_ACCESS_KEY_ID="sua_access_key"
AWS_SECRET_ACCESS_KEY="sua_secret_key"
AWS_ENDPOINT="sua_url_do_supabase"
AWS_URL="sua_url_base"
AWS_BUCKET="seu_bucket"
```

## 📡 Endpoints Disponíveis

### 🏠 Home
- `GET /api/` - Informações da API

### 🔐 Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado
- `PUT /api/auth/update-profile` - Atualizar perfil do usuário

> 📮 **Importe a collection do Postman** (`adote-pets.postman_collection.json`) para testar todos os endpoints!

## 👥 Equipe de Desenvolvimento

**Sonata dos Bytes** 🎵

- **Erikli Arruda** - [GitHub](https://github.com/Erikli999)
- **Pedro Henrique Martins Borges** - [GitHub](https://github.com/piedro404)
- **Guilherme Felipe** - [GitHub](https://github.com/guilherme-felipe123)
- **Luan Jacomini Kloh** - [GitHub](https://github.com/luanklo)
- **Matheus Augusto** - [GitHub](https://github.com/Matheuz233)
- **Thayna Bezerra** - [GitHub](https://github.com/thayna-bezerra)

## 📞 Contato
🔗 Entre em contato para mais informações: [pedro.henrique.martins404@gmail.com](mailto:pedro.henrique.martins404@gmail.com)

---

🚀 **Agora a API está pronta para desenvolvimento!** 🎉

> Desenvolvido com 💙 pela equipe **Sonata dos Bytes** para o projeto **TED - UNIBALSAS**
