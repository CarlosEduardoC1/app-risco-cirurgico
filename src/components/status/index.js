import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Image, TouchableHighlight, TextInput, AsyncStorage } from 'react-native';
import axios from 'axios';
import { containerSearch, containerUpdate, styleContainer, styleImg, styleSearch, update } from './props';
import { server } from '../../services';
import { Button, List, Snackbar } from 'react-native-paper';
import sendNotification from '../../services/notification';
import { FlatList } from 'react-native';
import { ScrollView } from 'react-native';

function Status() {

    const [paciente, setPaciente] = useState([]);
    const [pacienteError, setPacienteError] = useState([]);
    const [search, setSearch] = useState();
    const [type, setType] = useState();
    const [id, setId] = useState();
    const [color, setcolor] = useState();
    const [snack, setsnack] = useState(false);
    const [label, setlabel] = useState();

    useEffect(async () => {
        let tipo = await AsyncStorage.getItem('type');
        let idm = await AsyncStorage.getItem('id');
        setType(tipo);
        setId(idm);
        if (search) {
            getWithSearch();
        } else {
            getPacientes();
        }
    }, [search]);

    const getPacientes = async () => {
        if (type == 'AD') {
            setSearch('');
            await axios.post(server + "paciente/select-adm/")
                .then(response => {
                    setPaciente(response.data);
                })
                .catch(error => setPacienteError(error))
        }
        else {
            setSearch('');
            await axios.post(server + "paciente/get-paciente/" + id)
                .then(response => {
                    setPaciente(response.data);
                })
                .catch(error => setPacienteError(error))
        }
    }

    const getWithSearch = async () => {
        if (type == 'AD') {
            await axios.post(server + "paciente/search-adm/" + search)
                .then(response => {
                    setPaciente(response.data);
                })
                .catch(error => setPacienteError(error));
        }
        else {
            await axios.post(server + "paciente/get-paciente/" + id + "/" + search)
                .then(response => {
                    setPaciente(response.data);
                })
                .catch(error => setPacienteError(error));
        }
    }

    const alteraStatus = async (nome, id_usr, id_med, sts) => {
        await axios.post(server + "paciente/update-paciente", {
            status: sts,
            id: id_usr,
            id_medico: id_med
        })
            .then(async response => {
                await axios.post(server + "notificaiton/send", {
                    app_id: "3e4a73a9-b5ce-41d3-bafc-4188efe477af",
                    contents: { "en": "O status do seu paciente " + nome + " foi alterado" },
                    subtitle: { "en": "Atualização de status" },
                    // small_icon: 'ic_stat_onesignal_default',
                    headings: { "en": "RISCO CIRURGICO APP" },
                    include_player_ids: [response.data.rows.appID]
                })
                    .then(() => {
                        getPacientes();
                    })
                    .catch(() => {
                        getPacientes();
                    })
            })
            .catch(error => {
                getPacientes();
            })
    }


    const myType = (nome, id_usr, id_med) => {
        if (type == 'AD') {
            return (
                <View style={{ width: '100%', padding: 10, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button mode='outlined' color='black' style={{ marginTop: 5 }} onPress={() => alteraStatus(nome, id_usr, id_med, "Em Consulta")}>Em Consulta</Button>
                    <Button mode='outlined' color='green' style={{ marginTop: 5 }} onPress={() => alteraStatus(nome, id_usr, id_med, "Liberado para Cirurgia")}>Sem risco</Button>
                    <Button mode='outlined' color='red' style={{ marginTop: 5 }} onPress={() => alteraStatus(nome, id_usr, id_med, "Com risco cirurgico")}>Com risco</Button>
                </View>
            )
        }
    }


    function onDismiss() {
        setsnack(false);
    }

    return (
        <View style={styleContainer}>
            <SafeAreaView style={containerSearch}>
                <Image source={require('../../../assets/search.png')} resizeMode="contain" style={styleImg} />
                <TextInput placeholder="Pesquisar..." value={search} onChangeText={texto => setSearch(texto)} style={styleSearch} ></TextInput>
            </SafeAreaView>
            <TouchableHighlight style={containerUpdate} underlayColor='white' onPress={() => getPacientes()}>
                <Text style={update}>Atualizar lista</Text>
            </TouchableHighlight>
            <View style={{ width: '100%' }}>
                <ScrollView alwaysBounceVertical scrollsToTop style={{ width: "100%", height: '70%' }}>
                    {paciente.map(item => {
                        let type = undefined;
                        if (item.status == 'Encaminhado') { type = 'black' };
                        if (item.status == 'Em Consulta') { type = 'orange' };
                        if (item.status == 'Liberado para Cirurgia') { type = 'green' };
                        if (item.status == 'Com risco cirurgico') { type = 'red' };
                        if (item.nome) {
                            return (
                                <View>
                                    <List.Accordion
                                        style={{ backgroundColor: "#f6f6f6" }}
                                        titleStyle={{ color: type }}
                                        title={item.nome}
                                        right={() => <Image source={require('../../../assets/arrow.png')} style={{ height: 15, width: 15 }} resizeMode='center' />}
                                    >

                                        {myType(item.nome, item.id, item.id_medico)}
                                        <List.Item title={item.fone} />
                                        <List.Item titleStyle={{ color: type }} title={" Status: " + item.status} />
                                        <List.Item title={"Última atualização: " + item.dateTime} />
                                    </List.Accordion>
                                </View>
                            );
                        }
                        else {
                            return (
                                <Text style={{ marginTop: 100 }}>Você não possui pacientes cadastrados.</Text>
                            );
                        }

                    })}
                </ScrollView>
            </View>
            <Snackbar style={{ backgroundColor: color }} visible={snack} onDismiss={() => onDismiss()} duration={1500} >
                {label}
            </Snackbar>
        </View>
    );
}

export default Status;