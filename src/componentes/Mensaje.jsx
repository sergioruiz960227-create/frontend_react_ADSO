// Componente que muestra un mensaje de éxito o de error
// Props: tipo ('exito' o 'error') y texto. Si no hay texto, no muestra nada
function Mensaje({ tipo, texto }) {
    if (!texto) {
        return null;
    }

    return (
        <p className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
            {texto}
        </p>
    );
}

export default Mensaje;