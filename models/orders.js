var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orders = new Schema({
    name : String,
    for:String,
    resturant:String,
    owner : {type:Schema.Types.ObjectId, ref:"users"},
    checkedout : Boolean,
    createdAt: {type:Date,default:Date.now},
    invitedfriend : {type:Schema.Types.ObjectId, ref:"users"},
    invitedgroup:{type:Schema.Types.ObjectId, ref:"groups"},
    participants : [{type:Schema.Types.ObjectId, ref:"users"}],
    meals: [{
          name:[{type:Schema.Types.ObjectId, ref:"users"}],
          item:String,
          amount:Number,
          price:Number,
          comment:String
       }]

});

mongoose.model("orders",orders);
