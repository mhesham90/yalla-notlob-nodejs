var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notifications = new Schema({
    seen : Boolean,
    users: Array,
    type:Number,
    info:Array
});

mongoose.model("notifications",notifications);
