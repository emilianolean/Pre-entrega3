class Producto {
    constructor(id, nombre, precio, stock, img, alt) {
        this.id = id
        this.nombre = nombre
        this.cantidad = 1
        this.precio = precio
        this.stock = stock
        this.img = img
        this.alt = alt
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    async levantar_y_mostrar(controladorCarrito){
        const resp = await fetch("/www.tiendaropa.json")
        this.listaProductos = await resp.json()

        this.mostrarEnDOM()
        this.darEventosClickAProductos(controladorCarrito)
    }


    levantarProductos() {
        this.listaProductos = [
            new Producto(1, "Remera gris", 6000, 10, "./assets/img/remera-hombre.jpeg", "remera overside"),
            new Producto(2, "Remera blanca", 6000, 10, "./assets/img/remera-hombre2.jpeg", "remera overside2"),
            new Producto(3, "Remera marron", 6000, 10, "./assets/img/remera-hombre3.jpeg", "remera overside3")
        ]
    }

    mostrarEnDOM(){
        //Mostramos los productos en DOM
        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML += `
        <div class="card" style="width: 18rem;">
            <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio}</p>
                <a href="#" id="cpu-${producto.id}" class="btn btn-primary">Añadir al carrito</a>
            </div>
        </div>`
        })
    }

    darEventosClickAProductos(controladorCarrito){
        this.listaProductos.forEach(producto => {
            const btnAP = document.getElementById(`cpu-${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.agregar(producto)
                controladorCarrito.guardarEnStorage()
                //TODO: que solo anada 1 producto al DOM. que no recorra toda la lista.
                controladorCarrito.mostrarEnDOM(contenedor_carrito)

                Toastify({
                    text: `${producto.nombre} añadido!`,
                    duration: 3000,
                    gravity: "bottom", 
                    position: "right", 
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            })
        })
    }
}

class CarritoController {
    constructor() {
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
        this.total = document.getElementById("total")
    }

    verificarSiExisteElProducto(producto){
        return this.listaCarrito.find((elproducto)=>elproducto.id == producto.id)
    }

    agregar(producto) {
        let objeto = this.verificarSiExisteElProducto(producto)

        if( objeto ){
            objeto.cantidad += 1;
        }else{{
            this.listaCarrito.push(producto)
        }}
    }

    limpiarCarritoEnStorage(){
        localStorage.removeItem("listaCarrito")
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    verificarExistenciaEnStorage(){
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDOM()
        }
    }

    limpiarContenedor_Carrito() {
        //limpiar el contenedor para que no se repitan los productos
        this.contenedor_carrito.innerHTML = ""
    }

    mostrarEnDOM(){
        this.limpiarContenedor_Carrito()
        this.listaCarrito.forEach(producto => {
            this.contenedor_carrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 400px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                        </div>
                    </div>
                </div>
            </div>`
        })

        this.mostrarTotalEnDOM()
    }

    calcularTotal(){
        let total = 0;

        this.listaCarrito.forEach(producto => {
            total += producto.precio * producto.cantidad
        })

        return total;
    }

    mostrarTotalEnDOM(){
        this.total.innerHTML = this.calcularTotal()
    }
}

//Controllers
const controladorProductos = new ProductoController()
const controladorCarrito = new CarritoController()

controladorProductos.levantar_y_mostrar(controladorCarrito)
//Storage y Dom
controladorCarrito.verificarExistenciaEnStorage()


//DOM
controladorProductos.mostrarEnDOM()


//Eventos
controladorProductos.darEventosClickAProductos(controladorCarrito)

const finalizar_compra = document.getElementById("finalizar_compra")


finalizar_compra.addEventListener("click",()=>{
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra finalizada!',
        showConfirmButton: false,
        timer: 2000
    })

    //En DOM
    controladorCarrito.limpiarContenedor_Carrito()
    //En LocalStorage
    controladorCarrito.limpiarCarritoEnStorage()
    //En listaCarrito
    controladorCarrito.listaCarrito = []

    controladorCarrito.mostrarTotalEnDOM()
})
