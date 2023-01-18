const express = require ("express");
const app = express();

const port = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Hello Andra");
});

app.post("/login", (req, res) =>{
    const loginUser = req.body.userName;
    console.log('Login username: '+loginUser);
    res.send('Hello there, '+loginUser);
});

app.listen(port, ()=>{
    console.log("listening");
});