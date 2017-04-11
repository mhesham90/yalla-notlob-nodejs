var express = require('express');
var expressServer = express();
var bodyParser = require("body-parser");
var postRequestMiddleware = bodyParser.json;
var mongoose = require("mongoose");

var notifMsg = function(notification) {

    var msg = notification.message;
    console.log(msg)
    msg = msg.split(':');
    if (msg.indexOf('[u]') !== -1) {
        notification.userId['type'] = "user";
        msg[msg.indexOf('[u]')] = notification.userId
    }

    if (msg.indexOf('[o]') !== -1) {
        notification.orderId['type'] = "order";
        msg[msg.indexOf('[o]')] = notification.orderId
    }
    if (msg.indexOf('[g]') !== -1) {
        notification.groupId['type'] = "group";
        msg[msg.indexOf('[g]')] = notification.groupId
    }

    return { msg: msg, notif_id: notification._id }
}

const msgs=['[u]: is now friend with :[u]',
     '[u]: added you to :[g]',
     '[u]: was added to :[g]: group',
     '[u]: created :[g]',
     '[u]: invitated you to :[o]: order',
     '[u]: made an order :[o]',
     'your :[o]: was sent',
     'your :[o]: was deleted',
     '[u]: added you as friend',
     'your group :[g]: was invited to :[o]: order'
];
//
var addnotif =function (types,parts) {

    console.log("parts",parts);
        console.log('in if')
        mongoose.model("users").find({_id:parts.user},function (err,user) {
            console.log(parts);
            if(!err){
                var notification={seen:[]};
                if(user.length!==0)
                var friends=user[0].friends;
                //console.log('friends',friends);
                types.forEach(function (type) {

                    switch (type){
                        case 0 :{
                            //deprecated
                            break;
                        }
                        case 1 :{
                            if(parts.group.members.length!==0){
                                notification.to=parts.group.members;
                                for (var i=0;i<parts.group.members.length;i++){
                                    notification.seen[i]={seen:false,id:parts.group.members[i].toString()};
                                }
                                notification.userId=parts.user;
                                notification.groupId=parts.group._id;
                                notification.message=msgs[1];
                            }
                            break;
                        }
                        case 2 :{
                            notification.userId=parts.userId;
                            notification.to=parts.group.members;
                            for (var i=0;i<notification.to.length;i++){
                                notification.seen[i]={seen:false,id:notification.to[i].toString()};
                            }
                            notification.groupId=parts.group._id;
                            notification.message=msgs[2];
                        }
                            break;

                        case 3 :{
                            notification.to=friends;
                            for (var i=0;i<notification.to.length;i++){
                                notification.seen[i]={seen:false,id:notification.to[i].toString()};
                            }
                            notification.userId=parts.user;
                            notification.groupId=parts.group._id;
                            notification.message=msgs[3];
                        }
                            break;

                        case 4 :{
                            var invited =[]
                            parts.order.invitedfriends.forEach(function (f) { invited.push(f._id) });
                            notification.to=invited;
                            for (var i=0;i<notification.to.length;i++){
                                notification.seen[i]={seen:false,id:notification.to[i].toString()};
                            }
                            notification.orderId=parts.order._id;
                            notification.userId=parts.user;
                            notification.message=msgs[4];
                        }
                            break;

                        case 5 :{
                            notification.to=friends;
                            for (var i=0;i<notification.to.length;i++){
                                notification.seen[i]={seen:false,id:notification.to[i].toString()};
                            }
                            notification.orderId=parts.order._id;
                            notification.userId=parts.user;
                            notification.message=msgs[5];
                        }
                            break;

                        case 6 :{
                            if(parts.order.hasOwnProperty('joined')) {
                                notification.to = parts.order.joined;
                                for (var i = 0; i < notification.to.length; i++) {
                                    notification.seen[i] = {seen: false, id: notification.to[i].toString()};
                                }
                                notification.orderId = parts.order._id;
                                notification.message = msgs[6];
                            }

                        }
                            break;

                        case 7 :{
                            if(parts.order.hasOwnProperty('joined'))
                            {
                                notification.to=parts.order.joined;
                                for (var i=0;i<notification.to.length;i++){
                                    notification.seen[i]={seen:false,id:notification.to[i].toString()};
                                }
                                notification.orderId=parts.order._id;
                                notification.message=msgs[7];
                            }
                        }
                            break;

                        case 8 :{
                            notification.to=parts.userId;
                            notification.seen[0]={seen:false,id:parts.userId.toString()}
                            notification.userId=parts.user;
                            notification.message=msgs[8];
                        }
                            break;

                        case 9:{
                            notification.to=[];

                            notification.to.push.apply(notification.to,parts.group.members);

                            for (var i=0;i<notification.to.length;i++){
                                notification.seen[i]={seen:false,id:notification.to[i].toString()};
                            }
                            notification.orderId=parts.order._id;
                            notification.groupId=parts.group._id;
                        }
                            break;

                        default:break;

                    }
                    console.log('after',notification);

                    var notifModel=mongoose.model("notifications");
                    var notif=new notifModel(notification);
                    notif.save(function (err) {
                        if(!err){
                            console.log("success");
                        }else{
                            console.log("Error",err);
                        }

                    });


                })




            }
            else console.log('error',err);
        });


}


var router = express.Router();

//send notification

router['sendnotif'] = function(types, parts) {
    addnotif(types, parts);
    console.log('send notif', types, parts);
    for (var clientid in ioLoggedClients) {
        if (notification.to.includes(clientid)) {
            ioLoggedClients[clientid].emit('newNotif');
        }
    }
}

io.on("connection", function(client) {
    ioUnloggedClients.push(client);
    client.on('login', function(id) {
        ioLoggedClients[id] = client;
        ioUnloggedClients.splice(ioUnloggedClients.indexOf(client), 1);

    })

});




router.get('/', function(request, response) {
    //get user id
    //var id='58e75d0ef48126268d2dc6c6';

    var id = request.token._id;

    mongoose.model('notifications').find({ 'seen.seen':false, 'seen.id':request.token._id}).populate(' userId groupId orderId usersId', ['username', 'name']).exec(function(err, notif) {
        var notifff=[];
        notif.forEach(function(notification) {

            var notif = notifMsg(notification);
            notifff.push(notif);
            console.log(notif);
        })
        response.json(notifff);
    })

})

router.get('/activities', function(request, response) {

})

router.put('/', postRequestMiddleware, function(request, response) {
    var id = request.body.id;
    console.log(id);
    mongoose.model('notifications').find({ _id: id }, function(err, notif) {
        if (!err) {
            var index = notif.indexOf(request.token._id);
            var up = 'seen.' + index.toString();
            var obj = {};
            obj[up] = true;
            mongoose.model('notifications').update({ _id: id }, { $set: obj }, function(err) {
                if (!err) console.log('success');
                else console.log(err);
            })

        } else {
            console.log("Error", err);
        }
    })


});



module.exports = router;