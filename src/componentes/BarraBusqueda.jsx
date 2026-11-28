// Buscador: guarda el texto que escribe el usuario y avisa a la pantalla en cada cambio
// Props: onBuscar (función que recibe el texto) y placeholder (opcional)
import { useState } from 'react';

function BarraBusqueda({ onBuscar, placeholder = 'Buscar...' }) {
    // Estado: texto escrito en el buscador
    const [texto, setTexto] = useState('');

    // Se ejecuta con cada letra que se escribe o se borra
    function manejarCambio(evento) {
        setTexto(evento.target.value);
        onBuscar(evento.target.value);
    }

    return (
        <div className="barra-busqueda">
            <input type="search" aria-label="Buscar" placeholder={placeholder} value={texto} onChange={manejarCambio} />
        </div>
    );
}

export default BarraBusqueda;
