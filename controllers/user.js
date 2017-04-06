var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var bcrypt=require("bcrypt");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var mongoose = require("mongoose");


router.get("/listfriends",function(request,response){
  //get username from access token
  mongoose.model("users").find({_id:"58e634304045c81e8f22f5b7"},function(err,user){
    // ' userId groupId orderId ',
mongoose.model("users").populate(user,{path:"friends"},function(err,result){
  var friendsarray=result[0].friends;
  var friends=[];
  friendsarray.forEach(function (friend) {
    friends.push(friend.username);
  })
    response.json(friends);
  //  response.json(result);
})
  })

});

router.get("/friendsactivity",function(request,response){
  mongoose.model("users").find({accessToken:"1"},{_id:false,friends:true},function(err,friends){
     var friendsarray=friends[0].friends;
      mongoose.model("orders").find({owner:{$in:friendsarray}},{},function(err,orders){
        response.json(orders);
      })
})
})

router.post("/addfriend",postRequestMiddleware,function(request,response){
  //
   mongoose.model("users").find({email:request.body.email},function(err,user){

     if(user==undefined){
       response.json({success:false,error:"No such user"});
     }
    else{
        //  response.send(user[0]._id);
       mongoose.model("users").update({_id:"58e634304045c81e8f22f5b7"},{ $push:{friends: user[0]._id} },function(err,i){
         response.json({success:true});
        //  response.send(user[0]._id);
       });
  //
    }
   })
})

router.post("/unfriend",postRequestMiddleware,function(request,response){

  mongoose.model("users").find({username:request.body.username},{_id:true},function(err,friend){
    mongoose.model("users").update({accessToken:"1"},{$pull:{friends:friend[0]._id}},function(err,user){
      if(!err){
        response.json({success:true});
      }
      else{  response.json({success:false}); }
    })
  })

})



module.exports = router;
