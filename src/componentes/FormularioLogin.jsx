// Formulario de inicio de sesión (mismo diseño que la pantalla de login de Tienda Nueva)
// Props: aviso (opcional): { tipo, titulo, texto }, por ejemplo el aviso de registro exitoso o de sesión vencida
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario';
import Mensaje from './Mensaje';
import { iniciarSesion } from '../servicios/authServicio';
import { guardarSesion } from '../servicios/sesionServicio';

function FormularioLogin({ aviso }) {
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
            guardarSesion(resultado.usuario.usuario, resultado.token);
            navegar('/usuarios');
        } else {
            setError(resultado.mensaje);
        }
    }

    return (
        <section className="login-card">
            <h1>TIENDA NUEVA</h1>
            <p className="subtitulo">Sistema de Gestión Comercial</p>
            {aviso && !error && <Mensaje tipo={aviso.tipo} titulo={aviso.titulo} texto={aviso.texto} />}
            <Mensaje tipo="error" titulo="Error de inicio de sesión" texto={error} />
            <form onSubmit={enviar} noValidate>
                <CampoFormulario
                    id="usuario"
                    etiqueta="Usuario"
                    valor={usuario}
                    onCambio={(evento) => setUsuario(evento.target.value)}
                    placeholder="Ingrese su usuario"
                    maxLongitud={50}
                    autoComplete="username"
                />
                <CampoFormulario
                    id="contrasena"
                    etiqueta="Contraseña"
                    tipo="password"
                    valor={contrasena}
                    onCambio={(evento) => setContrasena(evento.target.value)}
                    placeholder="Ingrese su contraseña"
                    autoComplete="current-password"
                />
                <button type="submit" disabled={enviando}>
                    {enviando ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>
            <div className="links">
                <Link to="/registro">Registrar Usuario</Link>
            </div>
        </section>
    );
}

export default FormularioLogin;
