// Encabezado de las pantallas con sesión iniciada
// Props: titulo (de la pantalla), usuario (nombre a mostrar), onCerrarSesion y onAlternarMenu
// (funciones que se ejecutan al pulsar los botones)
function Encabezado({ titulo, usuario, onCerrarSesion, onAlternarMenu }) {
    return (
        <header className="encabezado">
            <div className="encabezado-izquierda">
                <button type="button" className="boton-menu" onClick={onAlternarMenu} aria-label="Abrir el menú">
                    ☰
                </button>
                <h1 className="encabezado-titulo">{titulo}</h1>
            </div>
            <div className="encabezado-usuario">
                <span>
                    Usuario: <strong>{usuario}</strong>
                </span>
                <button type="button" className="boton-secundario" onClick={onCerrarSesion}>
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}

export default Encabezado;
