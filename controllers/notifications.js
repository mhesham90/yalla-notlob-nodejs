var express=require('express');
var expressServer=express();
var bodyParser=require("body-parser");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var mongoose = require("mongoose");
var MongoOplog = require ('mongo-oplog');

var MongoWatch = require ('mongo-watch');


var router = express.Router();



var oplog= MongoOplog('mongodb://127.0.0.1:27017/local',{ns:'ordersystem.notification'})

oplog.tail().then(function () {
    console.log('tailing started')
}).catch(function () {
 console.error(err)})
io.on("connection",function (client) {
    console.log('new client');


    oplog.on('insert',function (doc) {
        client.emit("new_notification",JSON.stringify(doc.o));
    })

})





module.exports = router;
