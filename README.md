# Portal Oficial — Dip. Fed. Rocío Adriana Abreu Artiñano

Sitio web oficial, plataforma de rendición de cuentas legislativa, agenda institucional y vinculación social en territorio para la **Diputada Federal Rocío Adriana Abreu Artiñano** (LXVI Legislatura del H. Congreso de la Unión, Presidenta de la Comisión de Energía de la Cámara de Diputados).

---

## 🏛️ Contexto y Estructura del Portal

El portal combina una estética editorial de alto impacto institucional con herramientas interactivas de servicio a la ciudadanía y gestión parlamentaria:

- **Identidad:** Mtra. Rocío Adriana Abreu Artiñano — Abogada con especialidad fiscal (UNITEC), 28+ años de servicio público, ex Senadora de la República por Campeche y primera mujer en presidir la Comisión de Energía de la Cámara de Diputados.
- **Paleta Oficial:**
  - Base Guinda Institucional: `--guinda: #8A1538` / `--guinda-hover: #6e102c`
  - Ciruela de Contraste: `--ciruela: #201418`
  - Fondo Crema Editorial: `--crema: #FCFAF6`
  - Dorado Legislativo: `--dorado: #8A6D3E` / `--dorado-claro: #A98A5B`
  - Tipografías: *Fraunces* (títulos y acentos display) y *Archivo/Inter* (cuerpo y metadatos).

### 📑 Secciones del Portal

1. **Inicio (`/`):** Hero cinematográfico rotativo con imágenes de territorio y comisiones, cifras históricas (1.ª mujer en Energía, LXVI Legislatura, 1996), pilares de soberanía y transición energética, actividades recientes, reproductor oficial de video de Meta Facebook y galería interactiva.
2. **Trayectoria (`/trayectoria`):** Biografía integral desde Ciudad del Carmen a San Lázaro, formación jurídica, integración al colectivo Sorora y línea de tiempo detallada con todos sus cargos públicos (CONSAR, PGJDF, Regiduría, Diputación Local, Diputación Federal LXII, SEMARNAT, Senado LXIV y Diputación Federal LXVI).
3. **Trabajo Legislativo (`/trabajo-legislativo`):** Registro de **18 iniciativas legislativas** con filtros por legislatura, ejes de soberanía energética, combate al huachicoleo, bienestar animal, derechos de las mujeres y registro de comparecencias y foros de la Comisión de Energía (PEMEX, CFE, CENACE, Central Puerto Peñasco).
4. **Gestión y Apoyos (`/gestion`):** Ejes del movimiento territorial *«Rocístas de Corazón»*:
   - *Rocío en tu Colonia:* canasta básica y carnes subsidiadas a bajo costo en colonias de Campeche y Carmen.
   - *Rocío en tu Salud:* campañas de salud visual (convenio Smart Visión), lentes subsidiados, medicamentos y aparatos ortopédicos.
   - *Rocío en tu Escuela:* rehabilitación, pintura, domos, material didáctico y mobiliario.
   - *Mural de Reels y Videos:* fachada de alta velocidad con reproductor oficial de Facebook bajo demanda.
5. **Agenda Digital (`/agenda/`):** Gaceta pública de actividades y **Consola Ejecutiva Interna** para recepción de propuestas ciudadanas y flujo de aprobación.
6. **Galería Multimedia (`/galeria-territorio/`):** Mural fotográfico y audiovisual con filtros dinámicos por temática (*Bienestar animal, Canasta básica, Salud, Energía, Educación*) y por municipios de Campeche.
7. **Contacto (`/contacto`):** Ubicación en el Palacio Legislativo de San Lázaro, correo oficial (`rocio.abreu@diputados.gob.mx`), redes sociales y formulario con validación interactiva.
8. **Aviso de Privacidad (`/aviso-de-privacidad`):** Marco legal conforme a la Ley Federal de Protección de Datos Personales.

---

## 💻 Servidor Local y API REST (`server.js`)

El portal incluye un backend nativo en **Node.js** (sin dependencias pesadas de terceros) para servir los archivos y proveer una API REST para la Agenda Digital y los videos:

### Iniciar el Servidor

```bash
node server.js
```

El servidor iniciará en: **`http://localhost:8085`**

### 🔑 Cuentas y Roles de la Consola de Planeación (`/agenda/`)

Para acceder al modo de planeación y revisión de agenda, usa las siguientes credenciales en el modal de inicio de sesión de la Agenda Digital:

| Rol | Usuario / Alias | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Diputada Federal** | `diputada@rocioabreu.mx` o `diputada` | `rocio2026` | Aprobación final, rechazo y publicación de actividades. |
| **Equipo de Territorio** | `coordinacion@rocioabreu.mx` o `equipo` | `equipo2026` | Registro de nuevas propuestas de actividades en colonias y municipios. |
| **Administrador** | `admin@rocioabreu.mx` o `admin` | `admin2026` | Control total del sistema, edición y eliminación de eventos. |

---

## 📹 Administración de Reels y Videos de Territorio

Los videos mostrados en la galería y en la sección de gestión se gestionan a través de `data/reels.json` mediante scripts CLI:

### 1. Agregar o Actualizar un Reel Individual
```bash
node scripts/add-reel.js "https://www.facebook.com/reel/1461882355841973" --title "Rescate animal y adopción responsable" --cat "animal" --mun "Campeche"
```

### 2. Importar Videos en Lote desde Archivo
Edita [`enlaces-ejemplo.txt`](enlaces-ejemplo.txt) con tus URLs de Facebook y ejecuta:

```bash
node -e "const { importarListaUrls } = require('./scripts/import-lote'); const fs = require('fs'); const lineas = fs.readFileSync('enlaces-ejemplo.txt', 'utf8').split('\n'); console.log(importarListaUrls(lineas));"
```

O a través del endpoint HTTP:
```bash
POST /api/reels/batch
Content-Type: application/json

{
  "urls": ["https://facebook.com/reel/1461882355841973 | Rescate animal | animal | Campeche"]
}
```

---

## 📁 Estructura de Directorios

```
rocio-abreu-portal/
├── index.html                  # Portada y página principal
├── agenda/                     # Agenda digital interactiva y consola ejecutiva
├── trayectoria/                # Biografía y trayectoria legislativa
├── trabajo-legislativo/        # Iniciativas de ley, Comisión de Energía y foros
├── gestion/                    # Programas sociales «Rocístas de Corazón» y Reels
├── galeria-territorio/         # Galería multimedia por municipios
├── contacto/                   # Información institucional y formulario
├── aviso-de-privacidad/        # Aviso legal de privacidad
├── server.js                   # Servidor HTTP nativo en Node.js (puerto 8085)
├── data/
│   ├── agenda.json             # Almacén de actividades y estados de aprobación
│   └── reels.json              # Catálogo de videos de Meta Facebook
├── scripts/
│   ├── add-reel.js             # CLI para incorporar videos individuales
│   └── import-lote.js          # Procesador masivo de videos con metadatos
├── css/                        # Hojas de estilo oficiales y tokens de diseño
├── images/                     # Archivos fotográficos optimizados (WebP / JPG)
└── enlaces-ejemplo.txt         # Plantilla para carga masiva de videos
```
