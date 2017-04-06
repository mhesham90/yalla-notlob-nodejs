var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
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
  // console.log(request.token)
  // var orderslist=[];
  // mongoose.model("orders").find({owner:"58e634304045c81e8f22f5b7"},{},
  // function(err,orders){
  //   orders.forEach(function (order) {
  //     var invited=order.invitedfriends.length+order.invitedgroups.length;
  //
  //     var invitedgroups=[];
  //     var invitedfriends=[];
  mongoose.model("users").find({email:request.token},function(err,user){
      mongoose.model('orders').find({owner:user[0]._id})
      .populate('joined',['username,name']).exec(function (err,orders) {
        console.log(orders[0])
      })
    })
      response.send("okk");
      // mongoose.model("orders").populate(order,{path:"joined"},function(err,joined){
      //   var joinedarr=[];
      //   joined[0].forEach(function (joined) {
      //     joinedarr.push(joined.username);
      //
      //   })

        // console.log(joinedarr)

              // var orderobj={
              // name:order.name,
              // id:order._id,
              // owner:order.owner,
              // for:order.for,
              // resturant:order.resturant,
              // status:order.status,
              // meals:order.meals,
              // joined_no:order.joined.length,
              // invited_no:invited,
              // joined:joinedarr
              // }
              // console.log(order)
            //  orderslist.push(orderobj);
      // })

    // })



    // response.json(orderslist);
  })
// })

router.get("/latestorders",function(request,response){
   mongoose.model("users").find({email:request.token},{_id:true},function(err,user){
     mongoose.model("orders").find({owner:user[0]._id},{"limit": 5},function(err,orders){
         response.json(orders);
       });
   })

})

// router.get("/viewdetails",function(request,response){
//
//     mongoose.model("orders").find({_id:request.body.id,owner:"58e62bcf3d5f6b811ff88b82"},function(err,order){
//       response.json(order);
//     });
// })

//add order
router.post("/add",postRequestMiddleware,function(request,response){
    // var OrderModel=mongoose.model("orders");
    //var username="";
    //access token check
    mongoose.model("users").find({email:request.token},{_id:true},function(err,user){
      // console.log(user[0]._id)
      if(request.body.invitedfriends){
        mongoose.model("users").find({username:{$in:request.body.invitedfriends}},{_id:true},function(err,friends){

        var order=new OrderModel({for:request.body.for,resturant:request.body.resturant,name:request.body.name,
          owner:user[0]._id,status:"waiting",meals:[],invitedfriends:friends,joined:[]});
          order.save(function(err){
          if(!err){
            response.json("success");
          }else{
            response.json("Error");
          }
        })
      })
      }
      else if(request.body.invitedgroups){
        mongoose.model("groups").find({name:{$in:request.body.invitedgroups}},{_id:true},function(err,groups){
        var order=new OrderModel({for:request.body.for,resturant:request.body.resturant,name:request.body.name,
        owner:user[0]._id,checkedout:false,meals:[],invitedgroups:groups,joined:[]});
        order.save(function(err){
        if(!err){
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

    mongoose.model("users").find({email:request.token},{_id:true},function(err,user){


    mongoose.model("orders").remove({owner:user[0]._id,id:request.body.id},function(err,order){
      if (!err) { response.json("success");}
      else{
        response.send("Error");
      }
    });
})

});

router.delete("/removeinvited",postRequestMiddleware,function(request,response){
  //orderid
  mongoose.model("users").find({email:request.token},{_id:true},function(err,user){
  mongoose.model("orders").update({_id:request.body.orderid,owner:user[0]._id},{$pull:{invitedfriends:request.body.personid}},function(err,res){
if(!err){response.json({success:true})}
  })
})
})

router.delete("/removemeal",postRequestMiddleware,function(request,response){
  mongoose.model("users").find({email:request.email},{_id:true},function(err,user){
  mongoose.model("orders").update({_id:request.body.orderid,owner:user[0]._id},{$pull:{ meals:{ _id:request.body.mealid } }}
    ,function(err,order){

  })
})
})

router.post("/addmeal",postRequestMiddleware,function(request,response){
  mongoose.model("users").find({email:request.token},{_id:true,username:true},function(err,user){
  mongoose.model("orders").update(
    {_id:"58e63a263f8b2f21c99631e2"},{
    $addToSet:{ meals:{person:user[0].username,personid:user[0]._id,
    item:request.body.item,price:request.body.price,amount:request.body.amount,comment:request.body.comment} },
     $pull:{ invitedfriends:user[0]._id},
     $push:{ joined:user[0]._id }
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

module.exports = router;
