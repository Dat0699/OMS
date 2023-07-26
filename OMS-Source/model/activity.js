const mongoose = require('mongoose');
const ActivitySchema = new mongoose.Schema(
    {
        name    : {type :String, required: true},
        price   : {type: Number, required: true}
    },
    {timestamps:true}
) 

module.exports = mongoose.model("activity",ActivitySchema)