FROM node:12

WORKDIR /tarea1

COPY package*.json ./

RUN  npm install

COPY index.js ./

CMD [ "node", "index.js" ]