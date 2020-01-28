import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import LoginDialog from './login.js';
import ChatList from './chatList.js';

class ChatClient extends React.Component{
	constructor(props){
		super(props);

		this.state = {login: ''};
	}

	doLogin = (login) => {
		if(login){
			this.setState(state => state.login = login);
		}
	};

	render(){
		let comp = this.state.login ?
			<ChatList ref={ref => this.chatList = ref} errNotify={this.errNotify} login={this.state.login}/> :
			<LoginDialog doLogin={this.doLogin} ref={ref => this.loginDialog = ref} id="loginDialog"/>;

		return (<div>{comp}</div>);
	}
}

ReactDOM.render(<ChatClient/>, document.getElementById('root'));