// Página de inicio de sesión
import { useLocation } from 'react-router-dom';
import FormularioLogin from '../componentes/FormularioLogin';

function PaginaLogin() {
    // Si llegamos desde el registro, la ubicación trae el mensaje de éxito
    const ubicacion = useLocation();

    return (
        <main className="contenedor-centrado">
            <FormularioLogin mensajeInicial={ubicacion.state?.mensaje} />
        </main>
    );
}

export default PaginaLogin;
