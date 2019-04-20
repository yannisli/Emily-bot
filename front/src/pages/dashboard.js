import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Redirect, withRouter } from 'react-router-dom';

import NavBar from '../components/navbar';

import '../styles/dashboard.scss';

import loading from '../images/loading.svg';

import GuildList from './components/guild-list';

import GuildBoard from './components/guild-board';

import Announcement from '../components/announcement';



class Dashboard extends Component {

    render() {
        let innerContents;
        if(!this.props.location.pathname.includes("guild")) {
            

            if(this.props.Loading)
            {
                innerContents = [<div style={{textAlign: 'center', width: '100%'}} key="Loading-div">Loading guild information...</div>,<img className="loading pushLeft pushRight" style={{alignSelf: 'flex-start'}}alt="Loading" key="loadingsvg" src={loading}/>];
            }
            else if(this.props.Loaded)
            {
                innerContents = <GuildList Guilds={this.props.Guilds}/>;
                
            }
            
        }
        else
        {
            let id = this.props.location.pathname.split("/");
            id = id[id.length-1];
            if(this.props.Selected === null || this.props.Guilds[this.props.Selected].id !== id)
                return <Redirect to="/dashboard"/>;
            innerContents = <GuildBoard Guild={this.props.Guilds[this.props.Selected]}/>;
        }

        return <div className="dashboard-root">
            <NavBar/>
            
            <div className="dashboard-outer">
                <div className="dashboard-inner">
                    <div className="dashboard-container">
                        {!this.props.Loading && <Announcement/>}
                        {innerContents}
                    </div>
                </div>
            </div>
        </div>;
    }

    componentDidMount() {

        document.title = "Emily | Dashboard";
        
        this.props.dispatch({type: "LOADING_GUILDS"});

        fetch(`/api/discord/@me/guilds`).then(res => {

            if(!res.ok) {
                console.error(res.status);
            }
            else
            {
                res.json().then(json => {
                    this.props.dispatch({type: "GUILDS_LOADED", data: json});
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
}

export default withRouter(connect(state => {
    return {
        Guilds: state.core.guilds,
        Selected: state.core.selectedGuild,
        Loading: state.core.loadingGuilds,
        Loaded: state.core.loadedGuilds
    }
})(Dashboard));