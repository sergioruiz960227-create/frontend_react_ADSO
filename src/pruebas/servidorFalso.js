// Servidor falso para las pruebas: imita las respuestas reales del backend (prueba_node_ADSO)
// sin necesidad de base de datos ni de red. Así las pruebas son rápidas y funcionan en cualquier equipo.
import { vi } from 'vitest';

// Crea una respuesta JSON como la entregaría fetch
function responder(estado, cuerpo) {
    const encabezados = { 'Content-Type': 'application/json' };
    return Promise.resolve(new Response(JSON.stringify(cuerpo), { status: estado, headers: encabezados }));
}

// Crea el servidor falso con una lista inicial de usuarios ({ id, usuario, fecha_registro }).
// Todos los usuarios iniciales tienen la contraseña "Clave123".
export function crearServidorFalso(usuariosIniciales = []) {
    const servidor = {
        usuarios: usuariosIniciales.map((usuario) => ({ ...usuario })),
        tokens: new Set(),
        peticiones: [],
        apagado: false,

        // Reemplaza fetch por este servidor falso
        instalar() {
            vi.stubGlobal('fetch', vi.fn(manejar));
            return servidor;
        },
        // Simula que el backend está apagado: fetch falla antes de recibir respuesta
        apagar() {
            servidor.apagado = true;
        },
        // Simula que los tokens vencieron: el servicio de usuarios responderá 401
        vencerTokens() {
            servidor.tokens.clear();
        }
    };
    const contrasenas = {};
    servidor.usuarios.forEach((usuario) => {
        contrasenas[usuario.usuario] = 'Clave123';
    });

    // Atiende cada petición según su método y su ruta, igual que el backend real
    async function manejar(ruta, opciones = {}) {
        const metodo = opciones.method || 'GET';
        const cuerpo = opciones.body ? JSON.parse(opciones.body) : {};
        servidor.peticiones.push({ metodo, ruta, encabezados: opciones.headers || {}, cuerpo });

        if (servidor.apagado) {
            throw new TypeError('Failed to fetch');
        }

        if (metodo === 'POST' && ruta === '/api/register') {
            const nombre = String(cuerpo.usuario || '').trim();
            if (!nombre || !cuerpo.contrasena) {
                return responder(400, { ok: false, mensaje: 'Usuario y contraseña son obligatorios' });
            }
            if (servidor.usuarios.some((usuario) => usuario.usuario.toLowerCase() === nombre.toLowerCase())) {
                return responder(409, { ok: false, mensaje: 'El usuario ya existe' });
            }
            const nuevo = {
                id: servidor.usuarios.length + 1,
                usuario: nombre,
                fecha_registro: new Date().toISOString()
            };
            servidor.usuarios.push(nuevo);
            contrasenas[nombre] = cuerpo.contrasena;
            return responder(201, { ok: true, mensaje: 'Usuario registrado correctamente' });
        }

        if (metodo === 'POST' && ruta === '/api/login') {
            const nombre = String(cuerpo.usuario || '').trim();
            if (!nombre || !cuerpo.contrasena) {
                return responder(400, { ok: false, mensaje: 'Usuario y contraseña son obligatorios' });
            }
            const encontrado = servidor.usuarios.find((usuario) => usuario.usuario === nombre);
            if (!encontrado || contrasenas[nombre] !== cuerpo.contrasena) {
                return responder(401, { ok: false, mensaje: 'Error en la autenticación' });
            }
            const token = `token-falso-${encontrado.id}`;
            servidor.tokens.add(token);
            return responder(200, {
                ok: true,
                mensaje: 'Autenticación satisfactoria',
                token,
                usuario: { id: encontrado.id, usuario: encontrado.usuario }
            });
        }

        if (metodo === 'GET' && ruta === '/api/usuarios') {
            const autorizacion = (opciones.headers && opciones.headers.Authorization) || '';
            const token = autorizacion.replace('Bearer ', '');
            if (!servidor.tokens.has(token)) {
                return responder(401, { ok: false, mensaje: 'Token inválido o ausente' });
            }
            const datos = servidor.usuarios.map(({ id, usuario, fecha_registro }) => ({ id, usuario, fecha_registro }));
            return responder(200, { ok: true, total: datos.length, datos });
        }

        return responder(404, { ok: false, mensaje: 'Ruta no encontrada' });
    }

    return servidor;
}
