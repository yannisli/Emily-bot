import React, { Component } from 'react';

import fetch from 'node-fetch';

import { connect } from 'react-redux';

import loading from '../../images/loading.svg';

import '../../styles/messages.scss';


import Message from './messages/message';

class Messages extends Component {
    render() {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");
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

                contents.push(<Message key={msg_id} MsgData={this.props.MsgData} Guild={this.props.GuildData} Message={msg}/>);
            }

            return <div className="messages-container">
                {contents}
                {contents.length === 0 &&
                    <div className="board-error">
                        Looks like you have no messages registered...
                    </div>
                }
                <div className="board-button">
                    Register a new Message
                </div>
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
        fetch(`/api/messages/guild/${this.props.Guild.id}`).then(res => {

            if(!res.ok)
            {
                console.error(res.status);
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
    }
}

export default connect(state => {
    return {
        MsgData: state.messages.data,
        Loading: state.messages.loading,
        Loaded: state.messages.loaded,
        GuildData: state.core.selectedGuildData
    }
})(Messages);
