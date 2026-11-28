// Tabla reutilizable: recibe las columnas y las filas y las dibuja
// Props:
//   columnas: lista de { clave, titulo, render } ("render" es opcional y recibe la fila para personalizar la celda)
//   filas: lista de objetos a mostrar
//   claveFila: nombre del campo único de cada fila (por defecto "id")
//   mensajeVacio: texto que se muestra cuando no hay filas
function TablaDatos({ columnas, filas, claveFila = 'id', mensajeVacio = 'No hay datos para mostrar' }) {
    return (
        <div className="tabla-contenedor">
            <table className="tabla-datos">
                <thead>
                    <tr>
                        {columnas.map((columna) => (
                            <th key={columna.clave} scope="col">
                                {columna.titulo}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filas.length === 0 ? (
                        <tr>
                            <td colSpan={columnas.length} className="tabla-vacia">
                                {mensajeVacio}
                            </td>
                        </tr>
                    ) : (
                        filas.map((fila) => (
                            <tr key={fila[claveFila]}>
                                {columnas.map((columna) => (
                                    <td key={columna.clave}>
                                        {columna.render ? columna.render(fila) : fila[columna.clave]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaDatos;
