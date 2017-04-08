var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var postRequestMiddleware=bodyParser.json({limit: '20mb'});
var mongoose = require("mongoose");
var notifications = require("./notifications");


router.use(function(request,response,next){
    // Set Origin to allow other domains to send request
    response.setHeader("Access-Control-Allow-Origin","*");
    // allow four HTTP method
    response.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");

    next();
});
//list groups
router.get("/",function(request,response){
    var id =request.token._id;
    var result ={};


        mongoose.model("groups").find({members:id}).populate('members owner',['username','avatar']).exec(function (err, memberGroups) {
            if(!err){
                result.member=memberGroups;
                mongoose.model("groups").find({owner:id}).populate('members owner',['username','avatar']).exec(function (err, ownerGroups) {
                    if(!err){
                        result.owner=ownerGroups;
                        response.status(200);
                        response.json(result);

                    }else{
                        response.status(404);
                        response.send("Error");
                    }
                })
            }else{
                response.status(404);
                response.send(err);
            }
        })
})

router.get('/:id',function(request,response){
  var id =request.params.id;
  mongoose.model("groups").find({_id:id}).populate("members owner",['uaername','avatar']).exec(function (err,group) {
      if(!err){
          response.status(200);
          response.json(group[0]);
      }else{
          response.status(404);
          response.send(err);
      }
  })
})


//add groups
router.post("/",postRequestMiddleware,function(request,response){
    console.log(request.body);
    var groupModel=mongoose.model("groups");
    var group = new groupModel(request.body);
    group.save(function (err) {
        if(!err){
            response.status(200);
            response.send("success");
        }else{
            response.status(404);
            response.send("Error");
        }
        
    });

    notifications.sendnotif([1,3],{group:group,user:request.token._id})
    console.log(group._id)
});
//cancel group
router.delete("/:id",function(request,response){
    mongoose.model("groups").remove({_id:request.params.id},function(err,group){
        if(!err){
            response.status(200);
            response.send("success");
        }else{
            response.status(404);
            response.send("Error");
        }
    });
});

//update group
router.post('/addMember',postRequestMiddleware,function (request,response) {
    var id =request.body.id;
    mongoose.model("users").find({email:request.body.email},function(err,user){
        if(user.length == 0){
            response.json({success:false,error:"No such user"});
        }
        else{
            mongoose.model("groups").update({_id:id},{$push:{members: user[0]._id}},function(err,groups){
                if(!err){
                    response.status(200);
                    response.json({success: true});
                }else{
                    response.status(404);
                    response.json({success: false,error:"No such user"});
                }
            })
        }
    })
})
router.post('/deleteMember',postRequestMiddleware,function (request,response) {
    var id =request.body.id;
    console.log(id, request.body.userid);
    mongoose.model("groups").update({_id:request.body.id},{$pull:{members: request.body.userid}},function(err,groups){

        if(!err){
            // notifications.sendnotif([2],{group:group,usersId:request.body.members})
            response.status(200);
            response.json({success: true});
        }else{
            response.status(404);
            response.json({success: false,error:"try again later"});
        }
    })
   
})
module.exports = router;
