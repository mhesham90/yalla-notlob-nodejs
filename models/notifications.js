var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notifications = new Schema({
    seen : Boolean,
    from : String,
    to : []

});

mongoose.model("notifications",notifications);
