import React, { Component } from 'react';
import { Text, StatusBar, View } from 'react-native';
import Header from '../header';
import Status from '../status';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';

export default class Principal extends Component {
    render() {
        return (
            <View>
                <Header  />
                <View style={{ width: '100%', padding: 10 }}>
                    <Status />
                </View>
            </View>
        )
    }
}