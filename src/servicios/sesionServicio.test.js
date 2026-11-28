// Pruebas unitarias del servicio de sesión (usuario y token guardados en el navegador)
import { describe, expect, it, vi } from 'vitest';
import { cerrarSesion, guardarSesion, obtenerSesion, obtenerToken } from './sesionServicio';

describe('sesionServicio', () => {
    it('guarda y devuelve el usuario y el token', () => {
        guardarSesion('ana', 'abc.def.ghi');
        expect(obtenerSesion()).toEqual({ usuario: 'ana', token: 'abc.def.ghi' });
        expect(obtenerToken()).toBe('abc.def.ghi');
    });

    it('sin sesión guardada, no hay sesión ni token', () => {
        expect(obtenerSesion()).toBeNull();
        expect(obtenerToken()).toBeNull();
    });

    it('una sesión sin token (formato anterior) cuenta como sin sesión', () => {
        sessionStorage.setItem('sesionUsuario', JSON.stringify({ usuario: 'ana' }));
        expect(obtenerSesion()).toBeNull();
    });

    it('un dato dañado cuenta como sin sesión', () => {
        sessionStorage.setItem('sesionUsuario', '{esto no es json');
        expect(obtenerSesion()).toBeNull();
    });

    it('cerrarSesion elimina la sesión guardada', () => {
        guardarSesion('ana', 'token');
        cerrarSesion();
        expect(obtenerSesion()).toBeNull();
        expect(sessionStorage.getItem('sesionUsuario')).toBeNull();
    });

    it('si el almacenamiento falla, no rompe la aplicación', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('almacenamiento no disponible');
        });
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('almacenamiento no disponible');
        });
        vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
            throw new Error('almacenamiento no disponible');
        });
        expect(() => guardarSesion('ana', 'token')).not.toThrow();
        expect(obtenerSesion()).toBeNull();
        expect(() => cerrarSesion()).not.toThrow();
    });
});
