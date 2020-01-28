import React from 'react';

export default class ErrNotify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isShow: false, message: ''};
        this.state.isShow = this.props.isShow;
        this.state.message = this.props.message;
    }

    close = () => this.setState(state => state.isShow = false);

    render() {
        return (
            <div className="errNotify" style={{display: this.state.isShow ? 'block' : 'none'}} id={this.props.id}>
                <div className="clsBtn" onClick={this.close}>X</div>
                <div>{this.state.message}</div>
            </div>
        );
    }
}