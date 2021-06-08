import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableHighlight, FlatList } from 'react-native';
import { Card, CardItem, Spinner } from 'native-base';
import { Button, Paragraph, Dialog, Portal, Snackbar, Provider } from 'react-native-paper';
import { cancelar, cancelLabel, container, containerButtons, listLabel, props_statusbar, title } from './props';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { server } from '../../services';


function List() {

    const [users, setUsers] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [id, setID] = useState(false);
    const [name, setName] = useState(false);
    const [snack, setSnack] = useState(false);
    const [color, setColor] = useState();
    const [label, setLabel] = useState();
    const [spinr, setSpinner] = useState(false);

    useEffect(() => {
        _getUsers();
    }, [])


    const _getUsers = async () => {
        setSpinner(true);
        const response = await axios.get(server + "users/get-user")
            .then(response => {
                setUsers(response.data);
                setSpinner(false);
            })
            .catch(error => setSpinner(false));
    }

    const hideDialog = () => { setDialog(false); }

    const _deletaUser = (id, nome) => {
        setDialog(true);
        setName(nome);
        setID(id);
    }

    const _excluir = async () => {
        setSpinner(true);
        setDialog(false);
        await axios.delete(server + "users/delete-user/" + id)
            .then(() => {
                setSpinner(false);
                setSnack(true);
                setColor('green');
                setLabel("Usuário deletado com sucesso!");
                _getUsers();
            })
            .catch(() => {
                setSpinner(false);
                setSnack(true);
                setColor('red');
                setLabel("Erro ao deletar usuário");
                _getUsers();
            })
    }

    function spin() {
        if (spinr) {
            return (
                <Spinner color='green' />
            )
        }
    }

    function onDismiss() {
        setSnack(false);
    }

    return (
        <View style={container}>
            <StatusBar {...props_statusbar} />
            <View style={containerButtons}>
                <View style={cancelar}>
                    <TouchableHighlight underlayColor="white" onPress={() => { Actions.pop() }}>
                        <Text style={listLabel}>Voltar</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={title}><Text>Usuários Cadastrados </Text></View>
            <View>
                <FlatList
                    style={{ width: '100%' }}
                    data={users}
                    renderItem={({ item }) => {
                        let type = undefined;
                        if (item.type == 'AD') { type = 'Administrador' }
                        if (item.type == 'CM') { type = 'Usuário Comum' }
                        if (item.appID = ! '') {
                            return (
                                <View>
                                    <Card>
                                        <View>
                                            <CardItem>
                                                <Text>Nome: {item.nome}</Text>
                                            </CardItem>
                                            <CardItem>
                                                <Text>E-mail: {item.email}</Text>
                                            </CardItem>
                                            <CardItem>
                                                <Text>Tipo: {type}</Text>
                                            </CardItem>
                                            <CardItem style={{ justifyContent: 'flex-end' }}>
                                                <TouchableHighlight underlayColor="white" onPress={() => { _deletaUser(item.id, item.nome) }}>
                                                    <Text style={cancelLabel}>Deletar</Text>
                                                </TouchableHighlight>
                                            </CardItem>
                                        </View>
                                    </Card>
                                </View>
                            );
                        }
                        else {
                            setSnack(true);
                            setLabel("Você não possui usuários cadastrados!");
                            setColor('red');
                        }

                    }}
                />
            </View>
            <Provider>
                <Portal>
                    <Dialog visible={dialog} onDismiss={hideDialog}>
                        <Dialog.Title>Deletar</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Tem certeza que deseja excluir permanentemente o usuário {name} ?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button color="blue" onPress={hideDialog}>Cancelar</Button>
                            <Button color="red" onPress={_excluir}>Excluir</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </Provider>
            <Snackbar style={{ backgroundColor: color }} visible={snack} onDismiss={() => onDismiss()} duration={1500} >
                {label}
            </Snackbar>
            {spin()}
        </View>
    );
}

export default List;