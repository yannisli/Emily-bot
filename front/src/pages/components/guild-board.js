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
                    button = <div className="board-button">We can fix that though</div>;
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
}

export default connect(state => {
    return {
        Loading: state.core.loadingGuild,
        Loaded: state.core.loadedGuild,
        GuildData: state.core.selectedGuildData
    };
})(GuildBoard);