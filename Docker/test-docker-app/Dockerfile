FROM node:alpine

WORKDIR /test-app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
