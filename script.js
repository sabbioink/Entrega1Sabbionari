function Producto(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
}


const productos = [
    new Producto("Teclado Mecanico", 25000),
    new Producto("Mouse Gamer", 15000),
    new Producto("Monitor 24''", 80000),
    new Producto("Placa de video RTX 4060", 350000),
    new Producto("Auriculares Inalambricos", 20000),
];

let carrito = [];


function mostrarMenu() {
    let menu = "Productos disponibles en nuestra tienda:\n";
    productos.forEach((prod, i) => {
        menu += `${i + 1}. ${prod.nombre} - $${prod.precio}\n`;
    });
    return parseInt(prompt(menu));
}


function agregarAlCarrito(opcion) {
    carrito.push(productos[opcion - 1]);
    alert(`${productos[opcion - 1].nombre} agregado al carrito`);
}


function mostrarResumen() {
    if (carrito.length === 0) {
        alert("No compraste nada.");
        return;
    }
    let resumen = "Esto/s son los productos que compraste. Gracias por su compra:\n";
    carrito.forEach((prod, i) => {
        resumen += `${i + 1}. ${prod.nombre} - $${prod.precio}\n`;
    });

    let total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    resumen += `\nTotal a pagar: $${total}`;

    alert(resumen);
}

let seguirComprando = true;

while (seguirComprando) {
    let opcion = mostrarMenu();

    if (opcion >= 1 && opcion <= productos.length) {
        agregarAlCarrito(opcion);
    } else {
        alert("Opción inválida, intenta de nuevo.");
        continue;
    }

    let respuesta = prompt("¿Querés seguir comprando? (si / no)").toLowerCase();
    if (respuesta === "no") {
        seguirComprando = false;
    }
}

mostrarResumen();
