# Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

COPY .next ./

COPY ./src/api/dist ./src/api/dist

CMD [ "npm", "start" ]