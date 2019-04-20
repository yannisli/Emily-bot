import React, { useState } from 'react';

import MessageTextarea from './message-textarea';

const NewMessage = props => {

    const [sending, setSending] = useState(false);

    const [botCreate, setBotCreate] = useState(false);

    const [selectedMessage, setSelectedMessage] = useState(null);

    const [selectedChannel, setSelectedChannel ] = useState(null);

    const [contents, setContents] = useState(null);

    let inners;

    if(!botCreate) {

        inners = <div className="message-header">Registering existing Message...</div>
    }
    else
    {
        inners = [<div key="header" className="message-header">Letting Emily create a new Message...</div>,
            <div key="channel" className="message-author" style={{width: '100%'}}>Select a channel...</div>,
            <div key="message" className="message-author" style={{width: '100%'}}>Contents</div>,
            <MessageTextarea key="text"/>,
            <div key="confirm" className={contents != null && contents.length > 0 ? "message-button" : "message-button disabled"} style={{width: 'calc(100% - 42px)'}}>Confirm</div>];
    }
    return <div className="message-container editing">
        <div onClick={() => props.Cancel()} className="message-error-button" style={{marginTop: '0', width: 'calc(100% - 42px)'}}>Cancel</div>
        <div onClick={() => setBotCreate(true)} className={botCreate ? "message-button active" : "message-button"} style={{marginBottom: '10px'}}>Create New</div>
        <div onClick={() => setBotCreate(false)} className={!botCreate ? "message-button active pushRight" : "message-button pushRight"} style={{marginBottom: '10px'}}>Use Existing</div>

        {inners}
    </div>
}

export default NewMessage;