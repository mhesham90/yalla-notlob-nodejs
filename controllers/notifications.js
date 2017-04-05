var express=require('express');
var expressServer=express();
// HTTP SERVER
var http=require('http');
var httpSERVER=http.createServer(expressServer);
var io=require('socket.io')(httpSERVER);

var mongoose = require("mongoose");

router.use(function(request,response,next){
    // Set Origin to allow other domains to send request
    response.setHeader("Access-Control-Allow-Origin","*");
    // allow four HTTP method
    response.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");

    next();
});

httpSERVER.listen(8090);
module.exports = router;
