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
  
  if (btnMenu && listaNav) {
    btnMenu.onclick = () => {
      btnMenu.classList.toggle('activo');
      listaNav.classList.toggle('mostrar');
      const expandido = btnMenu.classList.contains('activo');
      btnMenu.setAttribute('aria-expanded', expandido);
    };
  }

  // Buscador
  const buscador = document.getElementById('buscadorPlatos');
  const btnLimpiar = document.getElementById('btnLimpiarBusqueda');
  
  if (buscador) {
    buscador.oninput = (e) => {
      const valor = e.target.value.trim();
      if (btnLimpiar) {
        btnLimpiar.style.display = valor ? 'block' : 'none';
      }
      filtrarYRenderizarPlatos();
    };
  }
  
  if (btnLimpiar) {
    btnLimpiar.onclick = () => {
      buscador.value = '';
      btnLimpiar.style.display = 'none';
      filtrarYRenderizarPlatos();
    };
  }

  // Toggle de vista
  const btnDetallada = document.getElementById('btnVistaDetallada');
  const btnSimple = document.getElementById('btnVistaSimple');
  
  if (btnDetallada) {
    btnDetallada.onclick = () => {
      vistaActual = 'detallada';
      btnDetallada.classList.add('activo');
      if (btnSimple) btnSimple.classList.remove('activo');
      renderizarPlatos();
    };
  }
  
  if (btnSimple) {
    btnSimple.onclick = () => {
      vistaActual = 'simple';
      btnSimple.classList.add('activo');
      if (btnDetallada) btnDetallada.classList.remove('activo');
      renderizarPlatos();
    };
  }

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
  if (!datosMenu || !datosMenu.categorias || !contenedor) return;
  
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
  contenedor.querySelectorAll('.filtro-categoria').forEach(boton => {
    boton.onclick = () => {
      contenedor.querySelectorAll('.filtro-categoria').forEach(b => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      boton.classList.add('activo');
      boton.setAttribute('aria-selected', 'true');
      categoriaActual = boton.getAttribute('data-categoria');
      filtrarYRenderizarPlatos();
    };
  });
}

// ==========================================================
// FILTRADO Y RENDERIZADO DE PLATOS
// ==========================================================

function filtrarYRenderizarPlatos() {
  if (!datosMenu || !datosMenu.platos) return;
  
  const buscador = document.getElementById('buscadorPlatos');
  const busqueda = buscador ? buscador.value.toLowerCase().trim() : '';
  
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
  
  if (!grilla) return;
  
  if (platosFiltrados.length === 0) {
    grilla.innerHTML = '';
    if (sinResultados) sinResultados.style.display = 'block';
    return;
  }
  
  if (sinResultados) sinResultados.style.display = 'none';
  
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
  // Obtener icono de la categoría del plato
  const categoria = datosMenu.categorias.find(c => c.id === plato.categoria);
  const iconoCategoria = categoria ? categoria.icono : '🍽️';
  
  return `
    <div class="tarjeta-plato-simple" data-plato-id="${plato.id}" tabindex="0">
      <div class="plato-simple-info">
        <span class="plato-simple-icono">${iconoCategoria}</span>
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
  document.querySelectorAll('.btn-agregar-rapido').forEach(boton => {
    boton.onclick = (e) => {
      e.stopPropagation();
      const platoId = boton.getAttribute('data-plato-id');
      abrirModalPlato(platoId);
    };
  });
  
  // Botones de agregar simple
  document.querySelectorAll('.btn-agregar-simple').forEach(boton => {
    boton.onclick = (e) => {
      e.stopPropagation();
      const platoId = boton.getAttribute('data-plato-id');
      abrirModalPlato(platoId);
    };
  });
  
  // Botones de vista previa (ojo)
  document.querySelectorAll('.btn-vista-previa').forEach(boton => {
    boton.onclick = (e) => {
      e.stopPropagation();
      const platoId = boton.getAttribute('data-plato-id');
      abrirModalVistaPrevia(platoId);
    };
  });
  
  // Click en tarjetas (abre modal de personalización)
  document.querySelectorAll('.tarjeta-plato').forEach(tarjeta => {
    tarjeta.onclick = (e) => {
      if (!e.target.closest('button')) {
        const platoId = tarjeta.getAttribute('data-plato-id');
        abrirModalPlato(platoId);
      }
    };
  });
  
  document.querySelectorAll('.tarjeta-plato-simple').forEach(tarjeta => {
    tarjeta.onclick = (e) => {
      if (!e.target.closest('button')) {
        const platoId = tarjeta.getAttribute('data-plato-id');
        abrirModalPlato(platoId);
      }
    };
  });
}

function actualizarContador() {
  const contador = document.getElementById('numResultados');
  if (contador) {
    contador.textContent = platosFiltrados.length;
  }
}

// ==========================================================
// MODAL DE VISTA PREVIA
// ==========================================================

function inicializarModalVistaPrevia() {
  const modal = document.getElementById('modalVistaPrevia');
  if (!modal) return;
  
  const btnCerrar = document.getElementById('btnCerrarVistaPrevia');
  const overlay = modal.querySelector('.modal-overlay-vista');
  const btnAgregar = document.getElementById('btnAgregarDesdeVista');
  
  if (btnCerrar) {
    btnCerrar.onclick = cerrarModalVistaPrevia;
  }
  
  if (overlay) {
    overlay.onclick = cerrarModalVistaPrevia;
  }
  
  if (btnAgregar) {
    btnAgregar.onclick = () => {
      const platoId = btnAgregar.getAttribute('data-plato-id');
      cerrarModalVistaPrevia();
      setTimeout(() => {
        abrirModalPlato(platoId);
      }, 300);
    };
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalVistaPrevia();
    }
  });
}

function abrirModalVistaPrevia(platoId) {
  if (!datosMenu || !datosMenu.platos) return;
  
  const plato = datosMenu.platos.find(p => p.id === platoId);
  if (!plato) return;
  
  const modal = document.getElementById('modalVistaPrevia');
  if (!modal) return;
  
  const img = document.getElementById('vistaPreviaImg');
  const titulo = document.getElementById('vistaPreviaTitulo');
  const precio = document.getElementById('vistaPreviaPrecio');
  const descripcion = document.getElementById('vistaPreviaDescripcion');
  const btnAgregar = document.getElementById('btnAgregarDesdeVista');
  
  if (img) {
    img.src = plato.imagen;
    img.alt = plato.nombre;
  }
  if (titulo) titulo.textContent = plato.nombre;
  if (precio) precio.textContent = `S/ ${plato.precio.toFixed(2)}`;
  if (descripcion) descripcion.textContent = plato.descripcion;
  if (btnAgregar) btnAgregar.setAttribute('data-plato-id', platoId);
  
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModalVistaPrevia() {
  const modal = document.getElementById('modalVistaPrevia');
  if (modal) {
    modal.classList.remove('activo');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================================
// MODAL DE PERSONALIZACIÓN
// ==========================================================

function inicializarModalPlato() {
  const modal = document.getElementById('modalPlato');
  if (!modal) return;
  
  const btnCerrar = document.getElementById('btnCerrarModalPlato');
  const overlay = modal.querySelector('.modal-overlay-plato');
  
  if (btnCerrar) {
    btnCerrar.onclick = cerrarModalPlato;
  }
  
  if (overlay) {
    overlay.onclick = cerrarModalPlato;
  }
  
  // Controles de cantidad
  const btnRestar = document.getElementById('btnRestarCantidad');
  const btnSumar = document.getElementById('btnSumarCantidad');
  
  if (btnRestar) {
    btnRestar.onclick = () => {
      if (cantidadSeleccionada > 1) {
        cantidadSeleccionada--;
        actualizarCantidadModal();
      }
    };
  }
  
  if (btnSumar) {
    btnSumar.onclick = () => {
      if (cantidadSeleccionada < 99) {
        cantidadSeleccionada++;
        actualizarCantidadModal();
      }
    };
  }
  
  // Observación
  const observacion = document.getElementById('observacionPlato');
  if (observacion) {
    observacion.oninput = () => {
      const contador = document.getElementById('contadorObservacion');
      if (contador) {
        contador.textContent = observacion.value.length;
      }
    };
  }
  
  // Botón agregar al carrito
  const btnAgregar = document.getElementById('btnAgregarCarrito');
  if (btnAgregar) {
    btnAgregar.onclick = agregarAlCarrito;
  }
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalPlato();
    }
  });
}

function abrirModalPlato(platoId) {
  if (!datosMenu || !datosMenu.platos) return;
  
  const plato = datosMenu.platos.find(p => p.id === platoId);
  if (!plato) return;
  
  platoSeleccionado = plato;
  cantidadSeleccionada = 1;
  
  const modal = document.getElementById('modalPlato');
  if (!modal) return;
  
  // Llenar información básica
  const img = document.getElementById('modalPlatoImg');
  const titulo = document.getElementById('modalPlatoTitulo');
  const precio = document.getElementById('modalPlatoPrecio');
  const descripcion = document.getElementById('modalPlatoDescripcion');
  
  if (img) {
    img.src = plato.imagen;
    img.alt = plato.nombre;
  }
  if (titulo) titulo.textContent = plato.nombre;
  if (precio) precio.textContent = `S/ ${plato.precio.toFixed(2)}`;
  if (descripcion) descripcion.textContent = plato.descripcion;
  
  // Renderizar opciones
  renderizarOpciones(plato);
  
  // Renderizar guarniciones
  renderizarGuarniciones(plato);
  
  // Mostrar observación
  const observacionContainer = document.getElementById('modalObservacionContainer');
  if (observacionContainer) {
    observacionContainer.style.display = 'block';
  }
  const observacionInput = document.getElementById('observacionPlato');
  if (observacionInput) {
    observacionInput.value = '';
  }
  const contadorObs = document.getElementById('contadorObservacion');
  if (contadorObs) {
    contadorObs.textContent = '0';
  }
  
  // Resetear cantidad
  actualizarCantidadModal();
  
  // Mostrar modal
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModalPlato() {
  const modal = document.getElementById('modalPlato');
  if (modal) {
    modal.classList.remove('activo');
    document.body.style.overflow = 'auto';
  }
  platoSeleccionado = null;
}

function renderizarOpciones(plato) {
  const contenedor = document.getElementById('modalOpcionesContainer');
  if (!contenedor) return;
  
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
  
  if (!contenedor || !lista) return;
  
  // Verificar si el plato tiene guarniciones definidas
  if (!plato.guarniciones || !plato.guarniciones.lista || plato.guarniciones.lista.length === 0) {
    contenedor.style.display = 'none';
    return;
  }
  
  contenedor.style.display = 'block';
  lista.innerHTML = '';
  
  const maxGuarniciones = plato.guarniciones.max || 2;
  
  // Usar las guarniciones específicas del plato
  plato.guarniciones.lista.forEach((guarnicion, index) => {
    lista.innerHTML += `
      <div class="guarnicion-item">
        <input type="checkbox" 
               id="guarnicion_${index}" 
               value="${guarnicion}"
               data-max="${maxGuarniciones}"
               onchange="verificarLimiteGuarniciones(${maxGuarniciones})">
        <label for="guarnicion_${index}">${guarnicion}</label>
      </div>
    `;
  });
  
  // Actualizar el texto del contador
  const contadorTexto = document.getElementById('contadorGuarniciones');
  if (contadorTexto) {
    contadorTexto.textContent = `0/${maxGuarniciones} seleccionadas`;
  }
  
  actualizarContadorGuarniciones(maxGuarniciones);
}

function verificarLimiteGuarniciones(max) {
  const limite = max || 2;
  const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]');
  const seleccionadas = Array.from(checkboxes).filter(cb => cb.checked).length;
  
  checkboxes.forEach(cb => {
    if (!cb.checked && seleccionadas >= limite) {
      cb.disabled = true;
    } else {
      cb.disabled = false;
    }
  });
  
  actualizarContadorGuarniciones(limite);
}

function actualizarContadorGuarniciones(max) {
  const limite = max || 2;
  const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]');
  const seleccionadas = Array.from(checkboxes).filter(cb => cb.checked).length;
  const contador = document.getElementById('contadorGuarniciones');
  
  if (contador) {
    contador.textContent = `${seleccionadas}/${limite} seleccionadas`;
    
    if (seleccionadas >= limite) {
      contador.classList.add('limite');
    } else {
      contador.classList.remove('limite');
    }
  }
}

function actualizarCantidadModal() {
  const cantidadElem = document.getElementById('cantidadPlato');
  if (cantidadElem) {
    cantidadElem.textContent = cantidadSeleccionada;
  }
  
  const btnRestar = document.getElementById('btnRestarCantidad');
  if (btnRestar) {
    btnRestar.disabled = cantidadSeleccionada <= 1;
  }
  
  if (platoSeleccionado) {
    const subtotal = platoSeleccionado.precio * cantidadSeleccionada;
    const subtotalElem = document.getElementById('modalSubtotal');
    if (subtotalElem) {
      subtotalElem.textContent = `S/ ${subtotal.toFixed(2)}`;
    }
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
  const observacionInput = document.getElementById('observacionPlato');
  const observacion = observacionInput ? observacionInput.value.trim() : '';
  
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
  
  if (toast && toastMensaje) {
    toastMensaje.textContent = mensaje;
    toast.classList.add('mostrar');
    
    setTimeout(() => {
      toast.classList.remove('mostrar');
    }, 3000);
  }
}

// ==========================================================
// EXPORTAR FUNCIONES GLOBALES
// ==========================================================

window.mostrarToast = mostrarToast;
window.verificarLimiteGuarniciones = verificarLimiteGuarniciones;
window.abrirModalPlato = abrirModalPlato;
window.abrirModalVistaPrevia = abrirModalVistaPrevia;
window.cerrarModalPlato = cerrarModalPlato;
window.cerrarModalVistaPrevia = cerrarModalVistaPrevia;
