import React from 'react';

import Input from './input.js';
import Button from './button.js';
import Message from './message.js';
import ErrNotify from "./errNotify.js";

/**
 * Вывод конкретного сообщения
 */
class ChatMessage extends React.Component{
	render(){
		return (
			<li key={this.props.index} index={this.props.index}>
				<span className={this.props.login === this.props.myLogin ? 'self' : 'another'}>{this.props.login}:&nbsp;</span>
				{this.props.message}
			</li>
		);
	}
}

/**
 * Вывод списка сообщений
 */
export default class ChatList extends React.Component{
	constructor(props){
		super(props);

		this.state             = {};
		this.state.login       = this.props.login;
		this.state.messages    = [];
		this.state.serverError = '';
	}

	componentDidMount(){
		const url = 'ws://' + window.location.hostname + ':8080';
		try{
			this.ws = new WebSocket(url, 'chat_1.0');

			this.ws.onopen = (evnt) => this.wsOnOpen(evnt);

			this.ws.onmessage = (data) => this.onReceive(data);

			this.ws.onerror = (err) => {
				this.setState(state => state.serverError = err.description || 'Не смогли соединиться с сервером');
				console.error(err);
			};

		}catch(err){
			this.setState(state => state.serverError = err.description);
		}

		this.pingHandler = window.setInterval(() => {
			if(this.ws && this.ws.isOpen){
				this.ws.ping();
			}
		})
	}

	componentWillUnmount(){
		//Закрываем WebSocket
		if(this.ws){
			this.ws.send(JSON.stringify({type: 1, login: this.props.login}));
			this.ws.close();
			this.ws = undefined;
		}
	}

	addMessage = (data) => this.setState(state => state.messages.push(data));

	wsOnOpen = (evnt) => this.ws.send(JSON.stringify({type: 0, login: this.props.login}));

	onReceive = (data) => {
		// Приняли сообщение от сервера

		let _data = JSON.parse(data.data);
		let mess;
		switch(_data.type){
			case 0:
				mess = {login: '', message: 'Пользователь ' + _data.login + ' присоединяется к чату.'};
				break;

			case 1:
				mess = {login: '', message: 'Пользователь ' + _data.login + ' выходит из чата.'};
				break;

			case 2:
				mess = {login: _data.login, message: _data.message};
				break;
		}

		this.addMessage(mess);
	};

	onSend = () => {
		// Получаем значение из поля ввода
		this.inpMessage.setState(state => {
			let sMessage = state.value;
			if(!sMessage){
				this.errorMessage.setState(state => state.message = 'Сообщение не должно быть путым');

			}else if(sMessage.length > 255){
				this.errorMessage.setState(state => state.message = 'Сообщение не должно быть более 255 символов');

			}else{
				this.errorMessage.setState(state => state.message = '');

				//Добляе ообщение в массив и отрисовываем его
				let mess = {
					login: this.state.login,
					message: sMessage
				};

				this.addMessage(mess);

				this.ws.send(JSON.stringify({type: 2, login: mess.login, message: mess.message}));

				state.value = '';
				return state;
			}
		})
	};

	onHideErrorMessage = () => this.setState(state => state.serverError = '');

	renderMess = (el, i, arr) => {
		return (
			<ChatMessage key={i} index={i} login={el.login} myLogin={this.state.login} message={el.message}/>
		)
	};

	render(){
		return (
			<div className="ChatList" id={this.props.id}>
				<div>
					<ul ref={ref => this.messageList = ref}>
						{this.state.messages.map(this.renderMess)}
					</ul>
				</div>
				<div>
					<Input ref={ref => this.inpMessage = ref} click={this.onSend}/><Button click={this.onSend} title="Отправить"/>
				</div>
				<div><Message ref={ref => this.errorMessage = ref}/></div>

				{this.state.serverError ? <ErrNotify message={this.state.serverError} onClose={this.onHideErrorMessage}/> : ''}
			</div>
		)

	}
}