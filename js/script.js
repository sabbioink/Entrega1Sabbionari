

const productos = [
    { nombre: "Teclado Mecánico", precio: 25000, img: "https://i.pinimg.com/1200x/c9/04/69/c90469a349d824dc054ceb5c80533071.jpg" },
    { nombre: "Mouse Gamer", precio: 15000, img: "https://i.pinimg.com/736x/45/52/6d/45526dfdc079ae7de2d47c3229079b30.jpg" },
    { nombre: "Monitor 24''", precio: 80000, img: "https://i.pinimg.com/1200x/99/1d/f9/991df9a44feb497c0588608aa4a13d2d.jpg" },
    { nombre: "Placa de video RTX 4060", precio: 350000, img: "https://i.pinimg.com/736x/21/9a/3f/219a3ff56ad25dbb90dcf84c17915092.jpg" },
    { nombre: "Auriculares Inalámbricos", precio: 20000, img: "https://i.pinimg.com/736x/45/05/17/450517cd4ca14eb9d4b01c8864eb6e0b.jpg" }
];


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const contenedorProductos = document.getElementById("cards-container");
const contenedorCarrito = document.getElementById("carrito-lista");
const btnFinalizar = document.getElementById("btn-finalizar");
const notificaciones = document.getElementById("notificaciones");




function mostrarProductos() {
    productos.forEach((producto, index) => {
        const card = document.createElement("div");
        card.classList.add("producto");
        card.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button id="btn-${index}">Comprar</button>
        `;
        contenedorProductos.appendChild(card);



        const btn = document.getElementById(`btn-${index}`);
        btn.addEventListener("click", () => agregarAlCarrito(producto, card.querySelector("img")));
    });
}



function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio}
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


function mostrarNotificacion(mensaje) {
    const div = document.createElement("div");
    div.classList.add("notificacion");
    div.textContent = mensaje;
    notificaciones.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 3000);
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

    setTimeout(() => {
        imgFly.remove();
    }, 1000);
}


btnFinalizar.addEventListener("click", () => {
    if(carrito.length === 0){
        mostrarNotificacion("El carrito está vacío");
        return;
    }
    let total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    mostrarNotificacion(`Compra finalizada. Total: $${total}`);
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
});


mostrarProductos();
mostrarCarrito();