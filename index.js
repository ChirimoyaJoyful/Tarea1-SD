const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');



//POSTGRESQL CONNECTION

const pool = new Pool({
    user: 'postgres',
    host: 'database',
    database: 'tiendita',
    password: 'marihuana',
    port: 5432,
});

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



app.get('/', async(req,res) => {
    pool.query('SELECT Id FROM items', (err,res) =>{
        if (err){
            console.log(err.stack)
        } else{
            console.log(res)
        }
    })
});

app.get('/inventory/search', async(req, res) =>{
    var q = req.query.q;
    var reply = await redisClient.get(q);
    if(reply){
        console.log("Cache");
    }else{
        var items = await pool.query("SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [q]);
        var cosa = JSON.stringify(items.rows)
        res.send(cosa);
        console.log("Database");
        await redisClient.setEx(q,600,cosa);
    }
});

//"SELECT * FROM items WHERE Name LIKE '%' || $1 || '%'", [q]

app.listen(port, () =>{
    console.log('Server running on port', port);
}); 