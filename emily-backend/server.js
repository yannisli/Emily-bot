const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const logger = require("morgan");
const url = require("url");

const fs = require('fs');

const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(
    process.env.MONGO_DB,
    { useFindAndModify: false, useNewUrlParser: true }
);

mongoose.connection.once("open", () => console.log("Successfully connected to MongoDB"));

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));





const app = express();

let hasKey = fs.existsSync("./" + process.env.PRIVATE_KEY) && fs.existsSync("./" + process.env.CERTIFICATE) && fs.existsSync("./" + process.env.CA_CERTIFICATE);

let server;

if(hasKey) {
    console.log("Does have key, starting as HTTPS");
    const options = {
        key: fs.readFileSync("./" + process.env.PRIVATE_KEY, 'utf8'),
        cert: fs.readFileSync("./" + process.env.CERTIFICATE, 'utf8'),
        ca: fs.readFileSync("./" + process.env.CA_CERTIFICATE, 'utf8')
    };
    server = require("https").createServer(options, app);

    const httpServer = require("http").createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    });
    
    
    
    httpServer.listen(80, () => { console.log("HTTP listening on 80 to redirect to https")});
}
else
{
    console.log("Does not have key, starting as HTTP");
    server = require("http").createServer(app);
}
const io = require("socket.io")(server);

io.on("connection", require("./api/bot").SocketOnConnect);

// Logging
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(logger("dev"));

// Serve the react app
app.use(express.static(path.join(__dirname, '../front/build'), {index: false}));


app.use("/api/oauth2", require("./api/oauth2").Router);
app.use("/api/discord", require("./api/discord"));
app.use("/api/messages", require("./api/messages"));
app.use("/api/bot", require("./api/bot").Router);

app.use( (err, req, res, next) => {
    if(res.headersSent) {
        return next(err);
    }
    console.error(err);
    res.sendStatus(500);
});

app.get("*", (req, res) => {
    if(req.headers.host.slice(0, 4) === 'www.') {
        let newHost = req.headers.host.slice(4);
        res.redirect(url.format({
            protocol: req.protocol,
            host: newHost,
            pathname: req.originalUrl
        }));
    }
    else
        res.sendFile(path.join(__dirname, "../front/build/index.html"));
});




const port = process.env.PORT !== undefined ? process.env.PORT : hasKey ? 443 : 80;

server.listen(port, () => {
    console.log(`Server now running on port ${port}`);
});


