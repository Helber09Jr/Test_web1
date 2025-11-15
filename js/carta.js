/* ==========================================================
   CARTA.JS - SISTEMA DE MENÚ DIGITAL
   La Arboleda Club - Tacna, Perú
   ========================================================== */

// ==========================================================
// VARIABLES GLOBALES
// ==========================================================

let datosMenu = null;
let platosFiltrados = [];
let categoriaActual = 'todos';
let vistaActual = 'detallada';
let platoSeleccionado = null;
let cantidadSeleccionada = 1;

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  cargarDatosMenu();
  inicializarEventos();
  ocultarCargador();
});

async function cargarDatosMenu() {
  try {
    const response = await fetch('data/carta.json');
    if (!response.ok) {
      throw new Error('Error al cargar el menú');
    }
    datosMenu = await response.json();
    
    // Cargar mozos en el carrito
    if (typeof cargarMozos === 'function' && datosMenu.mozos) {
      cargarMozos(datosMenu.mozos);
    }
    
    // Renderizar categorías y platos
    renderizarCategorias();
    filtrarYRenderizarPlatos();
    
  } catch (error) {
    console.error('Error cargando menú:', error);
    mostrarErrorCarga();
  }
}

function mostrarErrorCarga() {
  const grilla = document.getElementById('grillaPlatos');
  grilla.innerHTML = `
    <div class="sin-resultados">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3>Error al cargar el menú</h3>
      <p>Por favor, recarga la página</p>
    </div>
  `;
}

function ocultarCargador() {
  setTimeout(() => {
    const cargador = document.getElementById('cargador-inicial');
    if (cargador) {
      cargador.classList.add('oculto');
    }
  }, 2000);
}

// ==========================================================
// EVENTOS
// ==========================================================

function inicializarEventos() {
  // Menú móvil
  const btnMenu = document.querySelector('.boton-menu-movil');
  const listaNav = document.querySelector('.lista-navegacion');
  
  btnMenu.addEventListener('click', () => {
    btnMenu.classList.toggle('activo');
    listaNav.classList.toggle('mostrar');
    const expandido = btnMenu.classList.contains('activo');
    btnMenu.setAttribute('aria-expanded', expandido);
  });

  // Buscador
  const buscador = document.getElementById('buscadorPlatos');
  const btnLimpiar = document.getElementById('btnLimpiarBusqueda');
  
  buscador.addEventListener('input', (e) => {
    const valor = e.target.value.trim();
    btnLimpiar.style.display = valor ? 'block' : 'none';
    filtrarYRenderizarPlatos();
  });
  
  btnLimpiar.addEventListener('click', () => {
    buscador.value = '';
    btnLimpiar.style.display = 'none';
    filtrarYRenderizarPlatos();
  });

  // Toggle de vista
  const btnDetallada = document.getElementById('btnVistaDetallada');
  const btnSimple = document.getElementById('btnVistaSimple');
  
  btnDetallada.addEventListener('click', () => {
    vistaActual = 'detallada';
    btnDetallada.classList.add('activo');
    btnSimple.classList.remove('activo');
    renderizarPlatos();
  });
  
  btnSimple.addEventListener('click', () => {
    vistaActual = 'simple';
    btnSimple.classList.add('activo');
    btnDetallada.classList.remove('activo');
    renderizarPlatos();
  });

  // Modal de personalización
  inicializarModalPlato();
  
  // Modal de vista previa
  inicializarModalVistaPrevia();
}

// ==========================================================
// RENDERIZADO DE CATEGORÍAS
// ==========================================================

function renderizarCategorias() {
  const contenedor = document.getElementById('filtrosCategorias');
  if (!datosMenu || !datosMenu.categorias) return;
  
  let html = `
    <button class="filtro-categoria activo" data-categoria="todos" role="tab" aria-selected="true">
      <span class="filtro-icono">🍽️</span>
      Todos
    </button>
  `;
  
  datosMenu.categorias.forEach(cat => {
    html += `
      <button class="filtro-categoria" data-categoria="${cat.id}" role="tab" aria-selected="false">
        <span class="filtro-icono">${cat.icono}</span>
        ${cat.nombre}
      </button>
    `;
  });
  
  contenedor.innerHTML = html;
  
  // Event listeners para filtros
  const botones = contenedor.querySelectorAll('.filtro-categoria');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      botones.forEach(b => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      boton.classList.add('activo');
      boton.setAttribute('aria-selected', 'true');
      categoriaActual = boton.getAttribute('data-categoria');
      filtrarYRenderizarPlatos();
    });
  });
}

// ==========================================================
// FILTRADO Y RENDERIZADO DE PLATOS
// ==========================================================

function filtrarYRenderizarPlatos() {
  if (!datosMenu || !datosMenu.platos) return;
  
  const busqueda = document.getElementById('buscadorPlatos').value.toLowerCase().trim();
  
  platosFiltrados = datosMenu.platos.filter(plato => {
    // Filtro por categoría
    const cumpleCategoria = categoriaActual === 'todos' || plato.categoria === categoriaActual;
    
    // Filtro por búsqueda
    const cumpleBusqueda = !busqueda || 
      plato.nombre.toLowerCase().includes(busqueda) ||
      plato.descripcion.toLowerCase().includes(busqueda);
    
    return cumpleCategoria && cumpleBusqueda;
  });
  
  renderizarPlatos();
  actualizarContador();
}

function renderizarPlatos() {
  const grilla = document.getElementById('grillaPlatos');
  const sinResultados = document.getElementById('sinResultados');
  
  if (platosFiltrados.length === 0) {
    grilla.innerHTML = '';
    sinResultados.style.display = 'block';
    return;
  }
  
  sinResultados.style.display = 'none';
  
  if (vistaActual === 'detallada') {
    grilla.classList.remove('vista-simple');
    grilla.innerHTML = platosFiltrados.map(plato => crearTarjetaDetallada(plato)).join('');
  } else {
    grilla.classList.add('vista-simple');
    grilla.innerHTML = platosFiltrados.map(plato => crearTarjetaSimple(plato)).join('');
  }
  
  // Agregar event listeners
  agregarEventListenersPlatos();
}

function crearTarjetaDetallada(plato) {
  const categoria = datosMenu.categorias.find(c => c.id === plato.categoria);
  const nombreCategoria = categoria ? categoria.nombre : plato.categoria;
  
  return `
    <article class="tarjeta-plato" data-plato-id="${plato.id}" tabindex="0">
      <div class="tarjeta-plato-imagen">
        <img src="${plato.imagen}" alt="${plato.nombre}" loading="lazy">
        <span class="badge-categoria">${nombreCategoria}</span>
        <button class="btn-vista-previa" data-plato-id="${plato.id}" aria-label="Ver imagen grande de ${plato.nombre}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      <div class="tarjeta-plato-contenido">
        <h3 class="tarjeta-plato-nombre">${plato.nombre}</h3>
        <p class="tarjeta-plato-descripcion">${plato.descripcion}</p>
        <div class="tarjeta-plato-footer">
          <span class="tarjeta-plato-precio">S/ ${plato.precio.toFixed(2)}</span>
          <button class="btn-agregar-rapido" data-plato-id="${plato.id}" aria-label="Agregar ${plato.nombre} al carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function crearTarjetaSimple(plato) {
  return `
    <div class="tarjeta-plato-simple" data-plato-id="${plato.id}" tabindex="0">
      <div class="plato-simple-info">
        <span class="plato-simple-icono">${plato.icono || '🍽️'}</span>
        <span class="plato-simple-nombre">${plato.nombre}</span>
      </div>
      <div class="plato-simple-acciones">
        <span class="plato-simple-precio">S/ ${plato.precio.toFixed(2)}</span>
        <button class="btn-agregar-simple" data-plato-id="${plato.id}" aria-label="Agregar ${plato.nombre}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function agregarEventListenersPlatos() {
  // Botones de agregar rápido (vista detallada)
  const botonesAgregar = document.querySelectorAll('.btn-agregar-rapido');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const platoId = parseInt(boton.getAttribute('data-plato-id'));
      abrirModalPlato(platoId);
    });
  });
  
  // Botones de agregar simple
  const botonesSimple = document.querySelectorAll('.btn-agregar-simple');
  botonesSimple.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const platoId = parseInt(boton.getAttribute('data-plato-id'));
      abrirModalPlato(platoId);
    });
  });
  
  // Botones de vista previa (ojo)
  const botonesVistaPrevia = document.querySelectorAll('.btn-vista-previa');
  botonesVistaPrevia.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const platoId = parseInt(boton.getAttribute('data-plato-id'));
      abrirModalVistaPrevia(platoId);
    });
  });
  
  // Click en tarjetas (abre modal de personalización)
  const tarjetas = document.querySelectorAll('.tarjeta-plato, .tarjeta-plato-simple');
  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      const platoId = parseInt(tarjeta.getAttribute('data-plato-id'));
      abrirModalPlato(platoId);
    });
    
    tarjeta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const platoId = parseInt(tarjeta.getAttribute('data-plato-id'));
        abrirModalPlato(platoId);
      }
    });
  });
}

function actualizarContador() {
  document.getElementById('numResultados').textContent = platosFiltrados.length;
}

// ==========================================================
// MODAL DE VISTA PREVIA
// ==========================================================

function inicializarModalVistaPrevia() {
  const modal = document.getElementById('modalVistaPrevia');
  const btnCerrar = document.getElementById('btnCerrarVistaPrevia');
  const overlay = modal.querySelector('.modal-overlay-vista');
  const btnAgregar = document.getElementById('btnAgregarDesdeVista');
  
  btnCerrar.addEventListener('click', cerrarModalVistaPrevia);
  overlay.addEventListener('click', cerrarModalVistaPrevia);
  
  btnAgregar.addEventListener('click', () => {
    const platoId = parseInt(btnAgregar.getAttribute('data-plato-id'));
    cerrarModalVistaPrevia();
    setTimeout(() => {
      abrirModalPlato(platoId);
    }, 300);
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalVistaPrevia();
    }
  });
}

function abrirModalVistaPrevia(platoId) {
  const plato = datosMenu.platos.find(p => p.id === platoId);
  if (!plato) return;
  
  const modal = document.getElementById('modalVistaPrevia');
  
  document.getElementById('vistaPreviaImg').src = plato.imagen;
  document.getElementById('vistaPreviaImg').alt = plato.nombre;
  document.getElementById('vistaPreviaTitulo').textContent = plato.nombre;
  document.getElementById('vistaPreviaPrecio').textContent = `S/ ${plato.precio.toFixed(2)}`;
  document.getElementById('vistaPreviaDescripcion').textContent = plato.descripcion;
  document.getElementById('btnAgregarDesdeVista').setAttribute('data-plato-id', platoId);
  
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModalVistaPrevia() {
  const modal = document.getElementById('modalVistaPrevia');
  modal.classList.remove('activo');
  document.body.style.overflow = 'auto';
}

// ==========================================================
// MODAL DE PERSONALIZACIÓN
// ==========================================================

function inicializarModalPlato() {
  const modal = document.getElementById('modalPlato');
  const btnCerrar = document.getElementById('btnCerrarModalPlato');
  const overlay = modal.querySelector('.modal-overlay-plato');
  
  btnCerrar.addEventListener('click', cerrarModalPlato);
  overlay.addEventListener('click', cerrarModalPlato);
  
  // Controles de cantidad
  const btnRestar = document.getElementById('btnRestarCantidad');
  const btnSumar = document.getElementById('btnSumarCantidad');
  
  btnRestar.addEventListener('click', () => {
    if (cantidadSeleccionada > 1) {
      cantidadSeleccionada--;
      actualizarCantidadModal();
    }
  });
  
  btnSumar.addEventListener('click', () => {
    if (cantidadSeleccionada < 99) {
      cantidadSeleccionada++;
      actualizarCantidadModal();
    }
  });
  
  // Observación
  const observacion = document.getElementById('observacionPlato');
  observacion.addEventListener('input', () => {
    document.getElementById('contadorObservacion').textContent = observacion.value.length;
  });
  
  // Botón agregar al carrito
  const btnAgregar = document.getElementById('btnAgregarCarrito');
  btnAgregar.addEventListener('click', agregarAlCarrito);
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalPlato();
    }
  });
}

function abrirModalPlato(platoId) {
  const plato = datosMenu.platos.find(p => p.id === platoId);
  if (!plato) return;
  
  platoSeleccionado = plato;
  cantidadSeleccionada = 1;
  
  const modal = document.getElementById('modalPlato');
  
  // Llenar información básica
  document.getElementById('modalPlatoImg').src = plato.imagen;
  document.getElementById('modalPlatoImg').alt = plato.nombre;
  document.getElementById('modalPlatoTitulo').textContent = plato.nombre;
  document.getElementById('modalPlatoPrecio').textContent = `S/ ${plato.precio.toFixed(2)}`;
  document.getElementById('modalPlatoDescripcion').textContent = plato.descripcion;
  
  // Renderizar opciones
  renderizarOpciones(plato);
  
  // Renderizar guarniciones
  renderizarGuarniciones(plato);
  
  // Mostrar/ocultar observación
  const observacionContainer = document.getElementById('modalObservacionContainer');
  observacionContainer.style.display = 'block';
  document.getElementById('observacionPlato').value = '';
  document.getElementById('contadorObservacion').textContent = '0';
  
  // Resetear cantidad
  actualizarCantidadModal();
  
  // Mostrar modal
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModalPlato() {
  const modal = document.getElementById('modalPlato');
  modal.classList.remove('activo');
  document.body.style.overflow = 'auto';
  platoSeleccionado = null;
}

function renderizarOpciones(plato) {
  const contenedor = document.getElementById('modalOpcionesContainer');
  contenedor.innerHTML = '';
  
  if (!plato.opciones || Object.keys(plato.opciones).length === 0) {
    return;
  }
  
  Object.entries(plato.opciones).forEach(([key, valores]) => {
    const nombreOpcion = formatearNombreOpcion(key);
    
    let html = `
      <div class="opcion-grupo">
        <h4>${nombreOpcion}</h4>
        <div class="opcion-lista">
    `;
    
    valores.forEach((valor, index) => {
      const checked = index === 0 ? 'checked' : '';
      html += `
        <div class="opcion-item">
          <input type="radio" 
                 id="opcion_${key}_${index}" 
                 name="opcion_${key}" 
                 value="${valor}"
                 ${checked}>
          <label for="opcion_${key}_${index}">${valor}</label>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    contenedor.innerHTML += html;
  });
}

function formatearNombreOpcion(key) {
  const nombres = {
    'picante': 'Nivel de Picante',
    'termino': 'Término de Cocción',
    'temperatura': 'Temperatura',
    'tamanio': 'Tamaño',
    'tipo': 'Tipo'
  };
  return nombres[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function renderizarGuarniciones(plato) {
  const contenedor = document.getElementById('modalGuarnicionesContainer');
  const lista = document.getElementById('listaGuarniciones');
  
  if (!plato.guarniciones || !datosMenu.guarniciones) {
    contenedor.style.display = 'none';
    return;
  }
  
  contenedor.style.display = 'block';
  lista.innerHTML = '';
  
  datosMenu.guarniciones.forEach((guarnicion, index) => {
    lista.innerHTML += `
      <div class="guarnicion-item">
        <input type="checkbox" 
               id="guarnicion_${index}" 
               value="${guarnicion}"
               onchange="verificarLimiteGuarniciones()">
        <label for="guarnicion_${index}">${guarnicion}</label>
      </div>
    `;
  });
  
  actualizarContadorGuarniciones();
}

function verificarLimiteGuarniciones() {
  const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]');
  const seleccionadas = Array.from(checkboxes).filter(cb => cb.checked).length;
  const limite = 2;
  
  checkboxes.forEach(cb => {
    if (!cb.checked && seleccionadas >= limite) {
      cb.disabled = true;
    } else {
      cb.disabled = false;
    }
  });
  
  actualizarContadorGuarniciones();
}

function actualizarContadorGuarniciones() {
  const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]');
  const seleccionadas = Array.from(checkboxes).filter(cb => cb.checked).length;
  const contador = document.getElementById('contadorGuarniciones');
  
  contador.textContent = `${seleccionadas}/2 seleccionadas`;
  
  if (seleccionadas >= 2) {
    contador.classList.add('limite');
  } else {
    contador.classList.remove('limite');
  }
}

function actualizarCantidadModal() {
  document.getElementById('cantidadPlato').textContent = cantidadSeleccionada;
  
  const btnRestar = document.getElementById('btnRestarCantidad');
  btnRestar.disabled = cantidadSeleccionada <= 1;
  
  if (platoSeleccionado) {
    const subtotal = platoSeleccionado.precio * cantidadSeleccionada;
    document.getElementById('modalSubtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
  }
}

// ==========================================================
// AGREGAR AL CARRITO
// ==========================================================

function agregarAlCarrito() {
  if (!platoSeleccionado) return;
  
  // Recopilar opciones seleccionadas
  const opcionesSeleccionadas = {};
  
  if (platoSeleccionado.opciones) {
    Object.keys(platoSeleccionado.opciones).forEach(key => {
      const radio = document.querySelector(`input[name="opcion_${key}"]:checked`);
      if (radio) {
        opcionesSeleccionadas[key] = radio.value;
      }
    });
  }
  
  // Recopilar guarniciones
  const guarnicionesSeleccionadas = [];
  const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]:checked');
  checkboxes.forEach(cb => {
    guarnicionesSeleccionadas.push(cb.value);
  });
  
  // Obtener observación
  const observacion = document.getElementById('observacionPlato').value.trim();
  
  // Crear item del carrito
  const item = {
    id: platoSeleccionado.id,
    nombre: platoSeleccionado.nombre,
    precio: platoSeleccionado.precio,
    cantidad: cantidadSeleccionada,
    opciones: opcionesSeleccionadas,
    guarniciones: guarnicionesSeleccionadas,
    observacion: observacion,
    subtotal: platoSeleccionado.precio * cantidadSeleccionada
  };
  
  // Agregar al carrito (función del carrito.js)
  if (typeof agregarItemCarrito === 'function') {
    agregarItemCarrito(item);
  }
  
  // Mostrar notificación
  mostrarToast(`${platoSeleccionado.nombre} agregado al pedido`);
  
  // Cerrar modal
  cerrarModalPlato();
}

// ==========================================================
// NOTIFICACIONES TOAST
// ==========================================================

function mostrarToast(mensaje) {
  const toast = document.getElementById('toastNotificacion');
  const toastMensaje = document.getElementById('toastMensaje');
  
  toastMensaje.textContent = mensaje;
  toast.classList.add('mostrar');
  
  setTimeout(() => {
    toast.classList.remove('mostrar');
  }, 3000);
}

// Hacer la función global
window.mostrarToast = mostrarToast;
window.verificarLimiteGuarniciones = verificarLimiteGuarniciones;

