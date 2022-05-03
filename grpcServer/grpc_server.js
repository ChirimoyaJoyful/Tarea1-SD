var grpc = require("@grpc/grpc-js");
var protoLoader  = require("@grpc/proto-loader");
const express = require('express');

var PROTO_PATH = "./setup.proto";

var options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    arrays: true
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

var searchPckg = grpc.loadPackageDefinition(packageDefinition);
var searchitem = searchPckg.searchPackage;

function getServer() {
    var server = new grpc.Server();
    server.addService(searchitem.SearchItem.service,{
        "getSearch": getSearch
    });
    return server;
}

var routeServer = getServer();
routeServer.bindAsync("server:50051", grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
});

function checkSearch(terminoDeBusqueda) {
    console.log("checksearch");
    
    // console.log("Se a enviado un resultado!")
    // return results;
}

function getSearch(search, callback) {
    console.log("Recibido el termino: ")
    console.log(search.request.term);
    checkSearch(search.request.term);
    callback(null, blank);
}








// exports.server = server;

const port = 30002;


const app = express();


app.use(express.json());

app.listen(port, () =>{
    console.log('Server running on port', port);
});
