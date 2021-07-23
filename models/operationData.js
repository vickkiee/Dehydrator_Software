var mongoose   = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var OperationDataSchema = new mongoose.Schema({
    operationName               :String,
    fallbackTemp                :Number,  
    ovenTemp                    :Number, 
    ovenHumi                    :Number,  
    ambientTemp                 :Number,  
    extractorMotorSpeedCommand  :Number,
    ovenDoorSwitch              :Boolean,
    heater1Start                :Boolean,
    heater2Start                :Boolean,
    extractorVFDstart           :Boolean,
    eStop                       :Boolean,
    extractorVFDrun             :Boolean,
    extractorVFDfault           :Boolean,
    alarmGeneral                :Boolean,
    ovenLight                   :Boolean,
    createdAt: {type: Date, default: Date.now}
});
// OperationData.plugin(passportLocalMongoose);

module.exports = mongoose.model("OperationData", OperationDataSchema);