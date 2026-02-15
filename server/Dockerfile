FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate
RUN npm run build \
    && mkdir -p dist/generated \
    && cp -r generated/prisma dist/generated/prisma

EXPOSE 3000

CMD ["npm", "run", "start"]
