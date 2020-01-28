import React from 'react';

export default class ErrNotify extends React.Component{
	constructor(props){
		super(props);
		this.state         = {message: ''};
		this.state.message = this.props.message;

		this.onClose = () => this.props.onClose();
	}

	doClose = () => this.setState(state => {
		state.message = '';
		this.onClose();

		return state;
	});

	render(){
		if(this.state.message){
			return (
				<div className="errNotify" id={this.props.id}>
					<div className="clsBtn" onClick={this.doClose}>X</div>
					<div>{this.state.message}</div>
				</div>
			);

		}else{
			return (<div/>);
		}
	}
}