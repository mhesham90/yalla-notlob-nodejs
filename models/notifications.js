var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notifications = new Schema({
    seen : [Boolean],
    to: [{type: Schema.ObjectId, ref:'users'}],
    message:String,
     userId:{type: Schema.ObjectId, ref:'users'},
     groupId:{type: Schema.ObjectId, ref:'groups'},
     orderId:{type: Schema.ObjectId, ref:'orders'},

});

mongoose.model("notifications",notifications);


// db.notifications.insert({seen:false,to:[ObjectId('58e68b2ef3e316410f6318f5')],message:"[u]: added you to :[g]",
// userId:ObjectId('58e68b2ef3e316410f6318f5'),groupId:ObjectId('58e68414ad4a6806552af630'),orderId:ObjectId('58e680a8ad4a6806552af62f')})
