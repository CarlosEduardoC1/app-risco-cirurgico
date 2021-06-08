import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base';
import { Text, Picker, View } from 'react-native';
import { _salvePaciente } from './services';
import axios from 'axios';
import { Snackbar, ActivityIndicator, Colors } from 'react-native-paper';
import moment from 'moment';
import { server } from '../../services';
import b64 from 'base-64';

export default class Formulario extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: false, snack: false, label: '', color: '', email: '', nome: '', password: '', tipo: '' }
    }

    async adiciona() {
        if (this.state.nome == '') {
            this.setState({ snack: true, label: "O nome precisa ser informado", color: 'red' })
        }

        else if (this.state.email == '') {
            this.setState({ snack: true, label: "O e-mail precisa ser informado", color: 'red' })
        }
        else if (this.state.tipo == 'SL') {
            this.setState({ snack: true, label: "O tipo precisa ser informado", color: 'red' })
        }
        else if (this.state.password == '') {
            this.setState({ snack: true, label: "A senha precisa ser informada", color: 'red' })
        }
        else {
            this.setState({ loading: true });
            await axios.post(server + "users/save-user", {
                nome: this.state.nome, email: this.state.email, password: this.state.password, appID: moment().format("DD/MM/YYYY HH:mm:ss"), type: this.state.tipo
            })
                .then(async res => {
                    await axios.post(server + "mail/send", {
                        email: this.state.email, name: this.state.nome, senha: this.state.password
                    }).then(async () => {
                        await this.setState({ loading: false, snack: true, label: "Usuário cadastrado com sucesso!", color: 'green', tipo: 'SL', nome: '', email: "", password: '' });
                    })
                        .catch(error =>
                            this.setState({ loading: false, snack: true, label: "Erro ao cadastrar!", color: 'red', fone: '', nome: '' }));

                })
                .catch(error =>
                    this.setState({ loading: false, snack: true, label: "Erro ao cadastrar!", color: 'red', fone: '', nome: '' }));
        }
    }

    onDismiss() {
        this.setState({ snack: false });
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
                    onPress={() => this.adiciona()}>
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 18 }}>Salvar</Text>
                </Button>
            )
        }
    }


    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nome Completo</Label>
                            <Input value={this.state.nome} onChangeText={texto => this.setState({ nome: texto })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>E-mail</Label>
                            <Input keyboardType="email-address" value={this.state.email} onChangeText={texto => this.setState({ email: texto })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Senha</Label>
                            <Input secureTextEntry disabled value={this.state.password} onChangeText={texto => this.setState({ password: texto })} />
                        </Item>
                        <Button style={{ width: "100%", marginTop: 15, alignItems: "center", justifyContent: "center" }}
                            onPress={() => {
                                let ramdon = Math.floor(Math.random() * 100000);
                                this.setState({ password: b64.encode(ramdon) });
                            }}
                            light rounded><Text>Gerar Senha</Text></Button>
                        {/* <Item> */}
                        <Picker
                            mode="dropdown"
                            style={{ margin: 8 }}
                            selectedValue={this.state.tipo}
                            onValueChange={(item) => this.setState({ tipo: item })}
                        >
                            <Picker.Item label="Selecione o tipo de usuário" value="SL" />
                            <Picker.Item label="ADMINISTRADOR" value="AD" />
                            <Picker.Item label="USUÁRIO COMUM" value="CM" />
                        </Picker>
                        {/* </Item> */}
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