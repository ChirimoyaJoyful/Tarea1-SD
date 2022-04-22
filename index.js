var express = require("express");

var grpc = require("./grpc_client");

var app = express();
const port = 3000;

//app.use()



app.get('/inventory/search',async(req, res) =>{
    var sting = req.params.q;
    console.log(sting);
    res.send('opa opa');
});

app.listen(port, () =>{
        console.log("running") 
});