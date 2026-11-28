// Menú lateral de la aplicación (en pantallas pequeñas se abre y se cierra con el botón del encabezado)
// Props: abierto (si el menú está visible en pantallas pequeñas) y onCerrar (función para cerrarlo)
import { NavLink } from 'react-router-dom';

// Opciones del menú. A medida que se agreguen módulos, se agregan aquí
const OPCIONES = [{ ruta: '/usuarios', texto: 'Usuarios', icono: '👥' }];

function Sidebar({ abierto, onCerrar }) {
    return (
        <>
            {/* Fondo oscuro que cubre la pantalla cuando el menú está abierto en el celular */}
            {abierto && <div className="sidebar-fondo" onClick={onCerrar} aria-hidden="true" />}
            <aside className={`sidebar ${abierto ? 'sidebar-abierto' : ''}`}>
                <div className="sidebar-marca">
                    <h2>TIENDA NUEVA</h2>
                    <p>Sistema de Gestión Comercial</p>
                </div>
                <nav aria-label="Menú principal">
                    <ul className="sidebar-menu">
                        {OPCIONES.map((opcion) => (
                            <li key={opcion.ruta}>
                                <NavLink to={opcion.ruta} onClick={onCerrar}>
                                    <span aria-hidden="true">{opcion.icono}</span>
                                    {opcion.texto}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;
