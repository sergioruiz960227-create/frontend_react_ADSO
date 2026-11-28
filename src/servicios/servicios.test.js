// Pruebas unitarias de los servicios que se comunican con el backend (con un servidor falso)
import { describe, expect, it } from 'vitest';
import { crearServidorFalso } from '../pruebas/servidorFalso';
import { iniciarSesion, registrarUsuario } from './authServicio';
import { peticion, peticionPost } from './clienteHttp';
import { guardarSesion } from './sesionServicio';
import { listarUsuarios } from './usuariosServicio';

const usuarioInicial = { id: 1, usuario: 'ana', fecha_registro: new Date().toISOString() };

describe('clienteHttp', () => {
    it('devuelve ok y estado junto con lo que responde el servicio', async () => {
        crearServidorFalso([usuarioInicial]).instalar();
        const resultado = await peticionPost('/api/login', { usuario: 'ana', contrasena: 'Clave123' });
        expect(resultado.ok).toBe(true);
        expect(resultado.estado).toBe(200);
        expect(resultado.mensaje).toBe('Autenticación satisfactoria');
    });

    it('con una respuesta de error devuelve ok falso y el mensaje del servicio', async () => {
        crearServidorFalso().instalar();
        const resultado = await peticionPost('/api/login', { usuario: '', contrasena: '' });
        expect(resultado.ok).toBe(false);
        expect(resultado.estado).toBe(400);
        expect(resultado.mensaje).toBe('Usuario y contraseña son obligatorios');
    });

    it('si el servidor no responde, devuelve el estado 0 y el mensaje de conexión', async () => {
        crearServidorFalso().instalar().apagar();
        const resultado = await peticion('/api/usuarios');
        expect(resultado).toEqual({ ok: false, estado: 0, mensaje: 'No se pudo conectar con el servidor' });
    });

    it('peticionPost envía los datos como JSON', async () => {
        const servidor = crearServidorFalso().instalar();
        await peticionPost('/api/register', { usuario: 'luis', contrasena: 'Clave123' });
        const enviada = servidor.peticiones[0];
        expect(enviada.metodo).toBe('POST');
        expect(enviada.encabezados['Content-Type']).toBe('application/json');
        expect(enviada.cuerpo).toEqual({ usuario: 'luis', contrasena: 'Clave123' });
    });
});

describe('authServicio', () => {
    it('registrarUsuario llama a /api/register y registra al usuario', async () => {
        const servidor = crearServidorFalso().instalar();
        const resultado = await registrarUsuario('luis', 'Clave123');
        expect(servidor.peticiones[0].ruta).toBe('/api/register');
        expect(resultado.estado).toBe(201);
        expect(servidor.usuarios).toHaveLength(1);
    });

    it('registrarUsuario informa si el usuario ya existe', async () => {
        crearServidorFalso([usuarioInicial]).instalar();
        const resultado = await registrarUsuario('ana', 'Clave123');
        expect(resultado.estado).toBe(409);
        expect(resultado.mensaje).toBe('El usuario ya existe');
    });

    it('iniciarSesion llama a /api/login y entrega el token y los datos del usuario', async () => {
        const servidor = crearServidorFalso([usuarioInicial]).instalar();
        const resultado = await iniciarSesion('ana', 'Clave123');
        expect(servidor.peticiones[0].ruta).toBe('/api/login');
        expect(resultado.ok).toBe(true);
        expect(resultado.token).toBeTruthy();
        expect(resultado.usuario).toEqual({ id: 1, usuario: 'ana' });
    });

    it('iniciarSesion con una contraseña incorrecta no entrega token', async () => {
        crearServidorFalso([usuarioInicial]).instalar();
        const resultado = await iniciarSesion('ana', 'incorrecta');
        expect(resultado.estado).toBe(401);
        expect(resultado.token).toBeUndefined();
    });
});

describe('usuariosServicio', () => {
    it('envía el token de la sesión en el encabezado Authorization y recibe la lista', async () => {
        const servidor = crearServidorFalso([usuarioInicial]).instalar();
        const login = await iniciarSesion('ana', 'Clave123');
        guardarSesion('ana', login.token);

        const resultado = await listarUsuarios();

        expect(servidor.peticiones[1].ruta).toBe('/api/usuarios');
        expect(servidor.peticiones[1].encabezados.Authorization).toBe(`Bearer ${login.token}`);
        expect(resultado.estado).toBe(200);
        expect(resultado.total).toBe(1);
        expect(resultado.datos[0].usuario).toBe('ana');
    });

    it('sin sesión, el servicio responde 401', async () => {
        crearServidorFalso([usuarioInicial]).instalar();
        const resultado = await listarUsuarios();
        expect(resultado.estado).toBe(401);
        expect(resultado.ok).toBe(false);
    });

    it('con un token vencido, el servicio responde 401', async () => {
        const servidor = crearServidorFalso([usuarioInicial]).instalar();
        const login = await iniciarSesion('ana', 'Clave123');
        guardarSesion('ana', login.token);
        servidor.vencerTokens();
        expect((await listarUsuarios()).estado).toBe(401);
    });

    it('con el backend apagado, devuelve el mensaje de conexión', async () => {
        crearServidorFalso().instalar().apagar();
        const resultado = await listarUsuarios();
        expect(resultado.estado).toBe(0);
        expect(resultado.mensaje).toBe('No se pudo conectar con el servidor');
    });
});
