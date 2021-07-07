import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableHighlight } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base';
import { Snackbar, ActivityIndicator, Colors } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { props_statusbar } from './props';
import { Image } from 'react-native';
import axios from 'axios';
import { server } from '../../services';
import OneSignal from 'react-native-onesignal';
import { AsyncStorage } from 'react-native';


export default class Login extends Component {

    deviceState = undefined;


    constructor(props) {
        super(props);
        this.state = { email: "", password: "", loading: false, snack: false, label: "", color: '' }

        OneSignal.init("3e4a73a9-b5ce-41d3-bafc-4188efe477af");
        OneSignal.addEventListener('opened', this.onOpened);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('openResult: ', openResult);
    }


    async componentWillMount() {
        this.deviceState = await OneSignal.getPermissionSubscriptionState(async (status) => {
            await AsyncStorage.setItem('appID', status.userId);
            this.deviceState = status.userId;
            console.log(status.userId);
        });
    }

    async authentication() {
        this.setState({ loading: true });
        await axios.post(server + "users/auth", {
            email: this.state.email,
            password: this.state.password,
            appID: this.deviceState
        })
            .then(async response => {
                if (response.status == 200) {
                    await AsyncStorage.setItem('type', response.data.tipo);
                    let myId = response.data.id.toString();
                    await AsyncStorage.setItem('id', myId);
                    this.setState({ loading: false, snack: true, label: "Login bem sucedido!", color: "green" });
                    Actions.principal()
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ loading: false, snack: true, label: "Erro! Tente novamente!", color: "red" });
            });
    }



    _buttons() {
        if (this.state.loading) {
            return (
                <ActivityIndicator animating={true} color={Colors.green700} size="large" style={{ marginTop: 20 }} />
            )
        }
        else {
            return (
                <Button style={{ width: "100%", marginTop: 15, alignItems: "center", justifyContent: "center" }} rounded success
                    onPress={() => this.authentication()}>
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 18 }}>Salvar</Text>
                </Button>
            )
        }
    }

    onDismiss() {
        this.setState({ snack: false });
    }

    render() {
        return (
            <Container>
                <StatusBar {...props_statusbar} />
                <Content>
                    <View style={{ width: "100%", height: '50%', justifyContent: 'center', alignItems: "center" }}>
                        <Image source={require('../../../assets/logo4.png')} resizeMode="center" height={30} width={30} />
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>E-mail</Label>
                            <Input keyboardType="email-address" value={this.state.email} onChangeText={texto => this.setState({ email: texto })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Senha</Label>
                            <Input secureTextEntry value={this.state.password} onChangeText={texto => this.setState({ password: texto })} />
                        </Item>
                        {this._buttons()}
                    </Form>
                </Content>
                <Snackbar style={{ backgroundColor: this.state.color }} visible={this.state.snack} onDismiss={() => this.onDismiss()} duration={1500} >
                    {this.state.label}
                </Snackbar>
            </Container>
        );
    }
}