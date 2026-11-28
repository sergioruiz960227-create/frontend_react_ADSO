// Página de inicio de sesión
import { useLocation } from 'react-router-dom';
import FormularioLogin from '../componentes/FormularioLogin';

function PaginaLogin() {
    // Si llegamos desde otra pantalla (registro exitoso, sesión vencida), la ubicación trae un aviso
    const ubicacion = useLocation();

    return (
        <main className="login-container">
            <FormularioLogin aviso={ubicacion.state?.aviso} />
        </main>
    );
}

export default PaginaLogin;
