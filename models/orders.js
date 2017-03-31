var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orders = new Schema({
    name : String,
    owner : String,
    status : Boolean,
    invitations : [],
    participants : []

});

mongoose.model("orders",orders);
