const express = require("express");
const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const Redis = require("redis");

const redisClient = Redis.createClient({url:"redis://default:8AebdCgC2YDW2U5h@redis-stedi-andra:6379"});

const {v4: uuidv4} = require('uuid'); //universally unique identifier

const https = require('https');

const fs = require('fs');

app.use(bodyParser.json());

app.use(express.static('public'));

const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(async function (req,res,next){
    var cookie = req.cookies.stedicookie;
    if(cookie === undefined && !req.url.includes("login") && !req.url.includes("html") && req.url !== "/" 
    && !req.url.includes("css") && !req.url.includes("js") && !req.url.includes("ico") && !req.url.includes("png")){
        //no: set a new cookie
        res.status(401);
        res.send("no cookie");
    }
    else {
        //yes, cookie was already present
        res.status(200);
        next();
    }
});

app.post('/rapidsteptest', async(req,res)=>{
    const steps = req.body;
    await redisClient.zAdd('Steps', [{score:0, value:JSON.stringify(steps)}]);
    console.log('Steps', steps);
    res.send('saved');
});

app.get("/", (req, res)=>{
    res.send("Hello Andra");
});

app.get("/validate", async(req, res)=>{
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
});

app.post("/login", async (req, res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password;
    console.log('Login username: '+loginUser);
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword == correctPassword){
        const loginToken = uuidv4();
        await redisClient.hSet('TokenMap', loginToken, loginUser);
        res.cookie('stedicookie', loginToken);
        res.send(loginToken);
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

// https.createServer (
//     {key: fs.readFileSync('/etc/letsencrypt/live/andrahale.cit270.com/privkey.pem'),
//      cert: fs.readFileSync('/etc/letsencrypt/live/andrahale.cit270.com/cert.pem'),
//      ca: fs.readFileSync('/etc/letsencrypt/live/andrahale.cit270.com/fullchain.pem')},
//     app
// ).listen(port, ()=>{
//     redisClient.connect();
//     console.log('Listening on port: '+port);
// });