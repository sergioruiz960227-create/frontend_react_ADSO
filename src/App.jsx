// Componente raíz: define las rutas (pantallas) de la aplicación
import { Navigate, Route, Routes } from 'react-router-dom';
import RutaProtegida from './componentes/RutaProtegida';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaUsuarios from './paginas/PaginaUsuarios';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/registro" element={<PaginaRegistro />} />
            {/* Solo se puede entrar a /usuarios con la sesión iniciada */}
            <Route
                path="/usuarios"
                element={
                    <RutaProtegida>
                        <PaginaUsuarios />
                    </RutaProtegida>
                }
            />
            {/* Cualquier otra dirección lleva a /usuarios (que redirige al login si no hay sesión) */}
            <Route path="*" element={<Navigate to="/usuarios" replace />} />
        </Routes>
    );
}

export default App;
