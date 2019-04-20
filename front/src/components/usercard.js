import React, { Component } from 'react';

import fetch from 'node-fetch';

import { connect } from 'react-redux';


class UserCard extends Component {
    constructor(props) {
        super(props);

        this.showUserCard = this.showUserCard.bind(this);
        this.hideUserCard = this.hideUserCard.bind(this);
    }

    showUserCard(e) {
        e.preventDefault();

        this.props.dispatch({type: "USERCARD_CLICK"});
        document.addEventListener('click', this.hideUserCard);
    }

    hideUserCard() {
        this.props.dispatch({type: "USERCARD_DECLICK"});
        document.removeEventListener('click', this.hideUserCard);
    }
    render() {
        if(this.props.User === null) {

            return <a href={`${process.env.REACT_APP_API_URI}/api/oauth2/login`} className="navbar-button pushRight">Login</a>
        }
        else
        {
            let elements = [<img alt="?" key="user-avatar" src={`https://cdn.discordapp.com/avatars/${this.props.User.id}/${this.props.User.avatar}.png`} className="avatar circular pushRight button" onClick={this.showUserCard} />];
            
            
            if(this.props.Display) {
                elements.push(<div key="user-dropdown" className="usercard-dropdown-container">
                    <div>
                        <div className="usercard-dropdown-header">Logged in as:</div>
                        <span className="usercard-user">{this.props.User.username}</span><span className="usercard-discriminator">#{this.props.User.discriminator}</span>
                    </div>
                    <a className="usercard-logout" href={`${process.env.REACT_APP_API_URI}/api/oauth2/logout`}>
                        Log Out
                    </a>
                </div>)
            }
            return <div className="usercard-container pushRight">
                {elements}
            </div>;
        }
    }

    componentDidMount() {
        if(this.props.User === null) {
            // Fetch
            fetch('/api/discord/@me').then(res => {
                if(!res.ok) {
                    console.error("Something went wrong, response code ", res.status);
                }
                else
                {
                    res.json().then(json => {
                        this.props.dispatch({type: "USER_FETCHED", data: json});
                    }).catch(err => console.error(err));
                }
            }).catch(err => console.error(err));
        }
    }
}


export default connect(state => {
    return {
        User: state.core.user,
        Display: state.core.showCard
    }
})(UserCard);