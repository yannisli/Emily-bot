import React, { Component } from 'react';

import fetch from 'node-fetch';

import { connect } from 'react-redux';

import loading from '../../images/loading.svg';

import '../../styles/messages.scss';

const getHexaColor = color => typeof(color) === String ? color.parseInt(color, 10).toString(16) : color.toString(16);


const AnimatedEmoji = props => {

    let contents = [];
    // Match strings that are of the animated emoji format
    // <a:emoji_name:snowflake_id>
    let regex = props.str.match(/<a:[A-Za-z0-9]*:[0-9]*>/g);

    // Remaining input we have yet to parse
    let remainder = props.str;
    // If no matches, just return a span of this element
    if(regex === null)
        return <span>{props.str}</span>
    else {

        // Split the text
        for(let i = 0; i < regex.length; i++)
        {
            if(remainder === undefined)
                break;
            // Our str we used to split
            let str = regex[i];
            // Split the remaining string by the regex match
            let expl = remainder.split(str);

            // Our id is the 3rd element in the array
            // As we split based on :
            // and the animated emoji is in the format of <a:emoji_name:snowflake_id>
            let id = str.split(":");

            id = id[2].substr(0, id[2].length-1);

            // If we have newlines we should also accordingly append line breaks
            let newlines = expl[0].split("\n");

            if(newlines.length > 1)
            {
                // Append spans with line breaks
                // 0 based element doesn't have a line break since \n appears after it
                contents.push(<span key={`${i}animated${id}nlcont0`}>{newlines[0]}</span>);
                for(let j = 1; j < newlines.length; j++)
                {
                    contents.push(<br key={`animated${id}nl${j}`}/>);
                    contents.push(<span key={`animated${id}nlcont${j}`}>{newlines[j]}</span>);
                }
            }
            else // No newlines, don't need to loop
                contents.push(<span key={`animated${id}remainder${i}`}>{expl[0]}</span>)

            // Append our animated gif
            contents.push(<img src={`https://cdn.discordapp.com/emojis/${id}.gif`} alt="" key={`${i}animated${id}emoji`} className="message-emoji"/>);
            // If we had more than 2 results from the split because there was duplicate emojis, we need to concatenate them back to remainder since we need to parse things in order of the RegEx occurences
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
        // Push the remaining string to display as well
        contents.push(<span key={`animatedemojiremainders`}>{remainder}</span>);
    }

    return contents;

    
}

const RoleSpan = props => {

   
    let contents = [];
    let regex = props.str.match(/<@&[0-9]*>/g);

    if(regex !== null)
    {
        // Explode based off of &
        // expl[1].substr(0, expl[1].length-1) is our role id
        let expl = props.str.split("<@&");


        let strBefore = expl[0];

        let newlines = strBefore.split("\n");

        if(newlines.length > 1) {

            contents.push(<span key={`$rolespaninitialnl0`}>{newlines[0]}</span>);

            for(let i = 1; i < newlines.length; i++)
            {
                contents.push(<br key={`rolespawninitialbr${i}`}/>);
                contents.push(<AnimatedEmoji key={`rolespaninitialnl${i}`} str={newlines[i]}></AnimatedEmoji>);
            }
            
        }
        else // Evaluate for emoji
            contents.push(<AnimatedEmoji key={`rolespaninitialbefore`} str={strBefore}></AnimatedEmoji>);

        if(expl.length > 1)
        {
            for(let i = 1; i < expl.length; i++)
            {
                let sub_id = expl[i].substr(0, expl[i].indexOf(">"));
                let rest = expl[i].substr(expl[i].indexOf(">")+1);

                for(let x = 0; x < props.Roles.length; x++)
                {
                    if(props.Roles[x].id === sub_id)
                    {
                        contents.push(<span key={`rolespan${sub_id}aft`} style={{color: `#${getHexaColor(props.Roles[x].color)}`}}>@{props.Roles[x].name}</span>);
                        let newline = rest.split("\n");
                        if(newline.length > 1)
                        {
                            contents.push(<span key={`rolespawn${sub_id}nlcontent0`}>{newline[0]}</span>)
                            for(let j = 1; j < newline.length; j++)
                            {
                                contents.push(<br key={`rolespawn${sub_id}nl${j}`}/>);
                                // Evaluate the content to see if there's an animated emoji
                                contents.push(<AnimatedEmoji key={`rolespawn${sub_id}nlcontent${j}`} str={newline[j]}></AnimatedEmoji>);
                            }
                        }
                        else {
                            // Evaluate the content to see if there's an animated emoji
                            contents.push(<AnimatedEmoji key={`rolespawn${sub_id}rest`} str={rest}></AnimatedEmoji>);
                        }
                        break;
                    }
                }
                
            }
        }

        return contents;
        
    }
    return <AnimatedEmoji str={props.str}></AnimatedEmoji>;
}
const Message = props => {

    if(!props.Message)
        throw new Error("Message was not assigned a Message prop");
    
    /**
     * Message returns the message-contents and parses the message for embeds, attachments, role mentions, emojis, and animated emojis and displays them accordingly
     * 
     * Check for animated emoji -> Remainder strings checked for role mentions -> Remainder strings from RoleSpan checked for AnimatedEmojis
     * 
     * 
     */
    let contents = [];
    // Regex matches for normal emoji
    let regex = props.Message.contents.match(/<:[A-Za-z0-9]*:[0-9]*>/g);

    // Remainder of the contents we still need to parse
    let remainder = props.Message.contents;
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
                contents.push(<RoleSpan Roles={props.Guild.roles} str={newlines[0]} key={`${i}msg${props.Message.id}nl0`}/>);

                for(let x = 1; x < newlines.length; x++)
                {
                    contents.push(<br key={`${i}msg${props.Message.id}br${x}`}/>);
                    contents.push(<RoleSpan Roles={props.Guild.roles} str={newlines[x]} key={`${i}msg${props.Message.id}nlsp${x}`}/>);
                
                }
            }
            else
            {
                contents.push(<RoleSpan Roles={props.Guild.roles} str={expl[0]} key={`${i}msg${props.Message.id}nlsp0`}/>);
            }

            // Push the emoji
            contents.push(<img alt="" key={`${i}msg${props.Message.id}emoji${i}`} src={`https://cdn.discordapp.com/emojis/${id[2].substr(0, id[2].length-1)}.png`} className="message-emoji"/>);

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
    contents.push(<RoleSpan Roles={props.Guild.roles} str={remainder} key={`remainder${props.Message.id}`}/>);

    let attachments = [];
    if(props.Message.attachments) {
        for(let i = 0; i < props.Message.attachments.length; i++)
        {
            attachments.push(<img key={`attachment${i}msg${props.Message.id}`} src={props.Message.attachments[i].url} alt={props.Message.attachments[i].filename}/>);
        }
    }

    return <div className="message-container">
        <img src={`https://cdn.discordapp.com/avatars/${props.Message.author.id}/${props.Message.author.avatar}.png`} alt="?" className="message-avatar"/>
        <div className="message-author">{props.Message.author.username}
            <span className="message-discriminator">#{props.Message.author.id}</span>
        </div>
        <div className="message-author">{props.MsgData.Channels[props.MsgData.Messages[props.Message.id].channel].name}
            <span className="message-discriminator">#{props.Message.channel}</span>
        </div>
        <span className="message-discriminator">{props.Message.id}</span>
        <div className="message-contents">
            {contents}
            <br/>
            {attachments}
            
        </div>
        {props.children}
    </div>;
}
class Messages extends Component {
    render() {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");
        if(this.props.Loading)
        {
            return [<div key="messages-loading">Loading Messages...</div>,<img key="messages-loading-svg" src={loading} alt="Loading" className="loading"/>];
        }
        else if(this.props.Loaded)
        {
            let contents = [];
            for(let msg_id in this.props.MsgData.Messages)
            {
                let msg = this.props.MsgData.Messages[msg_id];

                contents.push(<Message key={msg_id} MsgData={this.props.MsgData} Guild={this.props.GuildData} Message={msg}/>);
            }

            return <div className="messages-container">
                {contents}
            </div>
        }
        return <div></div>;
    }
    componentDidMount()
    {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");
        // Fetch messages
        this.props.dispatch({type: "LOADING_GUILD"});
        fetch(`/api/messages/guild/${this.props.Guild.id}`).then(res => {

            if(!res.ok)
            {
                console.error(res.status);
                res.json().then(err => console.error(err));
                this.props.dispatch({type: "GUILD_LOADED", data: null});
                return;
            }
            else
            {
                res.json().then(json => {
                    this.props.dispatch({type: "GUILD_LOADED", data: json});
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
}

export default connect(state => {
    return {
        MsgData: state.messages.data,
        Loading: state.messages.loading,
        Loaded: state.messages.loaded,
        GuildData: state.core.selectedGuildData
    }
})(Messages);

export { Message, RoleSpan };

export { getHexaColor as GetHexaColor };