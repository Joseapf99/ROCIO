const fs = require('fs');
const path = require('path');

const REELS_PATH = path.join(__dirname, '..', 'data', 'reels.json');

const CATEGORY_MAP = {
  animal: { label: 'Bienestar Animal', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  canasta: { label: 'Canasta Básica', badge: 'bg-amber-50 text-amber-900 border-amber-200' },
  salud: { label: 'Salud Visual', badge: 'bg-sky-50 text-sky-900 border-sky-200' },
  energia: { label: 'Comisión de Energía', badge: 'bg-rose-50 text-rose-900 border-rose-200' },
  escuela: { label: 'Escuelas Dignas', badge: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
  territorio: { label: 'Territorio y Comunidad', badge: 'bg-orange-50 text-orange-900 border-orange-200' }
};

function extractReelId(url) {
  if (!url) return null;
  const reelMatch = url.match(/\/reel\/(\d+)/i);
  if (reelMatch) return reelMatch[1];
  const videoMatch = url.match(/\/videos\/(\d+)/i);
  if (videoMatch) return videoMatch[1];
  const watchMatch = url.match(/[?&]v=(\d+)/i);
  if (watchMatch) return watchMatch[1];
  const shareMatch = url.match(/\/share\/v\/([a-zA-Z0-9_-]+)/i);
  if (shareMatch) return shareMatch[1];
  return 'reel_' + Date.now();
}

function addReel({
  url,
  titulo = 'Publicación en Territorio · Rocío Abreu',
  resumen = 'Acciones de vinculación ciudadana y apoyo social directo en las colonias de Campeche.',
  tags = '#RocíoAbreu #Campeche #GestiónTerritorio',
  categoria = 'canasta',
  municipio = 'Campeche',
  img = '/images/hero-colonia.webp',
  reproducciones = '5.0k',
  reacciones = '320'
}) {
  const reelId = extractReelId(url);
  const catConfig = CATEGORY_MAP[categoria] || CATEGORY_MAP.territorio;

  const newEntry = {
    id: reelId,
    categoria,
    categoriaLabel: catConfig.label,
    badgeColor: catConfig.badge,
    titulo,
    resumen,
    tags,
    url: url.includes('/reel/') ? url : `https://www.facebook.com/reel/${reelId}/`,
    shareUrl: url,
    fbUrl: `https://www.facebook.com/watch/?v=${reelId}`,
    img,
    reproducciones,
    reproduccionesNum: parseInt(reproducciones.replace(/[^0-9]/g, '')) * (reproducciones.includes('k') ? 1000 : 1) || 5000,
    reacciones,
    reaccionesNum: parseInt(reacciones.replace(/[^0-9]/g, '')) * (reacciones.includes('k') ? 1000 : 1) || 300,
    municipio,
    fecha: new Date().toISOString().split('T')[0]
  };

  let list = [];
  if (fs.existsSync(REELS_PATH)) {
    try {
      list = JSON.parse(fs.readFileSync(REELS_PATH, 'utf-8'));
    } catch (e) {
      list = [];
    }
  }

  // Comprobar si ya existe
  const existingIdx = list.findIndex(r => r.id === reelId || r.url === url || r.shareUrl === url);
  if (existingIdx >= 0) {
    list[existingIdx] = Object.assign(list[existingIdx], newEntry);
    console.log(`[UPDATE] Actualizado reel existente: ${reelId}`);
  } else {
    list.unshift(newEntry);
    console.log(`[ADD] Nuevo reel añadido exitosamente: ${reelId}`);
  }

  fs.writeFileSync(REELS_PATH, JSON.stringify(list, null, 2), 'utf-8');
  console.log(`Total de Reels en catálogo: ${list.length}`);
}

// Ejecución vía CLI si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Uso: node add-reel.js <URL_FACEBOOK> [--title "Título"] [--cat "animal|canasta|salud|energia|escuela"] [--mun "Campeche"]');
    process.exit(0);
  }

  const url = args[0];
  let titulo = 'Publicación en Territorio · Rocío Abreu';
  let categoria = 'canasta';
  let municipio = 'Campeche';

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) titulo = args[++i];
    if (args[i] === '--cat' && args[i + 1]) categoria = args[++i];
    if (args[i] === '--mun' && args[i + 1]) municipio = args[++i];
  }

  addReel({ url, titulo, categoria, municipio });
}

module.exports = { addReel, extractReelId, CATEGORY_MAP };
