// Componente raíz: define las rutas (pantallas) de la aplicación
import { Navigate, Route, Routes } from 'react-router-dom';
import RutaProtegida from './componentes/RutaProtegida';
import PaginaInicio from './paginas/PaginaInicio';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/registro" element={<PaginaRegistro />} />
            {/* Solo se puede entrar a /inicio con la sesión iniciada */}
            <Route
                path="/inicio"
                element={
                    <RutaProtegida>
                        <PaginaInicio />
                    </RutaProtegida>
                }
            />
            {/* Cualquier otra dirección lleva a /inicio (que redirige al login si no hay sesión) */}
            <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
    );
}

export default App;