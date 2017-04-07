var express=require('express');
var expressServer=express();
var bodyParser=require("body-parser");
var postRequestMiddleware=bodyParser.json;
var mongoose = require("mongoose");

function notifMsg(notification) {
    console.log(notification);

    var msg =notification.message;
    console.log(msg)
    msg =msg.split(':');
    if(msg.indexOf('[u]')!== -1){
        notification.userId['type']="user";
        msg[msg.indexOf('[u]')]=notification.userId
    }
    if(msg.indexOf('[o]')!== -1){
        notification.orderId['type']="order";
        msg[msg.indexOf('[o]')]=notification.orderId
    }
    if(msg.indexOf('[g]')!== -1){
        notification.groupId['type']="group";
        msg[msg.indexOf('[g]')]=notification.groupId
    }

    return {msg:msg,notif_id:notification._id}
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
    //var id='58e75d0ef48126268d2dc6c6';
    var id =request.token._id;

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
