const fs = require('fs');
const path = require('path');

const GESTION_FILE = path.join(__dirname, '..', 'gestion', 'index.html');
const REELS_DATA_FILE = path.join(__dirname, '..', 'data', 'reels.json');

const reelsData = JSON.parse(fs.readFileSync(REELS_DATA_FILE, 'utf-8'));

let html = fs.readFileSync(GESTION_FILE, 'utf-8');

// Buscamos dónde comienza y termina la sección de reels
const startMarker = '<!-- SECCIÓN: MURAL OFICIAL DE REELS Y VIDEOS DE REDES SOCIALES';
const endMarker = '<section class="border-t border-hairline bg-white">';

const startIdx = html.indexOf('<!-- ======================================================================\n       SECCIÓN: MURAL OFICIAL DE REELS');
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found! startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

const reelsSectionHtml = `<!-- ======================================================================
       SECCIÓN: MURAL OFICIAL DE REELS Y VIDEOS DE REDES SOCIALES
       (Arquitectura Fachada Ligera con Reproductor Oficial Meta Bajo Demanda)
       ====================================================================== -->
  <section class="border-t border-hairline bg-crema py-20 lg:py-28" id="reels-territorio">
    <div class="contenedor">
      
      <!-- Encabezado de Sección con Contexto y Enlace a Perfil -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-hairline">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1877F2]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook Reels Oficial · @RocioAbreuA
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              ● Contenido Verificado en Meta
            </span>
          </div>

          <h2 class="mt-4 font-display text-[clamp(32px,4.5vw,52px)] leading-tight text-tinta">
            Reels y Videos en Territorio
          </h2>
          <p class="mt-3 max-w-2xl text-base text-tinta/75 leading-relaxed font-sans">
            Historias reales de rescate animal, entrega de canasta básica, salud visual y gestión energética. 
            <strong>Cada reproducción y reacción cuenta directamente en las métricas oficiales de Facebook</strong> de Rocío Abreu.
          </p>
        </div>

        <div class="shrink-0 flex flex-wrap items-center gap-3">
          <!-- Botón de desarrollador oculto para visitantes (Activable con ?dev=true o Ctrl+Shift+D) -->
          <button id="dev-add-reel-btn" type="button" onclick="openAddReelModal()" class="hidden items-center gap-2 rounded-lg border border-guinda/40 bg-white px-4 py-2.5 text-xs font-semibold text-guinda shadow-sm hover:bg-guinda hover:text-white transition cursor-pointer">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>+ Agregar Reel (Dev)</span>
          </button>
          
          <a href="https://www.facebook.com/RocioAbreuA/reels/" target="_blank" rel="noopener noreferrer" class="btn-primario inline-flex items-center gap-2 px-5 py-2.5 text-xs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Ver perfil en Facebook ↗</span>
          </a>
        </div>
      </div>

      <!-- Barra de Filtros, Búsqueda y Ordenamiento -->
      <div class="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        
        <!-- Pestañas de Categoría -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" id="category-tabs">
          <button type="button" data-filter="all" class="cat-tab active px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition bg-guinda text-crema shadow-sm">
            Todos (<span id="count-all">0</span>)
          </button>
          <button type="button" data-filter="animal" class="cat-tab px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition bg-white text-tinta/70 hover:bg-guinda/10 hover:text-guinda">
            🐾 Animal (<span id="count-animal">0</span>)
          </button>
          <button type="button" data-filter="canasta" class="cat-tab px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition bg-white text-tinta/70 hover:bg-guinda/10 hover:text-guinda">
            🥫 Canasta Básica (<span id="count-canasta">0</span>)
          </button>
          <button type="button" data-filter="salud" class="cat-tab px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition bg-white text-tinta/70 hover:bg-guinda/10 hover:text-guinda">
            👓 Salud (<span id="count-salud">0</span>)
          </button>
          <button type="button" data-filter="energia" class="cat-tab px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition bg-white text-tinta/70 hover:bg-guinda/10 hover:text-guinda">
            ⚡ Energía (<span id="count-energia">0</span>)
          </button>
          <button type="button" data-filter="escuela" class="cat-tab px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition bg-white text-tinta/70 hover:bg-guinda/10 hover:text-guinda">
            🏫 Escuelas (<span id="count-escuela">0</span>)
          </button>
        </div>

        <!-- Búsqueda y Ordenamiento -->
        <div class="flex items-center gap-3">
          <!-- Campo de Búsqueda -->
          <div class="relative w-full sm:w-64">
            <input type="text" id="reels-search" placeholder="Buscar por tema o municipio..." class="w-full rounded-full border border-hairline bg-white px-4 py-2 pl-9 text-xs text-tinta placeholder:text-tinta/45 focus:border-guinda focus:outline-none focus:ring-1 focus:ring-guinda shadow-sm">
            <svg class="absolute left-3 top-2.5 h-3.5 w-3.5 text-tinta/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <!-- Selector de Orden -->
          <select id="reels-sort" class="rounded-full border border-hairline bg-white px-3 py-2 text-xs text-tinta/80 focus:border-guinda focus:outline-none shadow-sm cursor-pointer">
            <option value="recent">Más recientes</option>
            <option value="views">Más vistas</option>
            <option value="reactions">Más reacciones</option>
          </select>
        </div>

      </div>

      <!-- Cuadrícula Dinámica de Tarjetas de Reels -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" id="reels-container">
        <!-- Generado dinámicamente por JavaScript -->
      </div>

      <!-- Estado Vacío Si No Hay Coincidencias -->
      <div id="reels-empty" class="hidden my-12 p-12 text-center rounded-2xl border border-hairline bg-white">
        <p class="font-display text-xl text-tinta">No se encontraron videos con ese filtro o búsqueda</p>
        <p class="mt-2 text-xs text-tinta/60">Prueba con otra palabra clave o selecciona "Todos".</p>
        <button type="button" onclick="resetFilters()" class="mt-4 btn-primario px-5 py-2 text-xs">Mostrar todos los Reels</button>
      </div>

      <!-- Botón de Cargar Más -->
      <div class="mt-12 flex justify-center" id="load-more-wrapper">
        <button type="button" id="load-more-btn" onclick="loadMoreReels()" class="inline-flex items-center gap-2 rounded-full border border-guinda bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-guinda shadow-sm hover:bg-guinda hover:text-white transition">
          <span>Cargar más Reels</span>
          <span id="load-more-count" class="rounded-full bg-guinda/10 px-2 py-0.5 text-[10px] text-guinda"></span>
        </button>
      </div>

      <!-- Banner hacia la Galería Completa de Territorio -->
      <div class="mt-16 flex flex-col items-center justify-center text-center p-8 bg-white border border-hairline rounded-2xl shadow-sm">
        <span class="label text-guinda">Archivo Multimedia Completo</span>
        <h3 class="mt-2 font-display text-2xl text-tinta">¿Quieres consultar más fotografías y videos de territorio?</h3>
        <p class="mt-2 text-sm text-tinta/70 max-w-xl">Accede al mural interactivo organizado por los 11 municipios del estado de Campeche.</p>
        <a href="/galeria-territorio/" target="_blank" rel="noopener noreferrer" class="btn-primario mt-6 inline-flex items-center gap-3 px-8 py-3.5 text-sm font-semibold">
          <span>Explorar Galería Completa de Gestión y Territorio (Fotos y Videos) ↗</span>
        </a>
      </div>

    </div>
  </section>

  <!-- ======================================================================
       MODAL CINEMÁTICO DE REPRODUCCIÓN OFICIAL DE META / FACEBOOK
       (Apreciación Completa del Video: Proporción 9:16 Sin Cortes + Modo Cine + Fácil Salida)
       ====================================================================== -->
  <div id="reel-modal" class="fixed inset-0 z-[100] hidden overflow-y-auto p-2 sm:p-4 lg:p-6 transition-opacity duration-300 flex-col items-center justify-start sm:justify-center" role="dialog" aria-modal="true" aria-label="Reproductor Oficial de Reel" data-lenis-prevent="true">
    
    <!-- Backdrop oscuro con clic directo para cerrar -->
    <div class="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer transition-opacity" onclick="closeReelModal()" aria-hidden="true" title="Clic aquí para volver a Gestión"></div>

    <!-- Barra Superior de Navegación Rápida Flotante -->
    <div class="relative z-30 w-full max-w-5xl flex items-center justify-between pb-3 px-1 my-2 shrink-0">
      <button type="button" onclick="closeReelModal()" class="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/35 text-white px-4 py-2 text-xs font-semibold backdrop-blur-md transition border border-white/30 shadow-lg cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>← Volver a Gestión y Apoyos</span>
      </button>
      
      <button type="button" onclick="closeReelModal()" class="inline-flex items-center gap-1.5 rounded-full bg-guinda hover:bg-guinda-deep text-white px-4 py-2 text-xs font-semibold transition shadow-lg border border-white/25 cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        <span>Cerrar (Esc)</span>
      </button>
    </div>

    <!-- Contenedor del Modal Responsivo -->
    <div id="modal-container-card" data-lenis-prevent="true" class="relative z-20 flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-white/20 overflow-hidden max-h-[88vh] transition-all duration-300">
      
      <!-- Botón de Cerrar Modal Flotante de Alto Contraste en Esquina -->
      <button type="button" onclick="closeReelModal()" class="absolute right-3 top-3 sm:right-4 sm:top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 hover:bg-guinda text-white shadow-xl transition-all duration-200 border border-white/20 cursor-pointer" aria-label="Cerrar reproductor">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <!-- Columna 1: Reproductor Oficial de Meta (Espacio Completo 100% Sin Cortes) -->
      <div id="reel-player-column" class="relative lg:w-1/2 bg-[#0c0c0c] flex flex-col items-center justify-center p-3 sm:p-5 shrink-0 transition-all duration-300 min-h-[460px] lg:min-h-[640px]">
        
        <!-- Barra de herramientas superior del reproductor -->
        <div class="w-full flex items-center justify-between px-2 pb-2.5 text-white/80 text-xs">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-crema/90">
            <svg class="h-3.5 w-3.5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Video Oficial Meta
          </span>
          <button type="button" onclick="toggleTheaterMode()" id="theater-btn" class="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[11px] font-medium text-white transition border border-white/15" title="Expandir reproductor a pantalla completa">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            <span id="theater-text">Modo Cine</span>
          </button>
        </div>

        <!-- Contenedor del Iframe Oficial con proporción exacta calculada dinámicamente -->
        <div id="reel-player-wrapper" class="relative flex items-center justify-center transition-all duration-300 rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
          
          <!-- Loading Spinner -->
          <div id="reel-spinner" class="absolute inset-0 flex flex-col items-center justify-center text-white/80 bg-black/90 z-10 transition-opacity">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-dorado mb-3"></div>
            <span class="text-xs uppercase tracking-widest text-crema/80">Cargando video completo...</span>
          </div>

          <iframe id="reel-iframe" 
                  src="" 
                  class="border-0 rounded-xl shadow-lg transition-all" 
                  style="border:none;overflow:hidden;background:#000;display:block;" 
                  scrolling="no" 
                  frameborder="0" 
                  allowfullscreen="true" 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" 
                  title="Reproductor oficial de Reel en Facebook">
          </iframe>
        </div>

        <!-- Aviso y Enlace Directo de Respaldo -->
        <div class="w-full text-center pt-2">
          <span class="text-[11px] text-white/60">¿Prefieres la app oficial? <a id="direct-fb-link" href="#" target="_blank" rel="noopener noreferrer" class="text-dorado underline hover:text-white font-medium">Ver reel directo en Facebook ↗</a></span>
        </div>

      </div>

      <!-- Columna 2: Ficha Técnica, Métricas y Enlaces Oficiales -->
      <div id="reel-details-column" class="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-crema">
        <div>
          <!-- Cabecera de Ficha -->
          <div class="flex items-center justify-between pb-4 border-b border-hairline">
            <span id="modal-category" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-guinda text-crema">
              Categoría
            </span>
            <span class="text-xs text-[#15803d] font-semibold flex items-center gap-1">
              <span class="h-2 w-2 rounded-full bg-[#15803d] animate-ping"></span>
              Sincronizado con Facebook
            </span>
          </div>

          <!-- Título y Descripción -->
          <h3 id="modal-title" class="mt-4 font-display text-xl sm:text-2xl text-tinta leading-snug">
            Título del Reel
          </h3>

          <p id="modal-desc" class="mt-3 text-sm text-tinta/80 leading-relaxed font-sans">
            Descripción completa del reel...
          </p>

          <p id="modal-tags" class="mt-3 text-xs text-guinda font-medium">
            #Tags
          </p>

          <!-- Bloque de Métricas Oficiales de Facebook -->
          <div class="mt-6 p-4 rounded-xl border border-hairline bg-white shadow-sm">
            <p class="text-xs font-bold uppercase tracking-wider text-tinta/60 mb-2">Impacto en Página Oficial de Facebook</p>
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="p-2 bg-crema rounded-lg">
                <span id="modal-views" class="block font-display text-xl font-bold text-guinda">--</span>
                <span class="text-[10px] text-tinta/60 uppercase">Reproducciones</span>
              </div>
              <div class="p-2 bg-crema rounded-lg">
                <span id="modal-likes" class="block font-display text-xl font-bold text-guinda">--</span>
                <span class="text-[10px] text-tinta/60 uppercase">Reacciones</span>
              </div>
            </div>
            <p class="mt-2 text-[11px] text-tinta/60 text-center">
              👍 Al interactuar en el video tus reproducciones y likes suman a la cuenta oficial @RocioAbreuA.
            </p>
          </div>
        </div>

        <!-- Acciones Inferiores y Navegación entre Reels -->
        <div class="mt-6 pt-6 border-t border-hairline">
          <div class="flex items-center justify-between gap-3 mb-4">
            <button type="button" onclick="prevReel()" class="inline-flex items-center gap-1 text-xs font-semibold text-tinta/70 hover:text-guinda transition cursor-pointer">
              ← Reel Anterior
            </button>
            <span id="modal-counter" class="text-xs font-bold text-dorado uppercase tracking-widest">
              1 / 9
            </span>
            <button type="button" onclick="nextReel()" class="inline-flex items-center gap-1 text-xs font-semibold text-tinta/70 hover:text-guinda transition cursor-pointer">
              Siguiente Reel →
            </button>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <a id="modal-fb-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn-primario justify-center text-center text-xs py-3 flex-1 inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Abrir en Facebook</span>
            </a>
            <a id="modal-wa-btn" href="#" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-[#25D366]/10 px-4 py-3 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366] hover:text-white transition">
              <span>Compartir en WhatsApp</span>
            </a>
          </div>

          <!-- Botón de Salida Clara al Final de la Ficha -->
          <button type="button" onclick="closeReelModal()" class="w-full mt-3.5 py-3 px-4 rounded-xl border border-hairline bg-white hover:bg-guinda hover:text-white text-tinta font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer group">
            <svg class="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>Cerrar video y seguir viendo la página de Gestión</span>
          </button>
        </div>

      </div>

    </div>
  </div>

  <!-- ======================================================================
       MODAL DE INGESTIÓN RÁPIDA DE REELS (AGREGAR NUEVO REEL EN VIVO)
       ====================================================================== -->
  <div id="add-reel-modal" class="fixed inset-0 z-[110] hidden items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Agregar Nuevo Reel">
    <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-hairline">
      <button type="button" onclick="closeAddReelModal()" class="absolute right-4 top-4 text-tinta/50 hover:text-guinda">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <span class="label text-guinda">Ingestión Directa de Videos</span>
      <h3 class="mt-2 font-display text-2xl text-tinta">Agregar Reel de Facebook</h3>
      <p class="mt-1 text-xs text-tinta/70">Pega el enlace de cualquier Reel o Video del perfil @RocioAbreuA para integrarlo con reproductor oficial.</p>

      <form id="add-reel-form" onsubmit="submitNewReel(event)" class="mt-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-tinta mb-1">URL del Reel o Video de Facebook *</label>
          <input type="url" id="new-reel-url" required placeholder="https://www.facebook.com/share/v/... o https://www.facebook.com/reel/..." class="w-full rounded-lg border border-hairline px-3 py-2 text-xs focus:border-guinda focus:outline-none">
        </div>

        <div>
          <label class="block text-xs font-semibold text-tinta mb-1">Título del Video *</label>
          <input type="text" id="new-reel-title" required placeholder="Ej: «Jornada de apoyo en Colonia Morelos»" class="w-full rounded-lg border border-hairline px-3 py-2 text-xs focus:border-guinda focus:outline-none">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-tinta mb-1">Categoría</label>
            <select id="new-reel-cat" class="w-full rounded-lg border border-hairline px-3 py-2 text-xs focus:border-guinda focus:outline-none">
              <option value="canasta">Canasta Básica</option>
              <option value="animal">Bienestar Animal</option>
              <option value="salud">Salud Visual</option>
              <option value="energia">Comisión de Energía</option>
              <option value="escuela">Escuelas Dignas</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-tinta mb-1">Municipio / Zona</label>
            <input type="text" id="new-reel-mun" placeholder="Campeche / Carmen" value="Campeche" class="w-full rounded-lg border border-hairline px-3 py-2 text-xs focus:border-guinda focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-tinta mb-1">Resumen o Descripción</label>
          <textarea id="new-reel-desc" rows="2" placeholder="Breve descripción del apoyo brindado..." class="w-full rounded-lg border border-hairline px-3 py-2 text-xs focus:border-guinda focus:outline-none"></textarea>
        </div>

        <div class="pt-2 flex justify-end gap-3">
          <button type="button" onclick="closeAddReelModal()" class="rounded-lg border border-hairline px-4 py-2 text-xs font-semibold text-tinta/70 hover:bg-black/5">Cancelar</button>
          <button type="submit" class="btn-primario px-5 py-2 text-xs">Guardar y Reproducir</button>
        </div>
      </form>
    </div>
  </div>

  <!-- SCRIPT DEL CONTROLADOR DE REELS, BÚSQUEDA Y REPRODUCTOR MODAL META -->
  <script>
    // Catálogo base precargado
    let reelsCatalog = ${JSON.stringify(reelsData)};
    let activeReelIndex = 0;
    let currentFilter = 'all';
    let currentSearch = '';
    let currentSort = 'recent';
    let visibleCount = 6;
    const PAGE_SIZE = 6;

    // Inicializar catálogo desde archivo JSON si está disponible
    async function initCatalog() {
      try {
        const res = await fetch('/data/reels.json');
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            reelsCatalog = remoteData;
          }
        }
      } catch (e) {
        console.warn('Usando catálogo precargado localmente');
      }
      updateCategoryCounts();
      renderReels();
    }

    // Actualizar contadores numéricos en las pestañas
    function updateCategoryCounts() {
      const counts = { all: reelsCatalog.length, animal: 0, canasta: 0, salud: 0, energia: 0, escuela: 0 };
      reelsCatalog.forEach(r => {
        if (counts[r.categoria] !== undefined) counts[r.categoria]++;
      });
      document.getElementById('count-all').textContent = counts.all;
      document.getElementById('count-animal').textContent = counts.animal;
      document.getElementById('count-canasta').textContent = counts.canasta;
      document.getElementById('count-salud').textContent = counts.salud;
      document.getElementById('count-energia').textContent = counts.energia;
      document.getElementById('count-escuela').textContent = counts.escuela;
    }

    // Filtrar, buscar y ordenar la lista
    function getFilteredReels() {
      let filtered = reelsCatalog.filter(reel => {
        const matchCat = (currentFilter === 'all' || reel.categoria === currentFilter);
        const q = currentSearch.toLowerCase().trim();
        const matchSearch = !q || 
          reel.titulo.toLowerCase().includes(q) || 
          reel.resumen.toLowerCase().includes(q) || 
          (reel.municipio && reel.municipio.toLowerCase().includes(q)) || 
          (reel.tags && reel.tags.toLowerCase().includes(q));
        return matchCat && matchSearch;
      });

      if (currentSort === 'views') {
        filtered.sort((a, b) => (b.reproduccionesNum || 0) - (a.reproduccionesNum || 0));
      } else if (currentSort === 'reactions') {
        filtered.sort((a, b) => (b.reaccionesNum || 0) - (a.reaccionesNum || 0));
      } else {
        // 'recent': por fecha descendente
        filtered.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
      }

      return filtered;
    }

    // Renderizar tarjetas de reels
    function renderReels() {
      const container = document.getElementById('reels-container');
      const emptyState = document.getElementById('reels-empty');
      const loadMoreWrapper = document.getElementById('load-more-wrapper');
      const loadMoreCount = document.getElementById('load-more-count');

      const filtered = getFilteredReels();

      if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        loadMoreWrapper.classList.add('hidden');
        return;
      }

      emptyState.classList.add('hidden');

      const itemsToShow = filtered.slice(0, visibleCount);

      container.innerHTML = itemsToShow.map((reel, displayIdx) => {
        // Encontrar índice real en catálogo para navegación modal
        const realIdx = reelsCatalog.findIndex(r => r.id === reel.id);

        return \`
        <article class="reel-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" data-category="\${reel.categoria}">
          
          <!-- Contenedor Visual 9:14 -->
          <div class="relative w-full overflow-hidden bg-ciruela cursor-pointer" style="aspect-ratio: 9/14;" onclick="openReelModal(\${realIdx})">
            <img src="\${reel.img}" alt="\${reel.titulo}" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 transition-opacity group-hover:opacity-90"></div>

            <!-- Insignias Superiores -->
            <div class="absolute top-4 inset-x-4 flex items-center justify-between">
              <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm border \${reel.badgeColor} bg-white/95 backdrop-blur-sm">
                \${reel.categoriaLabel}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
                📍 \${reel.municipio || 'Campeche'}
              </span>
            </div>

            <!-- Botón Central Play Pulsante -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-guinda/90 text-crema shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-guinda group-hover:ring-4 group-hover:ring-white/40">
                <svg class="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>

            <!-- Información Inferior -->
            <div class="absolute bottom-4 inset-x-4">
              <p class="font-display text-lg font-semibold text-white line-clamp-2 leading-snug drop-shadow-sm">
                \${reel.titulo}
              </p>
              
              <div class="mt-3 flex items-center justify-between text-xs text-crema/80 font-sans border-t border-white/20 pt-2.5">
                <span class="inline-flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  \${reel.reproducciones}
                </span>
                <span class="inline-flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  \${reel.reacciones}
                </span>
                <span class="inline-flex items-center gap-1 font-bold text-dorado-claro">
                  Reproducir ↗
                </span>
              </div>
            </div>

          </div>

          <!-- Pie con Texto y Acción -->
          <div class="p-5 flex flex-col justify-between flex-grow">
            <p class="text-xs text-tinta/75 leading-relaxed line-clamp-2">
              \${reel.resumen}
            </p>

            <div class="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs">
              <button type="button" onclick="openReelModal(\${realIdx})" class="font-semibold text-guinda hover:underline">
                ▶ Ver Reproductor Oficial
              </button>
              <a href="\${reel.shareUrl || reel.url}" target="_blank" rel="noopener noreferrer" class="font-medium text-[#1877F2] hover:underline" title="Abrir en Facebook">
                Facebook ↗
              </a>
            </div>
          </div>

        </article>
        \`;
      }).join('');

      // Control del botón Cargar Más
      const remaining = filtered.length - itemsToShow.length;
      if (remaining > 0) {
        loadMoreWrapper.classList.remove('hidden');
        loadMoreCount.textContent = \`+\${remaining}\`;
      } else {
        loadMoreWrapper.classList.add('hidden');
      }
    }

    function loadMoreReels() {
      visibleCount += PAGE_SIZE;
      renderReels();
    }

    function resetFilters() {
      currentFilter = 'all';
      currentSearch = '';
      document.getElementById('reels-search').value = '';
      document.querySelectorAll('.cat-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.filter === 'all');
        t.classList.toggle('bg-guinda', t.dataset.filter === 'all');
        t.classList.toggle('text-crema', t.dataset.filter === 'all');
        t.classList.toggle('bg-white', t.dataset.filter !== 'all');
        t.classList.toggle('text-tinta/70', t.dataset.filter !== 'all');
      });
      renderReels();
    }

    // Modal Player Oficial Meta con Dimensionamiento Dinámico Sin Cortes
    let isTheaterMode = false;

    function isVerticalReel(reel) {
      if (!reel) return true;
      if (reel.aspect === '16/9' || reel.aspect === 'horizontal') return false;
      if (reel.url && (reel.url.includes('/videos/') || reel.url.includes('/watch/')) && !reel.url.includes('/reel/')) {
        if (reel.id === '1138981290886111') return false;
      }
      return true; // Predeterminado a 9:16 vertical para formato Reels
    }

    function adjustPlayerDimensions() {
      const reel = reelsCatalog[activeReelIndex];
      const iframe = document.getElementById('reel-iframe');
      const wrapper = document.getElementById('reel-player-wrapper');
      if (!iframe || !wrapper) return { width: 360, height: 640 };

      const isVertical = isVerticalReel(reel);
      const isMobile = window.innerWidth < 1024;
      
      let w, h;

      if (isTheaterMode) {
        // En modo cine maximizamos la altura disponible
        const availableHeight = Math.min(window.innerHeight * 0.86, 720);
        if (isVertical) {
          h = Math.floor(availableHeight);
          w = Math.floor(h * (9 / 16));
          const maxW = Math.min(window.innerWidth - 32, 450);
          if (w > maxW) {
            w = maxW;
            h = Math.floor(w * (16 / 9));
          }
        } else {
          const maxW = Math.min(window.innerWidth - 48, 760);
          w = maxW;
          h = Math.floor(w * (9 / 16));
        }
      } else {
        // Modo estándar dividido:
        if (isVertical) {
          // 9:16 vertical
          const maxHeight = isMobile 
            ? Math.min(window.innerHeight * 0.58, 520) 
            : Math.min(window.innerHeight * 0.82, 640);
          h = Math.floor(maxHeight);
          w = Math.floor(h * (9 / 16));
          
          const maxWidth = Math.min(window.innerWidth - 40, 360);
          if (w > maxWidth) {
            w = maxWidth;
            h = Math.floor(w * (16 / 9));
          }
        } else {
          // 16:9 horizontal
          const maxWidth = isMobile ? Math.min(window.innerWidth - 40, 480) : 480;
          w = maxWidth;
          h = Math.floor(w * (9 / 16));
        }
      }

      wrapper.style.width = w + 'px';
      wrapper.style.height = h + 'px';
      iframe.style.width = w + 'px';
      iframe.style.height = h + 'px';
      iframe.setAttribute('width', w);
      iframe.setAttribute('height', h);

      return { width: w, height: h };
    }

    function toggleTheaterMode() {
      isTheaterMode = !isTheaterMode;
      const modalCard = document.getElementById('modal-container-card');
      const playerCol = document.getElementById('reel-player-column');
      const detailsCol = document.getElementById('reel-details-column');
      const theaterText = document.getElementById('theater-text');

      if (isTheaterMode) {
        modalCard.classList.remove('max-w-5xl');
        modalCard.classList.add('max-w-3xl');
        playerCol.classList.remove('lg:w-1/2');
        playerCol.classList.add('w-full');
        detailsCol.classList.add('hidden');
        theaterText.textContent = 'Ver Ficha';
      } else {
        modalCard.classList.add('max-w-5xl');
        modalCard.classList.remove('max-w-3xl');
        playerCol.classList.add('lg:w-1/2');
        playerCol.classList.remove('w-full');
        detailsCol.classList.remove('hidden');
        theaterText.textContent = 'Modo Cine';
      }
      
      const reel = reelsCatalog[activeReelIndex];
      if (reel) {
        const dims = adjustPlayerDimensions();
        const iframe = document.getElementById('reel-iframe');
        const targetFbUrl = reel.fbUrl || reel.url;
        iframe.src = `https://www.facebook.com/plugins/video.php?height=${dims.height}&href=${encodeURIComponent(targetFbUrl)}&show_text=false&width=${dims.width}&autoplay=true&t=0`;
      }
    }

    function openReelModal(index) {
      activeReelIndex = index;
      const reel = reelsCatalog[index];
      if (!reel) return;

      const modal = document.getElementById('reel-modal');
      const iframe = document.getElementById('reel-iframe');
      const spinner = document.getElementById('reel-spinner');

      document.getElementById('modal-title').textContent = reel.titulo;
      document.getElementById('modal-desc').textContent = reel.resumen;
      document.getElementById('modal-tags').textContent = reel.tags || '';
      document.getElementById('modal-category').textContent = reel.categoriaLabel;
      document.getElementById('modal-views').textContent = reel.reproducciones;
      document.getElementById('modal-likes').textContent = reel.reacciones;
      document.getElementById('modal-counter').textContent = (index + 1) + ' / ' + reelsCatalog.length;
      document.getElementById('modal-fb-btn').href = reel.shareUrl || reel.url;
      document.getElementById('direct-fb-link').href = reel.shareUrl || reel.url;
      document.getElementById('modal-wa-btn').href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent('Mira este video de Rocío Abreu: ' + reel.titulo + ' ' + (reel.shareUrl || reel.url));

      if (spinner) spinner.style.display = 'flex';
      
      const dims = adjustPlayerDimensions();
      const targetFbUrl = reel.fbUrl || reel.url;
      const embedUrl = `https://www.facebook.com/plugins/video.php?height=${dims.height}&href=${encodeURIComponent(targetFbUrl)}&show_text=false&width=${dims.width}&autoplay=true&t=0`;
      
      iframe.src = embedUrl;
      iframe.onload = () => {
        if (spinner) spinner.style.display = 'none';
      };

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Pausar Lenis temporalmente si está presente
      if (window.lenis && typeof window.lenis.stop === 'function') {
        window.lenis.stop();
      }
    }

    function closeReelModal() {
      const modal = document.getElementById('reel-modal');
      const iframe = document.getElementById('reel-iframe');
      if (iframe) iframe.src = '';
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      if (isTheaterMode) {
        isTheaterMode = false;
        const modalCard = document.getElementById('modal-container-card');
        const playerCol = document.getElementById('reel-player-column');
        const detailsCol = document.getElementById('reel-details-column');
        const theaterText = document.getElementById('theater-text');
        if (modalCard) {
          modalCard.classList.add('max-w-5xl');
          modalCard.classList.remove('max-w-3xl');
        }
        if (playerCol) {
          playerCol.classList.add('lg:w-1/2');
          playerCol.classList.remove('w-full');
        }
        if (detailsCol) detailsCol.classList.remove('hidden');
        if (theaterText) theaterText.textContent = 'Modo Cine';
      }

      // Desbloquear scroll inmediatamente en body y documentElement
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.removeProperty('overflow');
      document.documentElement.style.removeProperty('overflow');

      // Reanudar Lenis si está activo
      if (window.lenis && typeof window.lenis.start === 'function') {
        window.lenis.start();
      }
    }

    function nextReel() {
      const nextIdx = (activeReelIndex + 1) % reelsCatalog.length;
      openReelModal(nextIdx);
    }

    function prevReel() {
      const prevIdx = (activeReelIndex - 1 + reelsCatalog.length) % reelsCatalog.length;
      openReelModal(prevIdx);
    }

    window.addEventListener('resize', () => {
      const modal = document.getElementById('reel-modal');
      if (modal && !modal.classList.contains('hidden')) {
        adjustPlayerDimensions();
      }
    });

    // Modal de Ingestión Rápida de Reels
    function openAddReelModal() {
      document.getElementById('add-reel-modal').classList.remove('hidden');
      document.getElementById('add-reel-modal').classList.add('flex');
    }

    function closeAddReelModal() {
      document.getElementById('add-reel-modal').classList.add('hidden');
      document.getElementById('add-reel-modal').classList.remove('flex');
    }

    function submitNewReel(e) {
      e.preventDefault();
      const url = document.getElementById('new-reel-url').value.trim();
      const title = document.getElementById('new-reel-title').value.trim();
      const cat = document.getElementById('new-reel-cat').value;
      const mun = document.getElementById('new-reel-mun').value.trim() || 'Campeche';
      const desc = document.getElementById('new-reel-desc').value.trim() || 'Acciones de vinculación y apoyo social en Campeche.';

      const categoryLabels = {
        canasta: { label: 'Canasta Básica', badge: 'bg-amber-50 text-amber-900 border-amber-200' },
        animal: { label: 'Bienestar Animal', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
        salud: { label: 'Salud Visual', badge: 'bg-sky-50 text-sky-900 border-sky-200' },
        energia: { label: 'Comisión de Energía', badge: 'bg-rose-50 text-rose-900 border-rose-200' },
        escuela: { label: 'Escuelas Dignas', badge: 'bg-indigo-50 text-indigo-900 border-indigo-200' }
      };

      const newReel = {
        id: 'reel_' + Date.now(),
        categoria: cat,
        categoriaLabel: categoryLabels[cat].label,
        badgeColor: categoryLabels[cat].badge,
        titulo: title,
        resumen: desc,
        tags: '#RocíoAbreu #Gestión #' + mun,
        url: url,
        shareUrl: url,
        fbUrl: url,
        img: '/images/hero-colonia.webp',
        reproducciones: '1.2k',
        reproduccionesNum: 1200,
        reacciones: '150',
        reaccionesNum: 150,
        municipio: mun,
        fecha: new Date().toISOString().split('T')[0]
      };

      reelsCatalog.unshift(newReel);
      closeAddReelModal();
      document.getElementById('add-reel-form').reset();
      updateCategoryCounts();
      renderReels();
      openReelModal(0);
    }

    // Eventos Globales
    document.addEventListener('DOMContentLoaded', () => {
      initCatalog();

      // Pestañas
      document.querySelectorAll('.cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.cat-tab').forEach(t => {
            t.classList.remove('active', 'bg-guinda', 'text-crema');
            t.classList.add('bg-white', 'text-tinta/70');
          });
          tab.classList.add('active', 'bg-guinda', 'text-crema');
          tab.classList.remove('bg-white', 'text-tinta/70');
          currentFilter = tab.dataset.filter;
          visibleCount = PAGE_SIZE;
          renderReels();
        });
      });

      // Búsqueda en tiempo real
      document.getElementById('reels-search')?.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        visibleCount = PAGE_SIZE;
        renderReels();
      });

      // Ordenamiento
      document.getElementById('reels-sort')?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderReels();
      });

      // Modo Desarrollador (?dev=true o Ctrl+Shift+D): muestra el botón de ingestión rápida
      const devParams = new URLSearchParams(window.location.search);
      if (devParams.get('dev') === 'true' || localStorage.getItem('finox_dev_mode') === 'true') {
        const devBtn = document.getElementById('dev-add-reel-btn');
        if (devBtn) {
          devBtn.classList.remove('hidden');
          devBtn.classList.add('inline-flex');
        }
      }

      // Teclado
      document.addEventListener('keydown', (e) => {
        // Atajo de desarrollador para alternar botón de ingestión: Ctrl + Shift + D
        if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
          e.preventDefault();
          const devBtn = document.getElementById('dev-add-reel-btn');
          if (devBtn) {
            const isHidden = devBtn.classList.contains('hidden');
            if (isHidden) {
              devBtn.classList.remove('hidden');
              devBtn.classList.add('inline-flex');
              localStorage.setItem('finox_dev_mode', 'true');
            } else {
              devBtn.classList.add('hidden');
              devBtn.classList.remove('inline-flex');
              localStorage.removeItem('finox_dev_mode');
            }
          }
        }

        const modal = document.getElementById('reel-modal');
        if (modal && !modal.classList.contains('hidden')) {
          if (e.key === 'Escape') closeReelModal();
          if (e.key === 'ArrowRight') nextReel();
          if (e.key === 'ArrowLeft') prevReel();
        }
      });

      // Clic fuera del modal para cerrar
      document.getElementById('reel-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'reel-modal') closeReelModal();
      });
      document.getElementById('add-reel-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'add-reel-modal') closeAddReelModal();
      });
    });
  </script>

  `;

const newHtml = html.substring(0, startIdx) + reelsSectionHtml + html.substring(endIdx);
fs.writeFileSync(GESTION_FILE, newHtml, 'utf-8');
console.log('Sección actualizada con éxito en gestion/index.html!');
