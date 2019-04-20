import React from 'react';
import Reaction from './reaction';
import store from '../../../store';
import NewReaction from './new-reaction';
const ReactionList = props => {
    let innerContents;
    let creatingContents;
   

    

    if(props.Creating)
    {
        console.log("Guild: ", props.Guild);
        creatingContents = <NewReaction key="new-reaction" ConfirmText="Create" Confirm={(role, emoji, errHandler) => {
            
            fetch(`/api/messages/message/${props.MessageID}/reaction/create`, {
                method: "POST",
                body: JSON.stringify({role: role, emoji: emoji}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {

                if(res.ok)
                {
                    store.dispatch({type: "NEW_REACTION", data: {message: props.MessageID, reaction: {role: role, emoji: emoji}} });
                    props.SetCreating(false);
                }
                else
                {
                    console.error(res.status);
                    errHandler(`Response not OK Code ${res.status}`);
                }

            }).catch(err => console.error(err));
        }} SendingText="Creating..." SetDisplayThis={props.SetCreating} Guild={props.Guild} Reactions={props.Reactions} Roles={props.Roles}/>
    }

    

    
    if(props.Reactions.length === 0)
    {
        if(!props.Creating)
            innerContents = <div className="reaction-error">No reactions are registered...</div>
        else
            innerContents = creatingContents;
    }
    else {
        innerContents = [];
        if(props.Creating)
            innerContents.push(creatingContents);
        for(let i = 0; i < props.Reactions.length; i++)
        {
            // Emoji, Role
            for(let x = 0; x < props.Roles.length; x++)
            {
                if(props.Roles[x].id === props.Reactions[i].role)
                {
                   
                    
                    innerContents.push(<Reaction {...{Reactions: props.Reactions, Guild: props.Guild, Roles: props.Roles}} key={`reaction${i}`} MessageID={props.MessageID} Emoji={props.Reactions[i].emoji} Role={props.Roles[x]}/>);
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