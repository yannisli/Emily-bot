import React, { Component } from 'react';

import Messages from './messages-module';

import '../../styles/guildboard.scss';

import { connect } from 'react-redux';

import loading from '../../images/loading.svg';

import fetch from 'node-fetch';
let RootHeader = props => {
    return <div className="board-root">
        <header className="board-header">{props.name}</header>
        {props.children}
    </div>
}

class GuildBoard extends Component {
    constructor(props) {
        super(props);

        this.handleBotAddClick = this.handleBotAddClick.bind(this);
        this.fetchGuildInfo = this.fetchGuildInfo.bind(this);
        this.handleBotRedirectDone = this.handleBotRedirectDone.bind(this);
    }

    fetchGuildInfo() {
        this.props.dispatch({type: "CORE_GUILD_LOADING"});
        fetch(`/api/discord/guild/${this.props.Guild.id}`).then(res => {

            if(!res.ok)
            {
                console.error(res.status);
                this.props.dispatch({type: "CORE_GUILD_LOADED", data: null});
            }
            else
            {
                res.json().then(json => {
                    this.props.dispatch({type: "CORE_GUILD_LOADED", data: json});
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
    handleBotAddClick() {
        this.props.dispatch({type: "BOT_REDIRECT_CLICKED"});
    }
    handleBotRedirectDone() {
        this.props.dispatch({type: "BOT_REDIRECT_DONE"});
        this.fetchGuildInfo();
    }
    render() {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");

        let admin = (this.props.Guild.permissions & 0x00000008) === 0x00000008;
        if(this.props.Loading)
        {
            return <RootHeader name={this.props.Guild.name}>
                <div key="board-loading">Retrieving Guild Information...</div>
                <img key="board-loading-img" src={loading} alt="Loading" className="loading"/>
            </RootHeader>
        }
        else if(this.props.Loaded)
        {
            
            if(this.props.GuildData === null) {
                

                let button;

                if(admin)
                    if(!this.props.Redirecting)
                        button = <a onClick={this.handleBotAddClick} rel="noopener noreferrer" target="_blank" href={`https://discordapp.com/api/oauth2/authorize?client_id=272421186166587393&permissions=8&scope=bot`} className="board-button">We can fix that though</a>;
                    else
                        button = [<div key="redirdiv" className="board-subheader">Redirecting you to Discord...</div>, <div key="redirbutton" onClick={this.handleBotRedirectDone} className="board-button">{`All done?`}</div>]
                else
                    button = <div className="board-error">Hmmm..<br/>{`You don't have admin rights to add me either, sorry...`}</div>
                return <RootHeader name={this.props.Guild.name}>
                    <div className="board-error">{`Hey! Looks like I'm not in this guild... :/`}</div>
                    {button}
                    </RootHeader>
            }
            else {
                if(admin)
                    return <RootHeader name={this.props.Guild.name}>
                        <Messages Guild={this.props.Guild}/>
                        </RootHeader>
                else
                    return <RootHeader name={this.props.Guild.name}>
                        <div className="board-error">{`Hey! You're not an administrator of this server, so you can't configure anything here.`}<br/>Sorry!</div>
                    </RootHeader>


            }
        }
        return <RootHeader name={this.props.Guild.name}/>
        
    }
    componentDidMount() {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop.");
        // Fetch!
        document.title = `Emily | ${this.props.Guild.name}`;
        this.fetchGuildInfo();
    }
}

export default connect(state => {
    return {
        Loading: state.core.loadingGuild,
        Loaded: state.core.loadedGuild,
        GuildData: state.core.selectedGuildData,
        Redirecting: state.core.redirecting
    };
})(GuildBoard);