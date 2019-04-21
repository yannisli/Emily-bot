const mongoose = require("mongoose");

const Schema = mongoose.Schema;


let roleSchema = mongoose.Schema({
    emoji: String,
    role: String
});
const MessageSchema = new Schema(
{
    channel: String,
    message: String,
    guild: String,
    reactions: [roleSchema]
});
    
    
module.exports = mongoose.model("Message", MessageSchema);