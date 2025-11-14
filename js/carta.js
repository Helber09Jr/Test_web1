/* ==========================================================
   CARTA.JS - LÓGICA PRINCIPAL DE LA CARTA
   La Arboleda Club - Tacna, Perú
   ========================================================== */

// Variables globales
let datosMenu = null;
let platosFiltrados = [];
let categoriaActual = 'todo';
let vistaActual = 'detallada';
let platoSeleccionado = null;
let cantidadActual = 1;
let guarnicionesSeleccionadas = [];

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  inicializarCargador();
  cargarDatosMenu();
  inicializarMenuMovil();
  inicializarBuscador();
  inicializarToggleVista();
  inicializarModalPlato();
});

// Cargador inicial
function inicializarCargador() {
  const cargador = document.getElementById('cargador-inicial');
  if (cargador) {
    setTimeout(() => {
      cargador.classList.add('oculto');
      setTimeout(() => {
        cargador.remove();
      }, 600);
    }, 2000);
  }
}

// ==========================================================
// CARGA DE DATOS
// ==========================================================

async function cargarDatosMenu() {
  try {
    const respuesta = await fetch('data/carta.json');
    if (!respuesta.ok) {
      throw new Error('Error al cargar el menú');
    }
    datosMenu = await respuesta.json();
    
    // Inicializar la interfaz
    generarFiltrosCategorias();
    platosFiltrados = [...datosMenu.platos];
    renderizarPlatos();
    actualizarContador();
    
    // Cargar mozos en el carrito
    if (typeof cargarMozos === 'function') {
      cargarMozos(datosMenu.mozos);
    }
    
  } catch (error) {
    console.error('Error cargando datos:', error);
    mostrarErrorCarga();
  }
}

function mostrarErrorCarga() {
  const grilla = document.getElementById('grillaPlatos');
  grilla.innerHTML = `
    <div class="error-carga">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3>Error al cargar el menú</h3>
      <p>Por favor, recarga la página o intenta más tarde</p>
      <button onclick="location.reload()" class="btn-recargar">Recargar</button>
    </div>
  `;
}

// ==========================================================
// FILTROS DE CATEGORÍAS
// ==========================================================

function generarFiltrosCategorias() {
  const contenedor = document.getElementById('filtrosCategorias');
  if (!contenedor || !datosMenu) return;
  
  // Botón "Todo"
  let html = `
    <button class="filtro-categoria activo" 
            data-categoria="todo" 
            role="tab" 
            aria-selected="true"
            aria-controls="grillaPlatos">
      <span class="filtro-icono">🍽️</span>
      Todo
    </button>
  `;
  
  // Generar botones para cada categoría
  datosMenu.categorias.forEach(categoria => {
    // Contar platos en esta categoría
    const cantidad = datosMenu.platos.filter(p => p.categoria === categoria.id).length;
    if (cantidad > 0) {
      html += `
        <button class="filtro-categoria" 
                data-categoria="${categoria.id}" 
                role="tab" 
                aria-selected="false"
                aria-controls="grillaPlatos">
          <span class="filtro-icono">${categoria.icono}</span>
          ${categoria.nombre}
        </button>
      `;
    }
  });
  
  contenedor.innerHTML = html;
  
  // Event listeners para filtros
  const botones = contenedor.querySelectorAll('.filtro-categoria');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      // Remover activo de todos
      botones.forEach(b => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      
      // Activar el seleccionado
      boton.classList.add('activo');
      boton.setAttribute('aria-selected', 'true');
      
      // Filtrar platos
      categoriaActual = boton.getAttribute('data-categoria');
      aplicarFiltros();
    });
  });
}

// ==========================================================
// BUSCADOR
// ==========================================================

function inicializarBuscador() {
  const inputBuscar = document.getElementById('buscadorPlatos');
  const btnLimpiar = document.getElementById('btnLimpiarBusqueda');
  
  if (!inputBuscar) return;
  
  let timeoutBusqueda;
  
  inputBuscar.addEventListener('input', (e) => {
    const valor = e.target.value.trim();
    
    // Mostrar/ocultar botón limpiar
    btnLimpiar.style.display = valor ? 'block' : 'none';
    
    // Debounce para evitar búsquedas excesivas
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(() => {
      aplicarFiltros();
    }, 300);
  });
  
  btnLimpiar.addEventListener('click', () => {
    inputBuscar.value = '';
    btnLimpiar.style.display = 'none';
    aplicarFiltros();
    inputBuscar.focus();
  });
}

// ==========================================================
// FILTRADO Y BÚSQUEDA
// ==========================================================

function aplicarFiltros() {
  if (!datosMenu) return;
  
  const textoBusqueda = document.getElementById('buscadorPlatos').value.trim().toLowerCase();
  
  platosFiltrados = datosMenu.platos.filter(plato => {
    // Filtrar por categoría
    const cumpleCategoria = categoriaActual === 'todo' || plato.categoria === categoriaActual;
    
    // Filtrar por búsqueda
    let cumpleBusqueda = true;
    if (textoBusqueda) {
      const nombreMatch = plato.nombre.toLowerCase().includes(textoBusqueda);
      const descripcionMatch = plato.descripcion.toLowerCase().includes(textoBusqueda);
      const categoriaMatch = obtenerNombreCategoria(plato.categoria).toLowerCase().includes(textoBusqueda);
      cumpleBusqueda = nombreMatch || descripcionMatch || categoriaMatch;
    }
    
    return cumpleCategoria && cumpleBusqueda;
  });
  
  renderizarPlatos();
  actualizarContador();
}

function obtenerNombreCategoria(categoriaId) {
  if (!datosMenu) return '';
  const categoria = datosMenu.categorias.find(c => c.id === categoriaId);
  return categoria ? categoria.nombre : '';
}

function obtenerIconoCategoria(categoriaId) {
  if (!datosMenu) return '🍽️';
  const categoria = datosMenu.categorias.find(c => c.id === categoriaId);
  return categoria ? categoria.icono : '🍽️';
}

// ==========================================================
// TOGGLE DE VISTA
// ==========================================================

function inicializarToggleVista() {
  const btnDetallada = document.getElementById('btnVistaDetallada');
  const btnSimple = document.getElementById('btnVistaSimple');
  
  if (!btnDetallada || !btnSimple) return;
  
  btnDetallada.addEventListener('click', () => {
    if (vistaActual !== 'detallada') {
      vistaActual = 'detallada';
      btnDetallada.classList.add('activo');
      btnSimple.classList.remove('activo');
      renderizarPlatos();
    }
  });
  
  btnSimple.addEventListener('click', () => {
    if (vistaActual !== 'simple') {
      vistaActual = 'simple';
      btnSimple.classList.add('activo');
      btnDetallada.classList.remove('activo');
      renderizarPlatos();
    }
  });
}

// ==========================================================
// RENDERIZADO DE PLATOS
// ==========================================================

function renderizarPlatos() {
  const grilla = document.getElementById('grillaPlatos');
  const sinResultados = document.getElementById('sinResultados');
  
  if (!grilla) return;
  
  // Verificar si hay resultados
  if (platosFiltrados.length === 0) {
    grilla.innerHTML = '';
    grilla.style.display = 'none';
    sinResultados.style.display = 'block';
    return;
  }
  
  sinResultados.style.display = 'none';
  grilla.style.display = 'grid';
  
  // Aplicar clase de vista
  if (vistaActual === 'simple') {
    grilla.classList.add('vista-simple');
  } else {
    grilla.classList.remove('vista-simple');
  }
  
  // Renderizar según la vista
  if (vistaActual === 'detallada') {
    grilla.innerHTML = platosFiltrados.map(plato => crearTarjetaDetallada(plato)).join('');
  } else {
    grilla.innerHTML = platosFiltrados.map(plato => crearTarjetaSimple(plato)).join('');
  }
  
  // Agregar event listeners
  agregarEventListenersPlatos();
}

function crearTarjetaDetallada(plato) {
  const nombreCategoria = obtenerNombreCategoria(plato.categoria);
  
  return `
    <article class="tarjeta-plato" 
             data-plato-id="${plato.id}" 
             tabindex="0"
             role="button"
             aria-label="Ver detalles de ${plato.nombre}">
      <div class="tarjeta-plato-imagen">
        <img src="${plato.imagen}" 
             alt="${plato.nombre}" 
             loading="lazy"
             onerror="this.src='imagenes/menu/placeholder.jpg'">
        <span class="badge-categoria">${nombreCategoria}</span>
      </div>
      <div class="tarjeta-plato-contenido">
        <h3 class="tarjeta-plato-nombre">${plato.nombre}</h3>
        <p class="tarjeta-plato-descripcion">${plato.descripcion}</p>
        <div class="tarjeta-plato-footer">
          <span class="tarjeta-plato-precio">S/ ${plato.precio.toFixed(2)}</span>
          <button class="btn-agregar-rapido" 
                  data-plato-id="${plato.id}"
                  aria-label="Agregar ${plato.nombre} al carrito"
                  title="Personalizar y agregar">
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
  const icono = obtenerIconoCategoria(plato.categoria);
  
  return `
    <div class="tarjeta-plato-simple" 
         data-plato-id="${plato.id}"
         tabindex="0"
         role="button"
         aria-label="Ver detalles de ${plato.nombre}">
      <div class="plato-simple-info">
        <span class="plato-simple-icono">${icono}</span>
        <span class="plato-simple-nombre">${plato.nombre}</span>
      </div>
      <div class="plato-simple-acciones">
        <span class="plato-simple-precio">S/ ${plato.precio.toFixed(2)}</span>
        <button class="btn-agregar-simple" 
                data-plato-id="${plato.id}"
                aria-label="Agregar ${plato.nombre}"
                title="Personalizar y agregar">
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
  // Click en tarjetas
  const tarjetas = document.querySelectorAll('.tarjeta-plato, .tarjeta-plato-simple');
  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', (e) => {
      // No abrir modal si se hizo click en el botón de agregar
      if (e.target.closest('.btn-agregar-rapido') || e.target.closest('.btn-agregar-simple')) {
        return;
      }
      const platoId = tarjeta.getAttribute('data-plato-id');
      abrirModalPlato(platoId);
    });
    
    // Accesibilidad: Enter y Space
    tarjeta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const platoId = tarjeta.getAttribute('data-plato-id');
        abrirModalPlato(platoId);
      }
    });
  });
  
  // Click en botones de agregar rápido
  const botonesAgregar = document.querySelectorAll('.btn-agregar-rapido, .btn-agregar-simple');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const platoId = boton.getAttribute('data-plato-id');
      abrirModalPlato(platoId);
    });
  });
}

function actualizarContador() {
  const contador = document.getElementById('numResultados');
  if (contador) {
    contador.textContent = platosFiltrados.length;
  }
}

// ==========================================================
// MODAL DE PERSONALIZACIÓN
// ==========================================================

function inicializarModalPlato() {
  const modal = document.getElementById('modalPlato');
  const btnCerrar = document.getElementById('btnCerrarModalPlato');
  const overlay = modal.querySelector('.modal-overlay-plato');
  const btnRestar = document.getElementById('btnRestarCantidad');
  const btnSumar = document.getElementById('btnSumarCantidad');
  const btnAgregar = document.getElementById('btnAgregarCarrito');
  const textareaObservacion = document.getElementById('observacionPlato');
  
  // Cerrar modal
  btnCerrar.addEventListener('click', cerrarModalPlato);
  overlay.addEventListener('click', cerrarModalPlato);
  
  // Tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalPlato();
    }
  });
  
  // Control de cantidad
  btnRestar.addEventListener('click', () => {
    if (cantidadActual > 1) {
      cantidadActual--;
      actualizarCantidadModal();
    }
  });
  
  btnSumar.addEventListener('click', () => {
    if (cantidadActual < 99) {
      cantidadActual++;
      actualizarCantidadModal();
    }
  });
  
  // Contador de caracteres
  textareaObservacion.addEventListener('input', () => {
    const contador = document.getElementById('contadorObservacion');
    contador.textContent = textareaObservacion.value.length;
  });
  
  // Botón agregar al carrito
  btnAgregar.addEventListener('click', agregarAlCarrito);
}

function abrirModalPlato(platoId) {
  const plato = datosMenu.platos.find(p => p.id === platoId);
  if (!plato) return;
  
  platoSeleccionado = plato;
  cantidadActual = 1;
  guarnicionesSeleccionadas = [];
  
  const modal = document.getElementById('modalPlato');
  
  // Rellenar información básica
  document.getElementById('modalPlatoImg').src = plato.imagen;
  document.getElementById('modalPlatoImg').alt = plato.nombre;
  document.getElementById('modalPlatoTitulo').textContent = plato.nombre;
  document.getElementById('modalPlatoPrecio').textContent = `S/ ${plato.precio.toFixed(2)}`;
  document.getElementById('modalPlatoDescripcion').textContent = plato.descripcion;
  
  // Generar opciones dinámicas
  generarOpcionesPlato(plato);
  
  // Generar guarniciones
  generarGuarniciones(plato);
  
  // Mostrar/ocultar campo de observación
  const containerObs = document.getElementById('modalObservacionContainer');
  if (plato.permiteObservacion) {
    containerObs.style.display = 'flex';
    document.getElementById('observacionPlato').value = '';
    document.getElementById('contadorObservacion').textContent = '0';
  } else {
    containerObs.style.display = 'none';
  }
  
  // Resetear cantidad
  actualizarCantidadModal();
  
  // Mostrar modal
  modal.classList.add('activo');
  document.body.style.overflow = 'hidden';
  
  // Focus en el botón cerrar
  document.getElementById('btnCerrarModalPlato').focus();
}

function cerrarModalPlato() {
  const modal = document.getElementById('modalPlato');
  modal.classList.remove('activo');
  document.body.style.overflow = 'auto';
  platoSeleccionado = null;
}

function generarOpcionesPlato(plato) {
  const container = document.getElementById('modalOpcionesContainer');
  container.innerHTML = '';
  
  if (!plato.opciones) return;
  
  // Iterar sobre cada tipo de opción
  Object.keys(plato.opciones).forEach(tipoOpcion => {
    const valores = plato.opciones[tipoOpcion];
    if (!valores || valores.length === 0) return;
    
    const nombreOpcion = formatearNombreOpcion(tipoOpcion);
    
    let html = `
      <div class="opcion-grupo" data-opcion="${tipoOpcion}">
        <h4>${nombreOpcion}</h4>
        <div class="opcion-lista">
    `;
    
    valores.forEach((valor, index) => {
      const checked = index === 0 ? 'checked' : '';
      const inputId = `${tipoOpcion}-${index}`;
      
      html += `
        <div class="opcion-item">
          <input type="radio" 
                 id="${inputId}" 
                 name="${tipoOpcion}" 
                 value="${valor}" 
                 ${checked}>
          <label for="${inputId}">${valor}</label>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    container.innerHTML += html;
  });
}

function formatearNombreOpcion(key) {
  const nombres = {
    'picante': '🌶️ Nivel de Picante',
    'termino': '🔥 Término de Cocción',
    'temperatura': '🌡️ Temperatura',
    'tamanio': '📏 Tamaño',
    'tipo': '🍽️ Tipo'
  };
  return nombres[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function generarGuarniciones(plato) {
  const container = document.getElementById('modalGuarnicionesContainer');
  const lista = document.getElementById('listaGuarniciones');
  
  if (!plato.guarniciones || !plato.guarniciones.lista || plato.guarniciones.lista.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  guarnicionesSeleccionadas = [];
  
  const maxGuarniciones = plato.guarniciones.max || 2;
  
  let html = '';
  plato.guarniciones.lista.forEach((guarnicion, index) => {
    const inputId = `guarnicion-${index}`;
    html += `
      <div class="guarnicion-item">
        <input type="checkbox" 
               id="${inputId}" 
               name="guarnicion" 
               value="${guarnicion}"
               data-max="${maxGuarniciones}">
        <label for="${inputId}">${guarnicion}</label>
      </div>
    `;
  });
  
  lista.innerHTML = html;
  actualizarContadorGuarniciones(0, maxGuarniciones);
  
  // Event listeners para checkboxes
  const checkboxes = lista.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      manejarSeleccionGuarnicion(checkboxes, maxGuarniciones);
    });
  });
}

function manejarSeleccionGuarnicion(checkboxes, max) {
  const seleccionados = Array.from(checkboxes).filter(cb => cb.checked);
  guarnicionesSeleccionadas = seleccionados.map(cb => cb.value);
  
  // Deshabilitar los no seleccionados si se llegó al máximo
  if (seleccionados.length >= max) {
    checkboxes.forEach(cb => {
      if (!cb.checked) {
        cb.disabled = true;
      }
    });
  } else {
    checkboxes.forEach(cb => {
      cb.disabled = false;
    });
  }
  
  actualizarContadorGuarniciones(seleccionados.length, max);
}

function actualizarContadorGuarniciones(actual, max) {
  const contador = document.getElementById('contadorGuarniciones');
  contador.textContent = `${actual}/${max} seleccionadas`;
  
  if (actual >= max) {
    contador.classList.add('limite');
  } else {
    contador.classList.remove('limite');
  }
}

function actualizarCantidadModal() {
  document.getElementById('cantidadPlato').textContent = cantidadActual;
  
  // Actualizar subtotal
  if (platoSeleccionado) {
    const subtotal = platoSeleccionado.precio * cantidadActual;
    document.getElementById('modalSubtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
  }
  
  // Habilitar/deshabilitar botones
  document.getElementById('btnRestarCantidad').disabled = cantidadActual <= 1;
  document.getElementById('btnSumarCantidad').disabled = cantidadActual >= 99;
}

// ==========================================================
// AGREGAR AL CARRITO
// ==========================================================

function agregarAlCarrito() {
  if (!platoSeleccionado) return;
  
  // Recopilar opciones seleccionadas
  const opcionesSeleccionadas = {};
  
  if (platoSeleccionado.opciones) {
    Object.keys(platoSeleccionado.opciones).forEach(tipoOpcion => {
      const radioSeleccionado = document.querySelector(`input[name="${tipoOpcion}"]:checked`);
      if (radioSeleccionado) {
        opcionesSeleccionadas[tipoOpcion] = radioSeleccionado.value;
      }
    });
  }
  
  // Obtener observación
  const observacion = platoSeleccionado.permiteObservacion 
    ? document.getElementById('observacionPlato').value.trim() 
    : '';
  
  // Crear objeto del item
  const itemCarrito = {
    id: generarIdUnico(),
    platoId: platoSeleccionado.id,
    nombre: platoSeleccionado.nombre,
    precio: platoSeleccionado.precio,
    cantidad: cantidadActual,
    opciones: opcionesSeleccionadas,
    guarniciones: [...guarnicionesSeleccionadas],
    observacion: observacion,
    subtotal: platoSeleccionado.precio * cantidadActual
  };
  
  // Llamar a la función del carrito (definida en carrito.js)
  if (typeof agregarItemCarrito === 'function') {
    agregarItemCarrito(itemCarrito);
  }
  
  // Mostrar notificación
  mostrarToast(`${platoSeleccionado.nombre} agregado al pedido`);
  
  // Cerrar modal
  cerrarModalPlato();
}

function generarIdUnico() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==========================================================
// NOTIFICACIÓN TOAST
// ==========================================================

function mostrarToast(mensaje) {
  const toast = document.getElementById('toastNotificacion');
  const textoToast = document.getElementById('toastMensaje');
  
  textoToast.textContent = mensaje;
  toast.classList.add('mostrar');
  
  setTimeout(() => {
    toast.classList.remove('mostrar');
  }, 3000);
}

// ==========================================================
// MENÚ MÓVIL
// ==========================================================

function inicializarMenuMovil() {
  const botonMenu = document.querySelector('.boton-menu-movil');
  const menuNav = document.querySelector('.lista-navegacion');

  if (!botonMenu || !menuNav) return;

  botonMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const estaAbierto = menuNav.classList.contains('mostrar');
    
    menuNav.classList.toggle('mostrar');
    botonMenu.classList.toggle('activo');
    botonMenu.setAttribute('aria-expanded', !estaAbierto);
  });

  document.querySelectorAll('.enlace-nav').forEach(enlace => {
    enlace.addEventListener('click', () => {
      menuNav.classList.remove('mostrar');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!botonMenu.contains(e.target) && !menuNav.contains(e.target)) {
      menuNav.classList.remove('mostrar');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==========================================================
// EXPORTAR FUNCIONES NECESARIAS
// ==========================================================

// Estas funciones serán usadas por carrito.js
window.mostrarToast = mostrarToast;
window.datosMenu = datosMenu;