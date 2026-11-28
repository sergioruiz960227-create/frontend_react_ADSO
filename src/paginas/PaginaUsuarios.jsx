// Pantalla de usuarios: tarjetas de resumen, buscador y tabla con los usuarios registrados.
// Los datos salen del backend (servicio protegido con token) y las tarjetas se calculan con esos mismos datos.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../componentes/Badge';
import BarraBusqueda from '../componentes/BarraBusqueda';
import DisenoPrincipal from '../componentes/DisenoPrincipal';
import Mensaje from '../componentes/Mensaje';
import TablaDatos from '../componentes/TablaDatos';
import TarjetaResumen from '../componentes/TarjetaResumen';
import { cerrarSesion } from '../servicios/sesionServicio';
import { listarUsuarios } from '../servicios/usuariosServicio';
import { calcularResumen, esReciente, formatearFecha } from '../utilidades/resumenUsuarios';

// Columnas de la tabla. "render" personaliza lo que se muestra en la celda
const COLUMNAS = [
    { clave: 'id', titulo: 'Código' },
    { clave: 'usuario', titulo: 'Usuario' },
    {
        clave: 'fecha_registro',
        titulo: 'Fecha de registro',
        render: (usuario) => formatearFecha(usuario.fecha_registro)
    },
    {
        clave: 'estado',
        titulo: 'Registro',
        render: (usuario) =>
            esReciente(usuario.fecha_registro) ? (
                <Badge texto="Nuevo" tipo="nuevo" />
            ) : (
                <Badge texto="Registrado" tipo="neutro" />
            )
    }
];

// Indica si un usuario coincide con el texto buscado (por código o por nombre de usuario)
function coincide(usuario, busqueda) {
    const texto = `${usuario.id} ${usuario.usuario}`.toLowerCase();
    return texto.includes(busqueda.trim().toLowerCase());
}

function PaginaUsuarios() {
    const navegar = useNavigate();

    // Estado: lista de usuarios, si se está cargando, mensaje de error y texto del buscador
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Al abrir la pantalla se consulta la lista de usuarios al backend
    useEffect(() => {
        let cancelado = false;

        async function cargar() {
            const resultado = await listarUsuarios();
            if (cancelado) {
                return;
            }
            if (resultado.estado === 401) {
                // El token venció o no es válido: se cierra la sesión y se vuelve al login con un aviso
                cerrarSesion();
                const aviso = {
                    tipo: 'error',
                    titulo: 'Sesión expirada',
                    texto: 'Tu sesión terminó. Inicia sesión nuevamente'
                };
                navegar('/login', { state: { aviso } });
                return;
            }
            if (resultado.ok) {
                setUsuarios(resultado.datos);
            } else {
                setError(resultado.mensaje);
            }
            setCargando(false);
        }

        cargar();
        // Si la pantalla se cierra antes de recibir la respuesta, se ignora el resultado
        return () => {
            cancelado = true;
        };
    }, [navegar]);

    // Datos derivados: las tarjetas y las filas filtradas se calculan en cada cambio
    const resumen = calcularResumen(usuarios);
    const filtrados = usuarios.filter((usuario) => coincide(usuario, busqueda));
    const mostrar = (valor) => (cargando || error ? '—' : valor);

    return (
        <DisenoPrincipal titulo="Usuarios">
            <section className="tarjetas-resumen" aria-label="Resumen de usuarios">
                <TarjetaResumen icono="👥" titulo="Usuarios totales" valor={mostrar(resumen.total)} />
                <TarjetaResumen icono="📅" titulo="Registrados hoy" valor={mostrar(resumen.hoy)} />
                <TarjetaResumen icono="🗓️" titulo="Últimos 7 días" valor={mostrar(resumen.ultimosSieteDias)} />
                <TarjetaResumen
                    icono="🕒"
                    titulo="Último registro"
                    valor={mostrar(resumen.ultimo ? resumen.ultimo.usuario : 'Sin registros')}
                    detalle={!cargando && !error && resumen.ultimo ? formatearFecha(resumen.ultimo.fecha_registro) : ''}
                />
            </section>

            <section className="panel">
                <div className="panel-encabezado">
                    <h2>Usuarios registrados</h2>
                    <BarraBusqueda onBuscar={setBusqueda} placeholder="Buscar por usuario o código" />
                </div>
                {error ? (
                    <Mensaje tipo="error" titulo="No se pudo cargar la lista de usuarios" texto={error} />
                ) : cargando ? (
                    <p className="estado-carga">Cargando usuarios...</p>
                ) : (
                    <>
                        <TablaDatos
                            columnas={COLUMNAS}
                            filas={filtrados}
                            mensajeVacio={
                                busqueda ? 'Ningún usuario coincide con la búsqueda' : 'Aún no hay usuarios registrados'
                            }
                        />
                        <p className="tabla-pie">
                            Mostrando {filtrados.length} de {usuarios.length} usuarios
                        </p>
                    </>
                )}
            </section>
        </DisenoPrincipal>
    );
}

export default PaginaUsuarios;
