var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var models1 = new Schema({
    name: String,
    password: String,
    address: String,
    age: Number
});

mongoose.model("models1",models1);
