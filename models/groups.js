var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groups = new Schema({
    name : String,
    owner:{type: Schema.ObjectId, ref:'users'},
    members : [{type: Schema.ObjectId, ref:'users'}]

});

mongoose.model("groups",groups);

// db.groups.insert({name:'group1',owner:Object('58e3a68f82e295716c68bf34'),members:[ObjectId('58e47cb51c0d96b11de30e90')]})
// db.groups.insert({name:'group2',members:[ObjectId('58e3a68f82e295716c68bf34')],owner:ObjectId('58e47cb51c0d96b11de30e90')})
