import React, { Component } from 'react';
import { View, StatusBar, TouchableHighlight, Text } from 'react-native';
import Formulario from './form';
import { props_statusbar, container, cancelar, cancelLabel, containerButtons } from './props';
import { Actions } from 'react-native-router-flux';

export default class Profile extends Component {
    render() {
        return (
            <View style={container}>
                <StatusBar {...props_statusbar} />
                <View style={containerButtons}>
                    <View style={cancelar}>
                        <TouchableHighlight underlayColor="white" onPress={() => { Actions.pop() }}>
                            <Text style={cancelLabel}>Cancelar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <Formulario />
            </View>
        )
    }
}