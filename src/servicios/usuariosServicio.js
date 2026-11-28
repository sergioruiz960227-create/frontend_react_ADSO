// Servicio de usuarios: consulta la lista de usuarios registrados en el backend
import { peticion } from './clienteHttp';
import { obtenerToken } from './sesionServicio';

// Pide la lista de usuarios. El servicio exige el token de la sesión en el encabezado Authorization.
// Si el token falta, es inválido o venció, el backend responde 401
export function listarUsuarios() {
    return peticion('/api/usuarios', {
        headers: { Authorization: `Bearer ${obtenerToken()}` }
    });
}
