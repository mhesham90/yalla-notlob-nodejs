var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var bcrypt=require("bcrypt");
// var postRequestMiddleware=bodyParser.json();
var postRequestMiddleware=bodyParser.urlencoded({extended:true});
var jwt=require("jsonwebtoken");
var multer=require("multer");
var mongoose = require("mongoose");
var validator=require('validator');
var jwt=require("jsonwebtoken");
const APP_SECRET="@#$@#%!@#!@#";

// var uploadFileMiddleware=multer({dest:__dirname+"/../public",
// fileFilter:function(request,file,cb){
//   if(file.mimetype=="image/jpeg" || file.mimetype=="image/png"){
//     request.fileStatus="file uploaded";
//     cb(null,true);
//   }else{
//     request.fileStatus="file not uploaded";
//     cb(null,false);
//   }
//
// }})

router.use(function(request,response,next){
    // Set Origin to allow other domains to send request
    response.header("Access-Control-Allow-Origin","*");
    response.header("Access-Control-Allow-Headers","X-Requested-With, Content-Type");
    // allow four HTTP method
    response.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");

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

    //access token
    var errors=[];
    //aname
    // console.log(request.body);
    if(validator.isEmpty(request.body.email) || validator.isEmpty(request.body.name) || validator.isEmpty(request.body.username) || validator.isEmpty(request.body.password)){
      errors.push("empty");
    }
    if(!validator.isEmail(request.body.email)){
    errors.push("invalid email");
    }

    if(errors.length > 0){
       response.json(errors);
      //  console.log(errors);
    }
    else{

      var mail=validator.escape(request.body.email);
      var name=validator.escape(request.body.name);
      var username=validator.escape(request.body.username);
      var password=validator.escape(request.body.password);

      //  var mail=request.body.email;
      //  var username=request.body.username;
      //  var password=request.body.password;

      var salt=bcrypt.genSaltSync();
      var hashedPassword=bcrypt.hashSync(password,salt);

mongoose.model("users").find({email:request.body.email},{},function(err,user){
  if(user[0]==undefined){
      var user=new UserModel({email:mail,name:name,username:username,password:hashedPassword});

      user.save(function(err){
        if(!err){
          response.json({success:false});
        }else{
           response.json({success:false});
        }
      })
  }

  else {
    response.json({success:false,msg:"user already exists"});
  }
})

// response.send("ay7aga");
//,avatar:request.file.filename
//uploadFileMiddleware.single("avatar"),
}
    //insert into db
    //response.json
});

router.post("/login",postRequestMiddleware,function(request,response){

  mongoose.model("users").find({email:request.body.email},{},function(err,user){
       if(user[0]!=undefined){
         //check accessToken
   bcrypt.compare(request.body.password, user[0].password, function(err, res) {
    if(res==true){

    //  response.json({success:true,id:user[0]._id})
    //  response.redirect("/home")


      jwt.sign(user,APP_SECRET,{algorithm:"HS256"},function(err,token){
        response.json({token:token,success:true});
      });
      // response.json({success:true})

    }
});

       }


  else{
    // request.flash("message","Invalid email or password");
    response.json({msg:"no such user"});
  }
  })

})



//
// router.put("/",function(request,response){
//     //update db
//     //response.json
// });
router.delete("/",function(request,response){
    //delete from db
    //response.json
});




module.exports = router;
