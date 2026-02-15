FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXT_PUBLIC_BASE_URL=http://localhost:3000

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
