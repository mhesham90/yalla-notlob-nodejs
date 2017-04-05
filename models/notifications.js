var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notifications = new Schema({
    seen : Boolean,

    // from : [{type:Schema.Types.ObjectId, ref:"users"}],
    // to : [{type:Schema.Types.ObjectId, ref:"users"}],
    // content: String

    users: Array,
    type:Number,
    info:Array

});

mongoose.model("notifications",notifications);
