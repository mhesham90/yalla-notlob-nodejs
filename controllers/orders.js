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
  mongoose.model("orders").find({accessToken:"1"},{},function(err,orders){
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

      var order=new OrderModel({name:request.body.name,owner:user[0]._id,checkedout:false,meals:[request.body.meals],invitations:[request.body.invites],participants:[request.body.participants]});
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

router.put("/edit",postRequestMiddleware,function(request,response){
    mongoose.model("orders").find({_id:request.body.id},{},function(err,order){
      if(order[0].checkedout==false){
        response.json("already checked out order");
      }
      //update order
      else{

      }
    })
})

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

module.exports = router;
