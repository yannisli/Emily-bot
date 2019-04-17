const mongoose = require("mongoose");

const Schema = mongoose.Schema;


let roleSchema = mongoose.Schema({
    emoji: String,
    role: String
}, {_id: false});
const MessageSchema = new Schema(
{
    channel: String,
    message: String,
    guild: String,
    reactions: [roleSchema]
}, {_id: false});
    
    
module.exports = mongoose.model("Message", MessageSchema);