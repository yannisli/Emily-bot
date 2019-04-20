import React, { useState } from 'react';

import { EmojiDropdown, RoleDropdown } from './reaction-dropdown';

import { GetHexaColor } from './role-span';



const NewReaction = props => {
    const [selectedEmoji, setSelectedEmoji] = useState(props.CurEmoji !== undefined ? props.CurEmoji : null);

    const [selectedRole, setSelectedRole] = useState(props.CurRole !== undefined ? props.CurRole : null);

    const [displayEmojiDrop, setDisplayEmojiDrop] = useState(false);
    
    const [displayRoleDrop, setDisplayRoleDrop] = useState(false);

    const [sending, setSending] = useState(false);

    const [hasError, setHasError] = useState(false);

    const [hovered, setHover] = useState(false);

    let [roleColor, roleName] = ["", "Please select a role"];

    if(selectedRole !== null)
    {
        roleColor = GetHexaColor(selectedRole.color);
        roleName = selectedRole.name;
    }
    if(!sending)
    return <div key="creating" className="reaction-container-editing">
            <div className="reaction-line">
                {selectedEmoji !== null && <img onClick={() => setDisplayEmojiDrop(!displayEmojiDrop)} src={`https://cdn.discordapp.com/emojis/${selectedEmoji.id}.${selectedEmoji.animated ? "gif" : "png"}`} alt="" className="reaction-emoji-button"/>}
                {selectedEmoji === null && <div onClick={() => setDisplayEmojiDrop(!displayEmojiDrop)} className="reaction-emoji-button">?</div>}
                {displayEmojiDrop && <EmojiDropdown Guild={props.Guild} Reactions={props.Reactions} SetDisplay={setDisplayEmojiDrop} SetEmoji={setSelectedEmoji}/>}
                <div className="reaction-name-button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => setDisplayRoleDrop(!displayRoleDrop)} style={{color: hovered ? "" : `#${roleColor}`}}>{roleName}</div>
                {displayRoleDrop && <RoleDropdown Roles={props.Roles} SetDisplay={setDisplayRoleDrop} SetRole={setSelectedRole}/>}
            </div>
            <div className="reaction-sub">Emoji: {selectedEmoji !== null ? selectedEmoji.id : "N/A"}</div>
            <div className="reaction-sub">Role: {selectedRole !== null ? selectedRole.id : "N/A"}</div>
            <div className="reaction-line">
                <div className={(selectedEmoji !== null && selectedRole !== null) ? "reaction-button" : "reaction-button-disabled"} onClick={() => {
                    if(selectedEmoji === null || selectedRole === null)
                        return;
                    setSending(true);

                    // Send

                    props.Confirm(selectedRole.id, selectedEmoji.id, err => {
                        
                        setHasError(err);

                        setTimeout(() => {setSending(false); setHasError(false)}, 5000);
                    });

                
                }}>
                    {props.ConfirmText || "Confirm"}
                </div>
                <div className="reaction-error-button" onClick={() => props.SetDisplayThis(false)}>
                    Cancel
                </div>
            </div>
        </div>
    else
        return <div key="creating" className="reaction-container-editing">
            <div className="reaction-line">
                <img src={`https://cdn.discordapp.com/emojis/${selectedEmoji.id}.${selectedEmoji.animated ? "gif" : "png"}`} alt="" className="reaction-emoji"/>
                <div className="reaction-name" style={{color: `#${roleColor}`}}>{roleName}</div>

            </div>
            <div className="reaction-sub">Emoji: {selectedEmoji.id}</div>
            <div className="reaction-sub">Role: {selectedRole.id}</div>
            {hasError === false && <div className="reaction-inline-notif">
                {props.SendingText || "Sending..."}
            </div>
            }
            {hasError !== false && <div className="reaction-inline-notif-error">
                {hasError}
            </div>
            }
        </div>
}

export default NewReaction;