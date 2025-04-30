# Stage 1: Build stage
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production stage
FROM node:16-alpine

WORKDIR /app

RUN mkdir -p /app/logs && chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node --from=build /app ./

EXPOSE 3000

CMD ["node", "server.js"]
