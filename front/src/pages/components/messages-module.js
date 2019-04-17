import React, { Component } from 'react';

import fetch from 'node-fetch';

import { connect } from 'react-redux';

import loading from '../../images/loading.svg';
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
            return <div>Loaded</div>
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
        Loaded: state.messages.loaded
    }
})(Messages);