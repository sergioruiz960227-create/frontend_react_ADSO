// Página de inicio: solo se muestra con la sesión iniciada (ver RutaProtegida en App.jsx)
import { useNavigate } from 'react-router-dom';
import Encabezado from '../componentes/Encabezado';
import { cerrarSesion, obtenerSesion } from '../servicios/sesionServicio';

function PaginaInicio() {
    const navegar = useNavigate();
    const sesion = obtenerSesion();

    // Elimina la sesión y vuelve al inicio de sesión
    function manejarCierre() {
        cerrarSesion();
        navegar('/login');
    }

    return (
        <>
            <Encabezado usuario={sesion.usuario} onCerrarSesion={manejarCierre} />
            <main className="contenido">
                <h1>Bienvenido, {sesion.usuario}</h1>
                <p>Iniciaste sesión correctamente: el servicio web validó tu usuario y tu contraseña.</p>
            </main>
        </>
    );
}

export default PaginaInicio;