import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base';
import { _alteraSenha } from './services';
import { Snackbar, ActivityIndicator, Colors } from 'react-native-paper';
import { AsyncStorage, Text } from 'react-native';
import { props_indicator, saveButton, textSave, title } from './props';
import axios from 'axios';
import { server } from '../../services';

export default class Formulario extends Component {

    constructor(props) {
        super(props);
        this.state = { loading: false, snack: false, label: '', color: '', key: '', confirm: '' }
    }

    async alteraSenha() {
        this.setState({ loading: true });
        if (this.state.confirm == this.state.key && this.state.key.length >= 6 && this.state.confirm.length >= 6) {
            const id = await AsyncStorage.getItem('id');
            await axios.post(server + "users/change-pass", { password: this.state.key, id: id })
                .then(() => { this.setState({ loading: false, snack: true, label: "Senha alterada com sucesso!", color: "green", key: '', confirm: "" }) })
                .catch(() => { this.setState({ loading: false, snack: true, label: "Erro ao alterar senha!", color: "red", key: '', confirm: "" }) })
        }
        else {
            this.setState({ loading: false, snack: true, label: "As senhas devem ser identicas", color: "red", key: '', confirm: "" })
        }
    }

    onDismiss() {
        this.setState({ snack: false });
    }


    _buttons() {
        if (this.state.loading) {
            return (
                <ActivityIndicator {...props_indicator} style={{ marginTop: 20 }} />
            )
        }
        else {
            return (
                <Button style={saveButton} rounded success
                    onPress={() => this.alteraSenha()}>
                    <Text style={textSave}>Salvar</Text>
                </Button>
            )
        }
    }


    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Text style={title}>Alterar senha</Text>
                        <Text style={{ marginLeft: 5 }}>As senhas devem ter no mínimo 6 caracteres</Text>
                        <Item floatingLabel>
                            <Label>Nova Senha</Label>
                            <Input value={this.state.key} onChangeText={texto => this.setState({ key: texto })} secureTextEntry />
                        </Item>
                        <Item floatingLabel>
                            <Label>Confirmar Senha</Label>
                            <Input value={this.state.confirm} onChangeText={texto => this.setState({ confirm: texto })} secureTextEntry />
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