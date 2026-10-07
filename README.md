# Valentina y Tomás

Invitación estática de casamiento basada en https://valeromeroherrera.wixsite.com/boda.

## Vista previa

Abrir `index.html` en un navegador o, desde esta carpeta, ejecutar `python3 -m http.server 8080` y visitar http://localhost:8080.

## GitHub Pages

1. Crear un repositorio y subir `index.html`, `styles.css`, `rsvp.js`, `.nojekyll` y la carpeta `assets`.
2. En **Settings → Pages**, elegir **Deploy from a branch**.
3. Seleccionar la rama **main** y la carpeta **/(root)**, y guardar.

Los recursos usan rutas relativas, por lo que también funcionan cuando el sitio se publica dentro de la ruta de un repositorio. No hay instalación de dependencias ni comando de build.

## Otro hosting

Subir los mismos archivos al directorio público del hosting. La página de entrada es `index.html` y todos los recursos visuales están en `assets`.

## Edición

Los textos, los enlaces de Google Maps y Google Forms y los datos de las cuentas están en `index.html`. Los estilos están en `styles.css`.

## Formulario RSVP

El formulario se abre dentro de la invitación y cada envío corresponde a una persona. `rsvp.js` valida los campos, controla la restricción adicional y evita envíos simultáneos.

El destino de guardado todavía está pendiente de definir. Para conectar una API compatible, configurar `data-endpoint` en `#rsvp-form`. El cliente envía un POST JSON con exactamente `nombre`, `apellido`, `asiste` (booleano), `restriccion_alimentaria` y `restriccion_otro`.

La API debe validar los mismos requisitos en el servidor, guardar la respuesta y devolver HTTP 2xx con `{"ok": true}` únicamente después del guardado. Si está en otro dominio, debe permitir mediante CORS el origen del sitio y las cabeceras `Content-Type` y `Accept`. Las credenciales privadas deben permanecer en el servidor.

La confirmación se muestra solamente ante esa respuesta. Con el destino vacío o ante un error, el formulario conserva los datos y muestra un mensaje discreto; no se presenta un guardado ficticio en el navegador.

Se conserva el corte responsive de la referencia, en 1023 px: cambia la posición y el tamaño de la flor, la presentación de R.S.V.P. y la disposición de los datos bancarios.

El HTML original contiene datos bancarios de ejemplo en una sección oculta en móvil. Esta versión utiliza las cuentas de Banco Macro que aparecen en la versión de escritorio y en el pie móvil.

## Alcance de la revisión

Se analizaron el HTML, los estilos, los recursos y los enlaces publicados por Wix para escritorio y móvil. Falta comparar visualmente ambas versiones en un navegador: los permisos de control de Chrome no estaban disponibles durante la creación.

La carpeta `reference` contiene el material de consulta y queda excluida de Git y del ZIP de publicación.

La ruta `fiesta/` publica la invitación de la fiesta en `/fiesta/`, con la ilustración de brindis y el formulario de confirmación.
