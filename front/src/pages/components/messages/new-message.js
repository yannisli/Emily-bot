import React, { useState, useEffect } from 'react';

import MessageTextarea from './message-textarea';

import MessageContents from './message-contents';
import store from '../../../store';

// escape regular expression utility from online
// replaces all normal regular expression stuff like ? + * ^ ( ) with the escaped version
let escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
/**
 * Transpiles the front-end representations like @reaction test 2 and :lul: into the back-end string representations like
 * <@&50505050505050> and <:lul:505050505050>
 * 
 * Takes the string we want to be parsed and the array of roles and emojis that we are transforming things from.
 */
let transpileFrontToBack = (frontStr, roles, emojis, users) => {

    let rolesDesc = {};

    let retVal = frontStr;

    for(let i = 0; i < roles.length; i++)
    {
        console.log("splitting");
        let split = roles[i].name.split(" ");
        console.log(split);

        if(!rolesDesc[split.length])
            rolesDesc[split.length] = [];
        rolesDesc[split.length].push(roles[i]);
    }

    let keys = Object.keys(rolesDesc).sort();

    for(let i = keys.length-1; i >= 0; i--)
    {
        console.log("Looking at roles with length ", keys[i]);
        let arr = rolesDesc[keys[i]];

        console.log("arr is", arr);
        for(let j = 0; j < arr.length; j++)
        {
            retVal = retVal.replace(new RegExp(escapeRegExp(`@${arr[j].name}`), 'gi'), `<@&${arr[j].id}>`);
        }
    }

    for(let i = 0; i < emojis.length; i++)
    {
        retVal = retVal.replace(new RegExp(escapeRegExp(`:${emojis[i].name}:`), 'gi'), `<${emojis[i].animated ? "a" : ""}:${emojis[i].name}:${emojis[i].id}>`);
    }
    let userKeys = Object.keys(users);
    for(let i = 0; i < userKeys.length; i++)
    {
        let user = users[userKeys[i]];
        retVal = retVal.replace(new RegExp(escapeRegExp(`@${user.username}#${user.discriminator}`), 'gi'), `<@${user.id}>`);
    }
    console.log("retVal is ", retVal);
    return retVal;
}
const NewMessage = props => {

    const [sending, setSending] = useState(false);

    const [botCreate, setBotCreate] = useState(false);

    const [selectedMessage, setSelectedMessage] = useState(null);

    const [selectedChannel, setSelectedChannel ] = useState(null);

    const [previewing, setPreviewing] = useState(null);

    const [showingChannelDrop, setShowChannelDrop] = useState(false);

    const [old, setOld] = useState(null);

    const [err, setErr] = useState(null);

    const [curText, setCurText] = useState("");


    let inners;

    if(!botCreate) {

        inners = <div className="message-header">Registering existing Message...</div>
    }
    else
    {
        let channelList = [];
        if(showingChannelDrop)
        {
            let keys = Object.keys(props.MsgData.Channels);

            for(let i = 0; i < keys.length; i++)
            {
                let ch = props.MsgData.Channels[keys[i]];

                channelList.push(<div onClick={() => {
                    setShowChannelDrop(false);
                    setSelectedChannel(ch);
                }}key={keys[i]} className="message-dropdown-content">{ch.name}</div>);
            }
        }
        inners = [<div key="header" className="message-header">Letting Emily create a new Message...</div>, <div style={{position: 'relative', width: '100%'}}key="Channel">
            <div onClick={() => setShowChannelDrop(!showingChannelDrop)}className="message-text-button">
                {selectedChannel !== null ? `Within #${selectedChannel.name}` : "Select a channel..."}
                
            </div>
            {showingChannelDrop && <div className="message-dropdown-outer">
                <div className="message-dropdown-inner">
                    <div className="message-dropdown-container">
                        {channelList}
                    </div>
                </div>
            </div>}
            </div>];
        
        
        if(previewing === null) {
            //<div key="message" className="message-author" style={{width: '100%'}}>Contents</div>,
            inners = [...inners, <MessageTextarea SetText={setCurText} Old={old} Users={props.Users} Guild={props.Guild} MsgData={props.MsgData} key="text"/>,
            <div onClick={() => {
                
                let text = document.getElementById("messagetext");
                
                let val = text.value.trim();

                if(val.length === 0)
                {
                    text.value = val;
                    return;
                }

                setPreviewing(transpileFrontToBack(val, props.Guild.roles, props.Guild.emojis, props.Users));
                setOld(val);
            }} key="preview" className={curText.trim().length === 0 ? "message-button disabled" : "message-button"} style={{width: 'calc(100% - 42px)'}}>Preview Message</div>]
        }
        else
        {
            inners = [...inners,<div key="preview-contents" className="message-contents editing"><MessageContents key="preview-container" Users={props.Users} Guild={props.Guild} MessageID="N/A" Contents={previewing}/></div>,
                <div key="confirm" onClick={() => {
                    if(previewing === null || selectedChannel === null)
                        return;
                    if(previewing.length === 0)
                        return;
                    // Send an API request and set to sending
                    setSending(true);
                    let body = {
                        contents: previewing
                    };
                    fetch(`/api/messages/guild/${props.Guild.id}/channels/${selectedChannel.id}/create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    }).then(res => {
                        if(!res.ok)
                        {
                            setErr(`Response not OK Status Code ${res.status}`);

                            setTimeout(() => setErr(null), 5000);
                        }
                        else
                        {
                            res.json().then(json => {
                                setSending(false);
                                props.Cancel();
                                // Fetch from api the message data...
                                store.dispatch({type: "NEW_MESSAGE", data: json});
                            });
                        }
                    }).catch(err => console.error(err));
                }}
                className={previewing !== null && previewing.length > 0 && selectedChannel !== null ? "message-button" : "message-button disabled"}>Confirm</div>,
                <div key="goback" onClick={() => setPreviewing(null)} className="message-error-button">Go Back</div>
                
        
            
        ];
        }
    }
    return <div className="message-container editing">
        <div onClick={() => props.Cancel()} className="message-error-button" style={{marginTop: '0', width: 'calc(100% - 42px)'}}>Cancel</div>
        <div onClick={() => setBotCreate(true)} className={botCreate ? "message-button active-button" : "message-button"}>Create New</div>
        <div onClick={() => setBotCreate(false)} className={!botCreate ? "message-button active-button pushRight" : "message-button pushRight"}>Use Existing</div>

        {inners}
    </div>
}

export default NewMessage;