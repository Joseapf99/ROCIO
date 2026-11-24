const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8085;
const PUBLIC_DIR = __dirname;
const AGENDA_FILE = path.join(PUBLIC_DIR, 'data', 'agenda.json');
const REELS_FILE = path.join(PUBLIC_DIR, 'data', 'reels.json');
const { importarListaUrls } = require('./scripts/import-lote');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const USERS = [
  {
    usuario: 'diputada@rocioabreu.mx',
    alias: 'diputada',
    clave: 'rocio2026',
    nombre: 'Dip. Rocío Adriana Abreu',
    rol: 'diputada',
    rolLabel: 'Diputada Federal · Aprobación Final',
    avatar: '/images/hero-colonia.webp'
  },
  {
    usuario: 'coordinacion@rocioabreu.mx',
    alias: 'equipo',
    clave: 'equipo2026',
    nombre: 'Coordinación de Territorio y Agenda',
    rol: 'equipo',
    rolLabel: 'Equipo de Trabajo · Propuestas y Enlace',
    avatar: '/images/comision-reunion.webp'
  },
  {
    usuario: 'admin@rocioabreu.mx',
    alias: 'admin',
    clave: 'admin2026',
    nombre: 'Administrador del Portal',
    rol: 'admin',
    rolLabel: 'Administrador · Control Total',
    avatar: '/apple-touch-icon.png'
  }
];

function readAgenda() {
  try {
    if (!fs.existsSync(AGENDA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(AGENDA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo agenda.json:', e);
    return [];
  }
}

function writeAgenda(data) {
  try {
    fs.writeFileSync(AGENDA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error guardando agenda.json:', e);
    return false;
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURI(parsedUrl.pathname);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // API ROUTING
  if (reqPath.startsWith('/api/')) {
    // 1. Auth Endpoint
    if (reqPath === '/api/auth' && req.method === 'POST') {
      try {
        const { usuario, clave } = await parseJsonBody(req);
        const match = USERS.find(u => 
          (u.usuario.toLowerCase() === (usuario || '').trim().toLowerCase() ||
           u.alias.toLowerCase() === (usuario || '').trim().toLowerCase()) &&
          u.clave === clave
        );

        if (match) {
          const userCopy = { ...match };
          delete userCopy.clave;
          return sendJson(res, 200, { success: true, user: userCopy, token: 'token_' + Date.now() });
        } else {
          return sendJson(res, 401, { success: false, message: 'Usuario o contraseña incorrectos' });
        }
      } catch (err) {
        return sendJson(res, 400, { success: false, message: 'Error de formato en solicitud' });
      }
    }

    // 2. Agenda List
    if (reqPath === '/api/agenda' && req.method === 'GET') {
      const items = readAgenda();
      return sendJson(res, 200, { success: true, items });
    }

    // 3. Crear nueva propuesta (Equipo)
    if (reqPath === '/api/agenda' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        if (!body.titulo || !body.fecha) {
          return sendJson(res, 400, { success: false, message: 'Título y fecha son requeridos' });
        }

        const items = readAgenda();
        const newItem = {
          id: 'act-' + Date.now(),
          titulo: body.titulo.trim(),
          categoria: body.categoria || 'territorio',
          categoriaLabel: body.categoriaLabel || 'Territorio y Comunidad',
          fecha: body.fecha,
          hora: body.hora || '10:00',
          lugar: body.lugar || 'Por definir',
          municipio: body.municipio || 'Campeche',
          descripcion: body.descripcion || '',
          estado: 'pendiente', // Siempre pendiente hasta revisión
          publico: false,
          propuestoPor: body.propuestoPor || 'Equipo de Trabajo',
          fechaPropuesta: new Date().toISOString().split('T')[0],
          relevancia: body.relevancia || 'Media',
          observaciones: body.observaciones || ''
        };

        items.unshift(newItem);
        writeAgenda(items);

        return sendJson(res, 201, { success: true, item: newItem, message: 'Propuesta registrada correctamente' });
      } catch (err) {
        return sendJson(res, 400, { success: false, message: err.message });
      }
    }

    // 4. Cambiar estado de propuesta (Aprobar / Rechazar / Editar)
    if (reqPath.startsWith('/api/agenda/') && req.method === 'PUT') {
      try {
        const id = reqPath.replace('/api/agenda/', '');
        const body = await parseJsonBody(req);
        const items = readAgenda();
        const index = items.findIndex(i => i.id === id);

        if (index === -1) {
          return sendJson(res, 404, { success: false, message: 'Actividad no encontrada' });
        }

        // Si se aprueba, se publica automáticamente para el público
        if (body.estado === 'aprobado') {
          items[index].estado = 'aprobado';
          items[index].publico = true;
          items[index].fechaAprobacion = new Date().toISOString().split('T')[0];
          if (body.aprobadoPor) items[index].aprobadoPor = body.aprobadoPor;
        } else if (body.estado === 'rechazado') {
          items[index].estado = 'rechazado';
          items[index].publico = false;
          if (body.motivoRechazo) items[index].motivoRechazo = body.motivoRechazo;
        } else if (body.estado === 'pendiente') {
          items[index].estado = 'pendiente';
          items[index].publico = false;
        }

        // Permite también editar datos
        if (body.titulo) items[index].titulo = body.titulo;
        if (body.fecha) items[index].fecha = body.fecha;
        if (body.hora) items[index].hora = body.hora;
        if (body.lugar) items[index].lugar = body.lugar;
        if (body.municipio) items[index].municipio = body.municipio;
        if (body.descripcion !== undefined) items[index].descripcion = body.descripcion;
        if (body.categoria) items[index].categoria = body.categoria;
        if (body.categoriaLabel) items[index].categoriaLabel = body.categoriaLabel;

        writeAgenda(items);
        return sendJson(res, 200, { success: true, item: items[index], message: 'Actividad actualizada' });
      } catch (err) {
        return sendJson(res, 400, { success: false, message: err.message });
      }
    }

    // 5. Eliminar actividad
    if (reqPath.startsWith('/api/agenda/') && req.method === 'DELETE') {
      const id = reqPath.replace('/api/agenda/', '');
      let items = readAgenda();
      const initialLength = items.length;
      items = items.filter(i => i.id !== id);

      if (items.length === initialLength) {
        return sendJson(res, 404, { success: false, message: 'Actividad no encontrada' });
      }

      writeAgenda(items);
      return sendJson(res, 200, { success: true, message: 'Actividad eliminada' });
    }

    // 6. Obtener catálogo de Reels
    if (reqPath === '/api/reels' && req.method === 'GET') {
      try {
        const raw = fs.readFileSync(REELS_FILE, 'utf8');
        return sendJson(res, 200, { success: true, items: JSON.parse(raw) });
      } catch (e) {
        return sendJson(res, 200, { success: true, items: [] });
      }
    }

    // 7. Importar lista de enlaces de Facebook en lote
    if (reqPath === '/api/reels/batch' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        let urls = body.urls;
        if (typeof urls === 'string') {
          urls = urls.split('\n');
        } else if (!Array.isArray(urls)) {
          return sendJson(res, 400, { success: false, message: 'Se requiere una lista de URLs' });
        }

        const cat = body.categoria || 'territorio';
        const mun = body.municipio || 'Campeche';

        const resultado = importarListaUrls(urls, cat, mun);
        return sendJson(res, 200, {
          success: true,
          message: `Se importaron ${resultado.nuevos} videos nuevos (${resultado.actualizados} actualizados). Total: ${resultado.total}`,
          resultado
        });
      } catch (err) {
        return sendJson(res, 400, { success: false, message: err.message });
      }
    }

    return sendJson(res, 404, { success: false, message: 'Ruta API no encontrada' });
  }

  // STATIC FILE ROUTING
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.stat(indexPath, (err2, stats2) => {
        if (!err2 && stats2.isFile()) {
          serveFile(indexPath, res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        }
      });
      return;
    }

    if (!err && stats.isFile()) {
      serveFile(filePath, res);
      return;
    }

    // Try appending .html
    const htmlPath = filePath + '.html';
    fs.stat(htmlPath, (err3, stats3) => {
      if (!err3 && stats3.isFile()) {
        serveFile(htmlPath, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
