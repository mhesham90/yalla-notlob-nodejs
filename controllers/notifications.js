var express=require('express');
var expressServer=express();
// HTTP SERVER
var http=require('http');
var httpSERVER=http.createServer(expressServer);
var io=require('socket.io')(httpSERVER);


httpSERVER.listen(8090);
module.exports = router;
