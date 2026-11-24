/**
 * FORM VALIDATION, MODAL SYSTEM & CITIZEN DIALOGS
 * Senadora Rocío Abreu — Presidencia Comisión de Energía
 */

document.addEventListener('DOMContentLoaded', () => {
  initCitizenPetitionForm();
  initModalSystem();
});

/* 1. Citizen Petition Form Validation */
function initCitizenPetitionForm() {
  const form = document.getElementById('citizen-form');
  if (!form) return;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return phone.replace(/\D/g, '').length >= 10;
  };

  const showError = (fieldId, errorId, message) => {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.add('invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  };

  const clearError = (fieldId, errorId) => {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.remove('invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  };

  // Real-time input listener
  ['full-name', 'email-address', 'phone-number', 'municipio', 'message-body'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        clearError(id, `${id}-error`);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('full-name');
    const email = document.getElementById('email-address');
    const phone = document.getElementById('phone-number');
    const municipio = document.getElementById('municipio');
    const asunto = document.getElementById('asunto');
    const message = document.getElementById('message-body');
    const terms = document.getElementById('terms-agreement');

    // Name validation
    if (!name || name.value.trim().length < 3) {
      showError('full-name', 'full-name-error', 'Por favor ingresa tu nombre y apellidos (mínimo 3 caracteres).');
      isValid = false;
    } else {
      clearError('full-name', 'full-name-error');
    }

    // Phone validation (10 digits in Mexico)
    if (!phone || !validatePhone(phone.value)) {
      showError('phone-number', 'phone-number-error', 'Ingresa un número telefónico de contacto válido a 10 dígitos.');
      isValid = false;
    } else {
      clearError('phone-number', 'phone-number-error');
    }

    // Email validation
    if (!email || !validateEmail(email.value)) {
      showError('email-address', 'email-address-error', 'Ingresa una cuenta de correo electrónico válida.');
      isValid = false;
    } else {
      clearError('email-address', 'email-address-error');
    }

    // Municipio validation
    if (!municipio || !municipio.value) {
      showError('municipio', 'municipio-error', 'Selecciona tu municipio en el estado de Campeche.');
      isValid = false;
    } else {
      clearError('municipio', 'municipio-error');
    }

    // Message validation
    if (!message || message.value.trim().length < 15) {
      showError('message-body', 'message-body-error', 'Describe brevemente tu petición o planteamiento (mínimo 15 caracteres).');
      isValid = false;
    } else {
      clearError('message-body', 'message-body-error');
    }

    // Terms checkbox
    if (terms && !terms.checked) {
      alert('Debes autorizar el aviso de privacidad para canalizar tu solicitud.');
      isValid = false;
    }

    if (isValid) {
      // Generate Folio
      const folio = 'RA-' + Math.floor(100000 + Math.random() * 900000);

      // Show confirmation in modal
      const modal = document.getElementById('main-modal');
      const modalBody = document.getElementById('modal-dynamic-content');

      if (modal && modalBody) {
        modalBody.innerHTML = `
          <div style="text-align: center; padding: 24px 10px;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: #73162b; color: #C5A059; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 32px; box-shadow: 0 4px 16px rgba(115,22,43,0.3);">🏛️</div>
            <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.8rem; color: #73162b; margin-bottom: 8px; font-weight: 800;">¡Petición Registrada con Éxito!</h3>
            <div style="display: inline-block; background: #fdfaf2; border: 1px solid #C5A059; color: #73162b; font-weight: 700; padding: 6px 16px; border-radius: 9999px; margin-bottom: 18px; font-size: 0.95rem;">
              Folio Ciudadano: ${folio}
            </div>
            <p style="font-size: 1.05rem; color: #1F2937; line-height: 1.6; margin-bottom: 20px; max-width: 520px; margin-left: auto; margin-right: auto;">
              Estimado(a) <strong>${escapeHtml(name.value.trim())}</strong>, tu solicitud sobre <strong>${escapeHtml(asunto ? asunto.options[asunto.selectedIndex].text : 'Gestión')}</strong> para el municipio de <strong>${escapeHtml(municipio.value)}</strong> ha sido recibida por la Casa de Enlace de la Senadora Rocío Abreu.
            </p>
            <div style="background: #F8F9FA; border-radius: 12px; padding: 16px; text-align: left; max-width: 480px; margin: 0 auto 24px; font-size: 0.88rem; color: #4B5563;">
              <p>• Hemos notificado a nuestro equipo territorial en Campeche.</p>
              <p style="margin-top: 6px;">• Nos pondremos en contacto al teléfono <strong>${escapeHtml(phone.value)}</strong> o al correo <strong>${escapeHtml(email.value)}</strong> para el seguimiento correspondiente.</p>
            </div>
            <button class="pill-button" onclick="closeModal()" style="background: #73162b; color: #fff; margin: 0 auto;">Cerrar y Finalizar</button>
          </div>
        `;
        modal.classList.add('active');
        form.reset();
      }
    }
  });
}

/* 2. Modal System */
function initModalSystem() {
  const modal = document.getElementById('main-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

window.closeModal = function() {
  const modal = document.getElementById('main-modal');
  if (modal) modal.classList.remove('active');
};

/* 3. Open Proposal Detail Modal */
window.openProposalModal = function(id) {
  const modal = document.getElementById('main-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  if (!modal || !modalBody) return;

  const data = proposalDatabase[id];
  if (!data) return;

  modalBody.innerHTML = `
    <div class="proposal-modal-view">
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 14px; flex-wrap: wrap;">
        <span class="proposal-tag" style="background: #73162b; color: #fff;">${escapeHtml(data.tag)}</span>
        <span style="font-size: 0.82rem; color: #C5A059; font-weight: 700;">Gaceta del Senado: ${data.gaceta}</span>
      </div>
      <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.85rem; line-height: 1.25; color: #73162b; margin-bottom: 16px; font-weight: 800;">
        ${escapeHtml(data.title)}
      </h2>
      <p style="font-size: 1.05rem; color: #1F2937; line-height: 1.6; margin-bottom: 22px;">
        ${escapeHtml(data.fullDescription)}
      </p>
      
      <div style="background-color: #fdfaf2; border: 1px solid rgba(197,160,89,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h4 style="font-size: 1rem; font-weight: 700; color: #73162b; margin-bottom: 12px;">Ejes Clave de la Reforma:</h4>
        <ul style="display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #374151;">
          ${data.pillars.map(p => `<li style="display: flex; align-items: flex-start; gap: 8px;"><span style="color: #C5A059; font-weight: bold;">✔</span> ${escapeHtml(p)}</li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E5E7EB; padding-top: 20px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #6B7280; display: block; font-weight: 600;">Beneficio Directo</span>
          <strong style="font-size: 1.05rem; color: #111827;">${escapeHtml(data.impact)}</strong>
        </div>
        <div style="display: flex; gap: 10px;">
          <a href="#contacto" onclick="closeModal()" class="pill-button" style="background: #73162b; color: #fff; padding: 10px 20px; font-size: 0.88rem;">
            Sumar mi Apoyo Ciudadano →
          </a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

/* 4. Open News Release Modal */
window.openNewsModal = function(newsId) {
  const modal = document.getElementById('main-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  if (!modal || !modalBody) return;

  const newsData = newsDatabase[newsId];
  if (!newsData) return;

  modalBody.innerHTML = `
    <div style="padding: 10px 0;">
      <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px; font-size: 0.85rem; color: #C5A059; font-weight: 700;">
        <span style="background: #73162b; color: #fff; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem;">${escapeHtml(newsData.category)}</span>
        <span>${escapeHtml(newsData.date)}</span>
      </div>
      <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.75rem; color: #73162b; font-weight: 800; line-height: 1.25; margin-bottom: 16px;">
        ${escapeHtml(newsData.title)}
      </h3>
      <div style="font-size: 1rem; color: #374151; line-height: 1.65; display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
        ${newsData.content.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
      <div style="border-top: 1px solid #E5E7EB; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <span style="font-size: 0.85rem; color: #6B7280;">Fuente: Coordinación de Comunicación Social del Senado</span>
        <button class="pill-button" onclick="closeModal()" style="background: #73162b; color: #fff; padding: 8px 20px; font-size: 0.85rem;">Cerrar Comunicado</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

/* 5. Open Privacy Notice Modal (INAI / LFPDPPP) */
window.openPrivacyNoticeModal = function() {
  const modal = document.getElementById('main-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="padding: 10px 0; max-height: 75vh; overflow-y: auto;">
      <span style="background: #73162b; color: #fff; padding: 3px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">AVISO DE PRIVACIDAD INTEGRAL</span>
      <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.5rem; color: #73162b; font-weight: 800; margin: 12px 0 16px;">
        Protección de Datos Personales en Posesión de Sujetos Obligados
      </h3>
      <div style="font-size: 0.9rem; color: #374151; line-height: 1.6; display: flex; flex-direction: column; gap: 12px;">
        <p>En cumplimiento con la <strong>Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO)</strong>, la Ley Federal de Transparencia y Acceso a la Información Pública y los lineamientos del Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (<strong>INAI</strong>), la Oficina de Enlace Legislativo de la <strong>Senadora Rocío Abreu Artiñano</strong> informa:</p>
        
        <p><strong>I. Responsable del Tratamiento:</strong><br>
        La Oficina Legislativa y Casas de Enlace de la Senadora Rocío Abreu, con domicilio en Paseo de la Reforma 135, Col. Tabacalera, Alcaldía Cuauhtémoc, Ciudad de México, y sedes en Ciudad del Carmen y Campeche.</p>

        <p><strong>II. Finalidades del Tratamiento:</strong><br>
        Los datos personales recabados (nombre, teléfono, correo electrónico, municipio y descripción de peticiones) serán utilizados única y exclusivamente para:
        <br>1) Canalizar solicitudes de gestión social y atención ciudadana ante dependencias públicas de los tres órdenes de gobierno.
        <br>2) Dar seguimiento puntual al estatus de sus peticiones y folios ciudadanos.
        <br>3) Difundir informes de labores legislativas y rendición de cuentas parlamentarias.</p>

        <p><strong>III. Ejercicio de Derechos ARCO:</strong><br>
        Usted podrá ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) dirigiendo una solicitud por escrito al correo oficial: <em>rocio.abreu@senado.gob.mx</em>.</p>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <button class="pill-button" onclick="closeModal()" style="background: #73162b; color: #fff;">He Leído y Comprendido el Aviso</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"']/g, function (s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[s];
  });
}

/* Database of Initiatives */
const proposalDatabase = {
  'energia-tarifas': {
    tag: 'Energía & Tarifas Justas',
    gaceta: 'SEN-LXV-0498/26',
    title: 'Reclasificación Constitucional de Tarifas Eléctricas para Campeche (Tarifa 1F)',
    fullDescription: 'Iniciativa prioritaria para modificar la Ley de la Industria Eléctrica y ordenar a la CFE y a la Comisión Reguladora de Energía aplicar de forma permanente la Tarifa 1F a los 11 municipios del estado de Campeche, sustentada en los registros térmicos extremos del Golfo de México.',
    pillars: [
      'Establecimiento de subsidio de verano automático a partir de marzo de cada ejercicio fiscal.',
      'Reclasificación técnica de los municipios del estado de Campeche sin condicionamientos burocráticos.',
      'Prohibición de cortes masivos de suministro eléctrico en comunidades en vulnerabilidad térmica.'
    ],
    impact: 'Ahorro directo de hasta el 45% en el recibo de luz para más de 280,000 familias campechanas'
  },
  'soberania-petroquimica': {
    tag: 'Soberanía Energética',
    gaceta: 'SEN-LXV-0512/26',
    title: 'Fortalecimiento de la Industria Petroquímica y Contenido Local en Ciudad del Carmen',
    fullDescription: 'Reforma para garantizar que los contratos de exploración, producción y mantenimiento en la Sonda de Campeche otorguen prioridad contractual del 40% a empresas locales y mano de obra radicada en Ciudad del Carmen.',
    pillars: [
      'Padrón preferencial de proveeduría para pequeñas y medianas empresas carmelitas.',
      'Fondos de remediación ambiental y desarrollo portuario financiados con derechos petroleros.',
      'Certificación técnica gratuita para jóvenes ingenieros egresados de universidades de Campeche.'
    ],
    impact: 'Generación estimada de 18,000 empleos directos e indirectos en la región de la Isla del Carmen'
  },
  'pesca-golfo': {
    tag: 'Sector Pesquero & Acuícola',
    gaceta: 'SEN-LXV-0487/26',
    title: 'Ley de Fomento y Subsidio al Diésel y Gasolina Ribereña para el Sureste',
    fullDescription: 'Blindaje a los apoyos del programa Bienpesca con subsidio focalizado al combustible marino para pescadores de ribera y cooperativas de Champotón, Carmen, Campeche y Palizada.',
    pillars: [
      'Precios de garantía para combustible marino durante periodos de veda y apertura de captura.',
      'Líneas de crédito para la modernización de artes de pesca ecológicas y sustentables.',
      'Seguro de vida y gastos médicos para hombres y mujeres del mar del litoral campechano.'
    ],
    impact: 'Respaldo directo a más de 12,000 familias dedicadas a la actividad pesquera artesanal'
  },
  'paridad-violencia': {
    tag: 'Equidad & Derechos',
    gaceta: 'SEN-LXV-0466/26',
    title: 'Sanción Penal a la Violencia Política Contra las Mujeres en Razón de Género',
    fullDescription: 'Fortalecimiento del marco normativo federal para inhabilitar e imponer penas agravadas a servidores públicos y particulares que ejerzan violencia, acoso digital o intimidación política contra mujeres candidatas y legisladoras.',
    pillars: [
      'Inhabilitación automática para cargos de elección popular a agresores con sentencia firme.',
      'Medidas cautelares de protección policial inmediata en un plazo máximo de 12 horas.',
      'Capacitación obligatoria con perspectiva de género en órganos electorales y legislativos.'
    ],
    impact: 'Garantía de libre ejercicio de los derechos políticos de las mujeres en todo México'
  }
};

/* Database of Press Releases */
const newsDatabase = {
  'boletin-1': {
    category: 'Comisión de Energía',
    date: '21 Octubre, 2026',
    title: 'Rocío Abreu encabeza dictamen para garantizar soberanía eléctrica nacional en el Senado',
    content: [
      'La Presidenta de la Comisión de Energía del Senado de la República, Rocío Abreu Artiñano, encabezó la sesión ordinaria en la que se aprobó por mayoría calificada el dictamen que fortalece a las empresas públicas del Estado y consolida la rectoría estratégica de la nación en materia energética.',
      '"No podemos permitir que los recursos del pueblo queden al arbitrio del mercado sin sentido social. La energía eléctrica es un derecho humano y un motor de desarrollo que debe beneficiar primero a las familias mexicanas", puntualizó la legisladora campechana.',
      'El dictamen pasará al Pleno del Senado para su discusión y eventual ratificación en el presente periodo ordinario.'
    ]
  },
  'boletin-2': {
    category: 'Territorio Campeche',
    date: '15 Octubre, 2026',
    title: 'Exige Senadora Rocío Abreu acelerar la Tarifa 1F para todos los municipios de Campeche',
    content: [
      'Durante reunión de trabajo con la Comisión Reguladora de Energía y directivos de la CFE, la Senadora Rocío Abreu reiteró que Campeche merece justicia tarifaria inmediata debido a las sensaciones térmicas que superan los 45 grados centígrados.',
      '"Es una demanda histórica de las familias de Ciudad del Carmen, Campeche, Escárcega, Champotón y todos los municipios. Hemos presentado los estudios técnicos de CONAGUA y no descansaremos hasta que se firme el convenio definitivo", señaló Abreu Artiñano.',
      'Se acordó una mesa técnica de seguimiento con participación de presidentes municipales del estado.'
    ]
  },
  'boletin-3': {
    category: 'Gestión Social',
    date: '08 Octubre, 2026',
    title: 'Más de 50 mil familias beneficiadas a través de las Casas de Enlace Ciudadano en Campeche',
    content: [
      'Al presentar su balance semestral de territorio, la Senadora Rocío Abreu informó que sus oficinas de enlace en Ciudad del Carmen y San Francisco de Campeche han atendido a más de 50,000 familias en programas de salud, asesoría jurídica, donación de aparatos ortopédicos y apoyo a pescadores.',
      '"El verdadero trabajo de una senadora no solo está en la tribuna de la Ciudad de México, sino en las colonias, en los muelles y en las comunidades de nuestra tierra", concluyó.'
    ]
  }
};
