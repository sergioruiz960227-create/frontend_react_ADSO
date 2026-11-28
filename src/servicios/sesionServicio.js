// Servicio de sesión: guarda en el navegador quién inició sesión y su token.
// El token lo entrega el backend al iniciar sesión y se envía en las peticiones protegidas.
// Se guarda en sessionStorage: se borra al cerrar la pestaña o al cerrar sesión.

// Nombre con el que se guarda la sesión en el almacenamiento de la pestaña
const CLAVE_SESION = 'sesionUsuario';

// Guarda el nombre del usuario que inició sesión y su token
export function guardarSesion(usuario, token) {
    try {
        sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ usuario, token }));
    } catch {
        // Si el almacenamiento no está disponible, la sesión simplemente no se guarda
    }
}

// Devuelve la sesión guardada ({ usuario, token }) o null si no hay una sesión válida
export function obtenerSesion() {
    try {
        const texto = sessionStorage.getItem(CLAVE_SESION);
        const sesion = texto ? JSON.parse(texto) : null;
        // Una sesión sin token (de una versión anterior) no sirve para las rutas protegidas
        return sesion && sesion.token ? sesion : null;
    } catch {
        // Si el almacenamiento falla o el dato está dañado, se considera que no hay sesión
        return null;
    }
}

// Devuelve el token de la sesión o null si no hay sesión
export function obtenerToken() {
    const sesion = obtenerSesion();
    return sesion ? sesion.token : null;
}

// Elimina la sesión guardada (cerrar sesión)
export function cerrarSesion() {
    try {
        sessionStorage.removeItem(CLAVE_SESION);
    } catch {
        // Si el almacenamiento no está disponible, no hay nada que eliminar
    }
}
