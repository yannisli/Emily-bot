import React from 'react';

import RoleSpan from './role-span';

const MessageContents = props => {
    /**
     * Message returns the message-contents and parses the message for embeds, attachments, role mentions, emojis, and animated emojis and displays them accordingly
     * 
     * Check for animated emoji -> Remainder strings checked for role mentions -> Remainder strings from RoleSpan checked for AnimatedEmojis
     * 
     * 
     */
    let contents = [];
    // Regex matches for normal emoji
    let regex = props.Contents.match(/<:[A-Za-z0-9_]*:[0-9]*>/g);

    // Remainder of the contents we still need to parse
    let remainder = props.Contents;
    // If we have regex matches
    if(regex !== null)
    {
        // Loop through them
        for(let i = 0; i < regex.length; i++)
        {
            if(remainder === undefined)
                break;
            let str = regex[i];
            let expl = remainder.split(str);

            let id = str.split(":");

            // Expl[0] is our string before encountering the Emoji.
            // If there's newlines in it, we need to add the according <br> tags
            // We also must check within the contents if there is a Role mention or AnimatedEmoji to convert that into a proper representation
            let newlines = expl[0].split("\n");
            if(newlines.length > 1)
            {
                if(newlines[0].length > 0)
                    contents.push(<RoleSpan Users={props.Users} Roles={props.Guild.roles} str={newlines[0]} key={`${i}msg${props.MessageID}nl0`}/>);

                for(let x = 1; x < newlines.length; x++)
                {
                    contents.push(<br key={`${i}msg${props.MessageID}br${x}`}/>);
                    if(newlines[x].length > 0)
                        contents.push(<RoleSpan Users={props.Users} Roles={props.Guild.roles} str={newlines[x]} key={`${i}msg${props.MessageID}nlsp${x}`}/>);
                
                }
            }
            else if(expl[0].length > 0)
            {
                contents.push(<RoleSpan Users={props.Users} Roles={props.Guild.roles} str={expl[0]} key={`${i}msg${props.MessageID}nlsp0`}/>);
            }

            // Push the emoji
            contents.push(<img alt="" key={`${i}msg${props.MessageID}emoji${i}`} src={`https://cdn.discordapp.com/emojis/${id[2].substr(0, id[2].length-1)}.png`} className="message-emoji"/>);

            // We need to concatenate to properly represent the rest of the string we have not used parsed
            if(expl.length >= 3)
            {
                let concat = expl[1];

                for(let x = 2; x < expl.length; x++)
                {
                    concat += str;
                    concat += expl[x];
                }

                remainder = concat;
            } else
            {
                remainder = expl[1];
            }
        }
    }

    // Push the remaining string, it will also be checked for Role mentions and Animated Emojis
    contents.push(<RoleSpan Users={props.Users} Roles={props.Guild.roles} str={remainder} key={`remainder${props.MessageID}`}/>);

    return contents;
}

export default MessageContents;