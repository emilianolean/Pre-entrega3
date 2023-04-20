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

class ProductoController{
    constructor(){
        this.listaProductos = []
    }

    levantarProductos(){
        this.listaProductos = [
            new Producto(1, "Remera gris", 6000, 10, "./assets/img/remera-hombre.jpeg", "remera overside"),
            new Producto(2, "Remera blanca", 6000, 10, "./assets/img/remera-hombre2.jpeg", "remera overside2"),
            new Producto(3, "Remera marron", 6000, 10, "./assets/img/remera-hombre3.jpeg", "remera overside3")
        ]
    }

    mostrarEnDOM(contenedor_productos){
        //Mostramos los productos en DOM
    this.listaProductos.forEach(producto => {
        contenedor_productos.innerHTML += `
        <div class="card" style="width: 14rem;">
            <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Precio: $${producto.precio}</p>
                <a href="#" id="cpu-${producto.id}" class="btn btn-primary">Añadir al carrito</a>
            </div>
        </div>`
})
    }
}


const controladorProductos = new ProductoController()
controladorProductos.levantarProductos()


let listaCarrito;


//DOM
const contenedor_productos = document.getElementById("contenedor_productos")
const contenedor_carrito = document.getElementById("contenedor_carrito")

//Verifico si existe listaCarrito en DOM
if (localStorage.getItem("listaCarrito")){
    let listaCarritoJSON = localStorage.getItem("listaCarrito")
    listaCarrito = JSON.parse(listaCarritoJSON)

    //mostrar en DOM
    listaCarrito.forEach(producto => {
        contenedor_carrito.innerHTML +=
        `<div class="card mb-3" style="max-width: 300px;">
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
}else{
    listaCarrito = []
}

controladorProductos.mostrarEnDOM(contenedor_productos)

//Eventos
controladorProductos.listaProductos.forEach(producto => {
    const btnAP = document.getElementById(`cpu-${producto.id}`)
    btnAP.addEventListener("click", () => {

        //Añadir al carrito
        listaCarrito.push(producto)

        //convertir Objeto a JSON
        let listaCarritoJSON = JSON.stringify(listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)

        //limpiar el contenedor para que no se repitan los productos
        contenedor_carrito.innerHTML = ""
        listaCarrito.forEach(producto => {
            contenedor_carrito.innerHTML +=
            `<div class="card mb-3" style="max-width: 300px;">
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
    })
})
