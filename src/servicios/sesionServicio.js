// Servicio de sesión: guarda en el navegador quién inició sesión.
// Nota: el backend no entrega token, por lo que esta sesión solo controla la navegación
// del front-end y no reemplaza la seguridad del servidor.

// Nombre con el que se guarda la sesión en el almacenamiento de la pestaña
const CLAVE_SESION = 'sesionUsuario';

// Guarda el nombre del usuario que inició sesión
export function guardarSesion(usuario) {
    try {
        sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ usuario }));
    } catch {
        // Si el almacenamiento no está disponible, la sesión simplemente no se guarda
    }
}

// Devuelve la sesión guardada ({ usuario }) o null si no hay sesión
export function obtenerSesion() {
    try {
        const texto = sessionStorage.getItem(CLAVE_SESION);
        return texto ? JSON.parse(texto) : null;
    } catch {
        // Si el almacenamiento falla o el dato está dañado, se considera que no hay sesión
        return null;
    }
}

// Elimina la sesión guardada (cerrar sesión)
export function cerrarSesion() {
    try {
        sessionStorage.removeItem(CLAVE_SESION);
    } catch {
        // Si el almacenamiento no está disponible, no hay nada que eliminar
    }
}