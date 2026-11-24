const fs = require('fs');
const path = require('path');
const { extractReelId, CATEGORY_MAP } = require('./add-reel');

const REELS_PATH = path.join(__dirname, '..', 'data', 'reels.json');

// Imágenes oficiales disponibles para miniaturas automáticas según categoría
const DEFAULT_IMAGES = {
  animal: '/images/rocio-perros.webp',
  canasta: '/images/rocistas-huevo.webp',
  salud: '/images/rocio-en-tu-salud.webp',
  energia: '/images/comision-mesa.webp',
  escuela: '/images/camion-colonia.webp',
  territorio: '/images/hero-colonia.webp'
};

function readReels() {
  try {
    if (fs.existsSync(REELS_PATH)) {
      return JSON.parse(fs.readFileSync(REELS_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Error leyendo reels.json:', e);
  }
  return [];
}

function writeReels(data) {
  try {
    fs.writeFileSync(REELS_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error guardando reels.json:', e);
    return false;
  }
}

/**
 * Importa un arreglo de URLs o líneas con formato:
 * URL [| Título] [| Categoría] [| Municipio]
 */
function importarListaUrls(lineas, defaultCategory = 'territorio', defaultMunicipio = 'Campeche') {
  const catalog = readReels();
  let nuevos = 0;
  let actualizados = 0;

  for (let rawLine of lineas) {
    const linea = rawLine.trim();
    if (!linea || linea.startsWith('#')) continue; // Ignora líneas vacías o comentarios

    // Soporta formato simple: "https://facebook.com/..."
    // O formato enriquecido: "https://facebook.com/... | Título del video | salud | Carmen"
    const partes = linea.split('|').map(p => p.trim());
    const url = partes[0];
    const tituloPersonalizado = partes[1] || '';
    const categoria = (partes[2] || defaultCategory).toLowerCase();
    const municipio = partes[3] || defaultMunicipio;

    const reelId = extractReelId(url);
    if (!reelId) {
      console.warn(`[OMITIDO] No se pudo extraer ID de video válido de: ${url}`);
      continue;
    }

    const catConfig = CATEGORY_MAP[categoria] || CATEGORY_MAP.territorio;
    const imgMiniatura = DEFAULT_IMAGES[categoria] || DEFAULT_IMAGES.territorio;

    const nuevoReel = {
      id: reelId,
      categoria: categoria,
      categoriaLabel: catConfig.label,
      badgeColor: catConfig.badge,
      titulo: tituloPersonalizado || `Gestión y Territorio en ${municipio} · Rocío Abreu`,
      resumen: `Acciones de vinculación ciudadana, atención directa y apoyo comunitario en ${municipio}.`,
      tags: `#RocíoAbreu #${municipio} #GestiónTerritorio`,
      url: url.includes('/reel/') ? url : `https://www.facebook.com/reel/${reelId}/`,
      shareUrl: url,
      fbUrl: `https://www.facebook.com/watch/?v=${reelId}`,
      img: imgMiniatura,
      reproducciones: '3.5k',
      reproduccionesNum: 3500,
      reacciones: '280',
      reaccionesNum: 280,
      municipio: municipio,
      fecha: new Date().toISOString().split('T')[0]
    };

    const idx = catalog.findIndex(r => r.id === reelId || r.url === url || r.shareUrl === url);
    if (idx >= 0) {
      // Actualizar preservando métricas si ya existían
      catalog[idx] = Object.assign(catalog[idx], {
        url: nuevoReel.url,
        shareUrl: nuevoReel.shareUrl,
        fbUrl: nuevoReel.fbUrl,
        titulo: tituloPersonalizado || catalog[idx].titulo,
        categoria: categoria !== 'territorio' ? categoria : catalog[idx].categoria,
        categoriaLabel: catConfig.label,
        badgeColor: catConfig.badge,
        municipio: municipio || catalog[idx].municipio
      });
      actualizados++;
    } else {
      catalog.unshift(nuevoReel);
      nuevos++;
    }
  }

  writeReels(catalog);
  return { total: catalog.length, nuevos, actualizados };
}

// Ejecución directa por CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
========================================================================
📥 IMPORTADOR MASIVO DE VIDEOS DE FACEBOOK (Sin Meta Developers)
========================================================================
Uso:
  node scripts/import-lote.js <archivo_de_enlaces.txt> [--cat animal|canasta|salud|energia|escuela|territorio] [--mun "Campeche|Carmen"]

Formato aceptado en el archivo de texto:
  1) URL simple por línea:
     https://www.facebook.com/reel/1461882355841973
     https://www.facebook.com/watch/?v=1138981290886111

  2) URL con datos separados por barra vertical (|):
     https://www.facebook.com/reel/1461882355841973 | Rescate animal en colonia | animal | Campeche
     https://www.facebook.com/watch/?v=1138981290886111 | Apoyo de canasta básica | canasta | Carmen
========================================================================
`);
    process.exit(0);
  }

  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ El archivo no existe: ${filePath}`);
    process.exit(1);
  }

  let cat = 'territorio';
  let mun = 'Campeche';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--cat' && args[i + 1]) cat = args[++i];
    if (args[i] === '--mun' && args[i + 1]) mun = args[++i];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lineas = content.split('\n');

  console.log(`Procesando ${lineas.length} líneas de ${path.basename(filePath)}...`);
  const resultado = importarListaUrls(lineas, cat, mun);

  console.log(`
✅ IMPORTACIÓN FINALIZADA CON ÉXITO:
   - Nuevos videos agregados: ${resultado.nuevos}
   - Videos actualizados:     ${resultado.actualizados}
   - Total videos en catálogo: ${resultado.total}
`);
}

module.exports = { importarListaUrls };
