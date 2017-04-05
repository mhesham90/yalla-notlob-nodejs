var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notifications = new Schema({
    seen : Boolean,
    to: [{type: Schema.ObjectId, ref:'users'}],
    message:String,
    //type: {type: Schema.ObjectId, ref:'notif_type'},
     userId:{type: Schema.ObjectId, ref:'users'},
     groupId:{type: Schema.ObjectId, ref:'groups'},
     orderId:{type: Schema.ObjectId, ref:'orders'}

});

mongoose.model("notifications",notifications);


//db.notifications.insert({seen:false,to:[ObjectId('58e3a68f82e295716c68bf34')],message:"[u]: added you to : [g]",userId:ObjectId('58e3a68f82e295716c68bf34'),groupId:ObjectId('58e3a68f82e295716c68bf34'),orderId:ObjectId('58e3a6dc82e295716c68bf36')})
