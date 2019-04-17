const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const logger = require("morgan");
const url = require("url");

const mongoose = require("mongoose");

require('dotenv').config();

mongoose.connect(
    process.env.MONGO_DB,
    { useNewUrlParser: true }
);

mongoose.connection.once("open", () => console.log("Successfully connected to MongoDB"));

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));





const app = express();

const server = require("http").Server(app);
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

const port = process.env.PORT || 80;

server.listen(port, () => {
    console.log(`Server now running on port ${port}`);
});

