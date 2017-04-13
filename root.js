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

// expressServer.get('*', function(req, res) {
//     res.sendfile('./public/yalla-notlob-angular2/src/index.html');
// });

 expressServer.use(function (request,response,next) {
 	response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Headers","x_access_token, X-Requested-With, Content-Type");
    // allow four HTTP method
    response.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");

          var token =request.headers['x_access_token'];
     // var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZnJpZW5kcyI6ImluaXQiLCJub3RpZmljYXRpb25zIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJhdmF0YXIiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0IiwibmFtZSI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsImZyaWVuZHMiOnRydWUsIm5vdGlmaWNhdGlvbnMiOnRydWUsImF2YXRhciI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInVzZXJuYW1lIjp0cnVlLCJuYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImZyaWVuZHMiOltdLCJub3RpZmljYXRpb25zIjpbXSwiX192IjowLCJhdmF0YXIiOiJpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBTUFBQUFEQUNBQUFBQUIzdHpQYkFBQUNPVWxFUVZSNEFlM2FDUXJySUJSRzRlNS9UeitDQkFsSWtJQUVDVWpvU3Q0OHovR1plQXZuck1DdmM2LzM4WHp4QUFBQVlDNEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFNQ0FBQUFBQUFBQUFBQUFBQUFQc2FnejRWNHJxL0ZtQ0xUai9rNHZZcWdDTjUvVEtmamxjQUpLZmY1cEo1UVBINlk3N1lCaXo2YTR0aFFKMzBEMDNWS21CMytxZmNiaE93TytsK3dhUC8rVnNFQmdEVjZVU3VtZ05NT3RWa0RiRG9aSXN0UU5IcGlpbUExK204SlVCU1E4a080SEJxeUIxbUFFbE5KVE1BcjZhOEZjQ214allqZ0tqR29oR0FVMlBPQm1CWGM3c0p3S3JtVmhPQXFPYWlDVUJRYzhFRVFPMEp3UE1CNEFEQVN3aEFlM3lSOFZQaVAzL004WE9hUHpRZC9sTHlwNTZ4U3V2blVHSzB5SEMzMTNpZEN3NnVtTm92K2JobTVhSzdmZFdBWlEvV2Jkb1hubGc1WSttdmZlMlN4VmRXajIwRkFBQUFBQUFBQUFBQXdGUUFBSlNTMGh3bWZWTUljMHFsbUFmc09RV3ZQK1JEeXJ0TlFNMUwwRDhXbGx4TkFXcU9YaWZ6TVZjYmdHM3hhc3d2MjJqQUZwM2E2ekZ0ZVl3OGZROURNNkFtcjI3NVZHOEdsRm1kbTh1TmdEenBncVo4RXlCN1haVFBOd0RLcEF1YnlzV0FPdXZpNW5vbFlIVzZQTGRlQmppQ2Jpa2Mxd0NLMDAyNWNnVWc2OFp5ZjBEVXJjWGVnS2liaTMwQnEyNXY3UW5ZTktDdEgrQndHcEE3dWdGbURXbnVCU2dhVk9rRUNCcFU2QU9vR2xidEFsZzFyTFVMSUdoWW9RdkFhVml1QzBBRDZ3RTRYaDFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBREExOTRDdXFDNm9uaWt4WHdBQUFBQVNVVk9SSzVDWUlJPSIsInBhc3N3b3JkIjoiJDJhJDEwJHlzYTNJUjZlLy40Q2JzQnV2MlVaZnVsZmhHLmIyUzJtd0JibTZrbHd4enJvNC4xSE5FaEoyIiwidXNlcm5hbWUiOiJsZW5hYSIsIm5hbWUiOiJsZW5hYSIsImVtYWlsIjoibGVuYWFobWVkQGdtYWlsLmNvbSIsIl9pZCI6IjU4ZTg4OGRlYzczY2FiNjI0YzdjYjlhZiJ9LCJpYXQiOjE0OTE2MzUxNjJ9.07pRen1JbEcDg0vuABD79gK6QsmpBNZ_tagzHMdIyWI"

        if(token!== undefined) {
            jwt.verify(token, APP_SECRET, function (err, decoded) {
                if (err) {
                    console.log("error");
                    response.send(err);
                } else {
                    request.token=decoded;
                    next();
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

////load angular

// expressServer.get('/', function(req, res, next){
//     return res.sendfile(expressServer.get('public') + '/index.html');
// });



// httpSERVER.listen(8092);
httpSERVER.listen(server_port,server_ip_address);

//server.listen(server_port,server_ip_address);
