// Funciones que calculan los datos de las tarjetas y dan formato a las fechas de la pantalla de usuarios.
// Son funciones puras (no tocan la pantalla ni el backend), por eso se pueden probar fácilmente.

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const DIAS_RECIENTE = 7;

// Indica si dos fechas caen en el mismo día del calendario (hora local)
function esMismoDia(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Un usuario es "reciente" si se registró en los últimos 7 días
export function esReciente(fechaRegistro, ahora = new Date()) {
    const diferencia = ahora.getTime() - new Date(fechaRegistro).getTime();
    return diferencia < DIAS_RECIENTE * MS_POR_DIA;
}

// Calcula los cuatro datos de las tarjetas a partir de la lista de usuarios:
// total, registrados hoy, registrados en los últimos 7 días y el último usuario registrado
export function calcularResumen(usuarios, ahora = new Date()) {
    let hoy = 0;
    let ultimosSieteDias = 0;
    let ultimo = null;

    usuarios.forEach((usuario) => {
        const fecha = new Date(usuario.fecha_registro);
        if (esMismoDia(fecha, ahora)) {
            hoy++;
        }
        if (esReciente(usuario.fecha_registro, ahora)) {
            ultimosSieteDias++;
        }
        // El último es el de fecha más reciente; si empatan, el de código mayor
        if (ultimo === null) {
            ultimo = usuario;
        } else {
            const fechaUltimo = new Date(ultimo.fecha_registro);
            if (fecha > fechaUltimo || (fecha.getTime() === fechaUltimo.getTime() && usuario.id > ultimo.id)) {
                ultimo = usuario;
            }
        }
    });

    return { total: usuarios.length, hoy, ultimosSieteDias, ultimo };
}

// Da formato legible a una fecha del backend, por ejemplo "27/11/2026, 8:15 p. m."
export function formatearFecha(fechaRegistro) {
    const fecha = new Date(fechaRegistro);
    if (Number.isNaN(fecha.getTime())) {
        return '—';
    }
    return fecha.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}
