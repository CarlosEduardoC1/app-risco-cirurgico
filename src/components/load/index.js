import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator, View, Text } from 'react-native';

export default class Load extends Component {


    async componentWillMount() {
        const id = await AsyncStorage.getItem('id');
        if (id) {
            Actions.principal();
        }
        else {
            Actions.login();
        }
    }


    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="green" />
                <Text>Carregando...</Text>
            </View>
        )
    }
}