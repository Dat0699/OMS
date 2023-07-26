const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema(
    {
        activity    : {type :String, required: true},
    },
    {timestamps:true}
) 

module.exports = mongoose.model("log", LogSchema)



