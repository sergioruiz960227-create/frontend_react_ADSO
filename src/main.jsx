// Punto de entrada de la aplicación: monta el componente raíz en la página
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* BrowserRouter habilita la navegación entre pantallas sin recargar la página */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
