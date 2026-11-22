// Formulario de registro de usuarios
// Al registrar con éxito, lleva al inicio de sesión mostrando el mensaje del servidor
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario';
import Mensaje from './Mensaje';
import { registrarUsuario } from '../servicios/authServicio';

function FormularioRegistro() {
    const navegar = useNavigate();

    // Estado: valores escritos, mensaje de error y si hay una petición en curso
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmacion, setConfirmacion] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Se ejecuta al enviar el formulario
    async function enviar(evento) {
        evento.preventDefault(); // Evita que el navegador recargue la página
        setError('');

        // Validaciones en el front-end antes de llamar al backend
        if (usuario.trim() === '' || contrasena === '') {
            setError('Usuario y contraseña son obligatorios');
            return;
        }
        if (contrasena !== confirmacion) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setEnviando(true);
        const resultado = await registrarUsuario(usuario.trim(), contrasena);
        setEnviando(false);

        if (resultado.ok) {
            // Se envía el mensaje del servidor a la pantalla de inicio de sesión
            navegar('/login', { state: { mensaje: resultado.mensaje } });
        } else {
            setError(resultado.mensaje);
        }
    }

    return (
        <form className="formulario" onSubmit={enviar} noValidate>
            <h1>Crear cuenta</h1>
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
                autoComplete="new-password"
            />
            <CampoFormulario
                id="confirmacion"
                etiqueta="Confirmar contraseña"
                tipo="password"
                valor={confirmacion}
                onCambio={(evento) => setConfirmacion(evento.target.value)}
                autoComplete="new-password"
            />
            <button type="submit" disabled={enviando}>
                {enviando ? 'Registrando...' : 'Registrarme'}
            </button>
            <p className="enlace-alterno">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </form>
    );
}

export default FormularioRegistro;