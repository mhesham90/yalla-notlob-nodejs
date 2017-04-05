var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notif_type = new Schema({

    desc: String// [u] invited you to order
    //info:Array
});

mongoose.model("notif_type",notif_type);
