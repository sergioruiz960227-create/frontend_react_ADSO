// Formulario de inicio de sesión
// Props: mensajeInicial (texto opcional, por ejemplo el aviso de registro exitoso)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario';
import Mensaje from './Mensaje';
import { iniciarSesion } from '../servicios/authServicio';
import { guardarSesion } from '../servicios/sesionServicio';

function FormularioLogin({ mensajeInicial }) {
    const navegar = useNavigate();

    // Estado: valores escritos, mensaje de error y si hay una petición en curso
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Se ejecuta al enviar el formulario
    async function enviar(evento) {
        evento.preventDefault(); // Evita que el navegador recargue la página
        setError('');

        // Validación en el front-end antes de llamar al backend
        if (usuario.trim() === '' || contrasena === '') {
            setError('Usuario y contraseña son obligatorios');
            return;
        }

        setEnviando(true);
        const resultado = await iniciarSesion(usuario.trim(), contrasena);
        setEnviando(false);

        if (resultado.ok) {
            guardarSesion(usuario.trim());
            navegar('/inicio');
        } else {
            setError(resultado.mensaje);
        }
    }

    return (
        <form className="formulario" onSubmit={enviar} noValidate>
            <h1>Iniciar sesión</h1>
            <Mensaje tipo="exito" texto={mensajeInicial} />
            <Mensaje tipo="error" texto={error} />
            <CampoFormulario
                id="usuario"
                etiqueta="Usuario"
                valor={usuario}
                onCambio={(evento) => setUsuario(evento.target.value)}
                maxLongitud={50}
                autoComplete="username"
            />
            <CampoFormulario
                id="contrasena"
                etiqueta="Contraseña"
                tipo="password"
                valor={contrasena}
                onCambio={(evento) => setContrasena(evento.target.value)}
                autoComplete="current-password"
            />
            <button type="submit" disabled={enviando}>
                {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
            <p className="enlace-alterno">
                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
        </form>
    );
}

export default FormularioLogin;