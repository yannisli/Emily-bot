import React from 'react';

export default function Announcement() {
    return <div className="announcement-box">{
        `Currently the bot is under active development so a lot of features may be buggy, missing, or outright not working, as well as subject to change. 
        
        As of now, the bot has all of it's planned core functionality implemented (Reaction Roles), however visible error feedback may not be present for some actions if the Discord API server encounters an error or the internal server. Sorry!

        If there are any issues or bugs you encounter you can let me know @ Emi#5366
        `}
    </div>
}