import React from 'react';

// Whenever we encounter a : or @ it means mention or emoji...
// When we first encounter : or @, from there until we encounter a space, filter roles, emojis, users, etc.
const MessageTextarea = props => {

    // Parse initial text and set it to value
    return <textarea onInput={(e) => {
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";
    }} id="messagetext" value={props.InitialText || ""} key="textarea" className="message-textarea">
    </textarea>
}

export default MessageTextarea;