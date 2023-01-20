const express = require ("express");
const app = express();

const port = 3000;

const bodyParser = require("body-parser");

const {v4: uuidv4} = require('uuid'); //universally unique identifier

app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Hello Andra");
});

app.post("/login", (req, res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password;
    console.log('Login username: '+loginUser);
    if (loginUser == "General Kenobi" && loginPassword == "blahBl@h5"){
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
    console.log("listening");
});