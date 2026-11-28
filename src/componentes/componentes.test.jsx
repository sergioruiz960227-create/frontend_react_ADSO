// Pruebas unitarias de los componentes reutilizables
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { guardarSesion } from '../servicios/sesionServicio';
import Badge from './Badge';
import BarraBusqueda from './BarraBusqueda';
import CampoFormulario from './CampoFormulario';
import Encabezado from './Encabezado';
import Mensaje from './Mensaje';
import RutaProtegida from './RutaProtegida';
import Sidebar from './Sidebar';
import TablaDatos from './TablaDatos';
import TarjetaResumen from './TarjetaResumen';

describe('Mensaje', () => {
    it('no muestra nada si no hay texto', () => {
        const { container } = render(<Mensaje tipo="error" texto="" />);
        expect(container).toBeEmptyDOMElement();
    });

    it('un error se anuncia como alerta y muestra su título y su texto', () => {
        render(<Mensaje tipo="error" titulo="Error de prueba" texto="Algo salió mal" />);
        const alerta = screen.getByRole('alert');
        expect(alerta).toHaveTextContent('Error de prueba');
        expect(alerta).toHaveTextContent('Algo salió mal');
        expect(alerta).toHaveClass('mensaje-error');
    });

    it('un mensaje de éxito se anuncia como estado', () => {
        render(<Mensaje tipo="exito" texto="Todo bien" />);
        expect(screen.getByRole('status')).toHaveClass('mensaje-exito');
    });
});

describe('CampoFormulario', () => {
    it('asocia la etiqueta con el campo y avisa cuando se escribe', async () => {
        const alCambiar = vi.fn();
        render(<CampoFormulario id="usuario" etiqueta="Usuario" valor="" onCambio={alCambiar} />);
        await userEvent.type(screen.getByLabelText('Usuario'), 'a');
        expect(alCambiar).toHaveBeenCalledTimes(1);
    });

    it('usa el tipo, el placeholder y la longitud máxima recibidos', () => {
        render(
            <CampoFormulario
                id="clave"
                etiqueta="Clave"
                tipo="password"
                valor=""
                onCambio={() => {}}
                placeholder="Escriba su clave"
                maxLongitud={10}
            />
        );
        const campo = screen.getByLabelText('Clave');
        expect(campo).toHaveAttribute('type', 'password');
        expect(campo).toHaveAttribute('placeholder', 'Escriba su clave');
        expect(campo).toHaveAttribute('maxlength', '10');
    });
});

describe('Badge', () => {
    it('muestra el texto con la clase del tipo recibido', () => {
        render(<Badge texto="Nuevo" tipo="nuevo" />);
        expect(screen.getByText('Nuevo')).toHaveClass('badge', 'badge-nuevo');
    });

    it('si no se indica el tipo, usa el neutro', () => {
        render(<Badge texto="Registrado" />);
        expect(screen.getByText('Registrado')).toHaveClass('badge-neutro');
    });
});

describe('TarjetaResumen', () => {
    it('muestra el título, el valor y el detalle', () => {
        render(<TarjetaResumen icono="👥" titulo="Usuarios totales" valor={5} detalle="al día de hoy" />);
        expect(screen.getByRole('heading', { name: 'Usuarios totales' })).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('al día de hoy')).toBeInTheDocument();
    });

    it('sin detalle, no dibuja el texto del detalle', () => {
        const { container } = render(<TarjetaResumen icono="👥" titulo="Totales" valor={0} />);
        expect(container.querySelector('.tarjeta-detalle')).toBeNull();
    });
});

describe('BarraBusqueda', () => {
    it('avisa con el texto completo cada vez que se escribe', async () => {
        const alBuscar = vi.fn();
        render(<BarraBusqueda onBuscar={alBuscar} />);
        await userEvent.type(screen.getByRole('searchbox'), 'ab');
        expect(alBuscar).toHaveBeenNthCalledWith(1, 'a');
        expect(alBuscar).toHaveBeenNthCalledWith(2, 'ab');
    });

    it('muestra el placeholder recibido', () => {
        render(<BarraBusqueda onBuscar={() => {}} placeholder="Buscar por usuario" />);
        expect(screen.getByPlaceholderText('Buscar por usuario')).toBeInTheDocument();
    });
});

describe('TablaDatos', () => {
    const columnas = [
        { clave: 'id', titulo: 'Código' },
        { clave: 'nombre', titulo: 'Nombre', render: (fila) => fila.nombre.toUpperCase() }
    ];

    it('dibuja los encabezados y una fila por cada elemento', () => {
        render(
            <TablaDatos
                columnas={columnas}
                filas={[
                    { id: 1, nombre: 'ana' },
                    { id: 2, nombre: 'luis' }
                ]}
            />
        );
        expect(screen.getByRole('columnheader', { name: 'Código' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Nombre' })).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(3);
    });

    it('usa la función render para personalizar una celda', () => {
        render(<TablaDatos columnas={columnas} filas={[{ id: 1, nombre: 'ana' }]} />);
        expect(screen.getByRole('cell', { name: 'ANA' })).toBeInTheDocument();
    });

    it('sin filas, muestra el mensaje para tabla vacía', () => {
        render(<TablaDatos columnas={columnas} filas={[]} mensajeVacio="Nada por aquí" />);
        expect(screen.getByText('Nada por aquí')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    it('permite elegir otro campo como identificador de cada fila', () => {
        const columnasCodigo = [{ clave: 'codigo', titulo: 'Código' }];
        render(
            <TablaDatos columnas={columnasCodigo} filas={[{ codigo: 'A1' }, { codigo: 'B2' }]} claveFila="codigo" />
        );
        expect(screen.getByRole('cell', { name: 'B2' })).toBeInTheDocument();
    });
});

describe('Encabezado', () => {
    it('muestra el título y el usuario, y avisa al pulsar los botones', async () => {
        const alCerrar = vi.fn();
        const alMenu = vi.fn();
        render(<Encabezado titulo="Usuarios" usuario="ana" onCerrarSesion={alCerrar} onAlternarMenu={alMenu} />);
        expect(screen.getByRole('heading', { name: 'Usuarios' })).toBeInTheDocument();
        expect(screen.getByText('ana')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }));
        await userEvent.click(screen.getByRole('button', { name: 'Abrir el menú' }));
        expect(alCerrar).toHaveBeenCalledTimes(1);
        expect(alMenu).toHaveBeenCalledTimes(1);
    });
});

describe('Sidebar', () => {
    it('muestra la marca y la opción Usuarios marcada como activa en su ruta', () => {
        render(
            <MemoryRouter initialEntries={['/usuarios']}>
                <Sidebar abierto={false} onCerrar={() => {}} />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading', { name: 'TIENDA NUEVA' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Usuarios/ })).toHaveClass('active');
    });

    it('abierto muestra el fondo oscuro y pulsarlo cierra el menú', async () => {
        const alCerrar = vi.fn();
        const { container } = render(
            <MemoryRouter>
                <Sidebar abierto={true} onCerrar={alCerrar} />
            </MemoryRouter>
        );
        expect(container.querySelector('aside')).toHaveClass('sidebar-abierto');
        await userEvent.click(container.querySelector('.sidebar-fondo'));
        expect(alCerrar).toHaveBeenCalledTimes(1);
    });

    it('cerrado no muestra el fondo oscuro', () => {
        const { container } = render(
            <MemoryRouter>
                <Sidebar abierto={false} onCerrar={() => {}} />
            </MemoryRouter>
        );
        expect(container.querySelector('.sidebar-fondo')).toBeNull();
    });
});

describe('RutaProtegida', () => {
    // Monta una ruta protegida y una pantalla de login para ver a dónde lleva
    function montar() {
        return render(
            <MemoryRouter initialEntries={['/privada']}>
                <Routes>
                    <Route path="/login" element={<p>Pantalla de login</p>} />
                    <Route
                        path="/privada"
                        element={
                            <RutaProtegida>
                                <p>Contenido privado</p>
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
    }

    it('sin sesión, redirige al inicio de sesión', () => {
        montar();
        expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
        expect(screen.queryByText('Contenido privado')).toBeNull();
    });

    it('con sesión, muestra el contenido', () => {
        guardarSesion('ana', 'token');
        montar();
        expect(screen.getByText('Contenido privado')).toBeInTheDocument();
    });
});
