/* ==========================================================
   CARTA.JS - SISTEMA DE MENÚ INTERACTIVO
   La Arboleda Club - Tacna, Perú
   ========================================================== */

// ==========================================================
// DATOS DE LA CARTA
// ==========================================================

const datosPlatos = [
  // PIQUEOS
  {
    id: 1,
    nombre: "Canchita Picante",
    descripcion: "Maíz cancha tostado con especias peruanas y un toque de picante.",
    precio: 8.00,
    categoria: "piqueos",
    imagen: "imagenes/menu/canchita.jpg",
    icono: "🌽",
    opciones: {
      picante: ["Sin picante", "Poco picante", "Picante", "Muy picante"]
    },
    disponible: true
  },
  {
    id: 2,
    nombre: "Tequeños de Queso",
    descripcion: "Crujientes palitos de masa rellenos de queso fundido, servidos con guacamole.",
    precio: 18.00,
    categoria: "piqueos",
    imagen: "imagenes/menu/teque-os.jpg",
    icono: "🧀",
    opciones: {},
    disponible: true
  },
  {
    id: 3,
    nombre: "Choclo con Queso",
    descripcion: "Choclo tierno acompañado de queso fresco.",
    precio: 12.00,
    categoria: "piqueos",
    imagen: "imagenes/menu/choclo-con-queso.jpg",
    icono: "🌽",
    opciones: {},
    disponible: true
  },
  {
    id: 4,
    nombre: "Anticuchos de Corazón",
    descripcion: "Brochetas de corazón de res marinadas en ají panca, servidas con papas doradas y choclo.",
    precio: 28.00,
    categoria: "piqueos",
    imagen: "imagenes/menu/anticuchos.jpg",
    icono: "🍢",
    opciones: {
      termino: ["Término medio", "Tres cuartos", "Bien cocido"]
    },
    disponible: true
  },

  // CEVICHES
  {
    id: 5,
    nombre: "Ceviche Clásico",
    descripcion: "Pescado fresco marinado en limón con cebolla morada, ají limo y cilantro. Servido con camote y choclo.",
    precio: 38.00,
    categoria: "ceviches",
    imagen: "imagenes/menu/ceviche-clasico.jpg",
    icono: "🐟",
    opciones: {
      picante: ["Sin picante", "Poco picante", "Picante", "Muy picante"]
    },
    disponible: true
  },
  {
    id: 6,
    nombre: "Ceviche Mixto",
    descripcion: "Combinación de pescado, camarones y calamares en leche de tigre con toques cítricos.",
    precio: 48.00,
    categoria: "ceviches",
    imagen: "imagenes/menu/ceviche-mixto.jpg",
    icono: "🦐",
    opciones: {
      picante: ["Sin picante", "Poco picante", "Picante", "Muy picante"]
    },
    disponible: true
  },
  {
    id: 7,
    nombre: "Leche de Tigre",
    descripcion: "El jugo del ceviche servido en copa con trozos de pescado, cebolla y ají.",
    precio: 22.00,
    categoria: "ceviches",
    imagen: "imagenes/menu/leche-tigre.jpg",
    icono: "🥛",
    opciones: {
      picante: ["Sin picante", "Poco picante", "Picante", "Muy picante"]
    },
    disponible: true
  },

  // PLATOS DE FONDO
  {
    id: 8,
    nombre: "Lomo Saltado",
    descripcion: "Tiras de lomo fino salteadas con cebolla, tomate y ají amarillo, acompañadas de papas fritas y arroz.",
    precio: 42.00,
    categoria: "fondos",
    imagen: "imagenes/menu/lomo-saltado.jpg",
    icono: "🥩",
    opciones: {
      termino: ["Término medio", "Tres cuartos", "Bien cocido"]
    },
    guarniciones: true,
    disponible: true
  },
  {
    id: 9,
    nombre: "Arroz con Mariscos",
    descripcion: "Arroz cremoso con camarones, calamares, mejillones y langostinos en salsa de mariscos.",
    precio: 52.00,
    categoria: "fondos",
    imagen: "imagenes/menu/arroz-mariscos.jpg",
    icono: "🦑",
    opciones: {},
    disponible: true
  },
  {
    id: 10,
    nombre: "Ají de Gallina",
    descripcion: "Pollo deshilachado en crema de ají amarillo con nueces, servido con arroz y papas.",
    precio: 35.00,
    categoria: "fondos",
    imagen: "imagenes/menu/aji-gallina.jpg",
    icono: "🍗",
    opciones: {
      picante: ["Suave", "Medio", "Picante"]
    },
    disponible: true
  },
  {
    id: 11,
    nombre: "Parihuela",
    descripcion: "Sopa de mariscos con pescado, camarones, cangrejo y choros en caldo picante.",
    precio: 58.00,
    categoria: "fondos",
    imagen: "imagenes/menu/parihuela.jpg",
    icono: "🍲",
    opciones: {
      picante: ["Poco picante", "Picante", "Muy picante"]
    },
    disponible: true
  },

  // PASTAS
  {
    id: 12,
    nombre: "Fetuccini Alfredo",
    descripcion: "Pasta en cremosa salsa alfredo con champiñones y pollo grillado.",
    precio: 36.00,
    categoria: "pastas",
    imagen: "imagenes/menu/fetuccini.jpg",
    icono: "🍝",
    opciones: {},
    disponible: true
  },
  {
    id: 13,
    nombre: "Spaghetti a la Huancaína",
    descripcion: "Spaghetti en salsa huancaína con lomo saltado encima.",
    precio: 42.00,
    categoria: "pastas",
    imagen: "imagenes/menu/spaghetti-huancaina.jpg",
    icono: "🍝",
    opciones: {
      picante: ["Suave", "Medio", "Picante"]
    },
    disponible: true
  },

  // BEBIDAS
  {
    id: 14,
    nombre: "Chicha Morada",
    descripcion: "Bebida tradicional peruana de maíz morado con frutas y especias.",
    precio: 10.00,
    categoria: "bebidas",
    imagen: "imagenes/menu/chicha-morada.jpg",
    icono: "🍇",
    opciones: {
      temperatura: ["Natural", "Fría", "Con hielo"]
    },
    disponible: true
  },
  {
    id: 15,
    nombre: "Pisco Sour",
    descripcion: "Cóctel clásico peruano con pisco, limón, jarabe, clara de huevo y amargo de angostura.",
    precio: 25.00,
    categoria: "bebidas",
    imagen: "imagenes/menu/pisco-sour.jpg",
    icono: "🍸",
    opciones: {},
    disponible: true
  },
  {
    id: 16,
    nombre: "Limonada Frozen",
    descripcion: "Limonada refrescante con hielo frappé y hierba buena.",
    precio: 12.00,
    categoria: "bebidas",
    imagen: "imagenes/menu/limonada.jpg",
    icono: "🍋",
    opciones: {
      tamanio: ["Regular", "Grande"]
    },
    disponible: true
  },

  // POSTRES
  {
    id: 17,
    nombre: "Suspiro a la Limeña",
    descripcion: "Dulce de leche cubierto con merengue de oporto y canela.",
    precio: 18.00,
    categoria: "postres",
    imagen: "imagenes/menu/suspiro.jpg",
    icono: "🍮",
    opciones: {},
    disponible: true
  },
  {
    id: 18,
    nombre: "Tres Leches",
    descripcion: "Bizcocho bañado en tres leches, decorado con crema chantilly.",
    precio: 20.00,
    categoria: "postres",
    imagen: "imagenes/menu/tres-leches.jpg",
    icono: "🍰",
    opciones: {},
    disponible: true
  },
  {
    id: 19,
    nombre: "Helado Artesanal",
    descripcion: "Helado casero de lúcuma, maracuyá o chirimoya.",
    precio: 15.00,
    categoria: "postres",
    imagen: "imagenes/menu/helado.jpg",
    icono: "🍨",
    opciones: {
      tipo: ["Lúcuma", "Maracuyá", "Chirimoya"]
    },
    disponible: true
  }
];

// Categorías
const categorias = [
  { id: "todos", nombre: "Todos", icono: "🍽️" },
  { id: "piqueos", nombre: "Piqueos", icono: "🥢" },
  { id: "ceviches", nombre: "Ceviches", icono: "🐟" },
  { id: "fondos", nombre: "Fondos", icono: "🍲" },
  { id: "pastas", nombre: "Pastas", icono: "🍝" },
  { id: "bebidas", nombre: "Bebidas", icono: "🥤" },
  { id: "postres", nombre: "Postres", icono: "🍰" }
];

// Guarniciones disponibles
const guarnicionesDisponibles = [
  "Papas fritas",
  "Arroz blanco",
  "Ensalada fresca",
  "Plátano frito",
  "Yuca frita",
  "Camote"
];

// Mozos disponibles
const mozosDisponibles = [
  { nombre: "Carlos", telefono: "908881162" },
  { nombre: "María", telefono: "908881163" },
  { nombre: "Pedro", telefono: "908881164" }
];

// ==========================================================
// VARIABLES GLOBALES
// ==========================================================

let categoriaActiva = "todos";
let terminoBusqueda = "";
let vistaActual = "detallada"; // "detallada" o "simple"
let platoSeleccionado = null;
let cantidadSeleccionada = 1;
let opcionesSeleccionadas = {};
let guarnicionesSeleccionadas = [];
const MAX_GUARNICIONES = 2;

// ==========================================================
// INICIALIZACIÓN
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  ocultarCargador();
  inicializarFiltros();
  inicializarBuscador();
  inicializarToggleVista();
  renderizarPlatos();
  inicializarModalPlato();
  inicializarModalVistaPrevia();
  inicializarMenuMovil();
  cargarMozos(mozosDisponibles);
});

// Ocultar cargador
function ocultarCargador() {
  setTimeout(() => {
    const cargador = document.getElementById('cargador-inicial');
    cargador.classList.add('oculto');
    setTimeout(() => {
      cargador.style.display = 'none';
    }, 600);
  }, 2000);
}

// ==========================================================
// FILTROS DE CATEGORÍAS
// ==========================================================

function inicializarFiltros() {
  const contenedorFiltros = document.getElementById('filtrosCategorias');
  
  let html = '';
  categorias.forEach(cat => {
    const activo = cat.id === categoriaActiva ? 'activo' : '';
    html += `
      <button class="filtro-categoria ${activo}" 
              data-categoria="${cat.id}"
              role="tab"
              aria-selected="${cat.id === categoriaActiva}"
              aria-controls="grillaPlatos">
        <span class="filtro-icono">${cat.icono}</span>
        ${cat.nombre}
      </button>
    `;
  });
  
  contenedorFiltros.innerHTML = html;
  
  // Event listeners
  const botones = contenedorFiltros.querySelectorAll('.filtro-categoria');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      // Actualizar estado activo
      botones.forEach(b => {
        b.classList.remove('activo');
        b.setAttribute('aria-selected', 'false');
      });
      boton.classList.add('activo');
      boton.setAttribute('aria-selected', 'true');
      
      // Filtrar
      categoriaActiva = boton.getAttribute('data-categoria');
      renderizarPlatos();
    });
  });
}

// ==========================================================
// BUSCADOR
// ==========================================================

function inicializarBuscador() {
  const buscador = document.getElementById('buscadorPlatos');
  const btnLimpiar = document.getElementById('btnLimpiarBusqueda');
  
  buscador.addEventListener('input', (e) => {
    terminoBusqueda = e.target.value.toLowerCase().trim();
    
    // Mostrar/ocultar botón limpiar
    btnLimpiar.style.display = terminoBusqueda ? 'block' : 'none';
    
    renderizarPlatos();
  });
  
  btnLimpiar.addEventListener('click', () => {
    buscador.value = '';
    terminoBusqueda = '';
    btnLimpiar.style.display = 'none';
    renderizarPlatos();
    buscador.focus();
  });
}

// ==========================================================
// TOGGLE DE VISTA
// ==========================================================

function inicializarToggleVista() {
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
}

// ==========================================================
// RENDERIZADO DE PLATOS
// ==========================================================

function renderizarPlatos() {
  const grilla = document.getElementById('grillaPlatos');
  const contador = document.getElementById('numResultados');
  const sinResultados = document.getElementById('sinResultados');
  
  // Filtrar platos
  let platosFiltrados = datosPlatos.filter(plato => {
    // Filtro por categoría
    const pasaCategoria = categoriaActiva === 'todos' || plato.categoria === categoriaActiva;
    
    // Filtro por búsqueda
    const pasaBusqueda = terminoBusqueda === '' || 
                         plato.nombre.toLowerCase().includes(terminoBusqueda) ||
                         plato.descripcion.toLowerCase().includes(terminoBusqueda);
    
    return pasaCategoria && pasaBusqueda && plato.disponible;
  });
  
  // Actualizar contador
  contador.textContent = platosFiltrados.length;
  
  // Verificar si hay resultados
  if (platosFiltrados.length === 0) {
    grilla.innerHTML = '';
    sinResultados.style.display = 'block';
    return;
  }
  
  sinResultados.style.display = 'none';
  
  // Renderizar según vista
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
  const categoriaNombre = categorias.find(c => c.id === plato.categoria)?.nombre || '';
  
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
        <span class="badge-categoria">${categoriaNombre}</span>
        <button class="btn-vista-previa" 
                data-plato-id="${plato.id}"
                aria-label="Ver imagen de ${plato.nombre}"
                onclick="event.stopPropagation();">
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
          <button class="btn-agregar-rapido" 
                  data-plato-id="${plato.id}"
                  aria-label="Agregar ${plato.nombre} al pedido"
                  onclick="event.stopPropagation();">
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
    <div class="tarjeta-plato-simple" 
         data-plato-id="${plato.id}"
         tabindex="0"
         role="button"
         aria-label="Agregar ${plato.nombre} al pedido">
      <div class="plato-simple-info">
        <span class="plato-simple-icono">${plato.icono}</span>
        <span class="plato-simple-nombre">${plato.nombre}</span>
      </div>
      <div class="plato-simple-acciones">
        <span class="plato-simple-precio">S/ ${plato.precio.toFixed(2)}</span>
        <button class="btn-agregar-simple" 
                data-plato-id="${plato.id}"
                aria-label="Agregar ${plato.nombre}"
                onclick="event.stopPropagation();">
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
  // Tarjetas detalladas - click en toda la tarjeta abre modal de personalización
  const tarjetasDetalladas = document.querySelectorAll('.tarjeta-plato');
  tarjetasDetalladas.forEach(tarjeta => {
    tarjeta.addEventListener('click', (e) => {
      // Si no es el botón de vista previa ni agregar rápido
      if (!e.target.closest('.btn-vista-previa') && !e.target.closest('.btn-agregar-rapido')) {
        const platoId = parseInt(tarjeta.getAttribute('data-plato-id'));
        abrirModalPlato(platoId);
      }
    });
    
    tarjeta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const platoId = parseInt(tarjeta.getAttribute('data-plato-id'));
        abrirModalPlato(platoId);
      }
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
  
  // Botones agregar rápido (en tarjetas detalladas)
  const botonesAgregarRapido = document.querySelectorAll('.btn-agregar-rapido');
  botonesAgregarRapido.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const platoId = parseInt(boton.getAttribute('data-plato-id'));
      abrirModalPlato(platoId);
    });
  });
  
  // Tarjetas simples - click abre modal de personalización
  const tarjetasSimples = document.querySelectorAll('.tarjeta-plato-simple');
  tarjetasSimples.forEach(tarjeta => {
    tarjeta.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-agregar-simple')) {
        const platoId = parseInt(tarjeta.getAttribute('data-plato-id'));
        abrirModalPlato(platoId);
      }
    });
    
    tarjeta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const platoId = parseInt(tarjeta.getAttribute('data-plato-id'));
        abrirModalPlato(platoId);
      }
    });
  });
  
  // Botones agregar simple
  const botonesAgregarSimple = document.querySelectorAll('.btn-agregar-simple');
  botonesAgregarSimple.forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      const platoId = parseInt(boton.getAttribute('data-plato-id'));
      abrirModalPlato(platoId);
    });
  });
}

// ==========================================================
// MODAL DE VISTA PREVIA (IMAGEN GRANDE)
// ==========================================================

function inicializarModalVistaPrevia() {
  const modal = document.getElementById('modalVistaPrevia');
  const btnCerrar = document.getElementById('btnCerrarVistaPrevia');
  const overlay = modal.querySelector('.modal-overlay-vista');
  const btnAgregar = document.getElementById('btnAgregarDesdeVista');
  
  // Cerrar modal
  btnCerrar.addEventListener('click', cerrarModalVistaPrevia);
  overlay.addEventListener('click', cerrarModalVistaPrevia);
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalVistaPrevia();
    }
  });
  
  // Botón agregar desde vista previa
  btnAgregar.addEventListener('click', () => {
    const platoId = parseInt(btnAgregar.getAttribute('data-plato-id'));
    cerrarModalVistaPrevia();
    setTimeout(() => {
      abrirModalPlato(platoId);
    }, 300);
  });
}

function abrirModalVistaPrevia(platoId) {
  const plato = datosPlatos.find(p => p.id === platoId);
  if (!plato) return;
  
  const modal = document.getElementById('modalVistaPrevia');
  
  // Llenar datos
  document.getElementById('vistaPreviaImg').src = plato.imagen;
  document.getElementById('vistaPreviaImg').alt = plato.nombre;
  document.getElementById('vistaPreviaTitulo').textContent = plato.nombre;
  document.getElementById('vistaPreviaPrecio').textContent = `S/ ${plato.precio.toFixed(2)}`;
  document.getElementById('vistaPreviaDescripcion').textContent = plato.descripcion;
  document.getElementById('btnAgregarDesdeVista').setAttribute('data-plato-id', platoId);
  
  // Mostrar modal
  modal.classList.add('activo');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus en botón cerrar
  document.getElementById('btnCerrarVistaPrevia').focus();
}

function cerrarModalVistaPrevia() {
  const modal = document.getElementById('modalVistaPrevia');
  modal.classList.remove('activo');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

// ==========================================================
// MODAL DE PERSONALIZACIÓN DEL PLATO
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
  
  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('activo')) {
      cerrarModalPlato();
    }
  });
  
  // Control de cantidad
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
  
  // Contador de caracteres
  textareaObservacion.addEventListener('input', () => {
    const contador = document.getElementById('contadorObservacion');
    contador.textContent = textareaObservacion.value.length;
  });
  
  // Agregar al carrito
  btnAgregar.addEventListener('click', agregarAlCarrito);
}

function abrirModalPlato(platoId) {
  platoSeleccionado = datosPlatos.find(p => p.id === platoId);
  if (!platoSeleccionado) return;
  
  // Resetear valores
  cantidadSeleccionada = 1;
  opcionesSeleccionadas = {};
  guarnicionesSeleccionadas = [];
  
  // Llenar información básica
  document.getElementById('modalPlatoImg').src = platoSeleccionado.imagen;
  document.getElementById('modalPlatoImg').alt = platoSeleccionado.nombre;
  document.getElementById('modalPlatoTitulo').textContent = platoSeleccionado.nombre;
  document.getElementById('modalPlatoPrecio').textContent = `S/ ${platoSeleccionado.precio.toFixed(2)}`;
  document.getElementById('modalPlatoDescripcion').textContent = platoSeleccionado.descripcion;
  
  // Generar opciones dinámicas
  generarOpcionesPlato();
  
  // Generar guarniciones si aplica
  generarGuarniciones();
  
  // Mostrar campo de observación
  document.getElementById('modalObservacionContainer').style.display = 'block';
  document.getElementById('observacionPlato').value = '';
  document.getElementById('contadorObservacion').textContent = '0';
  
  // Actualizar cantidad y subtotal
  actualizarCantidadModal();
  
  // Mostrar modal
  const modal = document.getElementById('modalPlato');
  modal.classList.add('activo');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus en el primer elemento interactivo
  setTimeout(() => {
    const primerInput = modal.querySelector('input, button:not(.boton-cerrar-modal)');
    if (primerInput) primerInput.focus();
  }, 100);
}

function cerrarModalPlato() {
  const modal = document.getElementById('modalPlato');
  modal.classList.remove('activo');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
  platoSeleccionado = null;
}

function generarOpcionesPlato() {
  const contenedor = document.getElementById('modalOpcionesContainer');
  contenedor.innerHTML = '';
  
  if (!platoSeleccionado.opciones || Object.keys(platoSeleccionado.opciones).length === 0) {
    contenedor.style.display = 'none';
    return;
  }
  
  contenedor.style.display = 'flex';
  
  Object.entries(platoSeleccionado.opciones).forEach(([key, valores]) => {
    const grupoHTML = `
      <div class="opcion-grupo">
        <h4>${formatearNombreOpcion(key)}</h4>
        <div class="opcion-lista">
          ${valores.map((valor, index) => `
            <div class="opcion-item">
              <input type="radio" 
                     id="opcion_${key}_${index}" 
                     name="opcion_${key}" 
                     value="${valor}"
                     ${index === 0 ? 'checked' : ''}
                     onchange="seleccionarOpcion('${key}', '${valor}')">
              <label for="opcion_${key}_${index}">${valor}</label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    contenedor.innerHTML += grupoHTML;
    
    // Seleccionar primera opción por defecto
    opcionesSeleccionadas[key] = valores[0];
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

function seleccionarOpcion(key, valor) {
  opcionesSeleccionadas[key] = valor;
}

function generarGuarniciones() {
  const contenedor = document.getElementById('modalGuarnicionesContainer');
  const lista = document.getElementById('listaGuarniciones');
  
  if (!platoSeleccionado.guarniciones) {
    contenedor.style.display = 'none';
    return;
  }
  
  contenedor.style.display = 'block';
  guarnicionesSeleccionadas = [];
  
  let html = '';
  guarnicionesDisponibles.forEach((guarnicion, index) => {
    html += `
      <div class="guarnicion-item">
        <input type="checkbox" 
               id="guarnicion_${index}" 
               value="${guarnicion}"
               onchange="toggleGuarnicion('${guarnicion}', this)">
        <label for="guarnicion_${index}">${guarnicion}</label>
      </div>
    `;
  });
  
  lista.innerHTML = html;
  actualizarContadorGuarniciones();
}

function toggleGuarnicion(guarnicion, checkbox) {
  if (checkbox.checked) {
    if (guarnicionesSeleccionadas.length < MAX_GUARNICIONES) {
      guarnicionesSeleccionadas.push(guarnicion);
    } else {
      checkbox.checked = false;
      mostrarToast(`Máximo ${MAX_GUARNICIONES} guarniciones permitidas`);
    }
  } else {
    const index = guarnicionesSeleccionadas.indexOf(guarnicion);
    if (index > -1) {
      guarnicionesSeleccionadas.splice(index, 1);
    }
  }
  
  actualizarContadorGuarniciones();
}

function actualizarContadorGuarniciones() {
  const contador = document.getElementById('contadorGuarniciones');
  contador.textContent = `${guarnicionesSeleccionadas.length}/${MAX_GUARNICIONES} seleccionadas`;
  
  if (guarnicionesSeleccionadas.length >= MAX_GUARNICIONES) {
    contador.classList.add('limite');
    // Deshabilitar checkboxes no seleccionados
    const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (!cb.checked) {
        cb.disabled = true;
      }
    });
  } else {
    contador.classList.remove('limite');
    // Habilitar todos los checkboxes
    const checkboxes = document.querySelectorAll('#listaGuarniciones input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.disabled = false;
    });
  }
}

function actualizarCantidadModal() {
  document.getElementById('cantidadPlato').textContent = cantidadSeleccionada;
  
  // Actualizar estado de botones
  document.getElementById('btnRestarCantidad').disabled = cantidadSeleccionada <= 1;
  document.getElementById('btnSumarCantidad').disabled = cantidadSeleccionada >= 99;
  
  // Actualizar subtotal
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
  
  const observacion = document.getElementById('observacionPlato').value.trim();
  
  const itemCarrito = {
    id: Date.now(), // ID único para el item del carrito
    platoId: platoSeleccionado.id,
    nombre: platoSeleccionado.nombre,
    precio: platoSeleccionado.precio,
    cantidad: cantidadSeleccionada,
    opciones: { ...opcionesSeleccionadas },
    guarniciones: [...guarnicionesSeleccionadas],
    observacion: observacion,
    subtotal: platoSeleccionado.precio * cantidadSeleccionada
  };
  
  // Agregar al carrito (función del carrito.js)
  agregarItemCarrito(itemCarrito);
  
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
  const mensajeEl = document.getElementById('toastMensaje');
  
  mensajeEl.textContent = mensaje;
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
  const listaNav = document.querySelector('.lista-navegacion');
  
  botonMenu.addEventListener('click', () => {
    const estaAbierto = listaNav.classList.toggle('mostrar');
    botonMenu.classList.toggle('activo');
    botonMenu.setAttribute('aria-expanded', estaAbierto);
  });
  
  // Cerrar menú al hacer click en un enlace
  const enlaces = listaNav.querySelectorAll('.enlace-nav');
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', () => {
      listaNav.classList.remove('mostrar');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// ==========================================================
// EXPORTAR FUNCIONES GLOBALES
// ==========================================================

window.seleccionarOpcion = seleccionarOpcion;
window.toggleGuarnicion = toggleGuarnicion;
window.mostrarToast = mostrarToast;
