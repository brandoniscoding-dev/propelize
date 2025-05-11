FROM node:22.14.0-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
