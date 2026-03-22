# Brain Agriculture API


## Tecnologias Utilizadas
- **Node.js**
- **TypeScript**
- **NestJS**
- **Prisma**
- **PostgreSQL**
- **Vitest**
- **Swagger**
- **Pino**

## Arquitetura e Decisões Técnicas

Foi adotada a **Arquitetura em Camadas** e princípios de **Domain-Driven Design (DDD)** e **Clean Code**:
- **Domain Layer**: Validações de CPF/CNPJ (via algorítmo nativo para não depender excessivamente de bibliotecas externas) e de regras de áreas (`farm-area.validator`) isoladas da infraestrutura.
- **Application Layer**: Serviços acionando os casos de uso sem acoplamento a regras HTTP. A lógicas de transações ficam retidas aqui.
- **Infrastructure Layer**: Isolada via `PrismaService` - facilita a troca do banco ou mock nos testes.
- **Delivery Layer**: Controllers com validação rigorosa dos payloads via `ClassValidator` (`ValidationPipe`), garantindo o contrato da API (`DTOs`).

**Observabilidade & Segurança:**
- Logs estruturados em Console utilizando `nestjs-pino`.
- Configuração de `Helmet` (Headers HTTP seguros) e `CORS` habilitados.
- Tratamento global de exceções, omitindo rastros da stack para o cliente em ambiente de produção mantendo rastreabilidade apenas no console.

## Como Executar
A forma mais rápida e limpa de rodar o projeto do zero para avaliação é via **Docker**:

1. **Subir a Aplicação via Docker Compose:**
   ```bash
   docker compose up -d --build
   ```
Pronto! O container vai instalar tudo, configurar sozinho o banco postgres, executar o script de **Seed** automaticamente (populando o banco) e subir a API.

Acesse a documentação: `http://localhost:3000/api/docs`

---

## Como Executar (Desenvolvimento Local)

1. **Subir Banco de Dados via Docker:**
   ```bash
   docker compose up -d postgres
   ```
2. **Instalar Dependências:**
   ```bash
   npm install
   ```
3. **Gerar Client do Prisma e Sincronizar Banco de Dados (PostgreSQL):**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Preencher Banco com Seeds (Mocks Iniciais):**
   ```bash
   npm run prisma db seed
   ```
5. **Rodar a Aplicação:**
   ```bash
   npm run start:dev
   ```

A API estará em `http://localhost:3000/api`.

## Documentação API (Swagger)
Acesse a especificação interativa pelo Swagger UI:
- **`http://localhost:3000/api/docs`**

## Testes Automatizados (Vitest)
Foram adicionados testes unitários utilizando Vitest sobre as camadas críticas do sistema (Domain e Services).
- Testar: `npm run test`
