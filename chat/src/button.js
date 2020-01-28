import React from 'react';

export default class Button extends React.Component {
    render() {
        return (<button onClick={this.props.click}>{this.props.title}</button>);
    }
}
