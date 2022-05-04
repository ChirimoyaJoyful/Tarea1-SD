const express = require('express');
const redis = require('redis');
// const { Pool } = require('pg');
var grpc = require("@grpc/grpc-js");
var protoLoader  = require("@grpc/proto-loader");


//POSTGRESQL CONNECTION

// const pool = new Pool({
//     user: 'postgres',
//     host: 'database',
//     database: 'tiendita',
//     password: 'marihuana',
//     port: 5432,
// });


//////////////////////// gRPC
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
var client = new searchitem.SearchItem("server:50051", grpc.credentials.createInsecure());
// Objeto de prueba
var item2 = {term: "itemNro2" }

function searchGet(term) {
    console.log("searchGet :)")
    client.getSearch(term, (err, list) =>  {
        if (err) {
            console.log('Error al enviar/recibir rpc');
        } else {
            console.log("------------");
            console.log("dentro del get");
            // console.log(list.request);
            console.log(list.request);
            console.log("------------");
        }    
    });

    
}

// client.getSearch(item2, function(err, blank) {
//     if (err) {
//         console.log('Error al enviar rpc');
//     } else {
//         console.log(blank);
//     }    
// });
///////////////////////////End gRPC




//REDIS CONNECTION
const redisClient = redis.createClient({ url: 'redis://redis-server:6379'});
redisClient.on('error', (err) => {
    console.log('An error ocurred', err);
});
redisClient.on('connect', (err) => {
    console.log('Redis connection succesfull');
});
redisClient.connect();

/*(async () => {
    
    await 

    await redisClient.set('key', 'value');
    const value = await redisClient.get('key');
})();*/


const port = 3000;

const app = express();
const router = express.Router();

app.use(express.json());



// app.get('/', async(req,res) => {
//     pool.query('SELECT Id FROM items', (err,res) =>{
//         if (err){
//             console.log(err.stack)
//         } else{
//             console.log(res)
//         }
//     })
// });

app.get('/inventory/search', async(req, res) =>{
    var term = req.query;
    var reply = await redisClient.get(term.term);
    if(reply){
        console.log("Cache");
    }else{
        searchGet(term);
        // var items = await pool.query("SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [term.term]);
        // var cosa = JSON.stringify(items.rows)
        // res.send(cosa);
        // console.log("Database");
        await redisClient.setEx(term.term,600,term);
    }
});

//"SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [q]

app.listen(port, () =>{
    console.log('Server running on port', port);
}); 