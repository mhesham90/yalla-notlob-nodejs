//set server port && ip address
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8090;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
// '172.16.5.117';
// 127.0.0.1
//set mongodb connection
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + "yalla_notlob";
//load Express Module
var express = require('express');
var jwt=require("jsonwebtoken");

var fs = require('fs');

//socket io
var expressServer=express();

var http=require('http');
var httpSERVER=http.createServer(expressServer);
io=require('socket.io')(httpSERVER);
ioLoggedClients=[];
ioUnloggedClients=[];
const APP_SECRET="@#$@#%!@#!@#";


//connect to mongoose
var mongoose = require("mongoose");
if(process.env.OPENSHIFT_MONGODB_DB_URL){
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}
mongoose.connect(mongodb_connection_string);

//require models
fs.readdirSync(__dirname+"/models").forEach(function (file) {
    require("./models/"+file);
});



//Entity "controller1"

var authRouter = require("./controllers/authenticate");
expressServer.use("/authenticate",authRouter);


////token middleware

 expressServer.use(function (request,response,next) {
          var token =request.headers['x-access-token'];
      //   var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZTYyNWZiM2Q1ZjZiODExZmY4OGI4MSIsImlhdCI6MTQ5MTUwNTQwNH0.uNaS9NDWmrIgPHVNtQHqmfgjXlc7YnvWiUc21a4MbPU"
        if(token!== undefined) {
            jwt.verify(token, APP_SECRET, function (err, decoded) {
                if (err) {
                    console.log("error");
                    response.send(err);
                } else {
                    response.json(decoded)
                   // request.token=decoded;
                   // next();
                }
            });
        }
        else{
            response.send("token does not exit")
        }


});


var userRouter = require("./controllers/user");
expressServer.use("/user",userRouter);


var orderRouter = require("./controllers/orders");
expressServer.use("/orders",orderRouter);

var groupRouter = require("./controllers/groups");
expressServer.use("/groups",groupRouter);

var notificationRouter = require("./controllers/notifications");
expressServer.use("/notifications",notificationRouter);

expressServer.get("/",function(request, response){
//  reponse.send("ay7aga");
    // response.redirect("/home controller");
    //check at home controller if not logged in redirect to login
});





// httpSERVER.listen(8092);
httpSERVER.listen(server_port,server_ip_address);

//server.listen(server_port,server_ip_address);
