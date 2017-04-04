//set server port && ip address
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8090;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
//set mongodb connection
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + "ordersystem";
//load Express Module
var express = require('express');
var fs = require('fs');

//socket io
var expressServer=express();

var http=require('http');
var httpSERVER=http.createServer(expressServer);
 io=require('socket.io')(httpSERVER);



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
var authorizeRouter = require("./controllers/authorize");
expressServer.use("/authorize",authorizeRouter);

var orderRouter = require("./controllers/orders");
expressServer.use("/orders",orderRouter);

var notificationRouter = require("./controllers/notifications");
expressServer.use("/notifications",notificationRouter);

expressServer.get("/",function(request, response){
//  reponse.send("ay7aga");
    // response.redirect("/home controller");
    //check at home controller if not logged in redirect to login
});





httpSERVER.listen(8092);
//server.listen(server_port,server_ip_address);
