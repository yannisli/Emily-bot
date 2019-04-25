import React, { Component } from 'react';

import '../styles/home.scss';

import reactLogo from '../images/logo.svg';
import reduxLogo from '../images/redux.svg';
import discordJsLogo from '../images/discordjs.svg';
import nodeJsLogo from '../images/nodejs.svg';
import authorLogo from '../images/author.png';
import awsLogo from '../images/aws.svg';
import sassLogo from '../images/sass.svg';

import twitterBird from '../images/Twitter_Bird.svg';
import twitchLogo from '../images/twitch.svg';

import NavBar from '../components/navbar';

//import Announcement from '../components/announcement';

class Home extends Component {

    render() {
        return <div className="home-root">
        
            <NavBar/>
            <div className="home-outer">
                <div className="home-inner">
                    <header className="home-header">
                        Emily Bot
                    </header>
                    <div className="home-contents">
                        Hi! Emily Bot is designed to be a server administration bot for the Discord app to help remove the need for server administrators or moderators to assign individual roles to each individual and is meant to present a clean, and interactable front-end UI for management - Eliminating the need to remember how to use a command-line and streamlining the process to get the Bot up and functional in a server, rather than digging through documentation or a manual on how to set it up.
                    </div>

                    <header className="home-header">
                        Utilizing
                    </header>
                    <div className="home-contents">
                        <img src={reactLogo} alt="React" className="home-logo"/>
                        <img src={reduxLogo} alt="Redux" className="home-logo"/>
                        <img src={discordJsLogo} alt="Discord.js" className="home-logo-smaller"/>
                        <div className="home-logo">express.js</div>
                        <div className="home-logo">mongoose</div>
                        <img src={nodeJsLogo} alt="node.js" className="home-logo"/>
                        <img src={awsLogo} alt="amazon web services" className="home-logo"/>
                        <img src={sassLogo} alt="sass" className="home-logo"/>
                    </div>

                    <header className="home-header">
                        Author
                    </header>
                    <div className="home-contents">
                        <img src={authorLogo} alt="" className="home-avatar circular"/>
                        <div className="home-author-container">
                            <div className="home-author">
                                Emi#5366
                            </div>
                            
                            <div className="home-social-container">
                                <div className="home-social-header">Social Media</div>
                                
                                <a href="https://twitter.com/Eminanoka"><img src={twitterBird} alt="" className="home-logo-smaller"/></a>
                                <a href="https://twitch.tv/evanescentsnow"><img src={twitchLogo} alt="" className="home-logo-smaller"/></a>
                                
                            </div>
                        </div>
                        <div className="home-author-about"> 
                            <header className="home-header">
                                About Me
                            </header>
                            <div>
                                {`Hi there! I go by the name of Emi (笑み) online and I'm a former Computer Sciences and Software Development student that is currently interested in the web development field due to the sudden surge and prevalence of Progressive Web Applications and popular Native Web-Apps on the market such as Discord! I enjoy web development quite a lot and I started this project to demonstrate my aptitude in modern ECMAScript 2018 JavaScript alongside modern frameworks such as React.js, Redux.js, and Express.js, as well as the ability to use a MongoDB Database. If you have any questions, feel free to shoot me a friend request on Discord, or contact me via Twitter!`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        
        </div>
    }

    componentDidMount() {
        document.title = "Emily | Home";
    }
}

export default Home;