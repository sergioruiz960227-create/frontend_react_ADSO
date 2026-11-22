// Campo de formulario reutilizable: una etiqueta junto con su campo de entrada
// Props: id, etiqueta, tipo, valor, onCambio, maxLongitud y autoComplete
function CampoFormulario({ id, etiqueta, tipo = 'text', valor, onCambio, maxLongitud, autoComplete }) {
    return (
        <div className="campo">
            <label htmlFor={id}>{etiqueta}</label>
            <input
                id={id}
                name={id}
                type={tipo}
                value={valor}
                onChange={onCambio}
                maxLength={maxLongitud}
                autoComplete={autoComplete}
            />
        </div>
    );
}

export default CampoFormulario;