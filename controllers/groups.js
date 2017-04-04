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
router.get("/:id",function(request,response){
    var id =request.params.id;
    if(id=='all') {
        mongoose.model("groups").find({}, {}, function (err, groups) {
            if(!err){
                response.status(200);
                response.json(groups);
            }else{
                response.status(404);
                response.send("Error");
            }
        })
    }
    else if(id=='me'){
        var me ='1';
        mongoose.model("groups").find({members:me},{},function(err,groups){
            if(!err){
                response.status(200);
                response.json(groups);
            }else{
                response.status(404);
                response.send("Error");
            }
        })
    }
    else {
        mongoose.model("groups").find({_id:id},{},function(err,groups){
            if(!err){
                response.status(200);
                response.json(groups);
            }else{
                response.status(404);
                response.send("Error");
            }
        })
    }
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

router.put('/:id',postRequestMiddleware,function (request,response) {
    var id =request.params.id;

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
