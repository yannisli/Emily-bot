import React, { Component } from 'react';

import fetch from 'node-fetch';

import { connect } from 'react-redux';

import loading from '../../images/loading.svg';

import '../../styles/messages.scss';

const getHexaColor = color => typeof(color) === String ? color.parseInt(color, 10).toString(16) : color.toString(16);

const RoleSpan = props => {

   
    
    let regex = props.str.match(/<@&[0-9]*>/g);

    if(regex !== null)
    {
        console.log("Regex was not null", regex);
        // Explode based off of &
        // expl[1].substr(0, expl[1].length-1) is our role id
        let expl = props.str.split("<@&");
        let id = expl[1].trim();

        id = id.substr(0, id.length-1);

        console.log("Explode", expl);
        console.log(`ID: ${id}E`);

        // Look up through guild

        for(let i = 0; i < props.Roles.length; i++)
        {
            if(props.Roles[i].id === id)
            {
                return [<span key={`RoleSpan${id}bef`}>{expl[0]}</span>,<span key={`RoleSpawn${id}aft`} style={{color: `#${getHexaColor(props.Roles[i].color)}`}}>{props.Roles[i].name}</span>];
            }
        }
        
    }
    return <span>{props.str}</span>;
}
const Message = props => {

    if(!props.Message)
        throw new Error("Message was not assigned a Message prop");
    
    let contents = [];

    let regex = props.Message.contents.match(/<:[A-Za-z0-9]*:[0-9]*>/g);

    let remainder = props.Message.contents;

    if(regex !== null)
    {
        for(let i = 0; i < regex.length; i++)
        {
            if(remainder === undefined)
                break;
            let str = regex[i];
            let expl = remainder.split(str);

            let id = str.split(":");

            // Expl[0] is our string before encountering the Emoji.
            // If there's newlines in it, we need to add the according <br> tags
            // We also must check within the contents if there is a Role mention to convert that into a proper representation
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

    contents.push(<RoleSpan Roles={props.Guild.roles} str={remainder} key={`remainder${props.Message.id}`}/>);
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