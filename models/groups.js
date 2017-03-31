var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groups = new Schema({
    name : String,
    members : []

});

mongoose.model("groups",groups);
