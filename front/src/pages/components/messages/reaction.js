import React, { useState } from 'react';

import { GetHexaColor } from './role-span';

import store  from '../../../store';

import fetch from 'node-fetch';

import NewReaction from './new-reaction';


const Reaction = props => {

    let color = `#${GetHexaColor(props.Role.color)}`;

    const [editing, setEditing] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [sendingDelete, setSendingDelete] = useState(false);


    const [isAnimated, setAnimated] = useState(true);

    let containerClass = "reaction-container";

    if(editing)
        containerClass = "reaction-container editing";
    else if(deleting || sendingDelete)
        containerClass = "reaction-container deleting";
    if(!editing)
        return <div className={containerClass}>
            <div className="reaction-line">
                <img src={`https://cdn.discordapp.com/emojis/${props.Emoji}.gif`} onError={event => {
                    event.target.onerror = null;
                    event.target.src = `https://cdn.discordapp.com/emojis/${props.Emoji}.png`;
                    setAnimated(false);
                }} alt="" className="reaction-emoji"/>
                <span className="reaction-name" style={{color: color}}>{props.Role.name}</span>
                
            </div>
            <div>
                <div className="reaction-sub">Emoji: {props.Emoji}</div>
                <div className="reaction-sub">Role: {props.Role.id}</div>
            </div>
            {!editing && !deleting && <div className="reaction-line">
                <div className="reaction-button" onClick={() => setEditing(true)}>
                    Edit
                </div>

                <div className="reaction-error-button" onClick={() => setDeleting(true)}>
                    Delete
                </div>
            </div>
            }
            {deleting && !sendingDelete && <div className="reaction-line">
                <div className="reaction-button" onClick={() => {
                    
                    setSendingDelete(true);

                    fetch(`/api/messages/message/${props.MessageID}/reaction/${props.Emoji}`, {
                        method: "DELETE"
                    }).then(res => {
                        
                        if(!res.ok) {
                            console.error(res.status);
                            setSendingDelete(false);
                        }
                        else
                        {
                            store.dispatch({type: "REACTION_DELETED", data: {message: props.MessageID, emoji: props.Emoji}});
                            setSendingDelete(false);
                            setDeleting(false);
                        }
                    }).catch(err => console.error(err));

                }}>
                    Delete
                </div>
                <div className="reaction-error-button" onClick={() => setDeleting(false)}>
                    Cancel
                </div>
            </div>
            }
            {sendingDelete && <div className="reaction-line">
                <div className="reaction-inline-notif">
                    Deleting...
                </div>
            </div>}
        </div>
    else
        return <NewReaction CurRole={props.Role} CurEmoji={{animated: isAnimated, id: props.Emoji}} Confirm={(role, emoji, errHandler) => {
            
            fetch(`/api/messages/message/${props.MessageID}/reaction/${props.Emoji}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newRole: role, newEmoji: emoji})
            }).then(res => {
                if(!res.ok)
                {
                    console.error(res.status);
                    errHandler(`Response not OK Code ${res.status}`);
                }
                else
                {
                    store.dispatch({type: "REACTION_EDITED", data: {message: props.MessageID, oldEmoji: props.Emoji, newEmoji: emoji, newRole: role}});
                    setEditing(false);
                }
            }).catch(err => console.error(err));
        }}ConfirmText="Change" SendingText="Changing..." SetDisplayThis={setEditing} Guild={props.Guild} Reactions={props.Reactions} Roles={props.Roles}/>
}

export default Reaction;