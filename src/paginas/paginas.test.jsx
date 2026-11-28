// Pruebas unitarias de las pantallas completas, con un servidor falso en lugar del backend real
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { crearServidorFalso } from '../pruebas/servidorFalso';
import { obtenerSesion } from '../servicios/sesionServicio';

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const ahora = new Date();
const haceDias = (dias) => new Date(ahora.getTime() - dias * MS_POR_DIA).toISOString();

// Cuatro usuarios: dos registrados ahora, uno hace 3 días y uno hace 20 días
const USUARIOS = [
    { id: 1, usuario: 'antiguo', fecha_registro: haceDias(20) },
    { id: 2, usuario: 'reciente', fecha_registro: haceDias(3) },
    { id: 3, usuario: 'hoy_uno', fecha_registro: haceDias(0) },
    { id: 4, usuario: 'hoy_dos', fecha_registro: haceDias(0) }
];

// Muestra la aplicación empezando en la ruta indicada
function abrir(ruta) {
    return render(
        <MemoryRouter initialEntries={[ruta]}>
            <App />
        </MemoryRouter>
    );
}

// Devuelve la tarjeta de resumen que tiene el título indicado
const tarjeta = (titulo) => screen.getByRole('heading', { name: titulo }).closest('article');

// Escribe usuario y contraseña en el formulario de inicio de sesión y pulsa Iniciar Sesión
async function iniciarSesionEnPantalla(usuario, contrasena) {
    await userEvent.type(screen.getByLabelText('Usuario'), usuario);
    await userEvent.type(screen.getByLabelText('Contraseña'), contrasena);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
}

describe('pantalla de inicio de sesión', () => {
    it('muestra el título, el subtítulo y el enlace al registro', () => {
        abrir('/login');
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
        expect(screen.getByText('Sistema de Gestión Comercial')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Registrar Usuario' })).toBeInTheDocument();
    });

    it('con los campos vacíos muestra el error sin llamar al servidor', async () => {
        const servidor = crearServidorFalso(USUARIOS).instalar();
        abrir('/login');
        await userEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
        const alerta = screen.getByRole('alert');
        expect(alerta).toHaveTextContent('Error de inicio de sesión');
        expect(alerta).toHaveTextContent('Usuario y contraseña son obligatorios');
        expect(servidor.peticiones).toHaveLength(0);
    });

    it('con una contraseña incorrecta muestra el error del servidor y no guarda sesión', async () => {
        crearServidorFalso(USUARIOS).instalar();
        abrir('/login');
        await iniciarSesionEnPantalla('antiguo', 'incorrecta');
        expect(await screen.findByRole('alert')).toHaveTextContent('Error en la autenticación');
        expect(obtenerSesion()).toBeNull();
    });

    it('con datos correctos guarda la sesión y abre la pantalla de usuarios', async () => {
        crearServidorFalso(USUARIOS).instalar();
        abrir('/login');
        await iniciarSesionEnPantalla('antiguo', 'Clave123');
        expect(await screen.findByRole('heading', { name: 'Usuarios', level: 1 })).toBeInTheDocument();
        const sesion = obtenerSesion();
        expect(sesion.usuario).toBe('antiguo');
        expect(sesion.token).toBeTruthy();
    });

    it('con el backend apagado muestra el mensaje de conexión', async () => {
        crearServidorFalso(USUARIOS).instalar().apagar();
        abrir('/login');
        await iniciarSesionEnPantalla('antiguo', 'Clave123');
        expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar con el servidor');
    });

    it('el enlace de registro lleva a la pantalla de registro y de vuelta', async () => {
        abrir('/login');
        await userEvent.click(screen.getByRole('link', { name: 'Registrar Usuario' }));
        expect(screen.getByRole('heading', { name: 'Registro de Usuario' })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('link', { name: 'Volver al inicio de sesión' }));
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
    });
});

describe('pantalla de registro', () => {
    async function llenarRegistro(usuario, contrasena, confirmacion) {
        await userEvent.type(screen.getByLabelText('Usuario'), usuario);
        await userEvent.type(screen.getByLabelText('Contraseña'), contrasena);
        await userEvent.type(screen.getByLabelText('Confirmar contraseña'), confirmacion);
        await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));
    }

    it('con los campos vacíos muestra el error de registro', async () => {
        abrir('/registro');
        await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));
        const alerta = screen.getByRole('alert');
        expect(alerta).toHaveTextContent('Error de registro');
        expect(alerta).toHaveTextContent('Usuario y contraseña son obligatorios');
    });

    it('si las contraseñas no coinciden, lo avisa sin llamar al servidor', async () => {
        const servidor = crearServidorFalso().instalar();
        abrir('/registro');
        await llenarRegistro('nuevo', 'Clave123', 'Otra123');
        expect(screen.getByRole('alert')).toHaveTextContent('Las contraseñas no coinciden');
        expect(servidor.peticiones).toHaveLength(0);
    });

    it('si el usuario ya existe, muestra el error del servidor', async () => {
        crearServidorFalso(USUARIOS).instalar();
        abrir('/registro');
        await llenarRegistro('antiguo', 'Clave123', 'Clave123');
        expect(await screen.findByRole('alert')).toHaveTextContent('El usuario ya existe');
    });

    it('al registrar con éxito lleva al login con el aviso de registro exitoso', async () => {
        const servidor = crearServidorFalso().instalar();
        abrir('/registro');
        await llenarRegistro('nuevo', 'Clave123', 'Clave123');
        expect(await screen.findByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
        const aviso = screen.getByRole('status');
        expect(aviso).toHaveTextContent('Registro exitoso');
        expect(aviso).toHaveTextContent('Usuario registrado correctamente');
        expect(servidor.usuarios.map((usuario) => usuario.usuario)).toContain('nuevo');
    });

    it('el aviso del registro desaparece si el siguiente intento de login falla', async () => {
        crearServidorFalso().instalar();
        abrir('/registro');
        await llenarRegistro('nuevo', 'Clave123', 'Clave123');
        await screen.findByRole('status');
        await iniciarSesionEnPantalla('nuevo', 'incorrecta');
        expect(await screen.findByRole('alert')).toBeInTheDocument();
        expect(screen.queryByRole('status')).toBeNull();
    });
});

describe('pantalla de usuarios', () => {
    // Inicia sesión como el usuario "antiguo" a través del servidor falso y abre la pantalla de usuarios
    async function entrar(servidor) {
        abrir('/login');
        await iniciarSesionEnPantalla('antiguo', 'Clave123');
        await screen.findByRole('heading', { name: 'Usuarios', level: 1 });
        await screen.findByText('hoy_dos', { selector: 'td' });
        return servidor;
    }

    it('muestra las tarjetas calculadas con los usuarios del servidor', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        expect(within(tarjeta('Usuarios totales')).getByText('4')).toBeInTheDocument();
        expect(within(tarjeta('Registrados hoy')).getByText('2')).toBeInTheDocument();
        expect(within(tarjeta('Últimos 7 días')).getByText('3')).toBeInTheDocument();
        // Empatan dos usuarios de hoy: el último es el de código mayor
        expect(within(tarjeta('Último registro')).getByText('hoy_dos')).toBeInTheDocument();
    });

    it('muestra una fila por usuario y la etiqueta según la antigüedad', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        expect(screen.getAllByRole('row')).toHaveLength(5);
        expect(screen.getAllByText('Nuevo')).toHaveLength(3);
        expect(screen.getAllByText('Registrado')).toHaveLength(1);
        expect(screen.getByText('Mostrando 4 de 4 usuarios')).toBeInTheDocument();
    });

    it('muestra el menú lateral y el usuario con sesión iniciada en el encabezado', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Usuarios/ })).toHaveClass('active');
        expect(screen.getByText('Usuario:').parentElement).toHaveTextContent('antiguo');
    });

    it('el buscador filtra la tabla por nombre de usuario', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        await userEvent.type(screen.getByRole('searchbox'), 'hoy');
        expect(screen.getByText('Mostrando 2 de 4 usuarios')).toBeInTheDocument();
        expect(screen.queryByText('antiguo', { selector: 'td' })).toBeNull();
    });

    it('el buscador también filtra por código', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        await userEvent.type(screen.getByRole('searchbox'), '2');
        expect(screen.getByText('Mostrando 1 de 4 usuarios')).toBeInTheDocument();
        expect(screen.getByText('reciente', { selector: 'td' })).toBeInTheDocument();
    });

    it('si nada coincide con la búsqueda, lo avisa', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        await userEvent.type(screen.getByRole('searchbox'), 'zzz');
        expect(screen.getByText('Ningún usuario coincide con la búsqueda')).toBeInTheDocument();
        expect(screen.getByText('Mostrando 0 de 4 usuarios')).toBeInTheDocument();
    });

    it('con un token vencido vuelve al login con el aviso de sesión expirada', async () => {
        const servidor = crearServidorFalso(USUARIOS).instalar();
        const primera = abrir('/login');
        await iniciarSesionEnPantalla('antiguo', 'Clave123');
        servidor.vencerTokens();
        // Se vuelve a abrir la pantalla de usuarios con la sesión que ya no sirve
        primera.unmount();
        abrir('/usuarios');
        const aviso = await screen.findByText('Sesión expirada');
        expect(aviso.closest('[role="alert"]')).toHaveTextContent('Tu sesión terminó. Inicia sesión nuevamente');
        expect(obtenerSesion()).toBeNull();
    });

    it('con el backend apagado muestra el error y las tarjetas sin datos', async () => {
        const servidor = crearServidorFalso(USUARIOS).instalar();
        const primera = abrir('/login');
        await iniciarSesionEnPantalla('antiguo', 'Clave123');
        await screen.findByRole('heading', { name: 'Usuarios', level: 1 });
        servidor.apagar();
        primera.unmount();
        abrir('/usuarios');
        const alertas = await screen.findAllByRole('alert');
        expect(alertas.some((alerta) => alerta.textContent.includes('No se pudo cargar la lista de usuarios'))).toBe(
            true
        );
        expect(within(tarjeta('Usuarios totales')).getByText('—')).toBeInTheDocument();
    });

    it('Cerrar Sesión elimina la sesión y vuelve al login', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        await userEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }));
        expect(await screen.findByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
        expect(obtenerSesion()).toBeNull();
    });

    it('el botón del menú abre y cierra el menú lateral', async () => {
        await entrar(crearServidorFalso(USUARIOS).instalar());
        const menu = document.querySelector('aside.sidebar');
        expect(menu).not.toHaveClass('sidebar-abierto');
        await userEvent.click(screen.getByRole('button', { name: 'Abrir el menú' }));
        expect(menu).toHaveClass('sidebar-abierto');
        await userEvent.click(document.querySelector('.sidebar-fondo'));
        expect(menu).not.toHaveClass('sidebar-abierto');
    });

    it('sin usuarios registrados muestra el mensaje de tabla vacía y las tarjetas en cero', async () => {
        const servidor = crearServidorFalso([{ id: 1, usuario: 'unico', fecha_registro: haceDias(30) }]).instalar();
        const primera = abrir('/login');
        await iniciarSesionEnPantalla('unico', 'Clave123');
        await screen.findByText('unico', { selector: 'td' });
        servidor.usuarios.length = 0;
        primera.unmount();
        abrir('/usuarios');
        expect(await screen.findByText('Aún no hay usuarios registrados')).toBeInTheDocument();
        expect(within(tarjeta('Usuarios totales')).getByText('0')).toBeInTheDocument();
        expect(within(tarjeta('Último registro')).getByText('Sin registros')).toBeInTheDocument();
    });
});

describe('rutas', () => {
    it('/usuarios sin sesión lleva al login', () => {
        abrir('/usuarios');
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Usuarios', level: 1 })).toBeNull();
    });

    it('una ruta desconocida sin sesión lleva al login', () => {
        abrir('/lo-que-sea');
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
    });

    it('una sesión antigua sin token no abre la pantalla de usuarios', () => {
        sessionStorage.setItem('sesionUsuario', JSON.stringify({ usuario: 'ana' }));
        abrir('/usuarios');
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
    });
});
