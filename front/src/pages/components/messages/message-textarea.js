import React, { useState, useEffect } from 'react';

const AutoCompleteList = props => {

    return <div></div>;
}
// Whenever we encounter a : or @ it means mention or emoji...
// When we first encounter : or @, from there until we encounter a space, filter roles, emojis, users, etc.

const fetchUsers = async guild_id => {
    let users = {};
  
    let after = "0";
    // eslint-disable-next-line no-constant-condition
    while(true) {

        let response = await fetch(`/api/discord/guild/${guild_id}/members?limit=1000&after=${after}`);

        if(!response.ok)
            break;
        
        let json = await response.json();

        console.log("Got response", json);
        if(!json || json.length === 0)
            break;
        
        // Loop through json and add to map
        for(let i = 0; i < json.length; i++)
        {
            let user = json[i].user;
            users[user.id] = {
                username: user.username,
                discriminator: user.discriminator,
                id: user.id,
                avatar: user.avatar
            };
        }
        if(json.length < 1000)
            break;
        after = json[json.length-1].user.id;
        // Prevent from sending too many requests at a time
        await new Promise(resolve => setTimeout(resolve, 2000));

    }

    return users;
    
};
const MessageTextarea = props => {

    const [mentioning, setMention] = useState(-1);

    const [emoji, setEmoji] = useState(-1);

    const [curSub, setCurSub] = useState("");

    const [users, setUsers] = useState(null);

    useEffect(() => {
        if(users !== null)
            return;
        console.log("fetch user");
        // Fetch users

        fetchUsers(props.Guild.id).then(data => {
            console.log("Returned!", data);

            setUsers(data);
        });
    });

    // Parse initial text and set it to value
    return <div style={{width: '100%', position: 'relative'}}>
        <div className="message-textarea-autocomplete" id="autocomplete">
            {<AutoCompleteList MsgData={props.MsgData} Guild={props.Guild} Substr={curSub}/>}
        </div>
        <textarea onInput={(e) => {
            e.target.style.height = "";
            e.target.style.height = e.target.scrollHeight + "px";
            // Every time we have input reevaluate?
            let mostRecent = e.target.value.substr(e.target.value.length-1);
            console.log("mostRecent", mostRecent);
            // If space then no more mention or emoji
            if(mostRecent === " ") {
                console.log("Set to -1");
                setEmoji(-1);
                setMention(-1);
                // Set our autocomplete 
            }
            else if(mostRecent === "@") {
                console.log("Mention start");
                setMention(e.target.value.length);
                setEmoji(-1);

                // Set our autocomplete to display a list of roles
            }
            else if(mostRecent === ":") {
                console.log("Encounter :");
                setMention(-1);
                // If our emoji is > -1 then finish
                if(emoji !== -1)
                {
                    console.log("Finished emoji");
                    setEmoji(-1);
                }
                else
                {
                    console.log("Start emoji");
                    setEmoji(e.target.value.length);
                }
            }
            else
            {
                if(emoji === -1 && mentioning === -1)
                {
                    setCurSub("");
                }
                else
                {
                    setCurSub(e.target.value.substr(emoji !== -1 ? emoji : mentioning));
                }
                // Update autocomplete based on the substr
                console.log("Our substrs: ");
                if(emoji !== -1) {
                    console.log("Emoji", e.target.value.substr(emoji));
                }
                if(mentioning !== -1) {
                    console.log("Mention", e.target.value.substr(mentioning));
                }
            }
            console.log("onInput", e.target.value);
        }} id="messagetext" key="textarea" placeholder="Contents of message" className="message-textarea">
        </textarea>
        
    </div>
}

export default MessageTextarea;