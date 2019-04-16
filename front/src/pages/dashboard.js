import React, { Component } from 'react';

import { connect } from 'react-redux';

import NavBar from '../components/navbar';

import '../styles/dashboard.scss';

import loading from '../images/loading.svg';

class Dashboard extends Component {

    render() {

        let innerContents;

        if(this.props.Loading)
        {
            innerContents = [<div key="Loading-div">Loading guild information...</div>,<img alt="Loading" key="loadingsvg" src={loading}/>];
        }
        else if(this.props.Loaded)
        {
            innerContents = [];
            
            for(let i = 0; i < this.props.Guilds.length; i++)
            {
                let avatar;
                
                if(this.props.Guilds[i].icon !== null)
                    avatar = <img alt="?" className="dashboard-list-avatar" src={`https://cdn.discordapp.com/icons/${this.props.Guilds[i].id}/${this.props.Guilds[i].icon}.png`}/>
                else
                    avatar = <div className="dashboard-list-avatar">{this.props.Guilds[i].name.substr(0,1)}</div>
                let element = <div className="dashboard-selection" key={`guild${i}`}>
                    {avatar}
                    <span>
                        {this.props.Guilds[i].name}
                    </span>
                
                </div>
                innerContents.push(element);
            }
            
        }
        return <div className="dashboard-root">
            <NavBar/>
            <div className="home-outer">
                <div className="home-inner">
                    {innerContents}
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        this.props.dispatch({type: "LOADING_GUILDS"});

        fetch(`/api/discord/@me/guilds`).then(res => {

            if(!res.ok) {
                console.error(res.status);
            }
            else
            {
                res.json().then(json => {
                    this.props.dispatch({type: "GUILDS_FETCHED", data: json});
                }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
    }
}

export default connect(state => {
    return {
        Guilds: state.core.guilds,
        Loading: state.core.loadingGuilds,
        Loaded: state.core.loadedGuilds
    }
})(Dashboard);