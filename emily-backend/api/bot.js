let sockets = [];


const socketOnConnect = socket => {
    if(socket.handshake.query.token !== process.env.SOCKET_TOKEN)
    {
        socket.send({error: "Invalid Authentication provided."});
        socket.disconnect(true);
        return;
    }
    console.log("New Socket.io connection added");
    sockets.push(socket);

    socket.on("disconnect", () => {
        console.log("Socket.io connection closed");
        for(let i = 0; i < sockets.length; i++)
        {
            if(sockets[i] === socket)
            {
                sockets.splice(i, 1);
                break;
            }
        }
    });

    socket.emit("authenticated", true);
};


const socketEmit = (eventName, data, callback) => {

    for(let i = 0; i < sockets.length; i++)
    {
        if(!sockets[i])
            continue;
        if(!sockets[i].connected) {
            sockets.splice(i, 1);
            i--;
            continue;
        }
        sockets[i].emit(eventName, data);
        if(callback !== undefined) {
            
            sockets[i].once(eventName, reply => {
                callback(reply);
                for(let j = 0; j < sockets.length; j++)
                {
                    if(j !== i)
                        sockets[i].off(eventName);
                }
            });
        }
    }
};


const router = require("express").Router();

router.get("/status", (req, res) => {
    res.status(200).json(sockets.length > 0);
});

router.get("*", (req, res) => res.sendStatus(404));

exports.SocketOnConnect = socketOnConnect;
exports.SocketEmit = socketEmit;
exports.Router = router;