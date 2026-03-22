FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

# Copia dependencias e o schema
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependencias
RUN npm install

# Copia o restante do codigo e compila
COPY . .
RUN npx prisma generate
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Executa as migrations/sync do script, seed e então sobe o app
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm run start:prod"]
