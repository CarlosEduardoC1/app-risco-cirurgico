import axios from 'axios';
import { server } from '../../services';

export const _salvePaciente = async () => {
    const response = await axios.post( server + "paciente/save-paciente", { nome: "Carlos", status: "Bem", id_medico: 1 });
    return response;
}