var express = require("express");


var { Client } = require('pg');
/*const client = new Client({
    user: 'postgres',
    host: 'database',
    database: 'postgres',
    port: 5432,
})*/


var Redis = require("redis");
(async () => {
    const redis = Redis.createClient({host:'redis-server', port: 6379});
    
    redis.on('error', (err) => console.log('Redis Client Error', err));

    await redis.connect();
})();
//var grpc = require("./grpc_client");

var app = express();
const port = 3000;

//app.use()
//client.connect();


app.get('/', async(req,res) => {
    res =  await client.query('SELECT Id FROM items');
    console.log(res.rows[0]);
});


app.get('/inventory/search', async(req, res) =>{
    var sting = req.params.q;
    res = await client.query('select * from items');
    console.log(res.rows[0]);
    res.send('opa opa');
});

app.listen(port, () =>{
        console.log("running") 
});