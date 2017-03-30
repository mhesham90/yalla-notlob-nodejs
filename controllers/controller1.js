var express = require('express');
var router = express.Router();

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
    //get from db
    //response.json
});
router.post("/",function(request,response){
    //insert into db
    //response.json
});
router.put("/",function(request,response){
    //update db
    //response.json
});
router.delete("/",function(request,response){
    //delete from db
    //response.json
});




module.exports = router;