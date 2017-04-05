var express=require('express');
var expressServer=express();
var bodyParser=require("body-parser");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var mongoose = require("mongoose");



var router = express.Router();




router.get('/',function (request,response) {
    //get user id
    var id='58e3a68f82e295716c68bf34';
    mongoose.model('notifications').find({to:id,seen:false}).populate(' userId groupId orderId ',['username','name']).exec(function (err,notif) {
        notif.forEach(function (notification) {
            var msg =notification.message;
            msg =msg.split(':');
            msg.indexOf('[u]')!= -1?msg[msg.indexOf('[u]')]=notification.userId:null;
            msg.indexOf('[o]')!= -1 ?msg[msg.indexOf('[o]')]=notification.orderId:null;
            msg.indexOf('[g]')!= -1?msg[msg.indexOf('[g]')]=notification.groupId:null;
            notif={msg:msg,id:notification._id}
            console.log(notif);
        })
    })

})

router.put('/',function (request,response) {
    var id ='58e4796e1c0d96b11de30e8f';
    console.log('dkdk');
    mongoose.model('notifications').update({_id:id},{$set:{seen:true}});

})





module.exports = router;
