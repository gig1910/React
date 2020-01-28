import React from 'react';

import Input from './input.js';
import Button from './button.js';
import Message from './message.js';
import ErrNotify from "./errNotify.js";

import {getState} from './common.js';

class ChatMessage extends React.Component {
    render() {
        return (
            <li key={this.props.index} index={this.props.index}>
                <span className={this.props.login === this.props.myLogin ? 'self' : 'another'}>{this.props.login}:&nbsp;</span>
                {this.props.message}
            </li>
        );
    }
}

export default class ChatList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {messages: [], login: '', isShow: false};
        this.state.login = props.login;
        this.state.isShow = Boolean(props.isShow === 'true');

        window.receive = data => this.onReceive(data);
    }

    componentDidMount() {
                const url = 'ws://'+window.location.hostname + ':8080';
                this.ws = new WebSocket(url);
                this.ws.onopen = () => {
                    this.wsOnOpen()
                };
                this.ws.onmessage = (data) => {
                    this.onReceive()
                };
                this.ws.onerror = (err) => {
                    if(this.errNotify){
                        this.errNotify.setState(state => {
                            state.message = err.description;
                            state.isShow = true;

                            return state;
                        });
                    }
                    console.error(err);
                };
    }

    wsOnOpen() {
    }


    componentWillUnmount() {
        //Закрываем WebSocket
    }

    onReceive = (data) => {
        this.setState(state => state.messages.push({login: data && data.login, message: data && data.message}));
    };

    onSend = () => {
        getState(this.message, state => {
            let sMessage = state.value;
            if (!sMessage) {
                this.errorMessage.setState(state => state.message = 'Сообщение не должно быть путым');
            } else if (sMessage.length > 255) {
                this.errorMessage.setState(state => state.message = 'Сообщение не должно быть более 255 символов');
            } else {
                this.errorMessage.setState(state => state.message = '');

                //Добляе ообщение в массив и отрисовываем его
                this.setState((state, props) => state.messages.push({login: this.state.login, message: sMessage}));
                this.message.setState(state => state.value = '');
                //Отправляем сообщение на сервер
            }
        })
    };

    renderMess = (el, i, arr) => {
        return (
            <ChatMessage key={i} index={i} login={el.login} myLogin={this.state.login} message={el.message}/>
        )
    };

    render() {
        return (
            <div className="ChatList" id={this.props.id} style={{display: this.state.isShow ? 'block' : 'none'}}>
                <div>
                    <ul ref={ref => this.messageList = ref}>
                        {this.state.messages.map(this.renderMess)}
                    </ul>
                </div>
                <div>
                    <Input ref={ref => this.message = ref} click={this.onSend}/><Button click={this.onSend} title="Отправить"/>
                </div>
                <div><Message ref={ref => this.errorMessage = ref}/></div>
            </div>
        )

    }
}