import React, { Component } from 'react';

import fetch from 'node-fetch';

import { connect } from 'react-redux';

import loading from '../../images/loading.svg';

import '../../styles/messages.scss';


import Message from './messages/message';

import NewMessage from './messages/new-message';

const fetchUsers = async guild_id => {
    let users = {};
  
    let after = "0";
    // eslint-disable-next-line no-constant-condition
    while(true) {

        let response = await fetch(`/api/discord/guild/${guild_id}/members?limit=1000&after=${after}`);

        if(!response.ok)
            break;
        
        let json = await response.json();

        if(!json || json.length === 0)
            break;
        
        // Loop through json and add to map
        for(let i = 0; i < json.length; i++)
        {
            let user = json[i].user;
            users[user.id] = {
                username: user.username,
                discriminator: user.discriminator,
                id: user.id,
                avatar: user.avatar
            };
        }
        if(json.length < 1000)
            break;
        after = json[json.length-1].user.id;
        // Prevent from sending too many requests at a time
        await new Promise(resolve => setTimeout(resolve, 2000));

    }

    return users;
    
};
class Messages extends Component {
    render() {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");
        if(this.props.LoadError !== null)
        {
            return <div className="board-error pushLeft pushRight">
                {this.props.LoadError}
            </div>
        }
        if(this.props.Loading)
        {
            return [<div key="messages-loading">Loading Messages...</div>,<img key="messages-loading-svg" src={loading} alt="Loading" className="loading"/>];
        }
        else if(this.props.Loaded)
        {
            if(!this.props.MsgData) {
                return <div className="messages-container">
                    <div className="board-error">
                        Looks like you have no messages registered...
                    </div>
                    <div className="board-button">
                        Register a new Message
                    </div>
                </div>
            }
            let contents = [];
            for(let msg_id in this.props.MsgData.Messages)
            {
                let msg = this.props.MsgData.Messages[msg_id];

                contents.push(<Message key={msg_id} Users={this.props.Users} MsgData={this.props.MsgData} Guild={this.props.GuildData} Message={msg}/>);
            }

            return <div className="messages-container">
                <div className="messages-header">
                    Messages Registered
                </div>
                
                {!this.props.Creating && <div className="board-button" onClick={() => this.props.dispatch({type: "SET_CREATING", data: true})}>
                    Register a new Message
                </div>
                }
                {this.props.Creating && <NewMessage Cancel={() => this.props.dispatch({type: "SET_CREATING", data: false})} Users={this.props.Users} Guild={this.props.GuildData} MsgData={this.props.MsgData} /> }
                {contents.length === 0 &&
                    <div className="board-error">
                        Looks like you have no messages registered...
                    </div>
                }
                {contents}
                
            </div>
        }
        return <div></div>;
    }
    componentDidMount()
    {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");
        // Fetch messages
        this.props.dispatch({type: "LOADING_GUILD"});
        this.props.dispatch({type: "SET_ERROR", data: null});
        fetch(`/api/messages/guild/${this.props.Guild.id}`).then(res => {

            if(!res.ok)
            {
                console.error(res.status);
                this.props.dispatch({type: "SET_ERROR", data: `Internal server responded with code ${res.status}, please try again later...`});
                res.json().then(err => console.error(err));
                this.props.dispatch({type: "GUILD_LOADED", data: null});
                return;
            }
            else
            {
                res.json().then(json => {
                    this.props.dispatch({type: "GUILD_LOADED", data: json});
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));


        fetchUsers(this.props.Guild.id).then(data => {

            this.props.dispatch({type: "GUILD_MEMBERS_LOADED", data: data});
        });
    }
}

export default connect(state => {
    return {
        MsgData: state.messages.data,
        Loading: state.messages.loading,
        Loaded: state.messages.loaded,
        GuildData: state.core.selectedGuildData,
        Creating: state.messages.creating,
        Users: state.messages.members,
        LoadError: state.messages.error
    }
})(Messages);
