import React, { useState, useEffect } from 'react';

import { GetHexaColor } from './role-span';


// Whenever we encounter a : or @ it means mention or emoji...
// When we first encounter : or @, from there until we encounter a space, filter roles, emojis, users, etc.


const MessageTextarea = props => {

    const [start, setStart] = useState(-1);

    const [last, setLast] = useState(-1);

    const [curSub, setCurSub] = useState("");

   
    let innerContents = [];

    const [active, setActive] = useState(0);

    useEffect(() => {
        let text = document.getElementById("messagetext");
        if(!text)
            return;

        text.style.height = "";
        text.style.height = text.scrollHeight + "px";
    });

    let ac = [];
    if(curSub.length > 0)
    {
        
        if(curSub[0] === "@")
        {
            // Mentions
            let s = curSub.substr(1).toLowerCase();

            // Roles
            let count = 0;
            for(let i = 0; i < props.Guild.roles.length; i++)
            {
                if(count > 4)
                    break;
                let role = props.Guild.roles[i];
                if(role.name.toLowerCase().includes(s))
                {
                    

                    let ourCount = count;
                    ac.push(`@${role.name} `);
                    // Add!
                    let className = "autocomplete-line";
                    if(active === ourCount) {
                        className += " autocomplete-active";
           
                    }
                    innerContents.push(<div onClick={() => {
                        // Replace from start to end with the autocompleted
                        let e = document.getElementById("messagetext");
                        let sub = e.value.substr(0, start-1);

                        sub += ac[active];

                        e.value = sub;
                        // Reset our trackers
                        setStart(-1);
                        setCurSub("");
                    }} onMouseEnter={() => {
                        setActive(ourCount);
                    }} className={className} style={{color: `#${GetHexaColor(role.color)}`}} key={role.id}>{role.name}</div>)
                    count++;
                }
                
            }
            let keys = Object.keys(props.Users);
            for(let i = 0; i < keys.length; i++)
            {
                if(count > 10)
                    break;
                let user = props.Users[keys[i]];
                if(user.username.toLowerCase().includes(s))
                {
                    let ourCount = count;

                    ac.push(`@${user.username}#${user.discriminator} `);
                    let className = "autocomplete-line";
                    if(active === ourCount) {
                        className += " autocomplete-active";
           
                    }
                    innerContents.push(<div onClick={() => {
                        // Replace from start to end with the autocompleted
                        let e = document.getElementById("messagetext");
                        let sub = e.value.substr(0, start-1);

                        sub += ac[active];

                        e.value = sub;
                        // Reset our trackers
                        setStart(-1);
                        setCurSub("");
                    }} onMouseEnter={() => {
                        setActive(ourCount);
                    }} className={className} key={user.id}>{user.username}#{user.discriminator}</div>)
                    count++;
                }
            }

            
        }
        else if(curSub[0] === ":")
        {
            // Emojis
            let s = curSub.substr(1).toLowerCase();
            let count = 0;
            for(let i = 0; i < props.Guild.emojis.length; i++)
            {
                if(count > 8)
                    break;
                let emoji = props.Guild.emojis[i];
                
                if(emoji.name.toLowerCase().startsWith(s))
                {
                    
                    let ourCount = count;
                    ac.push(`:${emoji.name}: `);
                    let className = "autocomplete-line";
                    if(active === ourCount) {
                        className += " autocomplete-active";
                    }
                    
                    innerContents.push(<div onClick={() => {
                        // Replace from start to end with the autocompleted
                        let e = document.getElementById("messagetext");
                        let sub = e.value.substr(0, start-1);

                        sub += ac[active];

                        e.value = sub;
                        // Reset our trackers
                        setStart(-1);
                        setCurSub("");
                    }} onMouseEnter={() => {
                        setActive(ourCount);
                    }} key={emoji.id} className={className}>
                        <img className="autocomplete-emoji" src={`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`} alt=""/>
                        <div className="autocomplete-text">:{emoji.name}:</div>
                    </div>);
                    count++;
                }
            }

        }
    }
    // Parse initial text and set it to value
    return <div style={{width: '100%', position: 'relative'}}>
        {curSub.length > 0 && <div className="autocomplete-outer">
            <div className="autocomplete-inner">
                <div className="autocomplete-container">
                    {innerContents}
                </div>
            </div>
        </div>
        }
        <textarea onKeyDown={(e) => {
            if(curSub.length > 0) {
                if(e.keyCode === 38 )
                {
                    // Make active +1 or loop back to 0 if it reaches ac.length
                    if((active + 1) >= ac.length)
                        setActive(0);
                    else  
                        setActive(active+1);
                    e.preventDefault();
                    return false;
                }
                else if(e.keyCode === 40)
                {
                    if((active - 1) < 0)
                        setActive(ac.length-1);
                    else
                        setActive(active-1);
                    e.preventDefault();
                    return false;
                }
                else if(e.keyCode === 9 || e.keyCode == 13)
                {
                    e.preventDefault();
                    // Means we have something to autocomplete
                    // Replace from start to end with the autocompleted
                    let sub = e.target.value.substr(0, start-1);

                    sub += ac[active];

                    e.target.value = sub;
                    // Reset our trackers
                    setStart(-1);
                    setCurSub("");
                    return false;
                }
            }
            }}  onInput={(e) => {
            props.SetText(e.target.value);
            e.target.style.height = "";
            e.target.style.height = e.target.scrollHeight + "px";
            // Every time we have input reevaluate?
            let mostRecent = e.target.value.substr(e.target.value.length-1, 1);
            // If we have additions
            if(last < e.target.value.length) {
                // If space then no more mention or emoji
                if(mostRecent === " ") {
                    setCurSub("");
                    setStart(-1);
                }
                else if(mostRecent === "@") {
                    setStart(e.target.value.length);
                    setCurSub("@");
                    setActive(0);
                }
                else if(mostRecent === ":") {
                    // If our emoji is > -1 then finish
                    if(start !== -1 && e.target.value.substr(start-1, 1) === ":")
                    {
                        setStart(-1);
                        setCurSub("");
                    }
                    else
                    {
                        setStart(e.target.value.length);
                        setCurSub(":");
                        setActive(0);
                    }
                }
                else
                {
                    if(start == -1)
                    {
                        setCurSub("");
                    }
                    else
                    {
                        setCurSub(e.target.value.substr(Math.max(0,start-1)));
                    }
                    // Update autocomplete based on the substr
                    
                }
            }
            else // If we have backspaced then we have to reevaluate if our last is connected to a word then go back until encountering whitespace to construct a substr again
            {
                if(e.target.value.length === 0)
                {
                    setStart(-1);
                    setCurSub("");
                }
                else
                {
                    let beforeCur = e.target.value.substr(e.target.value.length-1, 1);
                    let reg = /[^ @:]/g

                    let res = beforeCur.match(reg);
                    if(res !== null)
                    {
                        // Its not @ : or whitespace
                        // Iterate until the start of string or encountering whitespace
                        for(let i = e.target.value.length-2; i >= 0; i--)
                        {
                            let sub = e.target.value[i];
                            let res = sub.match(reg);
                            if(res === null)
                            {
                                // Check if its @ or : then reconstruct
                                if(sub === "@" || sub === ":")
                                {
                                    // Set our start here
                                    setStart(i+1);
                                    setCurSub(e.target.value.substr(Math.max(0, i)));
                                    setActive(0);
                                }
                                break;
                            }
                        }
                    }
                    else
                    {
                        if(e.target.value.length < 3)
                        {
                            setStart(0);
                            setCurSub(e.target.value);
                            setActive(0);
                        }
                        else
                        {
                            // Backspaced into @ or :
                            // When backspaced into :, iterate down to see if its part of an existing emoji
                            if(beforeCur === "@" )
                            {
                                setStart(e.target.value.length);
                                setCurSub(e.target.value.substr(e.target.value.length-1));
                                setActive(0);

                            }
                            else if(beforeCur === ":")
                            {
                                let existingEmoji = false;
                                let reg = /[^ @:]/g;
                                for(let i = e.target.value.length-2; i >= 0; i--)
                                {
                                    // Loop through until encountering a :, if we encounter an : it means its part of an emoji
                                    let cur = e.target.value[i];
                                    let m = cur.match(reg);
                                    if(m === null)
                                    {
                                        // If its a : then its existing, if not then nope.
                                        if(cur === ":")
                                        {
                                            existingEmoji= true;
                                        }
                                        else
                                            break;
                                    }
                                   
                                }

                                if(existingEmoji)
                                {
                                    setStart(-1);
                                    setCurSub("");
                                }
                                else
                                {
                                    setStart(e.target.value.length);
                                    setCurSub(e.target.value.substr(e.target.value.length-1));
                                    setActive(0);
                                }
                            }
                            else {
                                setStart(-1);
                                setCurSub("");
                            }
                        }
                    }
                }
            }
            setLast(e.target.value.length);
        }} id="messagetext" key="textarea" defaultValue={props.Old !== null ? props.Old : ""} placeholder="Contents of message" className="message-textarea">
        </textarea>
        
    </div>
}

export default MessageTextarea;