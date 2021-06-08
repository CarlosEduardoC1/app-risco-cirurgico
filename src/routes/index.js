import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Principal from '../components/principal';
import Add from '../components/add';
import User from '../components/user';
import List from '../components/user/list';
import Login from '../components/login';
import Load from '../components/load';

export default class Rotas extends Component {
    render() {
        return (
            <Router>
                <Scene key="principal" component={Principal} title="Principale" hideNavBar={true} />
                <Scene key="add" component={Add} title="add" hideNavBar={true} direction="vertical" duration={450} />
                <Scene key="user" component={User} title="User" hideNavBar={true} direction="vertical" duration={450} />
                <Scene key="list" component={List} title="List" hideNavBar={true} direction="horizontal" duration={450} />
                <Scene key="login" component={Login} title="Login" hideNavBar={true} />
                <Scene key="load" component={Load} title="Load" hideNavBar={true} initial />
            </Router>
        )
    }
}