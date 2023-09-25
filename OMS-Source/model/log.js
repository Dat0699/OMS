const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema(
    {
        userId          : {type :String, required: true},
        action          : {type :String, required: true},
        deviceAccess    : {type :String, required: true},
        // deviceAccess    : {type :String, required: true},
    },
    {timestamps:true}
) 

module.exports = mongoose.model("log", LogSchema)



