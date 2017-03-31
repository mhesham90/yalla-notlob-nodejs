var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var bcrypt=require("bcrypt");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var multer=require("multer");
var mongoose = require("mongoose");

var uploadFileMiddleware=multer({dest:__dirname+"/../public",
fileFilter:function(request,file,cb){
  if(file.mimetype=="image/jpeg" || file.mimetype=="image/png"){
    request.fileStatus="file uploaded";
    cb(null,true);
  }else{
    request.fileStatus="file not uploaded";
    cb(null,false);
  }

}})

router.use(function(request,response,next){
    // Set Origin to allow other domains to send request
    response.setHeader("Access-Control-Allow-Origin","*");
    // allow four HTTP method
    response.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");

    next();
});



router.get("/",function(request,response){
    response.setHeader("Cache-Control","no-cache");
    response.setHeader("Content-Type","application/json");
    response.status(200);
//    reponse.send("helloo");
    //get from db
    //response.json
});

router.post("/register",postRequestMiddleware,function(request,response){
    var UserModel=mongoose.model("users");
    var salt=bcrypt.genSaltSync();
    var hashedPassword=bcrypt.hashSync(request.body.password,salt);
    //access token
    var user=new UserModel({email:request.body.email,username:request.body.username,password:hashedPassword});
    user.save(function(err){
      if(!err){

    //   response.json(at);
        // response.redirect("/home");
      }else{
        response.send("Error");
      }
    })

//,avatar:request.file.filename
//uploadFileMiddleware.single("avatar"),

    //insert into db
    //response.json
});

router.post("/login",postRequestMiddleware,function(request,response){

  mongoose.model("users").find({username:request.body.username},{_id:false,username:true,password:true},function(err,user){
       if(user[0]!=undefined){
         //check accessToken

        //  if(bcrypt.compareSync(request.body.password, user.password)){
   bcrypt.compare(request.body.password, user[0].password, function(err, res) {
    if(res==true){
    //  response.redirect("/home")
    }
    // else{
    //   request.flash("message","Invalid ");
    //   response.redirect("/authorize/login")
    // }
});

       }


  else{
    request.flash("message","Invalid username or password");
    response.redirect("/authorize/login")
  }
  })

})

router.put("/",function(request,response){
    //update db
    //response.json
});
router.delete("/",function(request,response){
    //delete from db
    //response.json
});




module.exports = router;
