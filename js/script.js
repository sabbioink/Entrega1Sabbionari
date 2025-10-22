
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const contenedorProductos = document.getElementById("cards-container");
const contenedorCarrito = document.getElementById("carrito-lista");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");
const btnHistorial = document.getElementById("btn-historial");
const notificaciones = document.getElementById("notificaciones");

function mostrarNotificacion(mensaje) {
    const div = document.createElement("div");
    div.classList.add("notificacion");
    div.textContent = mensaje;
    notificaciones.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function animacionVuelo(img){
    const imgFly = img.cloneNode(true);
    const rect = img.getBoundingClientRect();
    imgFly.style.position = 'fixed';
    imgFly.style.left = `${rect.left}px`;
    imgFly.style.top = `${rect.top}px`;
    imgFly.style.width=`${rect.width}px`;
    imgFly.style.height=`${rect.height}px`;
    imgFly.style.transition="all 1s ease-in-out";
    imgFly.style.zIndex=1000;
    document.body.appendChild(imgFly);

    const carritoRect = contenedorCarrito.getBoundingClientRect();
    setTimeout(()=>{
        imgFly.style.left=`${carritoRect.left}px`;
        imgFly.style.top=`${carritoRect.top}px`;
        imgFly.style.width="30px";
        imgFly.style.height="30px";
        imgFly.style.opacity=0;
    },10);

    setTimeout(()=>imgFly.remove(),1000);
}

function renderizarProductos(productos){
    contenedorProductos.innerHTML="";
    _.forEach(productos,(producto,index)=>{
        const card = document.createElement("div");
        card.classList.add("producto");
        card.innerHTML=`
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString("es-AR")}</p>
            <button id="btn-${index}">Comprar</button>
        `;
        contenedorProductos.appendChild(card);

        const btn = card.querySelector("button");
        btn.addEventListener("click",()=>agregarAlCarrito(producto, card.querySelector("img")));
    });
}

function mostrarCarrito(){
    contenedorCarrito.innerHTML="";
    carrito.forEach((producto,index)=>{
        const li = document.createElement("li");
        li.innerHTML=`
            ${producto.nombre} - $${producto.precio.toLocaleString("es-AR")} x 
            <button class="btn-cant" data-action="menos" data-index="${index}">-</button>
            ${producto.cantidad}
            <button class="btn-cant" data-action="mas" data-index="${index}">+</button>
            = $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}
            <button class="btn-eliminar" data-index="${index}">X</button>
        `;
        contenedorCarrito.appendChild(li);
    });

    document.querySelectorAll(".btn-cant").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            const index = btn.dataset.index;
            if(btn.dataset.action==="mas") carrito[index].cantidad++;
            if(btn.dataset.action==="menos"){
                carrito[index].cantidad--;
                if(carrito[index].cantidad < 1) carrito.splice(index,1);
            }
            localStorage.setItem("carrito",JSON.stringify(carrito));
            mostrarCarrito();
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn=>{
        btn.addEventListener("click", ()=>{
            const index = btn.dataset.index;
            carrito.splice(index,1);
            localStorage.setItem("carrito",JSON.stringify(carrito));
            mostrarCarrito();
        });
    });
}

function agregarAlCarrito(producto, imagen){
    const existe = carrito.find(p => p.id === producto.id);
    if(existe){
        existe.cantidad++;
    } else {
        carrito.push({...producto, cantidad:1});
    }
    localStorage.setItem('carrito',JSON.stringify(carrito));
    mostrarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    animacionVuelo(imagen);
}

btnVaciar.addEventListener("click",()=>{
    if(carrito.length===0){ mostrarNotificacion("El carrito ya está vacío"); return; }

    Swal.fire({
        title:"¿Vaciar carrito?",
        text:"Se eliminarán todos los productos del carrito.",
        icon:"warning",
        showCancelButton:true,
        confirmButtonText:"Sí, vaciar",
        cancelButtonText:"Cancelar"
    }).then(result=>{
        if(result.isConfirmed){
            carrito=[];
            localStorage.removeItem("carrito");
            mostrarCarrito();
            Swal.fire("Carrito vaciado","", "success");
        }
    });
});

const checkoutModal = document.getElementById("checkout-modal");
const formaPagoSelect = document.getElementById("forma-pago");
const datosTransferencia = document.getElementById("datos-transferencia");
const datosTarjeta = document.getElementById("datos-tarjeta");
const btnCancelar = document.getElementById("btn-cancelar");
const formCheckout = document.getElementById("form-checkout");

btnFinalizar.addEventListener("click", ()=>{
    if(carrito.length===0){ 
        mostrarNotificacion("El carrito está vacío"); 
        return; 
    }

    const historial = JSON.parse(localStorage.getItem("historialCompras")) || [];
    if(historial.length > 0){
        const ultimo = historial[historial.length - 1];
        const nombreApellido = ultimo.cliente.split(" ");
        document.getElementById("nombre-usuario").value = nombreApellido[0] || "";
        document.getElementById("apellido-usuario").value = nombreApellido.slice(1).join(" ") || "";
    }

    checkoutModal.classList.remove("hidden");
});

formaPagoSelect.addEventListener("change",()=>{
    const forma = formaPagoSelect.value;
    datosTransferencia.classList.toggle("hidden",forma!=="transferencia");
    datosTarjeta.classList.toggle("hidden",forma!=="tarjeta");
});

btnCancelar.addEventListener("click",()=>{ checkoutModal.classList.add("hidden"); });

formCheckout.addEventListener("submit",(e)=>{
    e.preventDefault();

    const nombre = document.getElementById("nombre-usuario").value.trim();
    const apellido = document.getElementById("apellido-usuario").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const forma = formaPagoSelect.value;

    if(!nombre||!apellido||!localidad||!direccion||!forma){ mostrarNotificacion("Completa todos los campos"); return; }

    let total = carrito.reduce((acc,prod)=>acc+prod.precio*prod.cantidad,0);
    let detallePago = "";

    if(forma==="transferencia"){ detallePago="Transferencia bancaria (Alias: TECNOSTORE123)"; }
    else if(forma==="tarjeta"){
        const numeroTarjeta = document.getElementById("numero-tarjeta").value.trim();
        const cuotas = parseInt(document.getElementById("cuotas").value);
        if(!numeroTarjeta||cuotas<1||cuotas>18){ mostrarNotificacion("Ingresa datos válidos de tarjeta y cuotas"); return; }
        detallePago=`Tarjeta (terminada en ${numeroTarjeta.slice(-4)}) - ${cuotas} cuota(s)`;
    } else { detallePago="Efectivo al recibir el pedido"; }

    const nuevaCompra = {
        cliente:`${nombre} ${apellido}`,
        fecha:new Date().toLocaleString(),
        total,
        formaPago:detallePago,
        productos: _.map(carrito,()=> {p=>`${p.nombre} x${p.cantidad}`})
    };

    const historial = JSON.parse(localStorage.getItem("historialCompras"))||[];
    historial.push(nuevaCompra);
    localStorage.setItem("historialCompras",JSON.stringify(historial));

    Swal.fire({
        title:`¡Gracias por tu compra, ${nombre}!`,
        html:`<p><strong>Total:</strong> $${total.toLocaleString("es-AR")}</p>
            <p><strong>Forma de pago:</strong> ${detallePago}</p>`,
        icon:"success",
        confirmButtonText:"Aceptar",
        showCancelButton:true,
        cancelButtonText:"Ver historial",
    }).then((result)=>{
        if(result.dismiss===Swal.DismissReason.cancel){ mostrarHistorialCompras(); }
    });

    carrito=[];
    localStorage.setItem("carrito",JSON.stringify(carrito));
    mostrarCarrito();
    checkoutModal.classList.add("hidden");
    formCheckout.reset();
    datosTransferencia.classList.add("hidden");
    datosTarjeta.classList.add("hidden");
});

function mostrarHistorialCompras(){
    const historial = JSON.parse(localStorage.getItem("historialCompras"))||[];
    if(historial.length===0){ Swal.fire("Historial vacío","Todavía no hay compras registradas.","info"); return; }

    const contenido = historial.map((c,i)=>`
        <div style="text-align:left; margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:6px;">
            <strong>Compra #${i+1}</strong><br>
            <small>${c.fecha}</small><br>
            Cliente: ${c.cliente}<br>
            Total: $${c.total.toLocaleString("es-AR")}<br>
            Pago: ${c.formaPago}<br>
            Productos: ${c.productos.join(", ")}
        </div>
    `).join("");

    Swal.fire({
        title:"Historial de compras",
        html:`<div style="max-height:300px; overflow:auto;">${contenido}</div>`,
        width:600,
        confirmButtonText:"Cerrar"
    });
}

btnHistorial.addEventListener("click",mostrarHistorialCompras);

fetch("./data/productos.json")
    .then(res=>res.json())
    .then(productos=>renderizarProductos(productos))
    .catch(err=>console.error("Error al cargar productos:",err));

mostrarCarrito();