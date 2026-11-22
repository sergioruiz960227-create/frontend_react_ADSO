// Servicio de autenticación: concentra las llamadas al servicio web (backend)
// Las rutas empiezan por /api porque Vite las reenvía al backend (ver vite.config.js)

// Envía una petición POST con datos JSON y devuelve el estado HTTP y el mensaje recibido
async function enviarPost(ruta, datos) {
    try {
        const respuesta = await fetch(ruta, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();
        return { ok: respuesta.ok, estado: respuesta.status, mensaje: resultado.mensaje };
    } catch {
        // Si el backend está apagado o no responde, fetch falla antes de recibir una respuesta
        return { ok: false, estado: 0, mensaje: 'No se pudo conectar con el servidor' };
    }
}

// Registra un usuario nuevo en el backend
export function registrarUsuario(usuario, contrasena) {
    return enviarPost('/api/register', { usuario, contrasena });
}

// Valida el usuario y la contraseña en el backend
export function iniciarSesion(usuario, contrasena) {
    return enviarPost('/api/login', { usuario, contrasena });
}