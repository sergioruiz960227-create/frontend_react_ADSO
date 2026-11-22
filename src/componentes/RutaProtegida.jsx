// Protege una pantalla: si no hay sesión iniciada, redirige al inicio de sesión
// Uso: <RutaProtegida><PaginaInicio /></RutaProtegida>
import { Navigate } from 'react-router-dom';
import { obtenerSesion } from '../servicios/sesionServicio';

function RutaProtegida({ children }) {
    if (!obtenerSesion()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RutaProtegida;