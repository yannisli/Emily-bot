import React from 'react';

import { GetHexaColor } from './role-span';
const EmojiDropdown = props => {

    return <div className="reaction-dropdown">
        <div className="reaction-dropdown-container">
            {props.Guild.emojis.reduce((acc, curVal) => {
                for(let i = 0; i < props.Reactions.length; i++)
                {
                    if(props.Reactions[i].emoji === curVal.id)
                        return acc;
                }
                acc.push(<img onClick={() => {
                    props.SetEmoji({animated: curVal.animated, id: curVal.id})
                    props.SetDisplay(false);
                }} key={curVal.id} src={`https://cdn.discordapp.com/emojis/${curVal.id}.${curVal.animated ? "gif" : "png"}`} alt="" className="reaction-emoji-button"/>);
                return acc;
            }, [])}
        </div>
    </div>

};

const RoleDropdown = props => {
    return <div className="reaction-dropdown">
    <div className="reaction-dropdown-container">
        {props.Roles.reduce((acc, curVal) => {
            if(curVal.name === "@everyone")
                return acc;
            acc.push(<div onClick={() => {
               
                props.SetRole(curVal);
                props.SetDisplay(false);
            }} key={curVal.id} className="reaction-name-button-dropdown" style={{color: `#${GetHexaColor(curVal.color)}`}}>{curVal.name}</div>);
            return acc;
        }, [])}
    </div>
</div>
};

export {RoleDropdown, EmojiDropdown};