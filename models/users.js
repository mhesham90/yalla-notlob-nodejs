var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var users = new Schema({
    email : {type: String, unique: true },
    username: String,
    name: String,
    password: String,
    accessToken: String,
    avatar : String,
    friends : [{type:Schema.Types.ObjectId, ref:"users"}],
    notifications : [{type:Schema.Types.ObjectId, ref:"notifications"}]
});

users.plugin(uniqueValidator);
mongoose.model("users",users);
