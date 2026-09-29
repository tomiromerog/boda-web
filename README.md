# Valentina y Tomás

Invitación estática de casamiento basada en https://valeromeroherrera.wixsite.com/boda.

## Vista previa

Abrir `index.html` en un navegador o, desde esta carpeta, ejecutar `python3 -m http.server 8080` y visitar http://localhost:8080.

## GitHub Pages

1. Crear un repositorio y subir `index.html`, `styles.css`, `.nojekyll` y la carpeta `assets`.
2. En **Settings → Pages**, elegir **Deploy from a branch**.
3. Seleccionar la rama **main** y la carpeta **/(root)**, y guardar.

Los recursos usan rutas relativas, por lo que también funcionan cuando el sitio se publica dentro de la ruta de un repositorio. No hay instalación de dependencias ni comando de build.

## Otro hosting

Subir los mismos archivos al directorio público del hosting. La página de entrada es `index.html` y todos los recursos visuales están en `assets`.

## Edición

Los textos, los enlaces de Google Maps y Google Forms y los datos de las cuentas están en `index.html`. Los estilos están en `styles.css`.

Se conserva el corte responsive de la referencia, en 1023 px: cambia la posición y el tamaño de la flor, la presentación de R.S.V.P. y la disposición de los datos bancarios.

El HTML original contiene datos bancarios de ejemplo en una sección oculta en móvil. Esta versión utiliza las cuentas de Banco Macro que aparecen en la versión de escritorio y en el pie móvil.

## Alcance de la revisión

Se analizaron el HTML, los estilos, los recursos y los enlaces publicados por Wix para escritorio y móvil. Falta comparar visualmente ambas versiones en un navegador: los permisos de control de Chrome no estaban disponibles durante la creación.

La carpeta `reference` contiene el material de consulta y queda excluida de Git y del ZIP de publicación.
