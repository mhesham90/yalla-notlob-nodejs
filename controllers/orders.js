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
  mongoose.model("orders").find({},{},function(err,orders){
    response.json(orders)
  })
})

router.get("/latestorders",function(request,response){

    mongoose.model("orders").find({accessToken:"1"},{"limit": 10},function(err,orders){
      response.json(orders);
    });
})

router.get("/viewdetails",function(request,response){

    mongoose.model("orders").find({_id:request.body.id},function(err,order){
      response.json(order);
    });
})

//add order
router.post("/add",postRequestMiddleware,function(request,response){
    var OrderModel=mongoose.model("orders");
    var username="";
    //access token check
    mongoose.model("users").find({accessToken:"1"},{},function(err,user){
      if(request.body.invitedfriend){
        mongoose.model("users").find({username:request.body.invitedfriend},{_id:true},function(err,friend){
        var order=new OrderModel({for:request.body.for,resturant:request.body.resturant,name:request.body.name,owner:user[0]._id,checkedout:false,meals:[],invitedfriend:friend[0]._id,joined:[]});
      })
      }
      else if(request.body.invitedgroup){
        mongoose.model("groups").find({name:request.body.invitedgroup},{_id:true},function(err,group){
        var order=new OrderModel({name:request.body.name,owner:user[0]._id,checkedout:false,meals:[],invitedgroup:group[0]._id,joined:[]});
      })
      }

        order.save(function(err){
        if(!err){
          response.json("success");
        }else{
          response.send("Error");
        }
      })
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
router.delete("/delete",postRequestMiddleware,function(request,response){
  mongoose.model("users").find({accessToken:"1"},{_id:true},function(err,user){
    mongoose.model("orders").remove({_id:request.body.id, owner:user[0]._id},function(err,order){
      if (!err) { response.json("success");}
      else{
        response.send("Error");
      }
    });
   })

});

router.delete("/removeinvited",postRequestMiddleware,function(request,response){
  //orderid
  mongoose.model("orders").update({_id:request.body.orderid},{$pull:{invited:request.body.personid}},function(err,res){
if(!err){response.json({success:true})}
  })
})

router.delete("/removemeal",postRequestMiddleware,function(request,response){

})

router.post("/addmeal",postRequestMiddleware,function(request,response){
  //remove from invited to joined
})

module.exports = router;
