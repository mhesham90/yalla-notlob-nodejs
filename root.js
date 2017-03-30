//set server port && ip address
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
//set mongodb connection
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + "orders";
//load Express Module
var express = require('express');
var server = express();
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
var controller1Router = require("./controllers/controller1");
server.use("/controller1",controller1Router);


server.get("/",function(request, response){
    //response.redirect("/home controller");
    //check at home controller if not logged in redirect to login
});



server.listen(server_port,server_ip_address);