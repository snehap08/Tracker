const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const server= http.createServer(app);
const io = socketio(server);

app.set("view engine",'ejs');
app.use(express.static(path.join(__dirname,'public')));


// handling the io function in scipt.js
io.on('connection',function(socket){
    //handle location
    console.log("A user connected:", socket.id);
    socket.on("send-location", function(data) {
        io.emit("receive-location",{id:socket.id, ...data});  //jitne bhi log connect honge sabko location send ho jayegi, harr socket ki ek unique id hoti hai to ye humne uski id bhej di and instead of  hath se about all data better hai ki use this '...' spread operator.
    });
    console.log("ho gya bhyii connect");

    //handle socket ka disconnect
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
            console.log("A user disconnected:", socket.id);
    })
});
app.get('/',(req, res)=>{
    res.render('index');
});

server.listen(3000,()=>{
    console.log("3000 pe chl rha hu");
});



