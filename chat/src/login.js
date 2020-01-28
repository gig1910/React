import React from 'react';

import Input from './input.js';
import Button from './button.js';
import Message from './message.js';

import {getState} from './common.js';

export default class LoginDialog extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	onLogin = () => {
		//Валидация
		getState(this.iLogin, lState => {
			let sLogin = lState.value;
			if(!sLogin){
				this.message.setState(state => state.message = 'Поле с логином не должно быть пустым');

			}else if(sLogin.length > 32){
				this.message.setState(state => state.message = 'Поле с логином не должно быть более 32 символов');

			}else{
				this.message.setState(state => state.message = '');

				//Показываем следующю страничку
				this.props.doLogin(sLogin);
			}
		})
	};

	render(){
		return (
			<div className="LoginDialog" id={this.props.id}>
				<table cellPadding="0" cellSpacing="0" border="0" width="100%">
					<tbody>
					<tr>
						<td><label _for="loginFld">Имя в чате:</label></td>
					</tr>
					<tr>
						<td><Input name="loginFld" id="loginFld" type="text" required value="qwerty" ref={ref => this.iLogin = ref} click={this.onLogin}/></td>
					</tr>
					<tr>
						<td id="loginErrorMessage"><Message ref={ref => this.message = ref}/></td>
					</tr>
					<tr>
						<td align="center"><Button type="button" click={this.onLogin} title="Войти"/></td>
					</tr>
					</tbody>
				</table>
			</div>
		)
	}
}
