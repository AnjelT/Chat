const http = require("http")
const path = require("path");
const express = require("express");
const soketio = require("socket.io")
const formatMessage = require("./public/utils/messages.js")
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require("./public/utils/users.js")

const app = express();
const server = http.createServer(app)
const io = soketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCode Bot"

//Run when client connects
io.on("connection", socket=>{

    socket.on("joinRoom", ({username,room})=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCode!")); //miayn miacwxin a gnum haxordagrutyun@

    //Broadcast when user connects
    socket.broadcast.to(user.room).emit(
        "message", 
         formatMessage(botName,`${user.username} has join the chat`)); //tarberutyunn ayn e, vor broadcast.emit()-ov gnum a bolorin bacarutyamb en userin, vor miacela ete uzum enq bolor usernerin gna grum enq io.emit

         //Send user and room info //info in left when user is join
         io.to(user.room).emit("roomUsers",{
             room: user.room,
             users: getRoomUsers(user.room)
         });
    })

    //Listen for chatMessage
    socket.on("chatMessage", (msg)=>{
        const user = getCurrentUser(socket.id);

        // console.log(msg); //terminalum stanalu hamar log enq anum
        io.to(user.room).emit("message", formatMessage(user.username,msg)); //io.emit vorovhetev bolorn en teselu arden console-um
    });
    //Runs when client disconnects
    socket.on("disconnect", ()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit("message",formatMessage(botName,`${user.username} has left the chat`))

            //Send users and room info //grum enq nayev disconnect-i jamanak, vor user@ disconnect ani tesnenq ova mnacel
            io.to(user.room).emit("roomUser",{
                user: user.room,
                users:getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 8000 || process.env.PORT
server.listen(PORT, ()=> console.log(`Server run on port ${PORT}`));