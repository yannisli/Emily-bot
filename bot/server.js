const Discord = require("discord.js");
const client = new Discord.Client();

const fetch = require("node-fetch");
require('dotenv').config();

let reactionData = {};


fetch(`${process.env.API_URI}/api/messages/all`).then(res => {

    if(!res.ok)
    {
        console.error("API Server responsed with status code ", res.status);
    }
    else
    {
        res.json().then(json => {
            
            

            let map = {};

            for(let i = 0; i < json.length; i++)
            {
                let msg = json[i];
                map[msg.message] = {
                    id: msg.message,
                    guild_id: msg.guild,
                    channel_id: msg.channel,
                    reactions: {}
                }
                for(let j = 0; j < msg.reactions.length; j++)
                {
                   map[msg.message].reactions[msg.reactions[j].emoji] = msg.reactions[j].role;
                }
            }
            
            reactionData = map;

            console.log(reactionData);
        }).catch(err => console.error(err));
    }
}).catch(err => console.error(err));


client.on("messageReactionAdd", (reaction, user) => {
    if(!reaction || !user)
        return;

    // Find if this is monitored
    // If its the bot, don't do anything
    if(user.id === client.user.id) {

        return;
    }
    if(!reactionData[reaction.message.id]) {
        return;
    }
    reaction.remove(user);
    // Add user to role
    reaction.message.guild.fetchMember(user).then( member => {
        if(member.roles.get(reactionData[reaction.message.id].reactions[reaction.emoji.id])) {
            console.log(`Removed ${user.username}#${user.discriminator} from role ${reactionData[reaction.message.id].reactions[reaction.emoji.id]}`);
            member.removeRole(reactionData[reaction.message.id].reactions[reaction.emoji.id]);
        }
        else
        {
            console.log(`Added ${user.username}#${user.discriminator} to role ${reactionData[reaction.message.id].reactions[reaction.emoji.id]}`);
            member.addRole(reactionData[reaction.message.id].reactions[reaction.emoji.id]);
        }
    }).catch(err => console.log(err));
});

// Obtained from Github for non-cached messages
client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    }).catch(err => console.error(err));
});

// On ready
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // After 3 seconds, look for the messages we have registered and add reactions to them, and remove reactions that aren't registered
    client.setTimeout(() => {   
       
        for(let msg_id in reactionData) {

            let guild = client.guilds.get(reactionData[msg_id].guild_id);
            let channel = guild.channels.get(reactionData[msg_id].channel_id);

            channel.fetchMessage(msg_id)
                .then(msg => {
                    // React for emojis we have registered
                    for(let emoji in reactionData[msg_id].reactions) {
                        msg.react(emoji);
                    }
                    // Also collect emojis that are of us and make sure they are unreacted if not registered anymore
                    
                    msg.reactions.forEach((reaction) => 
                    {
                        // Check if this exists in reactions
                        
                        let exists = reactionData[msg_id].reactions[reaction.emoji.id] !== undefined;
                        
                        // Doesn't exist so remove all reactions
                        if(!exists) {
                            console.log("Does not exist");
                            reaction.fetchUsers(100).then(col => col.forEach(user => {
                                reaction.remove(user);
                            }));
                        }
                        
                    });
                })
                .catch(err => {
                    if(err.message !== 'Unknown Message')
                        console.error(err);
                });
        }
    }, 3000);
});


client.on("message", msg => {
    if(!msg.guild) return;
    if(msg.content.startsWith('!roles'))
    {
        console.log(msg.guild.roles);
        let arr = msg.guild.roles.array();
        let reply = "";
        for(let i = 0; i < arr.length; i++)
        {
            reply += `**${arr[i].name}**\nID: ${arr[i].id}\nPermissions: ${arr[i].permissions}\n\n`;
        }
        msg.channel.send({embed: {
            color: 3342130,
            author: {
                name: msg.author.username,
                icon_url: msg.author.avatarURL
            },
            title: "Roles List",
            url: "http://emi.gg",
            description: reply,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "Requested @"
            }
        }});
        msg.delete();
    }
    else if(msg.content.startsWith('!try')) {
        msg.channel.send("<a:pepejam:560323934151507978>\n<@&555612418500329472>\n<:monkaThink:545487018541580299>");   
        msg.channel.send({embed: {
            color: 3342130,
            author: {
                name: msg.author.username,
                icon_url: msg.author.avatarURL
            },
            title: "Roles List",
            url: "http://emi.gg",
            description: "<a:pepejam:560323934151507978>\n<@&555612418500329472>\n<:monkaThink:545487018541580299>",
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "Requested @"
            }
        }});
    }
});

const io = require("socket.io-client");

const socket = io(`${process.env.API_URI}?token=${process.env.SOCKET_TOKEN}`)


socket.on("authenticated", (status) => {
    if(status)
    {
        console.log("Connected to API and Authenticated");
        client.login(process.env.BOT_TOKEN);
    }
});

socket.on("newReaction", data => {

    console.log("API Server emitted newReaction", data);
    let msg_id = data.message;
    let reaction = data.data;

    if(reactionData[msg_id]) {
        console.log("Added new reaction to ", msg_id, "Reaction: ", reaction);
        reactionData[msg_id].reactions[reaction.emoji] = reaction.role;
    } else
        return;

    let guild = client.guilds.get(reactionData[msg_id].guild_id);
    let channel = guild.channels.get(reactionData[msg_id].channel_id);

    channel.fetchMessage(msg_id).then(msg => {
        msg.react(reaction.emoji);
    }).catch(err => console.error(err));
});

socket.on("reactionEdit", data => {

    console.log("API server emitted reactionEdit", data);

    let msg_id = data.message;
    let newReaction = {role: data.data.newRole, emoji: data.data.newEmoji};
    let curEmoji = data.data.curEmoji;

    if(reactionData[msg_id]) {
        reactionData[msg_id].reactions[curEmoji] = newReaction;
    } else
        return;

    let guild = client.guilds.get(reactionData[msg_id].guild_id);
    let channel = guild.channels.get(reactionData[msg_id].channel_id);
    if(curEmoji !== data.data.newEmoji)
        channel.fetchMessage(msg_id).then(msg => {
            msg.react(data.data.newEmoji);
            msg.reactions.forEach(reaction => {
                if(reaction.emoji.id === curEmoji)
                {
                    reaction.users.forEach(user => {
                        reaction.remove(user);
                    });
                }
            });
        }).catch(err => console.error(err));
});

socket.on("reactionDelete", data => {

    console.log("API server emitted reactionDelete", data);

    let msg_id = data.message;
    let emoji = data.emoji;

    if(reactionData[msg_id]) {

        delete reactionData[msg_id].reactions[emoji];
        let guild = client.guilds.get(reactionData[msg_id].guild_id);
        let channel = guild.channels.get(reactionData[msg_id].channel_id);

        channel.fetchMessage(msg_id).then(msg => {

            msg.reactions.forEach(reaction => {
                if(reaction.emoji.id === emoji)
                    reaction.users.forEach(user => {
                        reaction.remove(user);
                    });
            });
        }).catch(err => console.error(err));
    }
});

socket.on("messageDelete", data => {
    console.log("API server emitted messageDelete", data);
    let msg_id = data.message;
    if(reactionData[msg_id]) {

        let guild = client.guilds.get(reactionData[msg_id].guild_id);
        let channel = guild.channels.get(reactionData[msg_id].channel_id);

        channel.fetchMessage(msg_id).then(msg => {

            msg.reactions.forEach(reaction => {
                reaction.users.forEach(user => {
                    reaction.remove(user);
                });
            });

            delete reactionData[msg_id];
        }).catch(err => console.error(err));
    }
});

socket.on("registerMessage", data => {

    console.log("API server emitted registerMessage", data);
    let msg_id = data.message;

    reactionData[msg_id] = data;
});

socket.on("createMessage", data => {
    console.log("API server emitted createMessage", data);

    let guild = client.guilds.get(data.guild);
    let channel = guild.channels.get(data.channel);
    channel.send({embed: {
        color: 3342130,
        author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
        },
        title: "Reaction List",
        url: "http://emi.gg",
        description: data.contents,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
            text: "Created @"
        }
    }}).then(msg => {
        reactionData[msg.id] = {
            id: msg.id,
            guild_id: data.guild,
            channel_id: data.channel,
            reactions: {}
        };
        socket.emit("createMessage", msg.id);
    }).catch(err => console.error(err));
});