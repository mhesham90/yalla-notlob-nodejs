var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orders = new Schema({
    name : String,
    owner : {type:Schema.Types.ObjectId, ref:"users"},
    checkedout : Boolean,
    createdAt: {type:Date,default:Date.now},
    invitations : [{type:Schema.Types.ObjectId, ref:"users"}],
    participants : [{type:Schema.Types.ObjectId, ref:"users"}],
    meals: [{
          item:String,
          amount:Number,
          price:Number
       }]

});

mongoose.model("orders",orders);
