var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var bcrypt=require("bcrypt");
var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var multer=require("multer");
var mongoose = require("mongoose");
 var validator=require('validator');

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

    //access token
    var errors=[];
    if(validator.isEmpty(request.body.email) || validator.isEmpty(request.body.username) || validator.isEmpty(request.body.password)){
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
      var username=validator.escape(request.body.username);
      var password=validator.escape(request.body.password);

      var salt=bcrypt.genSaltSync();
      var hashedPassword=bcrypt.hashSync(password,salt);

    var user=new UserModel({email:mail,username:username,password:hashedPassword});
    user.save(function(err){
      if(!err){
        console.log("success");
        //send token
          response.json({success:true});
    //   response.json(at);
        // response.redirect("/home");
      }else{
         response.json({success:false});
      }
    })

  }
// response.send("ay7aga");
//,avatar:request.file.filename
//uploadFileMiddleware.single("avatar"),

    //insert into db
    //response.json
});

//gwa el find
//mongoose.model("users").populate(user,{path:"friends"},function(err,result))



router.post("/login",postRequestMiddleware,function(request,response){

  mongoose.model("users").find({username:request.body.username},{_id:true,username:true,password:true},function(err,user){
       if(user[0]!=undefined){
         //check accessToken

        //  if(bcrypt.compareSync(request.body.password, user.password)){
   bcrypt.compare(request.body.password, user[0].password, function(err, res) {
    if(res==true){
      response.json({success:true,id:user[0]._id})
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
    response.redirect("/authenticate/login")
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
