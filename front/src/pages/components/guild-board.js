import React, { Component } from 'react';

class GuildBoard extends Component {
    render() {
        if(!this.props.Guild)
            throw new Error("GuildBoard was not assigned a Guild prop");
        return <div>Guild Board {this.props.Guild.id}</div>
    }
}

export default GuildBoard;