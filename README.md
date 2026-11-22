# Front-end de autenticación con React

Evidencia GA7-220501096-AA4-EV03 · Componente front-end del proyecto formativo y proyectos de clase.
Aprendiz: Sergio Andrés Ruiz Sanabria · Programa: Análisis y Desarrollo de Software (SENA).

Aplicación web hecha con **React y Vite** que permite **registrar usuarios e iniciar sesión**. Consume el servicio web de la evidencia AA5-EV01 ([`prueba_node_ADSO`](https://github.com/sergioruiz960227-create/prueba_node_ADSO)) sin modificarlo, y corresponde al módulo de autenticación del sistema **Tienda Nueva**: sigue su diseño y parte de sus artefactos (ver [Artefactos](#artefactos)).

## Tecnologías

React 19, Vite 8, React Router 7, JavaScript (JSX), CSS. Revisión de código con oxlint y formato con Prettier.

## Requisitos previos

- Node.js 20.19 o superior (o 22.12 o superior).
- MySQL encendido (se usa el de XAMPP).
- El servicio web `prueba_node_ADSO` instalado y en ejecución en el puerto 3000.

## Instalación y ejecución

La aplicación necesita **tres cosas encendidas al mismo tiempo**: la base de datos, el servicio web y el front-end.

**1. Base de datos y servicio web (una sola vez)**

1. Clonar el servicio web: `git clone https://github.com/sergioruiz960227-create/prueba_node_ADSO.git`
2. Encender MySQL en XAMPP e importar en phpMyAdmin el archivo `.sql` de la carpeta `basededatos`.
3. Dentro de la carpeta del servicio web: copiar `.env.example` como `.env`, y ejecutar `npm install`.

**2. Encender el servicio web** (en una terminal, dentro de `prueba_node_ADSO`)

```bash
npm start
```

Debe mostrar `Servidor escuchando en http://localhost:3000`.

**3. Encender el front-end** (en otra terminal)

```bash
git clone https://github.com/sergioruiz960227-create/frontend_react_ADSO.git
cd frontend_react_ADSO
npm install
npm run dev
```

Abrir en el navegador la dirección que muestra la terminal (normalmente `http://localhost:5173`). **Se abre el front-end, no el puerto 3000.**

### Cómo se conectan

El navegador solo habla con el front-end. Vite reenvía toda petición que empiece por `/api` hacia `http://localhost:3000` (configurado en `vite.config.js`). Así se evita el bloqueo CORS del navegador sin tener que modificar el servicio web.

## Scripts disponibles

| Comando                | Qué hace                                                      |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo                              |
| `npm run build`        | Genera la versión de producción en la carpeta `dist`          |
| `npm run preview`      | Muestra la versión de producción                              |
| `npm run lint`         | Revisa el código con oxlint                                   |
| `npm run format`       | Da formato a todo el código con Prettier                      |
| `npm run format:check` | Comprueba el formato sin modificar archivos                   |
| `npm run verificar`    | Ejecuta `lint` y `format:check` juntos (antes de cada commit) |

## Pantallas

| Ruta        | Pantalla                                          | Acceso                   |
| ----------- | ------------------------------------------------- | ------------------------ |
| `/login`    | Inicio de sesión                                  | Público                  |
| `/registro` | Registro de usuario                               | Público                  |
| `/inicio`   | Pantalla de inicio con el usuario y Cerrar Sesión | Solo con sesión iniciada |

Cualquier otra dirección lleva a `/inicio`, que a su vez redirige al inicio de sesión si no hay sesión.

## Servicios del backend que consume

| Método | Ruta            | Uso en el front-end |
| ------ | --------------- | ------------------- |
| POST   | `/api/register` | Registro de usuario |
| POST   | `/api/login`    | Inicio de sesión    |

Ambos reciben `{ "usuario": "...", "contrasena": "..." }` y responden `{ "ok": true/false, "mensaje": "..." }`. Los códigos y mensajes son los documentados en el README del servicio web (201, 409, 400, 200, 401 y 500). Todas las llamadas están concentradas en `src/servicios/authServicio.js`.

## Estructura del proyecto

```
index.html                         Página base (carga la fuente Poppins y el script principal)
vite.config.js                     Configuración de Vite y proxy hacia el servicio web
.prettierrc / .prettierignore      Reglas de formato
.oxlintrc.json                     Reglas de revisión de código
docs/                              Artefactos: historias de usuario, casos de uso y trazabilidad
src/
  main.jsx                         Punto de entrada: monta la aplicación y el enrutador
  App.jsx                          Define las rutas
  index.css                        Estilos (paleta y diseño de Tienda Nueva)
  componentes/                     Piezas reutilizables de la interfaz
  paginas/                         Pantallas completas
  servicios/                       Comunicación con el backend y manejo de la sesión
```

## Componentes

| Componente           | Función                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `FormularioLogin`    | Formulario de inicio de sesión con validación y envío al backend |
| `FormularioRegistro` | Formulario de registro, con confirmación de la contraseña        |
| `CampoFormulario`    | Etiqueta con su campo de entrada, reutilizada en los formularios |
| `Mensaje`            | Cuadro de error o de éxito                                       |
| `Encabezado`         | Muestra el usuario con sesión iniciada y el botón Cerrar Sesión  |
| `RutaProtegida`      | Redirige al inicio de sesión si no hay sesión iniciada           |

`Encabezado`, `FormularioRegistro` y `RutaProtegida` son componentes definidos en la evidencia AA4-EV02; `FormularioLogin`, `CampoFormulario` y `Mensaje` se agregaron al codificar el módulo.

## Estándares de codificación

- **Formato:** Prettier con 4 espacios, comillas simples, punto y coma, sin comas finales y líneas de hasta 120 caracteres (`.prettierrc`).
- **Revisión de código:** oxlint con reglas que exigen `===`, `let`/`const` en lugar de `var`, no dejar variables sin usar y avisar de `console.log` olvidados (`.oxlintrc.json`).
- **Nombres:** componentes y archivos de componentes en `PascalCase` (`FormularioLogin.jsx`); funciones, variables y archivos de servicios en `camelCase` y en español (`iniciarSesion`, `authServicio.js`); constantes en `MAYUSCULAS_CON_GUION_BAJO` (`CLAVE_SESION`).
- **Comentarios:** cada archivo empieza con un comentario que explica su propósito, y las funciones con lógica llevan su propio comentario, en español.
- **Comprobación:** antes de cada commit se ejecuta `npm run verificar`.

## Versionamiento

El proyecto se desarrolló con Git y se publicó en GitHub. Los commits siguen el estilo de mensajes convencionales (`feat:`, `docs:`, `style:`, `chore:`) para que el historial cuente el avance paso a paso.

## Artefactos

Este módulo parte de los artefactos elaborados para Tienda Nueva y agrega los que le faltaban:

- [Historias de usuario](docs/historias-de-usuario.md): HU13 (registrar usuario) y HU14 (iniciar sesión).
- [Casos de uso](docs/casos-de-uso.md): CU14 (registrar usuario) y CU15 (iniciar sesión), con sus diagramas.
- [Trazabilidad de artefactos](docs/trazabilidad-artefactos.md): de cada artefacto al código, diferencias con el prototipo y pantallas del prototipo.

## Pruebas manuales

Con la base de datos, el servicio web y el front-end encendidos:

| Caso                                  | Pasos                                                          | Resultado esperado                                                        |
| ------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Acceso sin sesión                     | Abrir `/inicio` sin haber iniciado sesión                      | Redirige al inicio de sesión                                              |
| Inicio de sesión con campos vacíos    | Pulsar Iniciar Sesión sin escribir nada                        | Error: "Usuario y contraseña son obligatorios"                            |
| Registro con contraseñas distintas    | Escribir una confirmación diferente y pulsar Registrar Usuario | Error: "Las contraseñas no coinciden"                                     |
| Registro correcto                     | Registrar un usuario nuevo                                     | Lleva al inicio de sesión con el aviso "Usuario registrado correctamente" |
| Registro de un usuario existente      | Registrar de nuevo el mismo usuario                            | Error: "El usuario ya existe"                                             |
| Inicio de sesión con clave incorrecta | Escribir un usuario válido con otra contraseña                 | Error: "Error en la autenticación"                                        |
| Inicio de sesión correcto             | Escribir usuario y contraseña correctos                        | Muestra "Bienvenido" y el encabezado con el usuario                       |
| Cierre de sesión                      | Pulsar Cerrar Sesión y abrir `/inicio`                         | Vuelve al inicio de sesión y `/inicio` queda protegida                    |
| Servicio web apagado                  | Apagar el servicio web e intentar iniciar sesión               | Error: "No se pudo conectar con el servidor"                              |

## Alcance y limitaciones

- Solo se manejan **usuario y contraseña**, que es lo que soporta el servicio web reutilizado. Los campos adicionales del prototipo (nombres, correo, rol) y la recuperación de contraseña corresponden al sistema completo de Tienda Nueva. Detalle en la [trazabilidad](docs/trazabilidad-artefactos.md#3-alcance-y-diferencias-con-el-prototipo).
- El servicio web no entrega un token. La sesión se guarda en el navegador (`sessionStorage`) y solo controla qué pantallas se muestran: **no reemplaza la seguridad del servidor**. Se elimina al cerrar sesión o al cerrar la pestaña.
