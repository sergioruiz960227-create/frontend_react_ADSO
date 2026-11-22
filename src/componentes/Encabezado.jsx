// Encabezado de las pantallas con sesión iniciada
// Props: usuario (nombre a mostrar) y onCerrarSesion (función que se ejecuta al pulsar el botón)
function Encabezado({ usuario, onCerrarSesion }) {
    return (
        <header className="encabezado">
            <span className="encabezado-titulo">Autenticación de usuarios</span>
            <div className="encabezado-usuario">
                <span>
                    Usuario: <strong>{usuario}</strong>
                </span>
                <button type="button" className="boton-secundario" onClick={onCerrarSesion}>
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}

export default Encabezado;
