import React, { Component } from 'react';
import { View } from 'react-native';
import Header from '../header';
import Status from '../status';

export default class Principal extends Component {
    render() {
        return (
            <View>
                <Header />
                <View style={{ width: '100%', padding: 10 }}>
                    <Status />
                </View>
            </View>
        )
    }
}