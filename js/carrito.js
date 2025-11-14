/* ==========================================================
   CARRITO.JS - SISTEMA DE CARRITO DE COMPRAS
   La Arboleda Club - Tacna, Perú
   ========================================================== */

// Variables globales del carrito
let carrito = [];
let mozosDisponibles = [];
const STORAGE_KEY = 'arboleda_cart_v2';

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  cargarCarritoDesdeStorage();
  inicializarPanelCarrito();
  inicializarEventosCarrito();
  actualizarInterfazCarrito();
});

// ==========================================================
// PERSISTENCIA CON LOCALSTORAGE
// ==========================================================

function cargarCarritoDesdeStorage() {
  try {
    const carritoGuardado = localStorage.getItem(STORAGE_KEY);
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
    }
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    carrito = [];
  }
}

function guardarCarritoEnStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  } catch (error) {
    console.error('Error al guardar carrito:', error);
  }
}

// ==========================================================
// CARGAR MOZOS
// ==========================================================

function cargarMozos(mozos) {
  mozosDisponibles = mozos || [];
  const selector = document.getElementById('selectorMozo');
  
  if (!selector || !mozosDisponibles.length) return;
  
  let html = '<option value="">-- Selecciona un mozo --</option>';
  
  mozosDisponibles.forEach(mozo => {
    html += `<option value="${mozo.telefono}">${mozo.nombre} (${mozo.telefono})</option>`;
  });
  
  selector.innerHTML = html;
}

// ==========================================================
// INICIALIZACIÓN DEL PANEL
// ==========================================================

function inicializarPanelCarrito() {
  const btnAbrir = document.getElementById('btnAbrirCarrito');
  const btnCerrar = document.getElementById('btnCerrarCarrito');
  const overlay = document.getElementById('overlayCarrito');
  const panel = document.getElementById('panelCarrito');
  
  // Abrir carrito
  btnAbrir.addEventListener('click', () => {
    abrirPanelCarrito();
  });
  
  // Cerrar carrito
  btnCerrar.addEventListener('click', () => {
    cerrarPanelCarrito();
  });
  
  // Cerrar con overlay
  overlay.addEventListener('click', () => {
    cerrarPanelCarrito();
  });
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('activo')) {
      cerrarPanelCarrito();
    }
  });
}

function abrirPanelCarrito() {
  const panel = document.getElementById('panelCarrito');
  const overlay = document.getElementById('overlayCarrito');
  
  panel.classList.add('activo');
  overlay.classList.add('activo');
  panel.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus en el botón cerrar
  document.getElementById('btnCerrarCarrito').focus();
}

function cerrarPanelCarrito() {
  const panel = document.getElementById('panelCarrito');
  const overlay = document.getElementById('overlayCarrito');
  
  panel.classList.remove('activo');
  overlay.classList.remove('activo');
  panel.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

// ==========================================================
// EVENTOS DEL CARRITO
// ==========================================================

function inicializarEventosCarrito() {
  // Botón enviar pedido
  const btnEnviar = document.getElementById('btnEnviarPedido');
  btnEnviar.addEventListener('click', enviarPedidoWhatsApp);
  
  // Botón limpiar carrito
  const btnLimpiar = document.getElementById('btnLimpiarCarrito');
  btnLimpiar.addEventListener('click', () => {
    if (carrito.length > 0) {
      if (confirm('¿Estás seguro de vaciar el carrito?')) {
        vaciarCarrito();
      }
    }
  });
  
  // Validación de campos
  const nombreCliente = document.getElementById('nombreCliente');
  const selectorMozo = document.getElementById('selectorMozo');
  
  nombreCliente.addEventListener('input', validarFormularioEnvio);
  selectorMozo.addEventListener('change', validarFormularioEnvio);
}

// ==========================================================
// AGREGAR ITEM AL CARRITO
// ==========================================================

function agregarItemCarrito(item) {
  carrito.push(item);
  guardarCarritoEnStorage();
  actualizarInterfazCarrito();
  
  // Animación del contador
  animarContadorCarrito();
}

function animarContadorCarrito() {
  const contador = document.getElementById('contadorCarrito');
  contador.style.animation = 'none';
  contador.offsetHeight; // Trigger reflow
  contador.style.animation = 'bounce-contador 0.5s ease';
}

// ==========================================================
// ACTUALIZAR INTERFAZ DEL CARRITO
// ==========================================================

function actualizarInterfazCarrito() {
  actualizarContadorFlotante();
  renderizarListaCarrito();
  calcularTotal();
  validarFormularioEnvio();
}

function actualizarContadorFlotante() {
  const contador = document.getElementById('contadorCarrito');
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  contador.textContent = totalItems;
}

function renderizarListaCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  const carritoVacio = document.getElementById('carritoVacio');
  
  if (carrito.length === 0) {
    listaCarrito.style.display = 'none';
    carritoVacio.style.display = 'block';
    return;
  }
  
  listaCarrito.style.display = 'flex';
  carritoVacio.style.display = 'none';
  
  let html = '';
  
  carrito.forEach((item, index) => {
    html += crearItemCarritoHTML(item, index);
  });
  
  listaCarrito.innerHTML = html;
  
  // Agregar event listeners a los botones
  agregarEventListenersItemsCarrito();
}

function crearItemCarritoHTML(item, index) {
  // Formatear detalles del item
  let detalles = '';
  
  // Opciones
  if (item.opciones && Object.keys(item.opciones).length > 0) {
    const opcionesTexto = Object.entries(item.opciones)
      .map(([key, value]) => `${formatearClaveOpcion(key)}: ${value}`)
      .join(' | ');
    detalles += `<span>📋 ${opcionesTexto}</span>`;
  }
  
  // Guarniciones
  if (item.guarniciones && item.guarniciones.length > 0) {
    detalles += `<span>🍽️ Guarniciones: ${item.guarniciones.join(', ')}</span>`;
  }
  
  // Observación
  if (item.observacion) {
    detalles += `<span>📝 ${item.observacion}</span>`;
  }
  
  const subtotal = item.precio * item.cantidad;
  
  return `
    <div class="item-carrito" data-index="${index}">
      <div class="item-carrito-header">
        <span class="item-carrito-nombre">${item.nombre}</span>
        <button class="btn-eliminar-item" 
                data-index="${index}"
                aria-label="Eliminar ${item.nombre} del carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
      ${detalles ? `<div class="item-carrito-detalles">${detalles}</div>` : ''}
      <div class="item-carrito-footer">
        <div class="item-carrito-cantidad">
          <button class="btn-cantidad-carrito btn-restar" 
                  data-index="${index}"
                  aria-label="Reducir cantidad">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="cantidad-carrito-valor">${item.cantidad}</span>
          <button class="btn-cantidad-carrito btn-sumar" 
                  data-index="${index}"
                  aria-label="Aumentar cantidad">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <span class="item-carrito-precio">S/ ${subtotal.toFixed(2)}</span>
      </div>
    </div>
  `;
}

function formatearClaveOpcion(key) {
  const nombres = {
    'picante': 'Picante',
    'termino': 'Término',
    'temperatura': 'Temp',
    'tamanio': 'Tamaño',
    'tipo': 'Tipo'
  };
  return nombres[key] || key;
}

function agregarEventListenersItemsCarrito() {
  // Botones eliminar
  const botonesEliminar = document.querySelectorAll('.btn-eliminar-item');
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.getAttribute('data-index'));
      eliminarItemCarrito(index);
    });
  });
  
  // Botones restar cantidad
  const botonesRestar = document.querySelectorAll('.btn-cantidad-carrito.btn-restar');
  botonesRestar.forEach(boton => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.getAttribute('data-index'));
      modificarCantidadItem(index, -1);
    });
  });
  
  // Botones sumar cantidad
  const botonesSumar = document.querySelectorAll('.btn-cantidad-carrito.btn-sumar');
  botonesSumar.forEach(boton => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.getAttribute('data-index'));
      modificarCantidadItem(index, 1);
    });
  });
}

// ==========================================================
// MODIFICAR CARRITO
// ==========================================================

function modificarCantidadItem(index, cambio) {
  if (index < 0 || index >= carrito.length) return;
  
  const nuevaCantidad = carrito[index].cantidad + cambio;
  
  if (nuevaCantidad <= 0) {
    eliminarItemCarrito(index);
  } else if (nuevaCantidad <= 99) {
    carrito[index].cantidad = nuevaCantidad;
    carrito[index].subtotal = carrito[index].precio * nuevaCantidad;
    guardarCarritoEnStorage();
    actualizarInterfazCarrito();
  }
}

function eliminarItemCarrito(index) {
  if (index < 0 || index >= carrito.length) return;
  
  const nombreItem = carrito[index].nombre;
  carrito.splice(index, 1);
  guardarCarritoEnStorage();
  actualizarInterfazCarrito();
  
  if (typeof mostrarToast === 'function') {
    mostrarToast(`${nombreItem} eliminado del pedido`);
  }
}

function vaciarCarrito() {
  carrito = [];
  guardarCarritoEnStorage();
  actualizarInterfazCarrito();
  
  // Limpiar campos
  document.getElementById('nombreCliente').value = '';
  document.getElementById('selectorMozo').value = '';
  document.getElementById('observacionGeneral').value = '';
  
  if (typeof mostrarToast === 'function') {
    mostrarToast('Carrito vaciado');
  }
}

// ==========================================================
// CÁLCULO DE TOTAL
// ==========================================================

function calcularTotal() {
  const total = carrito.reduce((sum, item) => {
    return sum + (item.precio * item.cantidad);
  }, 0);
  
  document.getElementById('totalCarrito').textContent = `S/ ${total.toFixed(2)}`;
  return total;
}

// ==========================================================
// VALIDACIÓN DEL FORMULARIO
// ==========================================================

function validarFormularioEnvio() {
  const btnEnviar = document.getElementById('btnEnviarPedido');
  const nombreCliente = document.getElementById('nombreCliente').value.trim();
  const mozoSeleccionado = document.getElementById('selectorMozo').value;
  
  const esValido = carrito.length > 0 && nombreCliente !== '' && mozoSeleccionado !== '';
  
  btnEnviar.disabled = !esValido;
  
  return esValido;
}

// ==========================================================
// ENVÍO POR WHATSAPP
// ==========================================================

function enviarPedidoWhatsApp() {
  if (!validarFormularioEnvio()) {
    alert('Por favor, completa todos los campos requeridos.');
    return;
  }
  
  const nombreCliente = document.getElementById('nombreCliente').value.trim();
  const telefonoMozo = document.getElementById('selectorMozo').value;
  const observacionGeneral = document.getElementById('observacionGeneral').value.trim();
  
  // Encontrar nombre del mozo
  const mozo = mozosDisponibles.find(m => m.telefono === telefonoMozo);
  const nombreMozo = mozo ? mozo.nombre : 'Mozo';
  
  // Construir mensaje
  const mensaje = construirMensajeWhatsApp(nombreCliente, nombreMozo, observacionGeneral);
  
  // Codificar mensaje
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Construir URL de WhatsApp
  const urlWhatsApp = `https://wa.me/51${telefonoMozo}?text=${mensajeCodificado}`;
  
  // Abrir WhatsApp
  window.open(urlWhatsApp, '_blank');
  
  // Limpiar carrito después de enviar
  setTimeout(() => {
    if (confirm('¿El pedido fue enviado correctamente? ¿Deseas limpiar el carrito?')) {
      vaciarCarrito();
      cerrarPanelCarrito();
    }
  }, 1000);
}

function construirMensajeWhatsApp(cliente, mozo, observacionGeneral) {
  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const horaFormateada = fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let mensaje = `🌳 *PEDIDO - LA ARBOLEDA CLUB* 🌳\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  mensaje += `📅 *Fecha:* ${fechaFormateada}\n`;
  mensaje += `🕐 *Hora:* ${horaFormateada}\n`;
  mensaje += `👤 *Cliente/Mesa:* ${cliente}\n`;
  mensaje += `👨‍🍳 *Atendido por:* ${mozo}\n\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `📋 *DETALLE DEL PEDIDO:*\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  let numeroItem = 1;
  carrito.forEach(item => {
    mensaje += `*${numeroItem}. ${item.nombre}*\n`;
    mensaje += `   Cantidad: ${item.cantidad}\n`;
    mensaje += `   Precio unit.: S/ ${item.precio.toFixed(2)}\n`;
    mensaje += `   Subtotal: S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    
    // Opciones
    if (item.opciones && Object.keys(item.opciones).length > 0) {
      mensaje += `   📋 Opciones:\n`;
      Object.entries(item.opciones).forEach(([key, value]) => {
        mensaje += `      • ${formatearClaveOpcion(key)}: ${value}\n`;
      });
    }
    
    // Guarniciones
    if (item.guarniciones && item.guarniciones.length > 0) {
      mensaje += `   🍽️ Guarniciones: ${item.guarniciones.join(', ')}\n`;
    }
    
    // Observación del plato
    if (item.observacion) {
      mensaje += `   📝 Nota: ${item.observacion}\n`;
    }
    
    mensaje += `\n`;
    numeroItem++;
  });
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━━\n`;
  const total = calcularTotal();
  mensaje += `💰 *TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  // Observación general
  if (observacionGeneral) {
    mensaje += `\n📌 *OBSERVACIONES GENERALES:*\n`;
    mensaje += `${observacionGeneral}\n`;
  }
  
  mensaje += `\n✅ *Pedido generado desde la web*\n`;
  mensaje += `🌐 www.laarboledaclub.com`;
  
  return mensaje;
}

// ==========================================================
// EXPORTAR FUNCIONES PARA USO GLOBAL
// ==========================================================

window.agregarItemCarrito = agregarItemCarrito;
window.cargarMozos = cargarMozos;
window.abrirPanelCarrito = abrirPanelCarrito;
window.cerrarPanelCarrito = cerrarPanelCarrito;