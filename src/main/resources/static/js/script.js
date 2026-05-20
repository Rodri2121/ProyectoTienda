

// EL CARRITO
let carrito = [];

// Renderizar productos en el HTML principal
function renderizarProductos(lista) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    lista.forEach(p => {
        const div = document.createElement('div');
        div.className = 'col-md-4';
        div.innerHTML = `
            <div class="card h-100 product-card shadow-sm">
                <img src="imagen/${p.imagen}" class="card-img-top product-img" alt="${p.nombre}">
                <div class="card-body text-center">
                    <span class="badge bg-info text-dark mb-2">${p.categoria.nombre}</span>
                    
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="text-primary fw-bold">C$ ${p.precio.toFixed(2)}</p>
                    <button class="btn btn-outline-primary" onclick="verDetalle(${p.id})">Ver detalle</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Filtro de categorías
function filtrarProductos(cat) {
    document.querySelectorAll('.btn-outline-primary').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (cat === 'Todos') renderizarProductos(productos);
    else renderizarProductos(productos.filter(p => p.categoria.nombre === cat));
}


// Modal de detalles
function verDetalle(id) {
    const p = productos.find(prod => prod.id === id);
    document.getElementById('modalTitulo').innerText = p.nombre;
    document.getElementById('modalImagen').src = `imagen/${p.imagen}`;
    document.getElementById('modalDescripcion').innerText = p.descripcion;
    document.getElementById('modalPrecio').innerText = `C$ ${p.precio.toFixed(2)}`;
    
    // Al hacer clic en agregar, llamamos a la nueva función
    document.getElementById('btnModalAgregar').onclick = () => {
        agregarAlCarrito(p);
        bootstrap.Modal.getInstance(document.getElementById('productoModal')).hide();
        new bootstrap.Toast(document.getElementById('cartToast')).show();
    };

    new bootstrap.Modal(document.getElementById('productoModal')).show();
}
/** Renderizar botones de categoría dinámicamente
function renderizarCategorias(listaProductos) {
    const contenedor = document.getElementById('categoria-container');

    // El botón "Todos" siempre va por defecto
    contenedor.innerHTML = '<button class="btn btn-outline-primary active" onclick="filtrarProductos(\'Todos\')">Todos</button>';

    // Extraer las categorías únicas de los productos que vinieron de la BD
    const categoriasUnicas = [...new Set(listaProductos.map(p => p.categoria.nombre))];

    // Crear un botón por cada categoría encontrada
    categoriasUnicas.forEach(cat => {
        contenedor.innerHTML += `<button class="btn btn-outline-primary" onclick="filtrarProductos('${cat}')">${cat}</button>`;
    });
}
    **/

// LÓGICA DEL CARRITO

function agregarAlCarrito(producto) {
    // Verificamos si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad++; // Si ya está, sumamos 1 a la cantidad
    } else {
        carrito.push({ ...producto, cantidad: 1 }); // Si no, lo agregamos como nuevo
    }
    
    actualizarCarritoDOM();
}

function actualizarCarritoDOM() {
    const contenedorItems = document.getElementById('carrito-items');
    const totalPrecio = document.getElementById('carrito-total');
    const contadorBadge = document.getElementById('cart-counter');

    // Actualizar el número rojo de la bolita
    const totalArticulos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorBadge.innerText = totalArticulos;

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="text-muted text-center mt-4">Tu carrito está vacío.</p>';
        totalPrecio.innerText = 'C$ 0.00';
        return;
    }

    // Dibujar los items del carrito
    contenedorItems.innerHTML = '';
    let totalCosto = 0;

    carrito.forEach((item, index) => {
        totalCosto += (item.precio * item.cantidad);
        
        contenedorItems.innerHTML += `
            <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                <img src="imagen/${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover;" class="rounded me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0 text-truncate" style="max-width: 150px; font-size: 0.95rem;">${item.nombre}</h6>
                    <small class="text-muted">Cant: ${item.cantidad} x C$${item.precio.toFixed(2)}</small>
                </div>
                <div class="text-end me-3 fw-bold">
                    C$${(item.precio * item.cantidad).toFixed(2)}
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminarItem(${index})" title="Eliminar">
                    ✖
                </button>
            </div>
        `;
    });

    // Actualizar el costo total
    totalPrecio.innerText = `C$ ${totalCosto.toFixed(2)}`;
}

// Función para eliminar un producto del panel lateral
function eliminarItem(index) {
    carrito.splice(index, 1); // Quita el elemento del arreglo
    actualizarCarritoDOM();   // Vuelve a dibujar el panel
}
// Función para cerrar carrito, bajar al formulario y preparar el teclado
function enfocarFormulario() {
    
    const panelCarrito = document.getElementById('carritoOffcanvas');
    const carritoInstancia = bootstrap.Offcanvas.getInstance(panelCarrito);
    if (carritoInstancia) {
        carritoInstancia.hide();
    }

    
    setTimeout(() => {
        
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        
        
        document.getElementById('clienteNombre').focus(); 
    }, 400);
}
// FIN LÓGICA

// Validación de formulario
// Validación y Envío Real de Formulario al Backend
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;

    // Verificar que los campos requeridos estén llenos
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    // Verificar que haya cosas en el carrito antes de enviar
    if (carrito.length === 0) {
        alert('Debes agregar al menos un producto al carrito antes de solicitar tu pedido.');
        return;
    }


    const datosPedido = {
        nombreCliente: document.getElementById('clienteNombre').value,
        correo: document.getElementById('clienteCorreo').value,
        comentario: document.getElementById('direccionComentario').value,
        items: carrito.map(item => ({
            id: item.id,
            cantidad: item.amount || item.cantidad // Mapea el ID y la cantidad del producto
        }))
    };


    fetch('/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPedido)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            // Pedido finalizado
            alert(`¡Pedido realizado con éxito!\nCódigo de Pedido: N° ${data.id}\nCliente: ${data.nombreCliente}\nTotal: C$ ${data.total.toFixed(2)}`);

            // Limpiar todo el estado de la interfaz
            form.reset();
            form.classList.remove('was-validated');
            carrito = [];
            actualizarCarritoDOM();
        })
        .catch(error => {
            // Manejar errores (como falta de stock)
            alert('Hubo un inconveniente con tu orden: ' + error.message);
        });
});

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {

    renderizarProductos(productos);  // genera las tarjetas
});