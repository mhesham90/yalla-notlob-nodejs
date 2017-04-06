var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var users = new Schema({
    email : String,
    username: String,
    name: String,
    password: String,
    accessToken: String,
    avatar : String,
    friends : [{type:Schema.Types.ObjectId, ref:"users"}],
    notifications : [{type:Schema.Types.ObjectId, ref:"notifications"}]
});

mongoose.model("users",users);
