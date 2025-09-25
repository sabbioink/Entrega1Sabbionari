const formulario = document.getElementById("form-contacto");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const textareaMensaje = document.getElementById("mensaje");
const contenedorNotificaciones = document.getElementById("notificaciones");

function mostrarNotificacion(mensaje) {
    const div = document.createElement("div");
    div.classList.add("notificacion");
    div.textContent = mensaje;
    contenedorNotificaciones.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const mensaje = textareaMensaje.value.trim();

    if (!nombre || !email || !mensaje) {
        mostrarNotificacion("Por favor completa todos los campos.");
        return;
    }

    const mensajesGuardados = JSON.parse(localStorage.getItem("mensajes")) || [];
    mensajesGuardados.push({ nombre, email, mensaje, fecha: new Date().toLocaleString() });
    localStorage.setItem("mensajes", JSON.stringify(mensajesGuardados));

    mostrarNotificacion("¡Mensaje enviado con exito! Gracias por tu opinion.");
    formulario.reset();
});