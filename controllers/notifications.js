var express = require('express');
var expressServer = express();
var bodyParser = require("body-parser");
var postRequestMiddleware = bodyParser.json;
var mongoose = require("mongoose");

var notifMsg = function(notification) {

    var msg = notification.message;
    //console.log(msg)
    msg = msg.split(':');
    if (msg.indexOf('[u]') !== -1) {
        if (notification.userId) {
            notification.userId['type'] = "user";
            msg[msg.indexOf('[u]')] = notification.userId
        } else console.log('userid not found', notification)
    }

    if (msg.indexOf('[o]') !== -1) {
        if (notification.orderId) {
            notification.orderId['type'] = "order";
            msg[msg.indexOf('[o]')] = notification.orderId
        } else console.log('orderid not found', notification)

    }
    if (msg.indexOf('[e]') !== -1) {

        msg[msg.indexOf('[e]')] = {}


    }
    if (msg.indexOf('[g]') !== -1) {
        if (notification.groupId) {
            notification.groupId['type'] = "group";
            msg[msg.indexOf('[g]')] = notification.groupId
        } else console.log('groupid not found', notification)

    }
    if (msg.length == 1) {
        msg[1] = msg[0]
        msg[0] = {}
        msg.push({ empty: 0 })
    }
    console.log(msg)
    return { msg: msg, notif_id: notification._id }
}

const msgs = ['[u]: is now friend with :[u]',
    '[u]: added you to :[g]',
    '[u]: was added to :[g]: group',
    '[u]: created :[g]',
    '[u]: invitated you to :[o]: order',
    '[u]: made an order :[o]',
    // '[o]:your  was sent',
    // '[o]:your  was deleted',
    // '[u]: added you as friend',
    // '[g]: was invited to :[o]: order'

    '[e]: your :[o]: order was sent',
    '[e]: your order to :[r]: was deleted',
    '[u]: added you as friend',
    '[e]: your group :[g]: was invited to order :[o]'

];
//
var addnotif = function(types, parts) {



    // console.log("parts", parts);
    //console.log('in if')
    mongoose.model("users").find({ _id: parts.user }, function(err, user) {

        if (!err) {
            if (user.length !== 0) {
                var friends = user[0].friends || Array()
                console.log('friends', friends);

                types.forEach(function(type) {
                    var notification = { seen: [] };
                    var flag = 1
                    switch (type) {
                        case 0:
                            {
                                flag
                                //deprecated
                                break;
                            }
                        case 3:
                            {
                                notification.to = friends;
                                for (var i = 0; i < notification.to.length; i++) {
                                    notification.seen[i] = { seen: false, id: notification.to[i].toString() };

                                }
                                notification.userId = parts.user;
                                notification.groupId = parts.group._id;
                                notification.message = msgs[3];
                            }

                            break;
                        case 1:
                            {
                                notification.to = parts.userId;
                                notification.seen[0] = { seen: false, id: parts.userId.toString() };

                                notification.groupId = parts.group._id;
                                notification.userId = parts.user;
                                notification.message = msgs[1];
                                break;
                            }

                        case 2:
                            {
                                notification.userId = parts.userId;
                                notification.to = parts.group.members;
                                for (var i = 0; i < notification.to.length; i++) {
                                    notification.seen[i] = { seen: false, id: notification.to[i].toString() };

                                }
                                notification.groupId = parts.group._id;
                                notification.message = msgs[2];
                            }
                            break;


                        case 5:
                            {
                                notification.to = friends;
                                for (var i = 0; i < notification.to.length; i++) {
                                    notification.seen[i] = { seen: false, id: notification.to[i].toString() };

                                }
                                notification.orderId = parts.order._id;
                                notification.userId = parts.user;
                                notification.message = msgs[5];
                                console.log('case5', notification)

                            }
                            break;

                        case 4:
                            {
                                var invited = []
                                parts.order.invitedfriends.forEach(function(f) { invited.push(f._id) });
                                notification.to = invited;
                                for (var i = 0; i < notification.to.length; i++) {
                                    notification.seen[i] = { seen: false, id: notification.to[i].toString() };

                                }
                                notification.orderId = parts.order._id;
                                notification.userId = parts.user;
                                notification.message = msgs[4];
                            }
                            break;



                        case 6:
                            {
                                console.log('case6', parts, parts.order.joined.length, parts.order.hasOwnProperty('joined'));
                                var joined = parts.order.joined || Array()
                                if (joined.length) {

                                    console.log('yes')
                                    notification.to = joined;
                                    for (var i = 0; i < notification.to.length; i++) {
                                        notification.seen[i] = { seen: false, id: notification.to[i].toString() };
                                    }
                                    notification.orderId = parts.order._id;
                                    notification.message = msgs[6];
                                } else flag = 0


                            }
                            break;


                        case 7:
                            {
                                console.log('case7', parts)
                                var joined = parts.order.joined || Array()
                                if (joined.length) {
                                    console.log('yes')
                                    notification.to = joined;
                                    for (var i = 0; i < notification.to.length; i++) {
                                        notification.seen[i] = { seen: false, id: notification.to[i].toString() };
                                    }

                                    notification.message = 'your order to ' + parts.order.resturant + ' was canceled';
                                } else flag = 0


                            }

                            break;

                        case 8:
                            {
                                notification.to = parts.userId;
                                notification.seen[0] = { seen: false, id: parts.userId.toString() }
                                notification.userId = parts.user;
                                notification.message = msgs[8];

                            }
                            break;

                        case 9:
                            {
                                notification.to = [];
                                parts.group.members.forEach(function(member) {
                                    notification.to.push(member._id);
                                })


                                for (var i = 0; i < notification.to.length; i++) {
                                    notification.seen[i] = { seen: false, id: notification.to[i].toString() };
                                }
                                notification.message = msgs[9];
                                notification.orderId = parts.order._id;
                                notification.groupId = parts.group._id;
                                //console.log('case9 notif',notification)
                            }
                            break;

                        default:
                            break;

                    }
                    // console.log('after', notification);
                    if (flag == 1 && notification.to.length !== 0) {
                        var notifModel = mongoose.model("notifications");
                        var notif = new notifModel(notification);
                        notif.save(function(err) {
                            if (!err) {
                                console.log("success");
                            } else {
                                console.log("Error", err);
                            }

                        });
                    for (var clientid in ioLoggedClients) {
                        if (notification.to.includes(clientid)) {
                            ioLoggedClients[clientid].emit("message", 'newNotif');
                        }
                    }

                    }


                })




            } else console.log('error', err);
        } else console.log('user not logged in')

    });


}


var router = express.Router();

//send notification

router['sendnotif'] = function(types, parts) {
    addnotif(types, parts);
    
}


io.on("connection", function(client) {

    console.log("io")
    client.emit('message', { unseen: "1" });

    client.on('login', function(id) {
        ioLoggedClients[id] = client;

    })
    client.on('disconnect', function () {
        ioLoggedClients.splice(ioLoggedClients.indexOf(client), 1);
    })
})



router.get('/', function(request, response) {


    mongoose.model('notifications').find({ to: request.token._id }).populate(' userId groupId orderId usersId', ['username', 'name']).exec(function(err, notif) {
        var notifff = [];

        notif.forEach(function(notification) {

            var notif = notifMsg(notification);
            notifff.push(notif);
        })
        response.json(notifff);
    })





})
router.get('/unseen', function(request, response) {
    console.log("notification unseen")
    var id = request.token._id
    mongoose.model('notifications').find({ 'seen.seen': false, 'seen.id': id }).populate(' userId groupId orderId usersId', ['username', 'name']).exec(function(err, notif) {
        var notifff = [];
        notif.forEach(function(notification) {

            var notif = notifMsg(notification);
            notifff.push(notif);
            //console.log(notif);
        })
        response.json(notifff);
    })
})


router.get('/activities', function(request, response) {

})

router.get('/setseen', function(request, response) {
    var id = request.token._id;
    console.log("put id in notif", id);
    mongoose.model('notifications').update({}, { $pull: { seen: { id: request.token._id, seen: false } } }, { multi: true }, function(err) {
        if (!err) response.json({ success: 'success' });
        else response.json({ success: 'false' });
    })



});



module.exports = router;