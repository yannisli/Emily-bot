import React, { useState }from 'react';
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
    const [displayed, setDisplay] = useState(true);
    return <div className="message-container">
        <img src={`https://cdn.discordapp.com/avatars/${props.Message.author.id}/${props.Message.author.avatar}.png`} alt="?" className="message-avatar"/>
        <div className="message-line">
            
            <span className="message-author">{props.Message.author.username}
                
            </span>
            <span className="message-discriminator">#{props.Message.author.discriminator}</span>
            <span className="message-author">&nbsp;in&nbsp;{props.MsgData.Channels[props.MsgData.Messages[props.Message.id].channel].name}
                
            </span>
            <span className="message-discriminator">#{props.Message.channel}</span>
            
        </div>
        <div className="message-dropdown-button" onClick={() => setDisplay(!displayed)}>
            {displayed ? "—" : "+"}
        </div>
        <span className="message-id">{props.Message.id}</span>
        {displayed &&
            [<div key="contents" className="message-contents">
                <MessageContents Guild={props.Guild} Message={props.Message}/>
                <br/>
                <div className="message-attachments-container">
                    {attachments}
                    </div>
                
            </div>,
            <div key="register" className="message-button">
                Register new Reaction
            </div>,
            <div key="delete" className="message-error-button">
                Delete Message
            </div>]
        }
        {props.children}
    </div>;
}

export default Message;