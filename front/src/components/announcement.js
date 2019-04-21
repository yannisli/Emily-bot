import React from 'react';

export default function Announcement() {
    return <div className="announcement-box">{
        `Hi, currently the bot is under active development so a lot of features may be buggy, missing, or outright not working, as well as subject to change. 
        
        As of now, the bot is in a "somewhat" stable state with most of it's core functionality implemented, however there are no guarantees on the performance or ability to handle larger loads than a few people.

        If there are any glaring issues, please let me know @ Emi#5366
        `}
    </div>
}