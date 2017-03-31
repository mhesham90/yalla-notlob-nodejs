var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var users = new Schema({
    email : String,
    username: String,
    password: String,
    accessToken: String,
    avatar : String,
    friends : []
});

mongoose.model("users",users);
