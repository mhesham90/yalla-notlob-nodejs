var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groups = new Schema({
    name : String,
    owner:[{type:Schema.Types.ObjectId, ref:"users"}],
    members : [{type:Schema.Types.ObjectId, ref:"users"}]

});

mongoose.model("groups",groups);
