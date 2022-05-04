var grpc = require("@grpc/grpc-js");
var protoLoader  = require("@grpc/proto-loader");
const express = require('express');
const { Pool } = require('pg');

// POSTGRESQL CONNECTION

const pool = new Pool({
    user: 'postgres',
    host: 'database',
    database: 'tiendita',
    password: 'marihuana',
    port: 5432,
});



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

        getSearch: getSearch

    });
    return server;
}

var routeServer = getServer();
routeServer.bindAsync("server:50051", grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
});



// function searchDB(term) {

    // return new Promise(function (resolve, reject) {
    //     pool.query("SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [term], (err, res) => {
    //         if (err) {
    //             console.log('Error saving to db: ' + err);
    //             return 0;
    //         } else {
    //             console.log('id' + res.rows[0]) //This gives me the value to console.
    //             return res.rows;
    //         }   
    //     })
    // })
    // var items = pool.query("SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [term]);
    // var cosa = JSON.stringify(items.rows);
    // console.log(cosa);
    // return cosa
// }



async function getSearch(term,callback) {
    termStr = term.request.term;
    // buscar en base de datos
    console.log(termStr)
    // enviar al cliente
    var items = await pool.query("SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [termStr]);
    var itemJson = JSON.stringify(items.rows);
    // var objList = { listEl : itemJson};
    var objList = {listEl: [{"id":5,"name":"John Hardy Womens Legends Naga Gold & Silver Dragon Station Chain Bracelet","price":695,"category":"jewelery","count":400},{"id":6,"name":"Solid Gold Petite Micropave ","price":168,"category":"jewelery","count":70}]}
    console.log(objList);
    callback(null, objList);
    
}









// function checkSearch(terminoDeBusqueda) {
//     console.log("checksearch");
    
//     // console.log("Se a enviado un resultado!")
//     // return results;
// }

// function getSearch(search, callback) {
//     console.log("Recibido el termino: ")
//     console.log(search.request.term);
//     checkSearch(search.request.term);
//     callback(null, blank);
// }








// exports.server = server;

const port = 30002;


const app = express();


app.use(express.json());

app.listen(port, () =>{
    console.log('Server running on port', port);
});
