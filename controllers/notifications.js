var express=require('express');
var expressServer=express();
var bodyParser=require("body-parser");
var postRequestMiddleware=bodyParser.json;
var mongoose = require("mongoose");

function notifMsg(notification) {
    var msg =notification.message;
    msg =msg.split(':');
    msg.indexOf('[u]')!== -1?msg[msg.indexOf('[u]')]=notification.userId:null;
    msg.indexOf('[o]')!== -1 ?msg[msg.indexOf('[o]')]=notification.orderId:null;
    msg.indexOf('[g]')!== -1?msg[msg.indexOf('[g]')]=notification.groupId:null;
    return {msg:msg,id:notification._id}
}

var router = express.Router();

//send notification

io.on("connection",function (client) {
    ioUnloggedClients.push(client);
    client.on('login',function (id) {
        ioLoggedClients[id]=client;
        ioUnloggedClients.splice(ioUnloggedClients.indexOf(client),1);
    })
    client.on('sendNotif',function (notification) {
        for(var clientid in ioLoggedClients){
            if(notification.to.includes(clientid)){
                ioLoggedClients[clientid].emit('newNotif');
            }
        }
    })
})


router.get('/',function (request,response) {
    //get user id
    var id='58e3a68f82e295716c68bf34';
    mongoose.model('notifications').find({to:id,seen:false}).populate(' userId groupId orderId ',['username','name']).exec(function (err,notif) {
        notif.forEach(function (notification) {

            var notif =notifMsg(notification);
            console.log(notif);
        })
    })

})

router.get('/activities',function (request,response) {

})

router.put('/',postRequestMiddleware,function (request,response) {
    var id =request.body.id;
    console.log(id);
    mongoose.model('notifications').update({_id:id},{$set:{seen:true}},function(err,yes){
        if(!err){
            response.status(200);
            response.send("success ");
        }else{
            response.status(404);
            response.send("Error");
        }
    });

});



module.exports = router;
