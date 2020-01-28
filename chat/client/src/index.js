import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import LoginDialog from './login.js';
import ChatList from './chatList.js';
import ErrNotify from "./errNotify.js";

class ChatClient extends React.Component {
    constructor() {
        super();

        window.showErrNotify = (err) =>{
            this.errNotify.setState(state => {
                state.isShow = true;
                state.message = err.description || err;

                return state;
            })
        }
    }

    doLogin = (login) => {
        this.loginDialog.setState(state => state.isShow = false);

        this.chatList.setState(state => {
            state.isShow = true;
            state.login = login;
            state.errNotify = this.errNotify;

            return state;
        });
    };

    render() {
        return (
            <div>
                <LoginDialog doLogin={this.doLogin} ref={ref => this.loginDialog = ref} id="loginDialog"/>
                <ChatList isShow="false" ref={ref => this.chatList = ref} errNotify={this.errNotify}/>
                <ErrNotify id="errNotify" ref={ref => this.errNotify = ref}/>
            </div>
        );
    }
}

ReactDOM.render(<ChatClient/>, document.getElementById('root'));