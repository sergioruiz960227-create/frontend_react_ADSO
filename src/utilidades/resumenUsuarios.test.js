// Pruebas unitarias de los cálculos de las tarjetas y del formato de fechas
import { describe, expect, it } from 'vitest';
import { calcularResumen, esReciente, formatearFecha } from './resumenUsuarios';

// Crea una fecha ISO a partir de año, mes (1 a 12), día, hora y minuto en hora local
const iso = (anio, mes, dia, hora = 12, minuto = 0) => new Date(anio, mes - 1, dia, hora, minuto).toISOString();

describe('calcularResumen', () => {
    const ahora = new Date(2026, 10, 27, 12, 0);
    const usuarios = [
        { id: 1, usuario: 'a', fecha_registro: iso(2026, 11, 27, 8) },
        { id: 2, usuario: 'b', fecha_registro: iso(2026, 11, 27, 9, 30) },
        { id: 3, usuario: 'c', fecha_registro: iso(2026, 11, 22, 10) },
        { id: 4, usuario: 'd', fecha_registro: iso(2026, 11, 10, 10) }
    ];

    it('calcula el total, los de hoy, los de los últimos 7 días y el último registro', () => {
        const resumen = calcularResumen(usuarios, ahora);
        expect(resumen.total).toBe(4);
        expect(resumen.hoy).toBe(2);
        expect(resumen.ultimosSieteDias).toBe(3);
        expect(resumen.ultimo.usuario).toBe('b');
    });

    it('con la lista vacía todo es cero y no hay último registro', () => {
        expect(calcularResumen([], ahora)).toEqual({ total: 0, hoy: 0, ultimosSieteDias: 0, ultimo: null });
    });

    it('con un solo usuario, ese es el último', () => {
        const resumen = calcularResumen([usuarios[3]], ahora);
        expect(resumen.ultimo.usuario).toBe('d');
        expect(resumen.hoy).toBe(0);
    });

    it('si dos usuarios tienen la misma fecha, el último es el de código mayor', () => {
        const fecha = iso(2026, 11, 27, 10);
        const empatados = [
            { id: 5, usuario: 'x', fecha_registro: fecha },
            { id: 9, usuario: 'y', fecha_registro: fecha },
            { id: 7, usuario: 'z', fecha_registro: fecha }
        ];
        expect(calcularResumen(empatados, ahora).ultimo.usuario).toBe('y');
    });

    it('no importa el orden en que llegan los usuarios', () => {
        const alReves = [...usuarios].reverse();
        expect(calcularResumen(alReves, ahora).ultimo.usuario).toBe('b');
    });
});

describe('esReciente', () => {
    const ahora = new Date(2026, 10, 27, 12, 0);

    it('es reciente si se registró hace menos de 7 días', () => {
        expect(esReciente(iso(2026, 11, 21, 12), ahora)).toBe(true);
    });

    it('no es reciente si se registró hace 7 días o más', () => {
        expect(esReciente(iso(2026, 11, 20, 12), ahora)).toBe(false);
        expect(esReciente(iso(2026, 10, 1, 12), ahora)).toBe(false);
    });
});

describe('formatearFecha', () => {
    it('muestra el año completo y la hora', () => {
        const texto = formatearFecha(iso(2026, 11, 27, 20, 15));
        expect(texto).toContain('2026');
        expect(texto).toContain('27');
    });

    it('devuelve una raya si la fecha no es válida', () => {
        expect(formatearFecha('no es una fecha')).toBe('—');
    });
});
