import React, { useState }from 'react';
import MessageContents from './message-contents';

import ReactionList from './reaction-list';

import store from '../../../store';

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

    const [deleting, setDeleting] = useState(false);

    const [creating, setCreating] = useState(false);

    const [editing, setEditing] = useState(false);

    let canEdit = props.Message.author.id === "272421186166587393";

    let containerClass = deleting ? "message-container deleting" : editing ? "message-container editing" : "message-container";

    let buttons = [];

    let editButton = <div key="edit" className={(!canEdit || deleting || creating) ? "message-button disabled" : "message-button"} onClick={() => {if(!canEdit) return; setEditing(true)}}>Edit Message</div>

    if(!deleting)
    {
        buttons.push(<div key="register" className={(deleting || editing || creating) ? "message-button disabled" : "message-button"} onClick={() => {if(editing || deleting) return; setCreating(true)}}>New Reaction</div>);
        if(!editing)
            buttons.push(editButton);
        buttons.push(<div key="delete" className={(editing || creating) ? "message-error-button disabled" : "message-error-button"} onClick={() => {if(creating) return; setDeleting(true)}}>Delete Message</div>);
        if(editing)
        {
            buttons.push(<div key="confirm_edit" className="message-button">Confirm Edit</div>);
            buttons.push(<div key="canceledit" className="message-error-button" onClick={() => setEditing(false)}>Cancel</div>);
        }
    }
    else
    {
        buttons.push(<div key="register" className={(deleting || editing || creating) ? "message-button disabled" : "message-button"} onClick={() => {if(editing || deleting) return; setCreating(true)}}>New Reaction</div>);
        buttons.push(editButton);
        buttons.push(<div key="confirm" onClick={() => {
            
            fetch(`/api/messages/message/${props.Message.id}`,
            {method: 'DELETE'}).then(res => {
                if(res.ok)
                {
                    store.dispatch({type: "MESSAGE_DELETED", data: props.Message.id});
                    
                }
            }).catch(err => console.error(err));
            
        }}className="message-button">Delete</div>);
        buttons.push(<div key="cancel" className="message-error-button" onClick={() => setDeleting(false)}>Cancel</div>);
    }


    

    
    return <div className={containerClass}>
        <img src={`https://cdn.discordapp.com/avatars/${props.Message.author.id}/${props.Message.author.avatar}.png`} alt="?" className="message-avatar circular"/>
        <div className="message-line">
            
            <span className="message-author">{props.Message.author.username}
                
            </span>
            <span className="message-discriminator">#{props.Message.author.discriminator}</span>
            <span className="message-author">&nbsp;in&nbsp;{props.MsgData.Channels[props.MsgData.Messages[props.Message.id].channel].name}
                
            </span>
            <span className="message-discriminator">#{props.Message.channel}</span>
            
        </div>
        <div className="message-dropdown-button pushRight" onClick={() => setDisplay(!displayed)}>
            {displayed ? "—" : "+"}
        </div>
        <span className="message-id">{props.Message.id}</span>
        {displayed &&
            [<div key="contents" className="message-contents">
                <MessageContents Users={props.Users} Guild={props.Guild} MessageID={props.Message.id} Contents={props.Message.contents}/>
                <br/>
                <div className="message-attachments-container">
                    {attachments}
                    </div>
                
            </div>,
            ...buttons,
            <ReactionList Guild={props.Guild} Creating={creating} SetCreating={setCreating} MessageID={props.Message.id} Roles={props.Guild.roles} Reactions={props.MsgData.Messages[props.Message.id].reactions} key="reaction-list"/>
        ]
        }
        {props.children}
    </div>;
}

export default Message;