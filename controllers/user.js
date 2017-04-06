var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var bcrypt=require("bcrypt");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var mongoose = require("mongoose");


router.get("/listfriends",function(request,response){
  //get username from access token
  mongoose.model("users").find({email:"amira@gmail.com"},function(err,user){
mongoose.model("users").populate(user,{path:"friends"},function(err,result){
   response.json(result[0].friends);
  // response.json(result);
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

router.put("/addfriend",postRequestMiddleware,function(request,response){
  //
   mongoose.model("users").find({email:request.body.email},function(err,user){

     if(user==undefined){
       response.json({success:false,error:"No such user"});
     }
    else{
        //  response.send(user[0]._id);
       mongoose.model("users").update({accessToken:"1"},{ $push:{friends: user[0]._id} },function(err,i){
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
