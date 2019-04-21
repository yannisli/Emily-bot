const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const MessageSchema = new Schema(
    {
        channel: String,
        message: String,
        guild: String,
        reactions: 
        {
            type: [
            {
                emoji: String,
                role: String,
            }
            ],
            default: []
        }
    });
    
module.exports = mongoose.model("Message", MessageSchema);