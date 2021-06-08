import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableHighlight } from 'react-native';
import { cancelar, containerButtons, lista, props_statusbar, title, listLabel, cancelLabel, container } from './props';
import { Actions } from 'react-native-router-flux';
import Formulario from './form';


export default class User extends Component {
    render() {
        return (
            <View style={container}>
                <StatusBar {...props_statusbar} />
                {/* <View style={{ width: "100%", height: 40, padding: 10 }}>
                    <Text>Risco Cirurgico App</Text>
                </View> */}
                <View style={containerButtons}>
                    <View style={cancelar}><TouchableHighlight underlayColor="white" onPress={() => { Actions.pop() }}><Text style={cancelLabel}>Cancelar</Text></TouchableHighlight></View>
                    <View style={lista}><TouchableHighlight underlayColor="white" onPress={() => { Actions.list() }}><Text style={listLabel}>Lista</Text></TouchableHighlight></View>

                </View>
                <View style={title}><Text>Adicionar Novo Usuário</Text></View>
                <Formulario />
            </View>
        );
    }
}