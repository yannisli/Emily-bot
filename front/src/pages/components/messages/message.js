import React from 'react';
import MessageContents from './message-contents';


const Message = props => {

    if(!props.Message)
        throw new Error("Message was not assigned a Message prop");
    
    

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
            <span className="message-discriminator">#{props.Message.author.discriminator}</span>
        </div>
        <div className="message-author">{props.MsgData.Channels[props.MsgData.Messages[props.Message.id].channel].name}
            <span className="message-discriminator">#{props.Message.channel}</span>
        </div>
        <span className="message-discriminator">{props.Message.id}</span>
        <div className="message-contents">
            <MessageContents Guild={props.Guild} Message={props.Message}/>
            <br/>
            <div className="message-attachments-container">
                {attachments}
                </div>
            
        </div>
        {props.children}
    </div>;
}

export default Message;