var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var bcrypt=require("bcrypt");
var postRequestMiddleware=bodyParser.json({limit: '20mb'});
var notifications = require("./notifications");


// var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var mongoose = require("mongoose");



router.get("/listfriends",function(request,response){
  //get username from access token

  mongoose.model("users").find({email:request.token.email},function(err,user){
    // ' userId groupId orderId ',
mongoose.model("users").populate(user,{path:"friends"},function(err,result){
  var friendsarray=result[0].friends;
  var friends=[];
  friendsarray.forEach(function (friend) {
    friends.push(friend);
  })
    response.json({friends:friends});
  //  response.json(result);
})
  })

});

router.get("/friendsactivity",function(request,response){
  mongoose.model("users").find({email:request.token.email},{_id:false,friends:true},function(err,user){
     var friendsarray=user[0].friends;
      mongoose.model("orders").find({owner:{$in:friendsarray}},
        {resturant:true,_id:true,for:true,owner:true},
        function(err,orders){

        var orderslist=[];
        orders[0].forEach(function (order) {
        mongoose.model("users").find({_id:order.owner},{username:true},function(err,user){
        var orderobj={
            orderowner:user[0].username,
            for:order.for,
            resturant:order.resturant
          }
          orderslist.push(orderobj);

        })
      })

        response.json({orderslist:orderslist});

})
})
})

router.post("/addfriend",postRequestMiddleware,function(request,response){

   mongoose.model("users").find({email:request.body.email},function(err,user){

     if(user==undefined){
       response.json({success:false,error:"No such user"});
     }

    else{

      var flag=0;
      mongoose.model("users").find({email:request.token.email},function(err,loggeduser){
        var loggedid= loggeduser[0]._id+"";
        var friendid=user[0]._id+"";
        // loggedid="58e888dec73cab624c7cb9af";
        // ObjectId("58e634304045c81e8f22f5b7")
        // friendid="58e634304045c81e8f22f5b7";

         console.log("friendd"+friendid);
         console.log("logeedd"+loggedid);
        if( loggedid != friendid){
// console.log("ssss")
          var userfriends=loggeduser[0].friends;
          userfriends.forEach(function (friend) {
            if(friendid==friend){ flag=1; }

          })
          if(flag == 0){
            mongoose.model("users").update({email:request.token.email},{ $push:{friends: user[0]._id} },function(err,i){
              response.json({success:true});
          })
        }
        else{
          response.json({error:"this is already your friend!"});
        }


      }
      else{
      response.json({error:"you can't add yourself!"});
    }


        //  response.send(user[0]._id);
       });
  //
    }
   })
})

router.post("/unfriend",postRequestMiddleware,function(request,response){

  // mongoose.model("users").find({username:request.body.username},{_id:true},function(err,friend){
    mongoose.model("users").update({email:request.token.email},{$pull:{friends:request.body.id}},function(err,user){
      if(!err){
        response.json({success:true});
      }
      else{  response.json({success:false,error: 'please try again later'}); }
    })
  // })

})



module.exports = router;
