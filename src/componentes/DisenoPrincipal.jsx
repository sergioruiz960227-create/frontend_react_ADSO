// Diseño común de las pantallas con sesión: menú lateral + encabezado + contenido
// Props: titulo (se muestra en el encabezado) y children (el contenido de la pantalla)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Encabezado from './Encabezado';
import Sidebar from './Sidebar';
import { cerrarSesion, obtenerSesion } from '../servicios/sesionServicio';

function DisenoPrincipal({ titulo, children }) {
    const navegar = useNavigate();
    const sesion = obtenerSesion();

    // Estado: si el menú lateral está abierto (solo importa en pantallas pequeñas)
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Elimina la sesión y vuelve al inicio de sesión
    function manejarCierre() {
        cerrarSesion();
        navegar('/login');
    }

    return (
        <div className="diseno-principal">
            <Sidebar abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
            <div className="diseno-contenido">
                <Encabezado
                    titulo={titulo}
                    usuario={sesion ? sesion.usuario : ''}
                    onCerrarSesion={manejarCierre}
                    onAlternarMenu={() => setMenuAbierto(!menuAbierto)}
                />
                <main className="contenido">{children}</main>
            </div>
        </div>
    );
}

export default DisenoPrincipal;
