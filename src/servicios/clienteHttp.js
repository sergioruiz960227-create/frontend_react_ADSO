// Cliente HTTP común: concentra la forma de llamar al servicio web (backend)
// Las rutas empiezan por /api porque Vite las reenvía al backend (ver vite.config.js)

// Hace una petición y devuelve siempre un objeto con la misma forma:
// { ok, estado, ...lo que responda el servicio (mensaje, token, datos, etc.) }
export async function peticion(ruta, opciones = {}) {
    try {
        const respuesta = await fetch(ruta, opciones);
        const resultado = await respuesta.json();
        return { ...resultado, ok: respuesta.ok, estado: respuesta.status };
    } catch {
        // Si el backend está apagado o no responde, fetch falla antes de recibir una respuesta
        return { ok: false, estado: 0, mensaje: 'No se pudo conectar con el servidor' };
    }
}

// Envía una petición POST con datos JSON
export function peticionPost(ruta, datos) {
    return peticion(ruta, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
}
