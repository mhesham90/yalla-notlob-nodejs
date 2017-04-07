var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orders = new Schema({
    name : String,
    resturant:String,
    forr:String,
    owner : {type:Schema.Types.ObjectId, ref:"users"},
    status : String,
    createdAt: {type:Date,default:Date.now},
    invitedfriends:[{type:Schema.Types.ObjectId, ref:"users"}],
    invitedgroups:[{type:Schema.Types.ObjectId, ref:"groups"}],
    joined : [{type:Schema.Types.ObjectId, ref:"users"}],
    menuimage:String,
    meals: [{
          id:Schema.Types.ObjectId,
          person:String,
          personid:{type:Schema.Types.ObjectId, ref:"users"},
          item:String,
          amount:Number,
          price:Number,
          comment:String
       }]

});

mongoose.model("orders",orders);
