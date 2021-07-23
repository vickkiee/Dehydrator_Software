var mongoose   = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var AlarmSchema = new mongoose.Schema({
    operationName: String,
    alarmName: String,
    severity: String,
    createdAt: {type: Date, default: Date.now}
});
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Alarm", AlarmSchema);