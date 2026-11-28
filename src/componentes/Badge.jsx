// Etiqueta de color para mostrar un estado
// Props: texto (lo que se muestra) y tipo ('nuevo' o 'neutro', cambia el color)
function Badge({ texto, tipo = 'neutro' }) {
    return <span className={`badge badge-${tipo}`}>{texto}</span>;
}

export default Badge;
