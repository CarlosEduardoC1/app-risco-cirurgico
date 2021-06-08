import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableHighlight } from 'react-native';
import { cancelar, cancelLabel, container, containerButtons, props_statusbar, title } from './props';
import Formulario from './form';
import { Actions } from 'react-native-router-flux';


export default class Add extends Component {
    render() {
        return (
            <View style={container}>
                <StatusBar {...props_statusbar} />
                {/* <View style={{ width: "100%", height: 40, padding: 10 }}>
                    <Text>Risco Cirurgico App</Text>
                </View> */}
                <View style={containerButtons}>
                    <View style={cancelar}><TouchableHighlight underlayColor="white" onPress={() => { Actions.pop() }}><Text style={cancelLabel}>Cancelar</Text></TouchableHighlight></View>
                </View>
                <View style={title}><Text>Adicionar Novo Paciente</Text></View>
                <Formulario />
            </View>
        );
    }
}