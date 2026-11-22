# Historias de usuario del módulo de autenticación

Este documento complementa las historias de usuario del proyecto **Tienda Nueva** (HU01 a HU12, Fase 1 – Guía 2).
Esas historias describen funciones del negocio (ventas, inventario, créditos, reportes) y suponen que el usuario ya
inició sesión, pero ninguna describe cómo se registra ni cómo ingresa. Aquí se agregan las dos que faltan, con la misma
plantilla ágil y la numeración continuada: **HU13** y **HU14**.

## Plantilla de historia de usuario ágil

| ID   | Tipo de usuario | Quiero                                                                                  | Para que pueda                                            |
| ---- | --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| HU13 | Usuario         | Como usuario quiero registrarme en el sistema con un nombre de usuario y una contraseña | para que pueda contar con una cuenta de acceso al sistema |
| HU14 | Usuario         | Como usuario quiero iniciar sesión con mi usuario y mi contraseña                       | para que pueda acceder al sistema de forma segura         |

## Requerimientos funcionales asociados

Continúan la numeración del proyecto (RF01 a RF13).

| ID   | Requerimiento                                                                               |
| ---- | ------------------------------------------------------------------------------------------- |
| RF14 | El sistema debe permitir registrar usuarios con un nombre de usuario único y una contraseña |
| RF15 | El sistema debe validar el usuario y la contraseña antes de permitir el acceso              |

## Tabla de trazabilidad

| Historia | Requerimiento | Criterios de aceptación                                                                                                                                                                                                                                                                                                                              | Prioridad |
| -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| HU13     | RF14          | El sistema solicita usuario, contraseña y confirmación de la contraseña.<br>El sistema valida que los campos no estén vacíos y que las dos contraseñas coincidan.<br>El sistema no permite registrar un usuario que ya existe.<br>Al registrar, el sistema confirma el registro y lleva al inicio de sesión.                                         | Alta      |
| HU14     | RF15          | El sistema solicita usuario y contraseña.<br>El sistema valida los datos contra los usuarios registrados.<br>Si los datos son correctos, el sistema permite el acceso a la pantalla de inicio.<br>Si son incorrectos, el sistema muestra un mensaje de error y no da acceso.<br>Las pantallas protegidas no se pueden abrir sin una sesión iniciada. | Alta      |

## Relación con los requerimientos no funcionales del proyecto

| Requerimiento                                                                            | Cómo se relaciona con este módulo                                                                                                                                |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RNF01. El sistema debe cifrar datos personales y financieros                             | Se cumple para la contraseña: el servicio web la guarda cifrada con bcrypt y nunca en texto plano.                                                               |
| RNF03. El sistema debe permitir varios roles de usuario con diferentes niveles de acceso | No se cubre en este módulo: el servicio web reutilizado solo maneja usuario y contraseña, sin roles. Los roles hacen parte del sistema completo de Tienda Nueva. |
