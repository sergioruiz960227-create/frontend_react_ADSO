// Servicio de autenticación: registro e inicio de sesión en el servicio web (backend)
import { peticionPost } from './clienteHttp';

// Registra un usuario nuevo en el backend
export function registrarUsuario(usuario, contrasena) {
    return peticionPost('/api/register', { usuario, contrasena });
}

// Valida el usuario y la contraseña en el backend.
// Si son correctos, la respuesta incluye el token y los datos del usuario
export function iniciarSesion(usuario, contrasena) {
    return peticionPost('/api/login', { usuario, contrasena });
}
