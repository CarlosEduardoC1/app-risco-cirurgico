import React, { Component } from 'react';
import { Image, TouchableHighlight, View } from 'react-native';
import Header from '../header';
import Status from '../status';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Footer extends Component {


    async _logout() {
        await AsyncStorage.multiRemove(['type', 'id', 'appID'], (erro) => {
            if (erro) { alert("Erro ao fazer logout. Tente novamente.") }
            else { Actions.load() }
        })
    }

    render() {
        return (
            <View style={{ width: '100%', height: 100, alignItems: 'center', justifyContent: "center", flexDirection: 'row' }}>
                <TouchableHighlight style={{ width: "50%", alignItems: "center", height: 80 }} underlayColor="white"
                    onPress={() => { Actions.profile() }}>
                    <Image source={require('../../../assets/profile.png')} resizeMode="center" style={{ height: 30, width: 30 }} />
                </TouchableHighlight>
                <TouchableHighlight style={{ width: "50%", alignItems: "center", height: 80 }} underlayColor="white"
                    onPress={() => { this._logout() }}>
                    <Image source={require('../../../assets/logout.png')} resizeMode="center" style={{ height: 30, width: 30 }} />
                </TouchableHighlight>
            </View>
        )
    }
}