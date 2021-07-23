var mongoose   = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var OperationSchema = new mongoose.Schema({
    operationName    :String,
    targetTemp       :Number,
    extractorMaxSpeed:Number,
    extractorMinSpeed:Number,
    heatSources      :Number,
    targetHumi       :Number,
    durationActive   :Boolean,
    durationTime     :Number,
    createdAt: {type: Date, default: Date.now}
});
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Operation", OperationSchema);