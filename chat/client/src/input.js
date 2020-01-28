import React from 'react';

export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {valid: true, value: ''};
    }

    onChange = () => {
        this.setState(state => state.value = this.iLogin.value);
    };

    onKeyUp = (evnt) => {
        if(evnt.keyCode === 13){
            this.props.click();
        }
    };

    render() {
        return (
            <input name={this.props.name} type={this.props.type} placeholder={this.props.placeholder} id={this.props.id}
                   ref={ref => this.iLogin = ref}
                   size={this.props.size || 20}
                   className={this.state.valid ? '' : 'error'} value={this.state.value}
                   onChange={this.onChange} onKeyUp={this.onKeyUp}
            />
        )
    }
}