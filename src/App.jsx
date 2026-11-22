// Componente raíz de la aplicación
// Nota: es una versión temporal para probar la conexión con el backend; se reemplaza en el Paso 3
import { useState } from 'react';
import { iniciarSesion } from './servicios/authServicio';

function App() {
    // Estado que guarda el mensaje que se muestra en pantalla
    const [mensaje, setMensaje] = useState('Aún no se ha probado la conexión');

    // Envía datos vacíos: el backend debe responder con el error 400 de validación
    async function probarConexion() {
        const resultado = await iniciarSesion('', '');
        setMensaje(`Respuesta del servidor (${resultado.estado}): ${resultado.mensaje}`);
    }

    return (
        <main>
            <h1>Autenticación de usuarios</h1>
            <button onClick={probarConexion}>Probar conexión con el backend</button>
            <p>{mensaje}</p>
        </main>
    );
}

export default App;