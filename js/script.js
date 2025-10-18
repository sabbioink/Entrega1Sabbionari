

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("cards-container");
const contenedorCarrito = document.getElementById("carrito-lista");
const btnFinalizar = document.getElementById("btn-finalizar");
const notificaciones = document.getElementById("notificaciones");



function mostrarNotificacion(mensaje) {
    const div = document.createElement("div");
    div.classList.add("notificacion");
    div.textContent = mensaje;
    notificaciones.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}




function animacionVuelo(img) {
    const imgFly = img.cloneNode(true);
    const rect = img.getBoundingClientRect();

    imgFly.style.position = "fixed";
    imgFly.style.left = `${rect.left}px`;
    imgFly.style.top = `${rect.top}px`;
    imgFly.style.width = `${rect.width}px`;
    imgFly.style.height = `${rect.height}px`;
    imgFly.style.transition = "all 1s ease-in-out";
    imgFly.style.zIndex = 1000;
    document.body.appendChild(imgFly);

    const carritoRect = contenedorCarrito.getBoundingClientRect();
    setTimeout(() => {
        imgFly.style.left = `${carritoRect.left}px`;
        imgFly.style.top = `${carritoRect.top}px`;
        imgFly.style.width = "30px";
        imgFly.style.height = "30px";
        imgFly.style.opacity = 0;
    }, 10);

    setTimeout(() => imgFly.remove(), 1000);
}




function renderizarProductos(productos) {
    contenedorProductos.innerHTML = "";

    productos.forEach((producto, index) => {
        const card = document.createElement("div");
        card.classList.add("producto");
        card.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString("es-AR")}</p>
            <button id="btn-${index}">Comprar</button>
        `;
        contenedorProductos.appendChild(card);

        const btn = card.querySelector("button");
        btn.addEventListener("click", () => {
            agregarAlCarrito(producto, card.querySelector("img"));
        });
    });
}




function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio.toLocaleString("es-AR")}
            <button>X</button>
        `;
        li.querySelector("button").addEventListener("click", () => eliminarDelCarrito(index));
        contenedorCarrito.appendChild(li);
    });
}



function agregarAlCarrito(producto, imagen) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    animacionVuelo(imagen);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    mostrarNotificacion("Producto eliminado del carrito");
}



const checkoutModal = document.getElementById("checkout-modal");
const formaPagoSelect = document.getElementById("forma-pago");
const datosTransferencia = document.getElementById("datos-transferencia");
const datosTarjeta = document.getElementById("datos-tarjeta");
const btnCancelar = document.getElementById("btn-cancelar");
const formCheckout = document.getElementById("form-checkout");



btnFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío");
        return;
    }
    checkoutModal.classList.remove("hidden");
});



formaPagoSelect.addEventListener("change", () => {
    const forma = formaPagoSelect.value;
    datosTransferencia.classList.toggle("hidden", forma !== "transferencia");
    datosTarjeta.classList.toggle("hidden", forma !== "tarjeta");
});



btnCancelar.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
});



formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre-usuario").value.trim();
    const apellido = document.getElementById("apellido-usuario").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const forma = formaPagoSelect.value;

    if (!nombre || !apellido || !localidad || !direccion || !forma) {
        mostrarNotificacion("Completa todos los campos");
        return;
    }

    let total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    let detallePago = "";

    if (forma === "transferencia") {
        detallePago = "Transferencia bancaria (Alias: tienda.gamer / CBU: 1234567890123456789012)";
    } else if (forma === "tarjeta") {
        const numeroTarjeta = document.getElementById("numero-tarjeta").value.trim();
        const cuotas = parseInt(document.getElementById("cuotas").value);
        if (!numeroTarjeta || cuotas < 1 || cuotas > 18) {
            mostrarNotificacion("Ingresa datos válidos de tarjeta y cuotas");
            return;
        }
        detallePago = `Tarjeta (terminada en ${numeroTarjeta.slice(-4)}), ${cuotas} cuota(s) sin interés`;
    } else {
        detallePago = "Efectivo al recibir el pedido";
    }



    const mensajeFinal = document.createElement("div");
    mensajeFinal.classList.add("mensaje-final");
    mensajeFinal.innerHTML = `
        <h2>¡Gracias por tu compra, ${nombre} ${apellido}! 🎉</h2>
        <p><strong>Total:</strong> $${total.toLocaleString("es-AR")}</p>
        <p><strong>Localidad:</strong> ${localidad}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Forma de pago:</strong> ${detallePago}</p>
        <p>Tu pedido será procesado en las próximas 24 horas.</p>
    `;
    document.body.appendChild(mensajeFinal);

    setTimeout(() => mensajeFinal.remove(), 8000); // se quita tras 8 seg


    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    checkoutModal.classList.add("hidden");
    formCheckout.reset();
    datosTransferencia.classList.add("hidden");
    datosTarjeta.classList.add("hidden");
});


fetch("./data/productos.json")
    .then(response => response.json())
    .then(productos => renderizarProductos(productos))
    .catch(err => console.error("Error al cargar productos:", err));


    
mostrarCarrito();