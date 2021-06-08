import React, { useEffect, useState } from 'react';
import { View, Text, Image, StatusBar, TouchableHighlight } from 'react-native';
import { props_statusbar, style_header, style_img, style_title } from './props';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';


function HeaderMultipleIconExample() {

    const [type, setType] = useState();

    useEffect(async () => {
        let tipo = await AsyncStorage.getItem('type');
        setType(tipo);
    });

    if (type === 'CM') {
        return (
            <View style={style_header}>
                <StatusBar {...props_statusbar} />
                <View style={style_title}>
                    <Text>Risco Cirurgico App</Text>
                </View>
                <View style={style_img}>
                    <TouchableHighlight underlayColor="white" onPress={() => { Actions.add() }}>
                        <Image source={require('../../../assets/add.png')} resizeMode="contain" style={{ height: 35, width: 35 }} />
                    </TouchableHighlight>
                </View>
            </View>
        );

    }
    else {
        return (
            <View style={style_header}>
                <StatusBar {...props_statusbar} />
                <View style={style_title}>
                    <TouchableHighlight underlayColor="white" onPress={() => { Actions.user() }}>
                        <Image source={require('../../../assets/user.png')} resizeMode="contain" style={{ height: 35, width: 35 }} />
                    </TouchableHighlight>
                </View>
                {/* <Text>Risco Cirurgico App</Text> */}
                <View style={style_img}>
                    <TouchableHighlight underlayColor="white" onPress={() => { Actions.add() }}>
                        <Image source={require('../../../assets/add.png')} resizeMode="contain" style={{ height: 35, width: 35 }} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

export default HeaderMultipleIconExample;
