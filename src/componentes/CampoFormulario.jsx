// Campo de formulario reutilizable: una etiqueta junto con su campo de entrada
// Props: id, etiqueta, tipo, valor, onCambio, placeholder, maxLongitud y autoComplete
function CampoFormulario({ id, etiqueta, tipo = 'text', valor, onCambio, placeholder, maxLongitud, autoComplete }) {
    return (
        <div className="campo">
            <label htmlFor={id}>{etiqueta}</label>
            <input
                id={id}
                name={id}
                type={tipo}
                value={valor}
                onChange={onCambio}
                placeholder={placeholder}
                maxLength={maxLongitud}
                autoComplete={autoComplete}
            />
        </div>
    );
}

export default CampoFormulario;
