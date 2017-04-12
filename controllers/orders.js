var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var notifications = require("./notifications");


var postRequestMiddleware = bodyParser.json({ limit: '20mb' });
//var postRequestMiddleware=bodyParser.urlencoded({extended:true});
var mongoose = require("mongoose");

router.use(function(request, response, next) {
    // Set Origin to allow other domains to send request
    response.setHeader("Access-Control-Allow-Origin", "*");
    // allow four HTTP method
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

    next();
});
//list orders
router.get("/allorders", function(request, response) {
        console.log("token", request.token._id)
        mongoose.model('orders').find({
                $or: [{ owner: request.token._id }, { joined: request.token._id }
                    // ,{invitedfriends:request.token._id}
                ]
            })
            .populate('joined invitedfriends invitedgroups', ['name', 'username']).exec(function(err, orders) {
                if (!err) {
                    var type;
                    // if(request.token._id )
                    var orderslist = [];

                    orders.forEach(function(order) {
                        var joined = order.joined;
                        var invitedgrp = order.invitedgroups;
                        var invitedfri = order.invitedfriends;
                        var joinedarr = [];
                        var invitedgroup = [];
                        var invitedfriend = [];
                        var grouparraylength = 0;
                        if (order.invitedgroups.length) { var invited = order.invitedfriends.length + order.invitedgroups.length - 1 } else {
                            var invited = order.invitedfriends.length + order.invitedgroups.length
                        }
                        joined.forEach(function(joined) {
                            joinedarr.push(joined.name);

                        })
                        invitedgrp.forEach(function(grp) {
                            invitedgroup.push(grp.name);
                            grouparraylength += grp.length;
                        })
                        invitedfri.forEach(function(friend) {
                                invitedfriend.push(friend.name);
                                //console.log("friend", friend)
                            })
                            //
                            //         // console.log(joinedarr)
                            //
                            //var invited = order.invitedfriends.length + grouparraylength;
                        var orderobj = {
                                name: order.name,
                                id: order._id,
                                owner: order.owner,
                                forr: order.forr,
                                resturant: order.resturant,
                                status: order.status,
                                meals: order.meals,
                                joined_no: order.joined.length,
                                invited_no: invited,
                                joined: joinedarr,
                                invitedgroups: invitedgroup,
                                invitedfriends: invitedfriend
                            }
                            //               // console.log(order)
                        orderslist.push(orderobj);

                    })

                }
                response.json(orderslist);
            })

    })
    // })

router.get("/latestorders", function(request, response) {
    //  mongoose.model("users").find({email:request.token.email},{_id:true},function(err,user){
    mongoose.model("orders").find({ owner: request.token._id }, { resturant: true, createdAt: true, forr: true }, { "limit": 5 }, function(err, orders) {

        response.json(orders);

    });
    //  })

})

// router.get("/viewdetails",function(request,response){
//
//     mongoose.model("orders").find({_id:request.body.id,owner:"58e62bcf3d5f6b811ff88b82"},function(err,order){
//       response.json(order);
//     });
// })

//add order
router.post("/add", postRequestMiddleware, function(request, response) {
    console.log(request.body)
    var OrderModel = mongoose.model("orders");
    //var username="";
    //access token check
    mongoose.model("users").find({ email: request.token.email }, { _id: true }, function(err, user) {
        if (request.body.invitedfriend) {

            mongoose.model("users").find({ name: { $in: request.body.invitedfriend } }, { _id: true }, function(err, friends) {

                var order = new OrderModel({
                    forr: request.body.forr,
                    resturant: request.body.resturant,
                    owner: user[0]._id,
                    status: "waiting",
                    meals: [],
                    invitedfriends: friends,
                    joined: []
                });

                order.save(function(err) {
                    if (!err) {
                        notifications.sendnotif([5,4], { user: request.token._id, order: order })
                        response.json("success");

                    } else {
                        response.json("Error");

                    }
                })
            })
        } else if (request.body.invitedgroup) {


            mongoose.model("groups").find({ name: { $in: request.body.invitedgroup } }, { members: true }).populate('members', ['username'], { _id: false }).exec(function(err, groups) {
                var ingroups = [];
                var invmembers = ["amira"]

                console.log("member", groups[0].members)
                var member = groups[0].members





                //console.log("groups in add ordder", members)
                groups.forEach(function(g) {
                    ingroups.push({ _id: g._id })
                })
                var order2 = new OrderModel({
                    forr: request.body.forr,
                    resturant: request.body.resturant,
                    name: request.body.name,
                    owner: user[0]._id,
                    checkedout: false,
                    status: "waiting",
                    meals: [],
                    invitedgroups: ingroups,
                    invitedfriends: groups[0].members,
                    joined: []
                });
                console.log("orderb4save", order2)
                order2.save(function(err) {
                    console.log("order", order2)
                    if (!err) {
                        console.log("order", order2)
                        notifications.sendnotif([5,9], { user: request.token._id, order: order2, group: groups[0] })

                        response.json("success");
                    } else {
                        response.json("Error");
                    }
                })
            })
        }

        //username=user.username;
    })
});

// router.put("/edit",postRequestMiddleware,function(request,response){
//     mongoose.model("orders").find({_id:request.body.id},{},function(err,order){
//       if(order[0].checkedout==false){
//         response.json("already checked out order");
//       }
//       //update order
//       else{
//
//       }
//     })
// })

//cancel order

router.delete("/cancel", postRequestMiddleware, function(request, response) {

    console.log("request.body.id", request.body.id)
    mongoose.model("users").find({ email: request.token.email }, { _id: true }, function(err, user) {

        //findOneAndRemove
        mongoose.model("orders").findOneAndRemove({ owner: user[0]._id, _id: request.body.id }, function(err, order) {
            if (!err) {
                console.log('cancel',request.body.id)
                mongoose.model('notifications').remove({ orderId:mongoose.Types.ObjectId(request.body.id) })
                notifications.sendnotif([7], { order: order })
                response.json("success");
                console.log("success")
            } else {
                response.send("Error");
                console.log(err)
            }
        });

    })
    console.log("delete")




});

router.delete("/removeinvited", postRequestMiddleware, function(request, response) {
        //orderid
        // mongoose.model("users").find({email:request.token},{_id:true},function(err,user){
        mongoose.model("orders").update({ _id: request.body.orderid, owner: request.token.id }, { $pull: { invitedfriends: request.body.personid } },
            function(err, res) {
                if (!err) { response.json({ success: true }) }
            })
    })
    // })


router.delete("/removemeal", postRequestMiddleware, function(request, response) {
    var id = mongoose.Types.ObjectId(request.body.orderid)
    var id2 = mongoose.Types.ObjectId(request.body.id)
    console.log("re-orderid", request.body.orderid)
        // mongoose.model("users").find({email:request.email},{_id:true},function(err,user){
    console.log("req body", request.body, "owner:", request.token._id)
    mongoose.model("orders").update({ _id: id }, { $pull: { meals: { _id: id2 } } }, function(err, order) {

        if (!err) {

            response.json({ success: true })
        } else {
            response.json({ success: false })
        }

    })


    // mongoose.model("orders").findOneAndRemove({ owner: user[0]._id, _id: request.body.id }, function(err, order) {
    //     if (!err) {
    //         notifications.sendnotif([7], { order: order })
    //         response.json("success");
    //         console.log("success")
    //     } else {
    //         response.send("Error");
    //         console.log(err)
    //     }
    // });

})

// })
router.post("/join", postRequestMiddleware, function(request, response) {
    console.log("orderis:", request.body.id)
    mongoose.model("orders").find({ _id:request.body.id,joined: request.token._id }, function(err, joined) {
        if (joined.length) {
            console.log("from joined if", joined)
            response.json({ success: "joined before" });
        } else {
            console.log("from else")
            mongoose.model("orders").update({ _id: request.body.id }, {

                    $pull: { invitedfriends: request.token._id },
                    $push: { joined: request.token._id }
                },
                function(err, order) {
                    if (!err) {
                        response.json({ success: true });
                    }
                })
        }

    })
})

router.post("/addmeal", postRequestMiddleware, function(request, response) {
    mongoose.model("users").find({ email: request.token.email }, { _id: true, username: true }, function(err, user) {
        console.log("update")
        mongoose.model("orders").update(
            //
            { _id: request.body.orderid }, {
                $addToSet: {
                    meals: {
                        person: user[0].username,
                        personid: user[0]._id,
                        item: request.body.item,
                        price: request.body.price,
                        amount: request.body.amount,
                        comment: request.body.comment
                    }
                }

            },
            function(err, order) {
                if (!err) {
                    response.json({ success: true });
                }
            })

    })

})

router.post("/checkout", postRequestMiddleware, function(request, response) {
    var id = mongoose.Types.ObjectId(request.token.id)
    var id2 = mongoose.Types.ObjectId(request.body.id)
    mongoose.model("orders").findOneAndUpdate({ _id: id2 }, { $set: { status: "finished" } }, function(err, order) {
        if (!err) {
            notifications.sendnotif([6], { order: order })
            console.log("successssss")
            response.json({ success: true });
        }
    })
})


router.post("/getorderbyid", postRequestMiddleware, function(request, response) {

    var id = mongoose.Types.ObjectId(request.body.id)
    mongoose.model("orders").findOne({ _id: id }).populate('joined invitedfriends invitedgroups', ['name', 'username']).exec(function(err, order) {


        if (!err) {

            var joined = order.joined;
            var invitedgrp = order.invitedgroups;
            var invitedfri = order.invitedfriends;
            var joinedarr = [];
            var invitedgroup = [];
            var invitedfriend = [];
            var grouparraylength = 0;
            joined.forEach(function(joined) {
                joinedarr.push(joined.name);

            })
            invitedgrp.forEach(function(grp) {
                invitedgroup.push(grp.name);
                grouparraylength += grp.length;
            })
            invitedfri.forEach(function(friend) {
                    console.log("friend-----------", friend)
                    invitedfriend.push(friend.name);

                })
                //
                //         // console.log(joinedarr)
                //
            var invited = order.invitedfriends.length + grouparraylength;
            var orderobj = {
                name: order.name,
                id: order._id,
                owner: order.owner,
                forr: order.forr,
                resturant: order.resturant,
                status: order.status,
                meals: order.meals,
                joined_no: order.joined.length,
                invited_no: order.invited,
                joined: joinedarr,
                invitedgroups: invitedgroup,
                invitedfriends: invitedfriend
            }

            response.json(orderobj)
        };


    })




})


module.exports = router;