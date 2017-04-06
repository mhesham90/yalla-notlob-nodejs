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
//list groups
router.get("/",function(request,response){
    var id =request.token.id;
    var result ={};


        mongoose.model("groups").find({members:me}).populate('members owner',['username']).exec(function (err, groups) {
            if(!err){
                result.in=groups;
            }else{
                response.status(404);
                response.send(err);
            }
        })

        mongoose.model("groups").find({owner:'58e47cb51c0d96b11de30e90'}).populate('members owner',['username']).exec(function (err, groups) {
            if(!err){
                result.my=groups;
            }else{
                response.status(404);
                response.send("Error");
            }
        })
        response.status(200);
        response.json(resulte);



})


//add groups
router.post("/",postRequestMiddleware,function(request,response){
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
        
    })
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

router.put('/',postRequestMiddleware,function (request,response) {
    var id =request.body.id;

    mongoose.model("groups").update({_id:id},{$set:request.body},function(err,groups){
        if(!err){
            response.status(200);
            response.send("success ");
        }else{
            response.status(404);
            response.send("Error");
        }
    })
})
module.exports = router;
