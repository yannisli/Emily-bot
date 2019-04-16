import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import '../styles/navbar.scss';

import UserCard from './usercard';

// eslint-ignore
class NavBar extends Component {

    
    render() {

        return <div className="navbar">
            <div className="navbar-container">
                <Link to="/" className={this.props.location.pathname === "/" ? "navbar-button-active" : "navbar-button"}>
                    Home
                </Link>
                {this.props.User !== null &&
                    <Link to="/dashboard" className={this.props.location.pathname.includes("dashboard") ? "navbar-button-active" : "navbar-button"}>
                        Dashboard
                    </Link>
                }
                <UserCard/>
            </div>
        </div>;

    }

}


export default withRouter(connect(state => {
    return {
        User: state.core.user
    }
})(NavBar));