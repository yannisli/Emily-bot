import React, { useState } from 'react';

import { GetHexaColor } from './role-span';
const Reaction = props => {

    let color = `#${GetHexaColor(props.Role.color)}`;
    return <div className="reaction-container">
        <div className="reaction-line">
            <img src={`https://cdn.discordapp.com/emojis/${props.Emoji}.png`} alt="" className="reaction-emoji"/>
            <span className="reaction-name">&nbsp;-&nbsp;</span>
            <span className="reaction-name" style={{color: color}}>{props.Role.name}</span>
            
        </div>
        <span className="reaction-sub">Emoji:{props.Emoji}</span>
        <span className="reaction-sub">Role:{props.Role.id}</span>
        <div className="reaction-line">
            <div className="reaction-button">
                Edit
            </div>

            <div className="reaction-error-button">
                Delete
            </div>
        </div>

    </div>
}

export default Reaction;