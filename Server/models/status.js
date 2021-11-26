const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;// use for unique identifier


const statusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
   
    postedby: {
        type: ObjectId,
        ref: "User"
    }
})
module.exports = mongoose.model("Status", statusSchema)