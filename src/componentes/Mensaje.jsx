// Componente que muestra un mensaje de éxito o de error con el estilo de Tienda Nueva
// Props: tipo ('exito' o 'error'), titulo (opcional) y texto. Si no hay texto, no muestra nada
function Mensaje({ tipo, titulo, texto }) {
    if (!texto) {
        return null;
    }

    // Ícono que acompaña al mensaje: "!" para errores y "✓" para éxito
    const icono = tipo === 'error' ? '!' : '✓';

    return (
        <div className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
            <span className="icono-mensaje" aria-hidden="true">
                {icono}
            </span>
            <div>
                {titulo && <strong>{titulo}</strong>}
                <p>{texto}</p>
            </div>
        </div>
    );
}

export default Mensaje;
