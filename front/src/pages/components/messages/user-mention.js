import React from 'react';

const UserMention = props => {


    let contents = [];

    let regex = props.str.match(/<@[0-9]*>/g);

    let remainder = props.str;

    if(regex === null)
        return <span>{props.str}</span>
    else
    {
        for(let i = 0; i < regex.length; i++)
        {
            if(remainder === undefined)
                break;
            let str = regex[i];

            let expl = remainder.split(str);

            let id = str.split("@");

            id = id[1].substr(0, id[1].length-1);

            let newlines = expl[0].split("\n");

            if(newlines.length > 1)
            {
                // Append spans with line breaks
                // 0 based element doesn't have a line break since \n appears after it
                if(newlines[0].length > 0)
                    contents.push(<span key={`${i}usermention${id}nlcont0`}>{newlines[0]}</span>);
                for(let j = 1; j < newlines.length; j++)
                {
                    contents.push(<br key={`usermention${id}nl${j}`}/>);
                    if(newlines[j].length > 0)
                        contents.push(<span key={`usermention${id}nlcont${j}`}>{newlines[j]}</span>);
                }
            }
            else if(expl[0].length > 0)
                contents.push(<span key={`usermention${id}remainder${i}`}>{expl[0]}</span>)

            // Append a mention
            contents.push(<span key={`usermention${id}user`} className="message-mention">@{props.Users[id].username}#{props.Users[id].discriminator}</span>);

            if(expl.length >= 3)
            {
                let concat = expl[1];

                for(let x = 2; x < expl.length; x++)
                {
                    concat += str;
                    concat += expl[x];
                }

                remainder = concat;
            } else
            {
                remainder = expl[1];
            }
        }

        contents.push(<span key="usermentionremainders">{remainder}</span>);
    }

    return contents;

};

export default UserMention;