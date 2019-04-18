import React, { useState } from 'react';



import Reaction from './reaction';
const ReactionList = props => {
    let innerContents;
    if(props.Reactions.length === 0)
    {
        innerContents = <div className="reaction-error">No reactions are registered...</div>
    }
    else {
        innerContents = [];
        for(let i = 0; i < props.Reactions.length; i++)
        {
            // Emoji, Role
            for(let x = 0; x < props.Roles.length; x++)
            {
                if(props.Roles[x].id === props.Reactions[i].role)
                {
                   
                    
                    innerContents.push(<Reaction key={`reaction${i}`} Emoji={props.Reactions[i].emoji} Role={props.Roles[x]}/>);
                    break;
                }
            }
            
        }
    }
    return <div className="reaction-list-container">
        {innerContents}
    </div>;
}

export default ReactionList;  