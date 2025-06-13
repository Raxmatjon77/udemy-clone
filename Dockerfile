
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
RUN apk add --no-cache openssl


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/main"]

EXPOSE 3000
