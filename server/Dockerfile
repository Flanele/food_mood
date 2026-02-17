FROM node:alpine  AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate
RUN npm run build \
    && mkdir -p dist/generated \
    && cp -r generated/prisma dist/generated/prisma


FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]
