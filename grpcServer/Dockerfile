FROM node:12

WORKDIR /tarea1

#COPY /grpcServer/ ./
COPY . .

RUN npm install



CMD [ "node", "grpc_server.js" ]