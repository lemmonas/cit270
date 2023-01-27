const express = require("express");
const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const Redis = require("redis");

const redisClient = Redis.createClient({url:"redis://127.0.0.1:6379"});

const {v4: uuidv4} = require('uuid'); //universally unique identifier

app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/", (req, res)=>{
    res.send("Hello Andra");
});

app.post("/login", async (req, res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password;
    console.log('Login username: '+loginUser);
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword == correctPassword){
        const loginToken = uuidv4();
        res.send(loginToken)
        //res.send("Hello there, " + loginUser);
    }else{
        res.status(401);
        res.send("Incorrect password for " + loginUser);
    }
    //res.send('Hello there, ' + loginUser);
});

app.listen(port, ()=>{
    redisClient.connect();
    console.log("listening");
});