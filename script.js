/**
 * @file script.js
 * @description Lógica principal para el Visor 3D de Aves UPEL IPB.
 * Implementa un componente de A-Frame para la visualización de modelos 3D (glTF)
 * y un controlador de interfaz para la gestión de datos y eventos.
 * @author Carlos García Torín "Abejorro Digital"
 * @version 1.0.0
 * @date Mayo 2026
 * @license MIT
 */

/* global AFRAME, THREE */

/**
 * @typedef {Object} DatosAve
 * @property {string} nombre - Nombre común del ave.
 * @property {string} cientifico - Nombre científico.
 * @property {string} familia - Familia taxonómica.
 * @property {string} descripcion - Breve descripción física y hábitat.
 * @property {string} dato - Dato curioso o clave científica.
 */

/**
 * Base de datos local con la información científica de las aves.
 * @type {Object.<string, DatosAve>}
 */
const DATOS_AVES = {
  /* 
  // NOTA: Deshabilitado temporalmente por peso excesivo del modelo 3D (~27MB). 
  // Requiere optimización (Draco compression o reducción de polígonos) antes de reactivar.
  'Azulejo de jardin 3D': {
    nombre: 'Azulejo de jardín',
    cientifico: 'Thraupis episcopus',
    familia: 'Thraupidae',
    descripcion: 'Es una de las aves más comunes en áreas urbanas y jardines. Se distingue por su plumaje azul claro cenizo, con tonos más intensos en las alas y la cola.',
    dato: 'Es altamente sociable y tiene una dieta generalista basada en frutas e insectos, lo que le permite prosperar en entornos transformados por el humano.'
  },
  */
  'Cernicalo Vulgar 3D': {
    nombre: 'Cernícalo Vulgar',
    cientifico: 'Falco tinnunculus',
    familia: 'Falconidae',
    descripcion: 'Un halcón pequeño con una asombrosa capacidad para el "vuelo de cernido" (mantenerse suspendido en un punto fijo en el aire batiendo las alas rápidamente).',
    dato: 'Posee una visión excepcionalmente aguda, capaz de detectar rastros de orina de roedores que reflejan la luz ultravioleta.'
  },
  'Cristofue 3D': {
    nombre: 'Cristofué',
    cientifico: 'Pitangus sulphuratus',
    familia: 'Tyrannidae',
    descripcion: 'Conocido también como Bienteveo o Quetupí. Tiene un antifaz negro, corona amarilla oculta y pecho amarillo vibrante.',
    dato: 'Su nombre común es una onomatopeya de su canto estridente. Es un ave muy territorial y audaz, capaz de ahuyentar a aves de presa mucho más grandes.'
  },
  'Garrapatero 3D': {
    nombre: 'Garrapatero',
    cientifico: 'Crotophaga ani / C. sulcirostris',
    familia: 'Cuculidae',
    descripcion: 'Ave de plumaje completamente negro y pico grueso y encorvado. Suele vérsele en grupos familiares.',
    dato: 'Recibe su nombre por su hábito de buscar parásitos en el ganado, aunque su dieta principal son los insectos que saltan cuando los animales caminan por el pasto.'
  },
  'Gavilan Habado 3D': {
    nombre: 'Gavilán Habado',
    cientifico: 'Rupornis magnirostris',
    familia: 'Accipitridae',
    descripcion: 'Es el ave de prey más común en bordes de carreteras y zonas abiertas. Tiene un barrado (habado) característico en el pecho y ojos amarillos intensos.',
    dato: 'Es un cazador oportunista que se alimenta de lagartijas, insectos grandes y pequeños roedores.'
  },
  'Gonzalito 3D': {
    nombre: 'Gonzalito',
    cientifico: 'Icterus nigrogularis',
    familia: 'Icteridae',
    descripcion: 'Un turpial de tamaño mediano con un plumaje amarillo brillante y una "corbata" o babero negro en la garganta.',
    dato: 'Construye nidos colgantes tejidos de forma experta con fibras vegetales, que pueden medir hasta 40 cm de largo para proteger a los polluelos de depredadores.'
  },
  /*
  // NOTA: Deshabilitado temporalmente por peso excesivo del modelo 3D (~32MB).
  // Requiere mantenimiento y optimización de malla.
  'Loro Guaro 3D': {
    nombre: 'Loro Guaro',
    cientifico: 'Amazona amazonica',
    familia: 'Psittacidae',
    descripcion: 'Un loro verde de tamaño medio con manchas amarillas y azules en la cara y plumas naranjas en las alas (visibles al volar).',
    dato: 'Son aves extremadamente longevas y monógamas; una vez que forman pareja, permanecen juntos durante toda su vida.'
  },
  */
  'Paloma Maraquita 3D': {
    nombre: 'Paloma Maraquita',
    cientifico: 'Columbina squammata',
    familia: 'Columbidae',
    descripcion: 'Una paloma pequeña cuyo plumaje presenta un patrón de bordes oscuros que le dan una apariencia "escamosa" (de ahí su nombre científico squammata).',
    dato: 'Al volar, sus alas producen un característico sonido metálico o traqueteo que sirve como señal de alerta para el resto de la bandada.'
  },
  'Paloma sabanera 3D': {
    nombre: 'Paloma Sabanera',
    cientifico: 'Patagioenas corensis / Zenaida auriculata',
    familia: 'Columbidae',
    descripcion: 'Dependiendo de la región, suele referirse a la paloma de ojos azules o a la torcaza común. Son robustas y de colores tierra/grisáceos.',
    dato: 'Son especies altamente adaptables que se desplazan en grandes grupos hacia zonas agrícolas para alimentarse de semillas y granos.'
  },
  'Paraulata Llanera': {
    nombre: 'Paraulata Llanera',
    cientifico: 'Mimus gilvus',
    familia: 'Mimidae',
    descripcion: 'Ave de color gris con pecho blanquecino y una cola larga con puntas blancas. Es famosa por su elegancia al caminar.',
    dato: 'Es una maestra de la mímica. Tiene un repertorio de cantos muy complejo y es capaz de imitar los sonidos de otras aves e incluso ruidos del entorno urbano.'
  }
};

/**
 * Registro del componente 'model-viewer' de A-Frame.
 * Gestiona la carga, centrado, escalado e interacción (rotación/zoom) del modelo 3D.
 */
AFRAME.registerComponent('model-viewer', {
  schema: {
    /** @type {string} Ruta al archivo .glb del modelo. */
    gltfModel: { default: '' },
    /** @type {string} Título (opcional) para el modelo. */
    title: { default: '' }
  },

  /**
   * Inicializa el componente, configura el renderizador y enlaza los eventos de entrada.
   */
  init: function () {
    var el = this.el;

    // Configuración de renderizado y raycasting
    el.setAttribute('renderer', { colorManagement: true, antialias: true });
    el.setAttribute('raycaster', { objects: '.raycastable' });
    el.setAttribute('cursor', { rayOrigin: 'mouse', fuse: false });

    // Enlazar métodos al contexto 'this'
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);

    // Inicializar sub-entidades (cámara, luces, pivots)
    this.initCameraRig();
    this.initEntities();

    // Deshabilitar menú contextual nativo en el canvas de A-Frame
    this.el.sceneEl.canvas.oncontextmenu = function (evt) { evt.preventDefault(); };

    // Escuchar cambios de orientación del dispositivo
    window.addEventListener('orientationchange', this.onOrientationChange);

    // Registrar manejadores de eventos globales (Ratón)
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('wheel', this.onMouseWheel);

    // Registrar manejadores de eventos globales (Táctil)
    document.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('touchmove', this.onTouchMove);

    // Evento de carga del modelo glTF
    this.modelEl.addEventListener('model-loaded', this.onModelLoaded);
  },

  /**
   * Se ejecuta cuando cambian las propiedades del esquema.
   * Actualiza el modelo cargado en la entidad.
   */
  update: function () {
    if (!this.data.gltfModel) { return; }
    this.modelEl.setAttribute('gltf-model', this.data.gltfModel);
  },

  /**
   * Inicializa la cámara y su plataforma (Rig).
   */
  initCameraRig: function () {
    var cameraRigEl = this.cameraRigEl = document.createElement('a-entity');
    var cameraEl = this.cameraEl = document.createElement('a-entity');

    cameraEl.setAttribute('camera', { fov: 60 });
    cameraEl.setAttribute('look-controls', {
      magicWindowTrackingEnabled: false,
      mouseEnabled: false,
      touchEnabled: false
    });

    cameraRigEl.appendChild(cameraEl);
    this.el.appendChild(cameraRigEl);
  },

  /**
   * Crea y configura las entidades necesarias: contenedor, pivot, modelo, luces y sombras.
   */
  initEntities: function () {
    var containerEl = this.containerEl = document.createElement('a-entity');
    var modelPivotEl = this.modelPivotEl = document.createElement('a-entity');
    var modelEl = this.modelEl = document.createElement('a-entity');
    var shadowEl = this.shadowEl = document.createElement('a-entity');
    var lightEl = this.lightEl = document.createElement('a-entity');
    var sceneLightEl = this.sceneLightEl = document.createElement('a-entity');

    // Iluminación ambiental base (Hemisferio)
    sceneLightEl.setAttribute('light', { type: 'hemisphere', intensity: 3.14 });
    this.el.appendChild(sceneLightEl);

    // Iluminación focal direccional con soporte de sombras
    lightEl.setAttribute('position', '-2 4 2');
    lightEl.setAttribute('light', {
      type: 'directional',
      castShadow: true,
      shadowMapHeight: 1024,
      shadowMapWidth: 1024,
      shadowCameraLeft: -7,
      shadowCameraRight: 5,
      shadowCameraBottom: -5,
      shadowCameraTop: 5,
      intensity: 1.57,
      target: 'modelPivot'
    });
    containerEl.appendChild(lightEl);

    // Entidad Pivot para facilitar rotación y centrado
    modelPivotEl.id = 'modelPivot';

    // Entidad del modelo 3D
    modelEl.setAttribute('rotation', '0 -30 0');
    modelEl.setAttribute('animation-mixer', '');
    modelEl.setAttribute('shadow', 'cast: true; receive: false');
    modelEl.id = 'modelEl';

    modelPivotEl.appendChild(modelEl);

    // Sombra falsa (plano) para mejorar la profundidad visual
    shadowEl.setAttribute('rotation', '-90 -30 0');
    shadowEl.setAttribute('geometry', 'primitive: plane; width: 1.0; height: 1.0');
    shadowEl.setAttribute('material', 'transparent: true; opacity: 0.35; color: #1a1a1a');
    modelPivotEl.appendChild(shadowEl);

    containerEl.appendChild(modelPivotEl);
    this.el.appendChild(containerEl);
  },

  /**
   * Manejador para el zoom mediante la rueda del ratón.
   * @param {WheelEvent} evt - Evento de rueda.
   */
  onMouseWheel: function (evt) {
    var modelPivotEl = this.modelPivotEl;
    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
    modelScale -= evt.deltaY / 100;
    // Limitar escala entre 0.5x y 4.0x
    modelScale = Math.min(Math.max(0.5, modelScale), 4.0);
    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
    this.modelScale = modelScale;
  },

  /**
   * Ajusta la distancia de la cámara según la orientación (Landscape/Portrait).
   */
  onOrientationChange: function () {
    if (AFRAME.utils.device.isLandscape()) {
      this.cameraRigEl.object3D.position.z -= 1;
    } else {
      this.cameraRigEl.object3D.position.z += 1;
    }
  },

  /**
   * Manejador central para eventos táctiles.
   * @param {TouchEvent} evt - Evento de toque.
   */
  onTouchMove: function (evt) {
    if (evt.touches.length === 1) { this.onSingleTouchMove(evt); }
    if (evt.touches.length === 2) { this.onPinchMove(evt); }
  },

  /**
   * Gestiona la rotación mediante un solo dedo.
   * @param {TouchEvent} evt - Evento de toque.
   */
  onSingleTouchMove: function (evt) {
    var dX, dY;
    var modelPivotEl = this.modelPivotEl;
    this.oldClientX = this.oldClientX || evt.touches[0].clientX;
    this.oldClientY = this.oldClientY || evt.touches[0].clientY;

    dX = this.oldClientX - evt.touches[0].clientX;
    dY = this.oldClientY - evt.touches[0].clientY;

    modelPivotEl.object3D.rotation.y -= dX / 200;
    modelPivotEl.object3D.rotation.x -= dY / 100;
    // Limitar rotación en X para evitar vueltas completas
    modelPivotEl.object3D.rotation.x = Math.min(
      Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2
    );

    this.oldClientX = evt.touches[0].clientX;
    this.oldClientY = evt.touches[0].clientY;
  },

  /**
   * Gestiona el zoom mediante el gesto de "pellizco" (dos dedos).
   * @param {TouchEvent} evt - Evento de toque múltiple.
   */
  onPinchMove: function (evt) {
    var dX = evt.touches[0].clientX - evt.touches[1].clientX;
    var dY = evt.touches[0].clientY - evt.touches[1].clientY;
    var modelPivotEl = this.modelPivotEl;
    var distance = Math.sqrt(dX * dX + dY * dY);
    var oldDistance = this.oldDistance || distance;
    var distanceDiff = oldDistance - distance;
    var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;

    modelScale -= distanceDiff / 500;
    modelScale = Math.min(Math.max(0.5, modelScale), 3.0);
    modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);

    this.modelScale = modelScale;
    this.oldDistance = distance;
  },

  /**
   * Limpia las variables de seguimiento al finalizar el contacto táctil.
   * @param {TouchEvent} evt - Evento de fin de toque.
   */
  onTouchEnd: function (evt) {
    this.oldClientX = undefined;
    this.oldClientY = undefined;
    if (evt.touches.length < 2) { this.oldDistance = undefined; }
  },

  /**
   * Finaliza el estado de pulsación del ratón.
   * @param {MouseEvent} evt - Evento de soltar botón.
   */
  onMouseUp: function (evt) {
    this.leftRightButtonPressed = false;
    if (evt.buttons === undefined || evt.buttons !== 0) { return; }
    this.oldClientX = undefined;
    this.oldClientY = undefined;
  },

  /**
   * Detecta la pulsación inicial del ratón para rotación o desplazamiento.
   * @param {MouseEvent} evt - Evento de clic.
   */
  onMouseDown: function (evt) {
    // Detecta si se presionan ambos botones para desplazar (pan)
    if (evt.buttons) { this.leftRightButtonPressed = evt.buttons === 3; }
    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  },

  /**
   * Gestiona el movimiento del ratón para rotar o desplazar el modelo.
   * @param {MouseEvent} evt - Evento de movimiento.
   */
  onMouseMove: function (evt) {
    if (this.leftRightButtonPressed) {
      this.dragModel(evt);
    } else {
      this.rotateModel(evt);
    }
  },

  /**
   * Desplaza el modelo en los ejes X e Y.
   * @param {MouseEvent} evt - Evento de movimiento.
   */
  dragModel: function (evt) {
    var dX, dY;
    var modelPivotEl = this.modelPivotEl;
    if (!this.oldClientX) { return; }
    dX = this.oldClientX - evt.clientX;
    dY = this.oldClientY - evt.clientY;
    modelPivotEl.object3D.position.y += dY / 200;
    modelPivotEl.object3D.position.x -= dX / 200;
    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  },

  /**
   * Rota el modelo en los ejes X e Y.
   * @param {MouseEvent} evt - Evento de movimiento.
   */
  rotateModel: function (evt) {
    var dX, dY;
    var modelPivotEl = this.modelPivotEl;
    if (!this.oldClientX) { return; }
    dX = this.oldClientX - evt.clientX;
    dY = this.oldClientY - evt.clientY;
    modelPivotEl.object3D.rotation.y -= dX / 100;
    modelPivotEl.object3D.rotation.x -= dY / 200;
    modelPivotEl.object3D.rotation.x = Math.min(
      Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2
    );
    this.oldClientX = evt.clientX;
    this.oldClientY = evt.clientY;
  },

  /**
   * Se dispara cuando el modelo glTF ha terminado de cargarse en memoria.
   * Ejecuta el centrado, escalado automático y notifica al controlador global.
   */
  onModelLoaded: function () {
    this.centerAndScaleModel();
    // Emitir evento personalizado para indicar que el modelo está listo
    document.dispatchEvent(new CustomEvent('aveModeloCargado'));
  },

  /**
   * Calcula las dimensiones del modelo y ajusta su escala y posición para que sea
   * visualmente consistente independientemente de su tamaño original en el archivo glb.
   */
  centerAndScaleModel: function () {
    var modelEl = this.modelEl;
    var shadowEl = this.shadowEl;
    var gltfObject = modelEl.getObject3D('mesh');

    if (!gltfObject) { return; }

    // Reiniciar transformaciones locales
    modelEl.object3D.position.set(0, 0, 0);
    modelEl.object3D.scale.set(1.0, 1.0, 1.0);
    this.cameraRigEl.object3D.position.z = 3.0;

    // Calcular Bounding Box y obtener tamaño real
    modelEl.object3D.updateMatrixWorld();
    var box = new THREE.Box3().setFromObject(gltfObject);
    var size = box.getSize(new THREE.Vector3());

    // Escalar dinámicamente para ajustar a una altura estándar de ~1.6m
    var scale = 1.6 / size.y;
    if (2.0 / size.x < scale) { scale = 2.0 / size.x; }
    if (2.0 / size.z < scale) { scale = 2.0 / size.z; }

    modelEl.object3D.scale.set(scale, scale, scale);

    // Centrar geometría en el origen (0,0,0) del pivot
    modelEl.object3D.updateMatrixWorld();
    box = new THREE.Box3().setFromObject(gltfObject);
    var center = box.getCenter(new THREE.Vector3());
    size = box.getSize(new THREE.Vector3());

    // Ajustar escala y posición de la sombra debajo del modelo
    shadowEl.object3D.scale.y = size.x;
    shadowEl.object3D.scale.x = size.y;
    shadowEl.object3D.position.y = -size.y / 2;
    shadowEl.object3D.position.z = -center.z;
    shadowEl.object3D.position.x = -center.x;

    // Reposicionar el modelo para que su centro coincida con el origen
    modelEl.object3D.position.x = -center.x;
    modelEl.object3D.position.y = -center.y;
    modelEl.object3D.position.z = -center.z;

    // Compensación de cámara en dispositivos móviles (paisaje)
    if (AFRAME.utils.device.isLandscape()) {
      this.cameraRigEl.object3D.position.z -= 1;
    }

    // Reiniciar escala de usuario del pivot
    this.modelPivotEl.object3D.scale.set(1, 1, 1);
    this.modelScale = 1;
  }
});

/**
 * Módulo de Control de la Interfaz de Usuario (UI Controller).
 * Maneja el DOM, eventos de selección y actualizaciones de la tarjeta de información.
 */
(function () {
  'use strict';

  // --- REFERENCIAS AL DOM ---
  var selectorAve = document.getElementById('selectorAve');
  var escenaAframe = document.getElementById('escenaAframe');
  var visorBienvenida = document.getElementById('visorBienvenida');
  var cargando = document.getElementById('cargando');
  var btnCaptura = document.getElementById('btnCaptura');
  var instrucciones = document.getElementById('instrucciones');

  var infoPlaceholder = document.getElementById('infoPlaceholder');
  var infoContenido = document.getElementById('infoContenido');
  var infoNombre = document.getElementById('infoNombre');
  var infoCientifico = document.getElementById('infoCientifico');
  var infoFamilia = document.getElementById('infoFamilia');
  var infoDescripcion = document.getElementById('infoDescripcion');
  var infoDato = document.getElementById('infoDato');

  // --- ESTADO LOCAL ---
  var modeloActivo = null;
  var escenaIniciada = false;

  /**
   * Activa el componente 'model-viewer' en la escena de A-Frame.
   * Se ejecuta solo una vez al seleccionar el primer ave.
   */
  function iniciarEscena() {
    if (escenaIniciada) { return; }
    escenaIniciada = true;
    escenaAframe.setAttribute('model-viewer', '');
  }

  /**
   * Carga el archivo 3D correspondiente al ave seleccionada.
   * @param {string} claveModelo - Identificador del ave (coincide con el nombre del archivo sin extensión).
   */
  function cargarModelo(claveModelo) {
    if (!claveModelo) { return; }

    // UI: Mostrar cargador y ocultar bienvenida
    cargando.classList.add('activo');
    visorBienvenida.classList.add('oculta');

    // Preparar escena
    iniciarEscena();
    escenaAframe.classList.remove('escena-oculta');
    escenaAframe.classList.add('escena-visible');

    // Generar ruta URL codificada
    var rutaModelo = 'modelos 3D/' + encodeURIComponent(claveModelo + '.glb');

    // Inyectar modelo en el componente (con reintentos si el componente aún no está listo)
    var intentos = 0;
    function intentarSetModelo() {
      var componente = escenaAframe.components && escenaAframe.components['model-viewer'];
      if (componente) {
        componente.el.setAttribute('model-viewer', 'gltfModel', rutaModelo);
      } else if (intentos < 20) {
        intentos++;
        setTimeout(intentarSetModelo, 150);
      }
    }
    intentarSetModelo();
  }

  /**
   * Actualiza los textos de la tarjeta de información con los datos taxonómicos.
   * @param {string} claveModelo - Clave del ave seleccionada.
   */
  function actualizarInfo(claveModelo) {
    var datos = DATOS_AVES[claveModelo];
    if (!datos) { return; }

    // UI: Mostrar tarjeta y ocultar placeholder
    infoPlaceholder.classList.add('oculto');
    infoContenido.classList.remove('oculto');

    // Reiniciar animación de CSS
    infoContenido.style.animation = 'none';
    infoContenido.offsetHeight; // forzar reflow
    infoContenido.style.animation = '';

    // Rellenar datos
    infoNombre.textContent = datos.nombre;
    infoCientifico.textContent = datos.cientifico;
    infoFamilia.textContent = 'Fam. ' + datos.familia;
    infoDescripcion.textContent = datos.descripcion;
    infoDato.textContent = datos.dato;
  }

  // --- MANEJADORES DE EVENTOS ---

  /**
   * Escucha cambios en el selector desplegable.
   */
  selectorAve.addEventListener('change', function () {
    var clave = this.value;
    modeloActivo = clave;
    cargarModelo(clave);
    actualizarInfo(clave);
  });

  /**
   * Escucha la notificación de que el modelo 3D ha sido cargado.
   */
  document.addEventListener('aveModeloCargado', function () {
    cargando.classList.remove('activo');
    btnCaptura.classList.add('visible');
    instrucciones.classList.add('visible');
  });

  /**
   * Proceso de captura de imagen del visor.
   * Renderiza el frame actual y descarga un archivo .png.
   */
  btnCaptura.addEventListener('click', function () {
    var canvas = escenaAframe.canvas;
    if (!canvas) { return; }

    try {
      // Forzar renderizado manual para asegurar que el buffer no esté vacío
      var renderer = escenaAframe.renderer;
      if (renderer) { renderer.render(escenaAframe.object3D, escenaAframe.camera); }

      // Extraer datos de imagen del canvas
      var url = canvas.toDataURL('image/png');
      var nombreAve = modeloActivo || 'ave';
      var link = document.createElement('a');
      link.href = url;
      link.download = 'aves-upel-ipb_' + nombreAve.replace(/\s+/g, '-') + '.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // UI: Feedback temporal de éxito
      var originalHTML = btnCaptura.innerHTML;
      btnCaptura.textContent = '✓ Guardada';
      btnCaptura.style.background = 'rgba(40,180,100,0.35)';
      setTimeout(function () {
        btnCaptura.innerHTML = originalHTML;
        btnCaptura.style.background = '';
      }, 2000);

    } catch (err) {
      console.warn('Fallo en captura:', err);
      alert('Error: Asegúrese de que el modelo esté visible y cargado.');
    }
  });

})();
