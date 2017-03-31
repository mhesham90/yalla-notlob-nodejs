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
router.get("/",function(request,response){
  mongoose.model("orders").find({},{},function(err,orders){
    response.json(orders)
  })
})
//add order
router.post("/",postRequestMiddleware,function(request,response){
    var OrderModel=mongoose.model("orders");
    var username="";
    //access token check
    mongoose.model("users").find({_id:"58ddfb8e431be5153def4466"},{_id:false,username:true},function(err,user){
      username=user.username;
    })

    var order=new OrderModel({name:request.body.name,owner:username,status:false,invitations:{},participants:{}});
    order.save(function(err){
      if(!err){
        response.json("success");
      }else{
        response.send("Error");
      }
    })
});
//cancel order
router.delete("/:id",function(request,response){
    mongoose.model("orders").remove({_id:request.params.id},function(err,order){
      if (err) return response.json(err);
      response.json("success");
    });
});

module.exports = router;
