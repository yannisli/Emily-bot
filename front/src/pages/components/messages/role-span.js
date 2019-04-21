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
            if(newlines[0].length > 0)
                contents.push(<span key={`$rolespaninitialnl0`}>{newlines[0]}</span>);

            for(let i = 1; i < newlines.length; i++)
            {
                contents.push(<br key={`rolespawninitialbr${i}`}/>);
                if(newlines[i].length > 0)
                    contents.push(<AnimatedEmoji Users={props.Users} key={`rolespaninitialnl${i}`} str={newlines[i]}></AnimatedEmoji>);
            }
            
        }
        else if(strBefore.length > 0) // Evaluate for emoji
            contents.push(<AnimatedEmoji Users={props.Users} key={`rolespaninitialbefore`} str={strBefore}></AnimatedEmoji>);

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
                        let c = parseInt(props.Roles[x].color, 10);
                        let r = Math.floor(c / (256*256));
                        let g = Math.floor(c / 256) % 256;
                        let b = c % 256;
                        contents.push(<span key={`rolespan${sub_id}aft${i}`} style={{backgroundColor: `rgba(${r},${g},${b},0.1)`, color: `#${getHexaColor(props.Roles[x].color)}`}}>@{props.Roles[x].name}</span>);
                        let newline = rest.split("\n");
                        if(newline.length > 1)
                        {
                            contents.push(<span key={`${i}rolespawn${sub_id}nlcontent0`}>{newline[0]}</span>)
                            for(let j = 1; j < newline.length; j++)
                            {
                                contents.push(<br key={`${i}rolespawn${sub_id}nl${j}`}/>);
                                // Evaluate the content to see if there's an animated emoji
                                contents.push(<AnimatedEmoji Users={props.Users} key={`${i}rolespawn${sub_id}nlcontent${j}`} str={newline[j]}></AnimatedEmoji>);
                            }
                        }
                        else {
                            // Evaluate the content to see if there's an animated emoji
                            contents.push(<AnimatedEmoji Users={props.Users} key={`rolespawn${sub_id}rest${i}`} str={rest}></AnimatedEmoji>);
                        }
                        break;
                    }
                }
                
            }
        }

        return contents;
        
    }
    return <AnimatedEmoji Users={props.Users} str={props.str}></AnimatedEmoji>;
}

export default RoleSpan;

export { getHexaColor as GetHexaColor };