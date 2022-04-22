const grpc = require("@grpc/grpc-js");
const protoLoader  = require("@grpc/proto-loader");

const PROTO_PATH = "./setup.proto";

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition);

function getServer() {
    const server = new grpc.Server();
    server.addService({

    });
    return server;
}
const routeServer = getServer();
routeServer.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
});

exports.server = server;