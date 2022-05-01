const express = require('express');
const redis = require('redis');



(async () => {
    const redisClient = redis.createClient({ url: 'redis://redis-server:6379'});
    redisClient.on('error', (err) => {
        console.log('An error ocurred', err);
    });
    redisClient.on('connect', (err) => {
        console.log('Redis connection succesfull');
    });
    await redisClient.connect();

    await redisClient.set('key', 'value');
    const value = await redisClient.get('key');
})();
const port = 3000;

const app = express();
const router = express.Router();

app.use(express.json());



app.listen(port, () =>{
    console.log('Server running on port', port);
}); 