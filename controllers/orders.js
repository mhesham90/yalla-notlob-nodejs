var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var notifications = require("./notifications");


// var postRequestMiddleware=bodyParser.json({limit: '20mb'});
var postRequestMiddleware=bodyParser.urlencoded({extended:true});
var mongoose = require("mongoose");

router.use(function(request,response,next){
    // Set Origin to allow other domains to send request
    response.setHeader("Access-Control-Allow-Origin","*");
    // allow four HTTP method
    response.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");

    next();
});
//list orders
router.get("/allorders",function(request,response){
console.log("token",request.token._id)
      mongoose.model('orders').find({$or:[{owner:request.token._id},{joined:request.token._id}
        // ,{invitedfriends:request.token._id}
      ]})
      .populate('joined invitedfriends invitedgroups',['name','username']).exec(function (err,orders) {
          if(!err) {
            var type;
            // if(request.token._id )
            var orderslist=[];

         orders.forEach(function (order) {
           var joined=order.joined;
           var invitedgrp=order.invitedgroups;
           var invitedfri=order.invitedfriends;
           var joinedarr=[];
           var invitedgroup=[];
           var invitedfriend=[];
           var grouparraylength=0;
          //  var invited=order.invitedfriends.length+order.invitedgroups.length;
          joined.forEach(function(joined){
          joinedarr.push(joined.name);

        })
          invitedgrp.forEach(function(grp){
          invitedgroup.push(grp.name);
          grouparraylength+=grp.length;
        })
         invitedfri.forEach(function(friend){
         invitedfriend.push(friend.name);

       })
//
//         // console.log(joinedarr)
//
 var invited=order.invitedfriends.length+grouparraylength;
              var orderobj={
              name:order.name,
              id:order._id,
              owner:order.owner,
              forr:order.forr,
              resturant:order.resturant,
              status:order.status,
              meals:order.meals,
              joined_no:order.joined.length,
              invited_no:invited,
              joined:joinedarr,
              invitedgroups:invitedgroup,
              invitedfriends:invitedfriend
              }
//               // console.log(order)
               orderslist.push(orderobj);

 })

}
response.json(orderslist);
  })

  })
// })

router.get("/latestorders",function(request,response){
  //  mongoose.model("users").find({email:request.token.email},{_id:true},function(err,user){
     mongoose.model("orders").find({owner:request.token.id},{"limit": 5},function(err,orders){
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
router.post("/add",postRequestMiddleware,function(request,response){
    var OrderModel=mongoose.model("orders");
    //var username="";
    //access token check
    mongoose.model("users").find({email:request.token.email},{_id:true},function(err,user){
      if(request.token.email){

        mongoose.model("users").find({email:{$in:request.body.invitedfriend}},{_id:true},function(err,friends){

        var order=new OrderModel({forr:request.body.forr,resturant:request.body.resturant,
          owner:user[0]._id, status:"waiting",meals:[],invitedfriends:friends,joined:[]});

          order.save(function(err){
          if(!err){
              notifications.sendnotif([4,5],{user:request.token._id,order:order})
            response.json("success");

          }else{
            response.json("Error");

          }
        })
      })
      }
      else if(request.body.invitedgroups){
        mongoose.model("groups").find({name:{$in:request.body.invitedgroups}},{_id:true},function(err,groups){
        var order=new OrderModel({forr:request.body.forr,resturant:request.body.resturant,name:request.body.name,
        owner:user[0]._id,checkedout:false,meals:[],invitedgroups:groups,joined:[]});
        order.save(function(err){
        if(!err){
            notifications.sendnotif([9,5],{user:request.token._id,order:order})
            response.json("success");
        }else{
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
router.delete("/cancel",postRequestMiddleware,function(request,response){

 console.log("request.body.id",request.body.id)
    mongoose.model("users").find({email:request.token.email},{_id:true},function(err,user){

 ////////////////////////////////
   mongoose.model("orders").findOneAndRemove({owner:user[0]._id,_id:request.body.id},function(err,order){
      if (!err) {
          console.log('err')
          console.log(err);
         // notifications.sendnotif([7],{order:order})
          response.json("success");
          console.log("success")
      }

      else{
        response.send("Error");
        console.log(err)
      }
    });

})
console.log("delete")




});

router.delete("/removeinvited",postRequestMiddleware,function(request,response){
  //orderid
  // mongoose.model("users").find({email:request.token},{_id:true},function(err,user){
  mongoose.model("orders").update({_id:request.body.orderid,owner:request.token.id},{$pull:{invitedfriends:request.body.personid}},
    function(err,res){
        if(!err){
            response.json({success:true})}
  })
})
// })

router.delete("/removemeal",postRequestMiddleware,function(request,response){
  // mongoose.model("users").find({email:request.email},{_id:true},function(err,user){
console.log("req body",request.body,"owner:",request.token._id)
  mongoose.model("orders").update({_id:request.body.orderid,owner:request.token.id},{$pull:{ meals: {id:request.body.id} }}
    ,function(err,order){

if(!err){response.json({success:true})}
else{response.json({success:false})}

  })
})

// })
router.post("/join",postRequestMiddleware,function(request,response){
  mongoose.model("orders").update({_id:request.body.orderid},
    {  $pull:{ invitedfriends:request.token._id},
       $push:{ joined:request.token._id}
     },
      function(err,order){
  if(!err){
    response.json({success:true});
  }
})
})

router.post("/addmeal",postRequestMiddleware,function(request,response){
  mongoose.model("users").find({email:request.token.email},{_id:true,username:true},function(err,user){
console.log("update")
  mongoose.model("orders").update(
//
    {_id:request.body.orderid},{
    $addToSet:{ meals:{person:user[0].username,personid:user[0]._id,
    item:request.body.item,price:request.body.price,amount:request.body.amount,comment:request.body.comment} }

   },
    function(err,order){
if(!err){
  response.json({success:true});
}
  })
  // mongoose.model("orders").find({_id:request.body.id},
  //
  // })

  })
  //remove from invited to joined

})

router.post("/checkout",postRequestMiddleware,function(request,response){
    mongoose.model("orders").findOneAndUpdate({owner:request.token.id,_id:request.body.id},
      {$set:{status:"finished"}},function(err,order){
        if(!err){
            notifications.sendnotif([6],{order:order});
            response.json({success:true});
        }
      })
})

module.exports = router;
