import React from 'react';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: '', color: 'red'};
    }

    render() {
        return (
            <div style={{color: this.state.color}}>{this.state.message}</div>
        )
    }
}

