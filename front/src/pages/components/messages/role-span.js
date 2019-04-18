import React from 'react';

import AnimatedEmoji from './animated-emoji';


const getHexaColor = color => typeof(color) === String ? color.parseInt(color, 10).toString(16) : color.toString(16);

const RoleSpan = props => {

   
    let contents = [];
    let regex = props.str.match(/<@&[0-9]*>/g);

    if(regex !== null)
    {
        // Explode based off of &
        // expl[1].substr(0, expl[1].length-1) is our role id
        let expl = props.str.split("<@&");


        let strBefore = expl[0];

        let newlines = strBefore.split("\n");

        if(newlines.length > 1) {

            contents.push(<span key={`$rolespaninitialnl0`}>{newlines[0]}</span>);

            for(let i = 1; i < newlines.length; i++)
            {
                contents.push(<br key={`rolespawninitialbr${i}`}/>);
                contents.push(<AnimatedEmoji key={`rolespaninitialnl${i}`} str={newlines[i]}></AnimatedEmoji>);
            }
            
        }
        else // Evaluate for emoji
            contents.push(<AnimatedEmoji key={`rolespaninitialbefore`} str={strBefore}></AnimatedEmoji>);

        if(expl.length > 1)
        {
            for(let i = 1; i < expl.length; i++)
            {
                let sub_id = expl[i].substr(0, expl[i].indexOf(">"));
                let rest = expl[i].substr(expl[i].indexOf(">")+1);

                for(let x = 0; x < props.Roles.length; x++)
                {
                    if(props.Roles[x].id === sub_id)
                    {
                        contents.push(<span key={`rolespan${sub_id}aft`} style={{color: `#${getHexaColor(props.Roles[x].color)}`}}>@{props.Roles[x].name}</span>);
                        let newline = rest.split("\n");
                        if(newline.length > 1)
                        {
                            contents.push(<span key={`rolespawn${sub_id}nlcontent0`}>{newline[0]}</span>)
                            for(let j = 1; j < newline.length; j++)
                            {
                                contents.push(<br key={`rolespawn${sub_id}nl${j}`}/>);
                                // Evaluate the content to see if there's an animated emoji
                                contents.push(<AnimatedEmoji key={`rolespawn${sub_id}nlcontent${j}`} str={newline[j]}></AnimatedEmoji>);
                            }
                        }
                        else {
                            // Evaluate the content to see if there's an animated emoji
                            contents.push(<AnimatedEmoji key={`rolespawn${sub_id}rest`} str={rest}></AnimatedEmoji>);
                        }
                        break;
                    }
                }
                
            }
        }

        return contents;
        
    }
    return <AnimatedEmoji str={props.str}></AnimatedEmoji>;
}

export default RoleSpan;

export { getHexaColor as GetHexaColor };