import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button } from 'native-base';
import { Text, View } from 'react-native';
import { _salvePaciente } from './services';
import axios from 'axios';
import { Snackbar, ActivityIndicator, Colors } from 'react-native-paper';
import { server } from '../../services';
import moment from 'moment';
import { AsyncStorage, Picker } from 'react-native';

export default class Formulario extends Component {

    listaMedicos = Array();

    constructor(props) {
        super(props);
        this.state = { loading: false, snack: false, label: '', color: '', fone: 0, nome: '', medicos: [], mTipo: '', idMedico: '' }
    }


    async componentWillMount() {
        const tipo = await AsyncStorage.getItem('type');
        this.setState({ mTipo: tipo })
        if (tipo == 'AD') {
            await axios.get(server + 'users/get-comuns')
                .then(response => {
                    this.setState({ medicos: response.data });
                })
                .catch(error => { console.log(error) });
        }
        else {
            const id = await AsyncStorage.getItem('id');
            this.setState({ idMedico: id });
        }
    }

    async adiciona() {
        if (this.state.nome == '') {
            this.setState({ snack: true, label: "O nome precisa ser informado", color: 'red' })
        }

        else if (this.state.fone.length < 15 || this.state.fone == 0) {
            this.setState({ snack: true, label: "O telefone precisa ser informado", color: 'red' })
        }
        else {
            this.setState({ loading: true });
            await axios.post(server + "paciente/save-paciente", {
                nome: this.state.nome, status: "Encaminhado", id_medico: this.state.idMedico, dateTime: moment().format("DD/MM/YYYY HH:mm:ss"), fone: this.state.fone
            })
                .then(async res => {
                    await this.setState({ loading: false, snack: true, label: "Paciente cadastrado com sucesso!", color: 'green', fone: '', nome: '' });
                    await axios.get(server + "users/get-appid")
                        .then(async response => {
                            let ids = [];
                            response.data.map(e => {
                                ids.push(e.appID);
                            });
                            await axios.post(server + "notificaiton/send", {
                                app_id: "3e4a73a9-b5ce-41d3-bafc-4188efe477af",
                                contents: { "en": "O paciente " + this.state.nome + " foi adicionado!" },
                                subtitle: { "en": "Paciente adicionado" },
                                headings: { "en": "RISCO CIRURGICO APP" },
                                include_player_ids: ids
                            });
                        });
                })
                .catch(error =>
                    this.setState({ loading: false, snack: true, label: "Erro ao cadastrar!", color: 'red', fone: '', nome: '' }));
        }
    }

    onDismiss() {
        this.setState({ snack: false });
    }


    _admin() {
        if (this.state.mTipo == 'AD') {
            return (
                <View style={{ width: '100%', padding: 10 }}>
                    <Text>Selecione o médico responsável por este paciente</Text>
                    <Picker
                        mode="dropdown"
                        style={{ margin: 8 }}
                        selectedValue={this.state.idMedico}
                        onValueChange={(item) => this.setState({ idMedico: item })}
                    >
                        {this.state.medicos.map(e => {
                            return (
                                <Picker.Item label={e.nome} value={e.id} />

                            )
                        })}
                    </Picker>
                </View>
            )
        }
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
        console.log(this.state.medicos);
        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nome Completo</Label>
                            <Input value={this.state.nome} onChangeText={texto => this.setState({ nome: texto })} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Telefone</Label>
                            <Input keyboardType="number-pad"
                                maxLength={15}
                                value={this.state.fone}
                                onChangeText={texto => this.setState({ fone: texto.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3") })} />
                        </Item>
                        {this._admin()}
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