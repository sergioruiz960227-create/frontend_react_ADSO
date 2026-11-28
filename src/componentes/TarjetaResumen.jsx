// Tarjeta que muestra un dato resumido
// Props: icono (emoji), titulo, valor y detalle (texto pequeño opcional)
function TarjetaResumen({ icono, titulo, valor, detalle }) {
    return (
        <article className="tarjeta-resumen">
            <span className="tarjeta-icono" aria-hidden="true">
                {icono}
            </span>
            <div>
                <h3>{titulo}</h3>
                <p className="tarjeta-valor">{valor}</p>
                {detalle && <p className="tarjeta-detalle">{detalle}</p>}
            </div>
        </article>
    );
}

export default TarjetaResumen;
