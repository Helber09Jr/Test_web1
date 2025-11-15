window.addEventListener('load', () => {
  const cargador = document.getElementById('cargador-inicial');
  if (cargador) {
    setTimeout(() => {
      cargador.classList.add('oculto');
      setTimeout(() => {
        cargador.remove();
      }, 600);
    }, 2200);
  }
});

const datosInstalaciones = {
  restaurante: {
    titulo: "Restaurante & Bar",
    tipoAccion: "simple",
    descripcion: "Disfruta de una experiencia gastronómica excepcional con platillos gourmet que encantan y bebidas premium que refrescan.",
    caracteristicas: ["Menú variado", "Bar completo", "Ambiente elegante", "Atención personalizada"],
    capacidad: "Capacidad: 120 personas",
    imagenes: ["imagenes/instalaciones/restaurante-1.jpg", "imagenes/instalaciones/restaurante-2.jpg"]
  },
  piscina: {
    titulo: "Piscina",
    tipoAccion: "simple",
    descripcion: "Sumérgete en un ambiente paradisíaco perfecto para relajarte y disfrutar del mejor verano con la familia.",
    caracteristicas: ["Agua tratada", "Salvavidas", "Duchas disponibles", "Áreas verdes"],
    capacidad: "Horario: 9:00 AM - 5:00 PM",
    imagenes: ["imagenes/instalaciones/piscina-1.jpg", "imagenes/instalaciones/piscina-2.jpg"]
  },
  parrillas: {
    titulo: "Zonas de Parrillas",
    tipoAccion: "reservar",
    subInstalaciones: [
      {
        nombre: "Parrilla Central",
        descripcion: "Parrilla principal con vista panorámica, ideal para grupos grandes.",
        caracteristicas: ["Techada", "Mesa 12 personas", "Lavadero", "Electricidad"],
        capacidad: "Capacidad: 15-20 personas",
        imagenes: ["imagenes/instalaciones/parrillas-central-1.jpg", "imagenes/instalaciones/parrillas-central-2.jpg"]
      },
      {
        nombre: "Parrilla Grande",
        descripcion: "Espacio amplio con parrilla de gran tamaño para eventos familiares.",
        caracteristicas: ["Semi-techada", "Mesa 10 personas", "Lavadero", "Área verde"],
        capacidad: "Capacidad: 12-15 personas",
        imagenes: ["imagenes/instalaciones/parrillas-grande-1.jpg", "imagenes/instalaciones/parrillas-grande-2.jpg"]
      },
      {
        nombre: "Parrilla Familiar",
        descripcion: "Zona acogedora perfecta para reuniones familiares íntimas.",
        caracteristicas: ["Techada", "Mesa 8 personas", "Bancas", "Área infantil cerca"],
        capacidad: "Capacidad: 8-10 personas",
        imagenes: ["imagenes/instalaciones/parrillas-familiar-1.jpg", "imagenes/instalaciones/parrillas-familiar-2.jpg"]
      },
      {
        nombre: "Parrilla 1",
        descripcion: "Parrilla individual con espacio privado y equipamiento completo.",
        caracteristicas: ["Privada", "Mesa 6 personas", "Lavadero", "Sombra natural"],
        capacidad: "Capacidad: 6-8 personas",
        imagenes: ["imagenes/instalaciones/parrillas-1a.jpg", "imagenes/instalaciones/parrillas-1b.jpg"]
      },
      {
        nombre: "Parrilla 2",
        descripcion: "Segunda parrilla individual con ambiente tranquilo.",
        caracteristicas: ["Privada", "Mesa 6 personas", "Lavadero", "Vista al jardín"],
        capacidad: "Capacidad: 6-8 personas",
        imagenes: ["imagenes/instalaciones/parrillas-2a.jpg", "imagenes/instalaciones/parrillas-2b.jpg"]
      },
      {
        nombre: "Parrilla 3",
        descripcion: "Parrilla compacta ideal para grupos pequeños.",
        caracteristicas: ["Semi-privada", "Mesa 4 personas", "Lavadero", "Acceso fácil"],
        capacidad: "Capacidad: 4-6 personas",
        imagenes: ["imagenes/instalaciones/parrillas-3a.jpg", "imagenes/instalaciones/parrillas-3b.jpg"]
      }
    ]
  },
  deportes: {
    titulo: "Canchas Deportivas",
    tipoAccion: "reservar",
    subInstalaciones: [
      {
        nombre: "Cancha de Tenis",
        descripcion: "Cancha profesional con superficie de arcilla y equipamiento completo.",
        caracteristicas: ["Iluminación LED", "Red profesional", "Bancas laterales", "Bebedero"],
        capacidad: "Capacidad: 2-4 jugadores",
        imagenes: ["imagenes/instalaciones/deportes-tenis-1.jpg", "imagenes/instalaciones/deportes-tenis-2.jpg"]
      },
      {
        nombre: "Cancha de Fútbol",
        descripcion: "Campo de grass sintético para partidos de fútbol 7.",
        caracteristicas: ["Grass sintético", "Arcos metálicos", "Iluminación", "Marcación oficial"],
        capacidad: "Capacidad: 14 jugadores",
        imagenes: ["imagenes/instalaciones/deportes-futbol-1.jpg", "imagenes/instalaciones/deportes-futbol-2.jpg"]
      },
      {
        nombre: "Frontón",
        descripcion: "Cancha de frontón con pared reglamentaria para pelota vasca.",
        caracteristicas: ["Pared oficial", "Piso antideslizante", "Marcación", "Techado parcial"],
        capacidad: "Capacidad: 2-4 jugadores",
        imagenes: ["imagenes/instalaciones/deportes-fronton-1.jpg", "imagenes/instalaciones/deportes-fronton-2.jpg"]
      },
      {
        nombre: "Cancha de Vóley",
        descripcion: "Cancha de vóley con arena fina y red profesional.",
        caracteristicas: ["Arena de playa", "Red ajustable", "Líneas marcadas", "Bancas"],
        capacidad: "Capacidad: 12 jugadores",
        imagenes: ["imagenes/instalaciones/deportes-voley-1.jpg", "imagenes/instalaciones/deportes-voley-2.jpg"]
      },
      {
        nombre: "Cancha de Básquet",
        descripcion: "Cancha de básquetbol con tableros profesionales.",
        caracteristicas: ["Piso de cemento", "Aros oficiales", "Iluminación", "Líneas marcadas"],
        capacidad: "Capacidad: 10 jugadores",
        imagenes: ["imagenes/instalaciones/deportes-basquet-1.jpg", "imagenes/instalaciones/deportes-basquet-2.jpg"]
      }
    ]
  },
  eventos: {
    titulo: "Zona para Eventos",
    tipoAccion: "reservar",
    subInstalaciones: [
      {
        nombre: "Cabañita",
        descripcion: "Espacio rústico y acogedor ideal para reuniones íntimas.",
        caracteristicas: ["Ambiente privado", "Decoración rústica", "Mesas incluidas", "Área verde"],
        capacidad: "Capacidad: 20-30 personas",
        imagenes: ["imagenes/instalaciones/eventos-cabanita-1.jpg", "imagenes/instalaciones/eventos-cabanita-2.jpg"]
      },
      {
        nombre: "Salón Principal",
        descripcion: "Salón amplio climatizado para eventos grandes y celebraciones.",
        caracteristicas: ["Climatizado", "Sonido incluido", "Iluminación", "Cocina disponible"],
        capacidad: "Capacidad: 100-150 personas",
        imagenes: ["imagenes/instalaciones/eventos-salon-1.jpg", "imagenes/instalaciones/eventos-salon-2.jpg"]
      },
      {
        nombre: "Zona Piscina",
        descripcion: "Área alrededor de la piscina para eventos al aire libre.",
        caracteristicas: ["Al aire libre", "Vista piscina", "Área amplia", "Ambiente festivo"],
        capacidad: "Capacidad: 50-80 personas",
        imagenes: ["imagenes/instalaciones/eventos-piscina-1.jpg", "imagenes/instalaciones/eventos-piscina-2.jpg"]
      },
      {
        nombre: "Zona Terraza",
        descripcion: "Terraza con vista panorámica perfecta para cócteles y reuniones.",
        caracteristicas: ["Vista panorámica", "Techada parcial", "Ambiente moderno", "Atardecer"],
        capacidad: "Capacidad: 40-60 personas",
        imagenes: ["imagenes/instalaciones/eventos-terraza-1.jpg", "imagenes/instalaciones/eventos-terraza-2.jpg"]
      }
    ]
  },
  recreacion: {
    titulo: "Zonas Recreacionales",
    tipoAccion: "administracion",
    subInstalaciones: [
      {
        nombre: "Sala de Billar",
        descripcion: "Mesa de billar profesional en ambiente climatizado.",
        caracteristicas: ["Mesa profesional", "Tacos disponibles", "Iluminación adecuada", "Aire acondicionado"],
        capacidad: "Capacidad: 4-6 personas",
        imagenes: ["imagenes/instalaciones/recreacion-billar-1.jpg", "imagenes/instalaciones/recreacion-billar-2.jpg"]
      },
      {
        nombre: "Gimnasio",
        descripcion: "Espacio con equipos básicos para mantenerse en forma.",
        caracteristicas: ["Máquinas cardio", "Pesas libres", "Espejos", "Ventilación"],
        capacidad: "Horario: 7:00 AM - 6:00 PM",
        imagenes: ["imagenes/instalaciones/recreacion-gym-1.jpg", "imagenes/instalaciones/recreacion-gym-2.jpg"]
      },
      {
        nombre: "Zona de Juegos",
        descripcion: "Área con juegos de mesa y entretenimiento para toda la familia.",
        caracteristicas: ["Juegos de mesa", "Ping pong", "Damas y ajedrez", "Área infantil"],
        capacidad: "Para todas las edades",
        imagenes: ["imagenes/instalaciones/recreacion-juegos-1.jpg", "imagenes/instalaciones/recreacion-juegos-2.jpg"]
      }
    ]
  }
};

class ModalInstalacion {
  constructor() {
    this.modal = document.getElementById('modalInstalacion');
    this.btnCerrar = document.getElementById('btnCerrarModal');
    this.botonesVerMas = document.querySelectorAll('.boton-ver-mas');
    this.instalacionActual = null;
    this.subIndiceActual = 0;
    this.imagenActualIndex = 0;
    this.imagenesActuales = [];
    this.intervalCarrusel = null;
    this.inicializarEventos();
  }

  inicializarEventos() {
    this.botonesVerMas.forEach(boton => {
      boton.addEventListener('click', (e) => {
        e.stopPropagation();
        const instalacion = boton.getAttribute('data-instalacion');
        this.abrir(instalacion);
      });
    });

    this.btnCerrar.addEventListener('click', () => this.cerrar());
    
    const overlay = this.modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.cerrar());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('activo')) {
        this.cerrar();
      }
    });
  }

  iniciarCarrusel() {
    this.detenerCarrusel();
    this.intervalCarrusel = setInterval(() => {
      this.cambiarImagenCarrusel();
    }, 4000);
  }

  detenerCarrusel() {
    if (this.intervalCarrusel) {
      clearInterval(this.intervalCarrusel);
      this.intervalCarrusel = null;
    }
  }

  cambiarImagenCarrusel() {
    if (this.imagenesActuales.length < 2) return;
    
    this.imagenActualIndex = (this.imagenActualIndex + 1) % this.imagenesActuales.length;
    const img = document.getElementById('subInstalacionImg');
    const dots = document.querySelectorAll('.indicador-dot');
    
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = this.imagenesActuales[this.imagenActualIndex];
      img.style.opacity = '1';
    }, 250);
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('activo', i === this.imagenActualIndex);
    });
  }

  abrir(instalacion) {
    const datos = datosInstalaciones[instalacion];
    if (!datos) return;

    this.instalacionActual = datos;
    this.subIndiceActual = 0;

    document.getElementById('modalTitulo').textContent = datos.titulo;
    
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = '';

    if (datos.subInstalaciones) {
      datos.subInstalaciones.forEach((sub, index) => {
        const tab = document.createElement('button');
        tab.className = `tab-sub ${index === 0 ? 'activo' : ''}`;
        tab.textContent = sub.nombre;
        tab.addEventListener('click', () => this.cambiarSubInstalacion(index));
        tabsContainer.appendChild(tab);
      });
      this.mostrarSubInstalacion(0);
    } else {
      this.mostrarInstalacionSimple(datos);
    }

    this.modal.classList.add('activo');
    document.body.style.overflow = 'hidden';
    this.btnCerrar.focus();
    this.iniciarCarrusel();
  }

  mostrarInstalacionSimple(datos) {
    this.imagenesActuales = datos.imagenes;
    this.imagenActualIndex = 0;
    
    const img = document.getElementById('subInstalacionImg');
    img.src = datos.imagenes[0];
    
    document.getElementById('subInstalacionNombre').textContent = datos.titulo;
    document.getElementById('subInstalacionDesc').textContent = datos.descripcion;
    
    const caracContainer = document.getElementById('subCaracteristicas');
    caracContainer.innerHTML = datos.caracteristicas.map(c => `<span class="sub-check">${c}</span>`).join('');
    
    document.getElementById('subCapacidad').textContent = datos.capacidad;
    document.getElementById('accionContainer').innerHTML = '';
    
    this.actualizarIndicadores();
  }

  mostrarSubInstalacion(index) {
    const sub = this.instalacionActual.subInstalaciones[index];
    this.subIndiceActual = index;
    this.imagenesActuales = sub.imagenes;
    this.imagenActualIndex = 0;

    const img = document.getElementById('subInstalacionImg');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = sub.imagenes[0];
      img.style.opacity = '1';
    }, 150);

    document.getElementById('subInstalacionNombre').textContent = sub.nombre;
    document.getElementById('subInstalacionDesc').textContent = sub.descripcion;
    
    const caracContainer = document.getElementById('subCaracteristicas');
    caracContainer.innerHTML = sub.caracteristicas.map(c => `<span class="sub-check">${c}</span>`).join('');
    
    document.getElementById('subCapacidad').textContent = sub.capacidad;

    const accionContainer = document.getElementById('accionContainer');
    if (this.instalacionActual.tipoAccion === 'reservar') {
      accionContainer.innerHTML = `<a href="reservas.html" class="boton-reservar-modal">Reservar</a>`;
    } else if (this.instalacionActual.tipoAccion === 'administracion') {
      accionContainer.innerHTML = `<div class="nota-administracion">📋 Solicitar en administración o guardianía</div>`;
    } else {
      accionContainer.innerHTML = '';
    }

    const tabs = document.querySelectorAll('.tab-sub');
    tabs.forEach((tab, i) => {
      tab.classList.toggle('activo', i === index);
    });

    this.actualizarIndicadores();
    this.iniciarCarrusel();
  }

  actualizarIndicadores() {
    const dots = document.querySelectorAll('.indicador-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('activo', i === this.imagenActualIndex);
    });
  }

  cambiarSubInstalacion(index) {
    if (index !== this.subIndiceActual) {
      this.mostrarSubInstalacion(index);
    }
  }

  cerrar() {
    this.detenerCarrusel();
    this.modal.classList.remove('activo');
    document.body.style.overflow = 'auto';
  }
}

// MENÚ MÓVIL MEJORADO - Igual que carta.html
function inicializarMenuMovil() {
  const botonMenu = document.querySelector('.boton-menu-movil');
  const menuNav = document.querySelector('.lista-navegacion');

  if (!botonMenu || !menuNav) return;

  botonMenu.onclick = () => {
    botonMenu.classList.toggle('activo');
    menuNav.classList.toggle('mostrar');
    const expandido = botonMenu.classList.contains('activo');
    botonMenu.setAttribute('aria-expanded', expandido);
  };

  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll('.enlace-nav').forEach(enlace => {
    enlace.onclick = () => {
      menuNav.classList.remove('mostrar');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
    };
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!botonMenu.contains(e.target) && !menuNav.contains(e.target)) {
      menuNav.classList.remove('mostrar');
      botonMenu.classList.remove('activo');
      botonMenu.setAttribute('aria-expanded', 'false');
    }
  });
}

function inicializarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.onclick = function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const destino = document.querySelector(href);
      
      if (destino) {
        const offset = 80;
        const posicion = destino.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: posicion, behavior: 'smooth' });
      }
    };
  });
}

function inicializarAnimaciones() {
  const prefiereSinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefiereSinMovimiento) {
    document.querySelectorAll('.animar-entrada, .animar-tarjeta, .animar-footer').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = '1';
        entrada.target.style.transform = 'translateY(0)';
        observador.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const elementosAnimar = document.querySelectorAll('.animar-entrada, .animar-tarjeta, .animar-footer');
  elementosAnimar.forEach(el => observador.observe(el));
}

function inicializarParallax() {
  const prefiereSinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefiereSinMovimiento) return;

  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const hero = document.querySelector('.seccion-hero');
        if (hero && window.scrollY < hero.offsetHeight) {
          hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

function prevenirDobleTap() {
  let ultimoTap = 0;
  
  document.addEventListener('touchend', (e) => {
    const ahora = Date.now();
    if (ahora - ultimoTap < 300) {
      e.preventDefault();
    }
    ultimoTap = ahora;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  new ModalInstalacion();
  inicializarMenuMovil();
  inicializarScrollSuave();
  inicializarAnimaciones();
  inicializarParallax();
  prevenirDobleTap();
});
