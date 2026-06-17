import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// SVG Star Sticker Designs as functional React components
const GoldStarSVG = () => (
  <svg viewBox="0 0 24 24" width="40" height="40">
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" fill="var(--neon-yellow)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
  </svg>
);

const CyanStarSVG = () => (
  <svg viewBox="0 0 24 24" width="40" height="40">
    <path d="M12 0l3.2 8.8 8.8 3.2-8.8 3.2-3.2 8.8-3.2-8.8-8.8-3.2 8.8-3.2z" fill="var(--neon-cyan)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
  </svg>
);

const PinkSmileStarSVG = () => (
  <svg viewBox="0 0 24 24" width="40" height="40">
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" fill="var(--neon-pink)" />
    <circle cx="9" cy="12" r="1.2" fill="#000" />
    <circle cx="15" cy="12" r="1.2" fill="#000" />
    <path d="M10 15q2 1.5 4 0" stroke="#000" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

const HologramStarSVG = ({ id }) => (
  <svg viewBox="0 0 24 24" width="40" height="40">
    <defs>
      <linearGradient id={`holo-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--neon-purple)" />
        <stop offset="50%" stopColor="var(--neon-pink)" />
        <stop offset="100%" stopColor="var(--neon-cyan)" />
      </linearGradient>
    </defs>
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" fill={`url(#holo-grad-${id})`} />
  </svg>
);

const SparkleStarSVG = () => (
  <svg viewBox="0 0 24 24" width="40" height="40">
    <path d="M12 2l2.4 7.2 7.2 2.4-7.2 2.4-2.4 7.2-2.4-7.2-7.2-2.4 7.2-2.4z" fill="var(--neon-orange)" />
    <circle cx="12" cy="12" r="2" fill="#fff" />
  </svg>
);

const STICKER_TYPES = [
  { type: 'gold', component: GoldStarSVG, label: 'Estrella Dorada' },
  { type: 'cyan', component: CyanStarSVG, label: 'Brillo Celeste' },
  { type: 'pink', component: PinkSmileStarSVG, label: 'Estrella Feliz' },
  { type: 'holo', component: HologramStarSVG, label: 'Holográfica' },
  { type: 'orange', component: SparkleStarSVG, label: 'Estrella Naranja' }
];

export default function App() {
  // --- VIDEO PLAYER STATES ---
  const videoRef = useRef(null);
  const utteranceRef = useRef(null);

  const cancelSpeech = () => {
    if (utteranceRef.current) {
      utteranceRef.current.onstart = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    window.speechSynthesis.cancel();
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoTime, setVideoTime] = useState('00:00 / 00:00');
  const [isQrZoomed, setIsQrZoomed] = useState(false);
  // --- ASSISTANT STATES ---
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSignPlaying, setIsSignPlaying] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentGesture, setCurrentGesture] = useState('idle');
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => {
      clearInterval(blinkInterval);
      cancelSpeech();
    };
  }, []);

  useEffect(() => {
    let captionInterval;
    if (isSignPlaying) {
      const captions = [
        "¡Hola! Te doy la bienvenida a mi portafolio profesional interactivo.",
        "Soy María Carrillo Carrasco, Educadora Social, Social Developer y Diseñadora Frontend.",
        "En esta página comparto mi trayectoria uniendo la intervención social y la tecnología.",
        "En la parte superior puedes ver mi Videocurrículum en video, donde detallo mi perfil.",
        "Más abajo, explico mi trayectoria: mis logros, aprendizajes y metas en tecnología de inclusión.",
        "También puedes ver mi Perfil Tech, basado en mi personalidad ENFP y fortalezas de mediación.",
        "En la sección de Proyectos, verás AquaRed (HumanWater) y Coronavirus Design, enfocados en accesibilidad.",
        "Publico noticias de impacto social en LinkedIn y organizo eventos en mi agenda comunitaria.",
        "Si deseas descargar mis currículums o ver mis títulos oficiales, tienes los botones de descarga.",
        "Para contactar conmigo, escríbeme por WhatsApp, llámame por teléfono o envíame un correo electrónico.",
        "¡Muchas gracias por visitar mi espacio profesional y por tu valioso tiempo!"
      ];
      const gestures = ['welcome', 'me', 'work', 'projects', 'work', 'me', 'projects', 'work', 'projects', 'contact', 'thanks'];
      let index = 0;
      setCurrentCaption(captions[0]);
      setCurrentGesture(gestures[0]);
      
      captionInterval = setInterval(() => {
        index = (index + 1) % captions.length;
        setCurrentCaption(captions[index]);
        // Map gestures safely matching captions index
        const gesturePattern = gestures[index] || 'idle';
        setCurrentGesture(gesturePattern);
      }, 4500);
    } else {
      setCurrentCaption('');
      setCurrentGesture('idle');
    }
    return () => clearInterval(captionInterval);
  }, [isSignPlaying]);

  // --- TRAJECTORY DATA ---
  const trajectory = {
    logros: [
      'Graduada en Educación Social (Universidad Complutense de Madrid).',
      'Certificado de Inserción Sociolaboral de Personas con Discapacidad.',
      'Formación intensiva en programación web (Front-end) en Factoría F5.',
      'Monitora cualificada de Ocio y Tiempo libre.'
    ],
    aprendizajes: [
      'Lenguajes Core: HTML5, CSS3, JavaScript (ES6).',
      'Desarrollo interactivo con React y maquetación responsiva.',
      'Control de versiones: Git, GitHub y flujos de trabajo en equipo.',
      'Accesibilidad Web (WCAG) aplicada a colectivos vulnerables.'
    ],
    metas: [
      'Ejercer como "Social Developer", uniendo la Educación Social y la Programación.',
      'Desarrollar plataformas inclusivas y accesibles para ONGs y centros sociales.',
      'Liderar proyectos que usen la tecnología para reducir la brecha digital.'
    ],
    desarrollo: [
      'Accesibilidad e Inclusión digital.',
      'Dinamización de grupos y talleres formativos.',
      'Mediación comunitaria y resolución pacífica de conflictos.'
    ]
  };

  // --- PROJECTS DATA ---
  const [filter, setFilter] = useState('Todos');
  const [activeCvTab, setActiveCvTab] = useState('General');
  const [activeTitleTab, setActiveTitleTab] = useState('Social');

  const techSlides = [
    {
      id: 1,
      image: 'tech-profile-1.jpg',
      title: 'Mi Personalidad: Aventurero (ENFP)',
      description: 'Espíritu libre: enérgico, entusiasta y curioso. Defensora de ideales y guiada por valores de intervención social y creatividad.'
    },
    {
      id: 2,
      image: 'tech-profile-2.jpg',
      title: 'Mi Rol Social: Guardián (INFJ)',
      description: 'Comunicadora de principios, generosa y con gran talento. Siento pasión por hacer el bien al mundo y a las personas que amo.'
    },
    {
      id: 3,
      image: 'tech-profile-3.jpg',
      title: 'Mis Debilidades a Trabajar',
      description: 'Sensible, extremadamente reservada, perfeccionista, aversa al conflicto y con tendencia a fatigarse con facilidad al dar el 100% por una causa.'
    },
    {
      id: 4,
      image: 'tech-profile-4.jpg',
      title: 'Mis Fortalezas Destacadas',
      description: 'Creativa, perspicaz, inspiradora, decidida, apasionada, altruista y compasiva. Conectada siempre con la empatía y los valores de principios.'
    },
    {
      id: 5,
      image: 'tech-profile-5.jpg',
      title: 'Compatibilidad de Personalidad',
      description: 'Perfiles afines como Mediador (INFP), Guardián (INFJ) y Organizador (INTJ). Enorme potencial de trabajo colaborativo para proyectos de impacto social.'
    }
  ];
  const projects = [
    {
      id: 1,
      title: 'AquaRed (HumanWater)',
      description: 'Plataforma web interactiva orientada a la gestión inteligente y comunitaria del agua en Andalucía. Prioriza la accesibilidad y la sencillez de uso para colectivos rurales.',
      category: 'Social',
      tags: ['React', 'Sostenibilidad', 'Educación Social'],
      icon: '💧'
    },
    {
      id: 2,
      title: 'Agenda de Eventos Inclusivos',
      description: 'Panel dinámico para registrar, planificar e interactuar con eventos y hackatones con enfoque social y tecnológico. Utiliza localStorage para almacenar los registros de forma persistente.',
      category: 'Tech',
      tags: ['JavaScript', 'HTML5', 'CSS3', 'localStorage'],
      icon: '📅'
    },
    {
      id: 3,
      title: 'Entornos Protectores Digitales',
      description: 'Herramienta conceptual y maqueta interactiva orientada a la prevención de violencia de género e inserción laboral de mujeres vulnerables.',
      category: 'Mix',
      tags: ['Accesibilidad', 'Integración Social', 'Diseño UX'],
      icon: '🛡️'
    },
    {
      id: 4,
      title: 'Coronavirus Design',
      description: 'Plataforma web informativa y de concienciación social creada para difundir pautas de prevención, recursos y apoyo comunitario durante la pandemia.',
      category: 'Mix',
      tags: ['Diseño Web', 'Concienciación', 'HTML5', 'CSS3'],
      icon: '🦠',
      video: 'https://www.youtube.com/embed/lWZow1wCv1k?rel=0'
    },
    {
      id: 5,
      title: 'Kaleidos',
      description: 'Plataforma interactiva de diseño web inspirada en Penpot y Taiga. Permite crear diseños vectoriales en un lienzo interactivo y visualizar en tiempo real su representación técnica en código (HTML/CSS, SVG y JSON), además de integrar un tablero Kanban de tareas y un hub de eventos inclusivos.',
      category: 'Tech',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'SVG', 'Web Audio API', 'Web Speech API'],
      icon: '🎨',
      video: 'https://www.youtube.com/embed/ezgtSVP3zp0?rel=0',
      link: 'https://MariaCarrilloCarrasco.github.io/Kaleidos---Plataforma-de-dise-o-web-con-c-digo-abierto/'
    },
    {
      id: 6,
      title: 'Ayuda a Domicilio',
      description: 'Plataforma web accesible diseñada para que personas de la tercera edad conozcan servicios de clases y apoyo digital a domicilio en Alcalá de Henares. Permite consultar talleres prácticos (WhatsApp, app de salud, trámites) e integrar herramientas de accesibilidad avanzada como cambio tipográfico dinámico, tema de alto contraste, intérprete LSE y lector de voz integrado.',
      category: 'Social',
      tags: ['React', 'Vite', 'Accesibilidad (WCAG)', 'Web Speech API', 'Inclusión Digital'],
      icon: '🤝',
      video: 'https://www.youtube.com/embed/5jDuN8Wr-NA?rel=0',
      link: 'https://MariaCarrilloCarrasco.github.io/Proyecto-ayuda-a-domicilio/'
    },
    {
      id: 7,
      title: 'Mi App ToDo',
      description: 'Aplicación de lista de tareas creada para organizar la jornada laboral. Desarrollada con React y Vite.',
      category: 'Tech',
      tags: ['React', 'JavaScript', 'Gestión de Tareas'],
      icon: '📝',
      video: 'https://www.youtube.com/embed/C0g3DbQMiuw?rel=0'
    }
  ];

  // --- EVENTS STATES (LOCAL STORAGE) ---
  const defaultEvents = [
    {
      id: 1,
      title: 'Hackathon Femcoders Madrid 2026',
      date: '2026-05-15',
      category: 'Tech',
      notes: 'Presentación final del proyecto AquaRed. ¡Ganamos mención especial en impacto y accesibilidad!',
      location: 'Factoría F5 Madrid'
    },
    {
      id: 2,
      title: 'Taller de Inserción y Tecnología',
      date: '2026-04-10',
      category: 'Social',
      notes: 'Planificación de dinámicas de ocio inclusivo aplicando herramientas interactivas.',
      location: 'Centro Social Alcalá'
    }
  ];

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('maria-portfolio-events');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [formEvent, setFormEvent] = useState({
    title: '',
    date: '',
    category: 'Social',
    notes: '',
    location: ''
  });

  useEffect(() => {
    localStorage.setItem('maria-portfolio-events', JSON.stringify(events));
  }, [events]);

  // --- PUBLICATIONS & LINKEDIN NEWS STATES (LOCAL STORAGE) ---
  const defaultPubs = [
    {
      id: 1,
      title: 'Mi transición de la Educación Social a la Tecnología 🚀',
      content: 'Hoy quiero compartir un gran hito en mi camino profesional. Al graduarme en Educación Social, siempre busqué formas de amplificar el impacto de mi trabajo. Hoy, gracias a mi formación intensiva de frontend en Factoría F5, puedo unir ambos mundos. ¡Soy una "Social Developer" lista para codear el cambio!',
      date: '2026-05-18',
      category: 'Logro',
      url: 'https://www.linkedin.com/in/maria-carrillo-carrasco/',
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      title: 'La accesibilidad web no es opcional, es un derecho fundamental 🌐',
      content: 'En un mundo cada vez más digitalizado, la falta de accesibilidad es una nueva forma de exclusión social. En Factoría F5 he aprendido a maquetar webs accesibles (WCAG) pensando especialmente en personas con diversidad funcional. Debemos construir una red en la que nadie se quede atrás.',
      date: '2026-04-25',
      category: 'Artículo',
      url: 'https://www.linkedin.com/in/maria-carrillo-carrasco/',
      likes: 85,
      comments: 9
    },
    {
      id: 3,
      title: '¡Presentamos el proyecto AquaRed en el Hackathon! 💧',
      content: 'Orgullosa de presentar nuestra app AquaRed (HumanWater), enfocada en empoderar comunidades rurales para una gestión sostenible del agua en Andalucía. Una interfaz pensada para ser accesible, sencilla y de gran impacto social. Gracias a mis compañeras por todo el esfuerzo.',
      date: '2026-05-10',
      category: 'Noticia',
      url: 'https://www.linkedin.com/in/maria-carrillo-carrasco/',
      likes: 142,
      comments: 24
    }
  ];

  const [publications, setPublications] = useState(() => {
    const saved = localStorage.getItem('maria-portfolio-publications');
    return saved ? JSON.parse(saved) : defaultPubs;
  });

  const [formPub, setFormPub] = useState({
    title: '',
    content: '',
    url: '',
    date: '',
    category: 'Logro'
  });

  useEffect(() => {
    localStorage.setItem('maria-portfolio-publications', JSON.stringify(publications));
  }, [publications]);

  const handlePubInputChange = (e) => {
    const { name, value } = e.target;
    setFormPub((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPub = (e) => {
    e.preventDefault();
    if (!formPub.title || !formPub.content || !formPub.url) {
      alert('Por favor, introduce título, contenido y enlace de LinkedIn.');
      return;
    }
    const newPub = {
      ...formPub,
      id: Date.now(),
      likes: Math.floor(Math.random() * 25) + 5,
      comments: Math.floor(Math.random() * 6)
    };
    setPublications((prev) => [newPub, ...prev]);
    setFormPub({
      title: '',
      content: '',
      url: '',
      date: '',
      category: 'Logro'
    });
  };

  const handleDeletePub = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta publicación?')) {
      setPublications((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!formEvent.title || !formEvent.date) {
      alert('Por favor, introduce al menos el título y la fecha del evento.');
      return;
    }
    const newEvent = {
      ...formEvent,
      id: Date.now()
    };
    setEvents((prev) => [newEvent, ...prev]);
    setFormEvent({
      title: '',
      date: '',
      category: 'Social',
      notes: '',
      location: ''
    });
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este evento?')) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  // --- STICKERS STATES & LOGIC (LOCAL STORAGE) ---
  const [stickers, setStickers] = useState(() => {
    const saved = localStorage.getItem('maria-portfolio-stickers');
    return saved ? JSON.parse(saved) : [
      { id: 101, x: 20, y: 15, type: 'gold', text: '¡Bienvenido!', rotation: -10, scale: 1.1 },
      { id: 102, x: 80, y: 25, type: 'pink', text: 'Social Coder', rotation: 12, scale: 1.2 },
      { id: 103, x: 15, y: 75, type: 'cyan', text: 'Estrella F5', rotation: -5, scale: 1.0 },
      { id: 104, x: 85, y: 70, type: 'holo', text: 'React Lover', rotation: 15, scale: 1.3 }
    ];
  });

  const [isStickerMode, setIsStickerMode] = useState(false);
  const [selectedStickerType, setSelectedStickerType] = useState('gold');
  const [editingStickerId, setEditingStickerId] = useState(null);
  
  // Dragging states
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('maria-portfolio-stickers', JSON.stringify(stickers));
  }, [stickers]);

  const handleBackgroundClick = (e) => {
    // Add sticker if sticker mode is active AND we are clicking directly on the overlay container
    if (isStickerMode && e.target.classList.contains('stickers-container-overlay')) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newSticker = {
        id: Date.now(),
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        type: selectedStickerType,
        text: '¡Haz doble clic para editar!',
        rotation: Math.floor(Math.random() * 40) - 20,
        scale: Math.round((0.9 + Math.random() * 0.5) * 10) / 10
      };

      setStickers((prev) => [...prev, newSticker]);
    }
  };

  const deleteSticker = (id, e) => {
    e.stopPropagation();
    setStickers((prev) => prev.filter((st) => st.id !== id));
  };

  const updateStickerText = (id, newText) => {
    setStickers((prev) => prev.map((st) => st.id === id ? { ...st, text: newText } : st));
  };

  // --- STICKER DRAGGING ACTIONS ---
  const handleStickerPointerDown = (id, e) => {
    e.stopPropagation();
    if (editingStickerId) return; // don't drag while editing text
    
    const stickerElement = e.currentTarget;
    const rect = stickerElement.getBoundingClientRect();
    
    // Calculate click offset relative to sticker top-left
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedId(id);
    
    // Attach document-wide move & up events so drag is smooth and doesn't break if cursor leaves sticker
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!draggedId) return;
    const overlay = document.querySelector('.stickers-container-overlay');
    if (!overlay) return;
    
    const overlayRect = overlay.getBoundingClientRect();
    
    // Calculate new X & Y percentages
    let x = ((e.clientX - overlayRect.left - dragOffset.x) / overlayRect.width) * 100;
    let y = ((e.clientY - overlayRect.top - dragOffset.y) / overlayRect.height) * 100;
    
    // Constrain within bounds (0% to 95%)
    x = Math.max(0, Math.min(95, x));
    y = Math.max(0, Math.min(95, y));
    
    // Dynamically update dragged sticker position
    setStickers((prev) => prev.map((st) => 
      st.id === draggedId ? { ...st, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } : st
    ));
  };

  const handlePointerUp = () => {
    setDraggedId(null);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedId]);

  // --- AUDIO READER LOGIC ---
  const handleToggleAudio = () => {
    console.log("TTS toggle requested. isAudioPlaying:", isAudioPlaying);
    if (isAudioPlaying) {
      console.log("TTS: Cancelling active playback");
      cancelSpeech();
      setIsAudioPlaying(false);
    } else {
      console.log("TTS: Initializing utterance");
      cancelSpeech();

      const textToSpeak = "Hola, te doy la bienvenida a mi portafolio profesional. Soy María Carrillo Carrasco, Educadora Social, Social Developer y Diseñadora Web. Aquí puedes consultar mi videocurrículum, mi trayectoria, mis proyectos destacados como AquaRed o Coronavirus Design, mis publicaciones de LinkedIn y mi agenda de eventos. Si deseas contactar conmigo, tienes a tu disposición los enlaces a mis redes sociales, mi correo electrónico y mi teléfono. ¡Gracias por visitarme!";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance; // Mantener referencia para evitar recolección de basura
      
      utterance.lang = 'es-ES';
      
      // Ritmo y tono estándar para máxima compatibilidad con todos los motores TTS del sistema
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        console.log("TTS: Started speaking successfully");
        setIsAudioPlaying(true);
      };
      utterance.onend = () => {
        console.log("TTS: Finished speaking");
        setIsAudioPlaying(false);
        utteranceRef.current = null;
      };
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          console.log("TTS: Playback interrupted or canceled intentionally");
          return;
        }
        console.error("TTS: Error occurred:", e.error, e);
        setIsAudioPlaying(false);
        utteranceRef.current = null;
      };
      
      console.log("TTS: Triggering speak() synchronously");
      window.speechSynthesis.speak(utterance);
      setIsAudioPlaying(true);
    }
  };

  // --- CUSTOM VIDEO PLAYER LOGIC ---
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => console.log("Video play interrupted:", err));
      setIsPlaying(true);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 0;
    setVideoProgress((current / duration) * 100 || 0);

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setVideoTime(`${formatTime(current)} / ${formatTime(duration)}`);
  };

  const handleVideoSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    const elem = videoRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  // Formatter for date display
  const formatDateString = (dateStr) => {
    if (!dateStr) return { day: '00', month: '---' };
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    return { day, month };
  };

  const filteredProjects = filter === 'Todos' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="app-container">
      
      {/* NAVBAR */}
      <nav className="navbar" aria-label="Navegación principal">
        <div className="nav-brand">
          <div className="blue-dot" aria-hidden="true"></div>
          <span className="brand-name">María Carrillo Carrasco</span>
        </div>
        <ul className="nav-menu">
          <li><a href="#video" className="nav-link">Videocurrículum</a></li>
          <li><a href="#sobre-mi" className="nav-link">Trayectoria</a></li>
          <li><a href="#perfil-tech" className="nav-link">Mi Perfil Tech</a></li>
          <li><a href="#ikigai" className="nav-link">Mi Ikigai</a></li>
          <li><a href="#curriculums" className="nav-link">Currículums</a></li>
          <li><a href="#mis-titulos" className="nav-link">Mis Títulos</a></li>
          <li><a href="#proyectos" className="nav-link">Proyectos</a></li>
          <li><a href="#publicaciones" className="nav-link">Publicaciones</a></li>
          <li><a href="#eventos" className="nav-link">Eventos</a></li>
          <li>
            <button 
              className={`btn-sticker-mode ${isStickerMode ? 'active' : ''}`}
              onClick={() => setIsStickerMode(!isStickerMode)}
              title="Activa el modo estrellas para pegar stickers en la web"
            >
              <span>{isStickerMode ? '✨ Modo Estrellas ON' : '🌟 Decorar con Estrellas'}</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* STICKERS LAYER OVERLAY */}
      <div 
        className={`stickers-container-overlay ${isStickerMode ? 'active-mode' : ''}`}
        onClick={handleBackgroundClick}
      >
        {stickers.map((st) => {
          const StickerComponent = STICKER_TYPES.find(t => t.type === st.type)?.component || GoldStarSVG;
          return (
            <div 
              key={st.id} 
              className={`sticker-placed ${st.type === 'holo' ? 'hologram' : ''}`}
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                transform: `rotate(${st.rotation}deg) scale(${st.scale})`,
              }}
              onPointerDown={(e) => handleStickerPointerDown(st.id, e)}
            >
              <button 
                className="btn-delete-sticker" 
                onClick={(e) => deleteSticker(st.id, e)}
                title="Quitar pegatina"
              >
                ✕
              </button>

              <StickerComponent id={st.id} />
              
              {editingStickerId === st.id ? (
                <input 
                  type="text" 
                  className="sticker-edit-input" 
                  value={st.text} 
                  onChange={(e) => updateStickerText(st.id, e.target.value)}
                  onBlur={() => setEditingStickerId(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingStickerId(null)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div 
                  className="sticker-text-tag"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingStickerId(st.id);
                  }}
                  title="Doble clic para editar texto"
                >
                  {st.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DISPENSER BOTTOM PANEL */}
      {isStickerMode && (
        <>
          <div className="dispenser-tip">
            👉 Haz clic en cualquier parte vacía de la página para pegar la estrella seleccionada. ¡Doble clic en sus etiquetas para editarlas!
          </div>
          <div className="sticker-dispenser-panel">
            <span className="dispenser-label">🌟 Dispensador de Estrellas:</span>
            <div className="dispenser-options">
              {STICKER_TYPES.map((opt) => {
                const OptComponent = opt.component;
                return (
                  <button 
                    key={opt.type}
                    className={`sticker-option-btn ${selectedStickerType === opt.type ? 'selected' : ''}`}
                    onClick={() => setSelectedStickerType(opt.type)}
                    title={`Seleccionar ${opt.label}`}
                  >
                    <OptComponent id="icon" />
                  </button>
                );
              })}
            </div>
            <button 
              className="btn-close-dispenser"
              onClick={() => setIsStickerMode(false)}
              title="Cerrar dispensador"
            >
              ✕
            </button>
          </div>
        </>
      )}

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-titles">
          <h1 className="title-large">
            <span className="word-edu">Educadora Social</span>
            <span className="word-dev">Social Developer</span>
            <span className="word-web">Diseñadora Web</span>
          </h1>
          <p className="hero-subtitle">
            Conectando la empatía y la intervención comunitaria de la Educación Social con la innovación técnica del desarrollo Frontend para crear aplicaciones inclusivas y accesibles.
          </p>
        </div>

        {/* VIDEOCURRICULUM PLAYER */}
        <section id="video" className="video-section" style={{ width: '100%' }}>
          <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '15px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <iframe 
              src="https://www.youtube.com/embed/cWMC2dbFYTc?si=RvDwxV1XmYkQJkje" 
              title="Videocurrículum de María Carrillo Carrasco" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            ></iframe>
          </div>

          {/* SECCIÓN REDES SOCIALES & CONTACTO */}
          <div className="social-links-section">
            <h3 className="social-section-title">Redes Sociales</h3>
            <div className="social-links-grid">
              <a href="https://github.com/MariaCarrilloCarrasco" target="_blank" rel="noopener noreferrer" className="social-card github">
                <span className="social-icon">💻</span>
                <div className="social-info">
                  <span className="social-name">GitHub</span>
                  <span className="social-handle">github.com/MariaCarrilloCarrasco</span>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/maría-carrillo-carrasco-13982b254?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-card linkedin">
                <span className="social-icon">💼</span>
                <div className="social-info">
                  <span className="social-name">LinkedIn</span>
                  <span className="social-handle">María Carrillo Carrasco</span>
                </div>
              </a>
              <a href="https://www.facebook.com/share/18adanexJW/" target="_blank" rel="noopener noreferrer" className="social-card facebook">
                <span className="social-icon">👥</span>
                <div className="social-info">
                  <span className="social-name">Facebook Profesional</span>
                  <span className="social-handle">María Carrillo Carrasco</span>
                </div>
              </a>
              <div className="social-card instagram">
                <div className="social-card-main-info">
                  <span className="social-icon">📸</span>
                  <div className="social-info">
                    <span className="social-name">Instagram Profesional</span>
                    <a href="https://www.instagram.com/MC129772/" target="_blank" rel="noopener noreferrer" className="social-handle highlight-link">@MC129772</a>
                  </div>
                </div>
                <div className="instagram-qr-wrap">
                  <img 
                    src="instagram-qr.jpeg" 
                    alt="Instagram QR Code @MC129772" 
                    className="instagram-qr-img" 
                    onClick={() => setIsQrZoomed(true)} 
                    title="Ampliar código QR" 
                  />
                </div>
              </div>
            </div>
            
            {/* Banner de Contacto Telefónico */}
            <div className="contact-phone-wrapper">
              <a href="tel:657028674" className="contact-phone-banner">
                <span className="phone-icon">📞</span>
                <span className="phone-label">Teléfono de Contacto:</span>
                <span className="phone-number">657028674</span>
              </a>
            </div>

            {/* Canales de Contacto Adicionales */}
            <div className="extra-contact-section">
              <h4 className="extra-contact-title">Otros Medios de Contacto</h4>
              <div className="extra-contact-grid">
                <a href="mailto:mariacuario12@hotmail.es" className="extra-contact-card hotmail">
                  <span className="contact-icon">📧</span>
                  <div className="contact-details">
                    <span className="contact-type">Hotmail</span>
                    <span className="contact-value">mariacuario12@hotmail.es</span>
                  </div>
                </a>
                <a href="mailto:mariacarrillocarrasco12@gmail.com" className="extra-contact-card gmail">
                  <span className="contact-icon">📧</span>
                  <div className="contact-details">
                    <span className="contact-type">Gmail</span>
                    <span className="contact-value">mariacarrillocarrasco12@gmail.com</span>
                  </div>
                </a>
                <a href="mailto:mariacarrillocarrasco12@outlook.com" className="extra-contact-card outlook">
                  <span className="contact-icon">📧</span>
                  <div className="contact-details">
                    <span className="contact-type">Outlook</span>
                    <span className="contact-value">mariacarrillocarrasco12@outlook.com</span>
                  </div>
                </a>
                <a href="https://www.infojobs.net/" target="_blank" rel="noopener noreferrer" className="extra-contact-card infojobs">
                  <span className="contact-icon">💼</span>
                  <div className="contact-details">
                    <span className="contact-type">InfoJobs</span>
                    <span className="contact-value">MariaCarrilloCarrasco</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* MODAL ZOOM CÓDIGO QR */}
          {isQrZoomed && (
            <div className="qr-zoom-overlay" onClick={() => setIsQrZoomed(false)}>
              <div className="qr-zoom-modal" onClick={(e) => e.stopPropagation()}>
                <button className="qr-zoom-close" onClick={() => setIsQrZoomed(false)}>✕</button>
                <img src="instagram-qr.jpeg" alt="Instagram QR Code @MC129772" className="qr-zoomed-img" />
                <p className="qr-zoom-caption">
                  Escanea para visitar mi Instagram Profesional o haz clic <a href="https://www.instagram.com/MC129772/" target="_blank" rel="noopener noreferrer" className="qr-zoom-link">aquí</a>
                </p>
              </div>
            </div>
          )}
        </section>
      </header>

      {/* SOBRE MI & TRAYECTORIA */}
      <main>
        <section id="sobre-mi" className="section-container">
          <h2 className="section-title"><span className="section-title-text">Mi Perfil & Trayectoria</span></h2>
          
          <div className="profile-grid">
            <div className="profile-card">
              <h3 className="profile-name">María Carrillo Carrasco</h3>
              <span className="profile-tag">Educación Social + Tech</span>
              
              <div className="profile-details">
                <div className="detail-item">
                  📍 <span>Alcalá de Henares, Madrid</span>
                </div>
                <div className="detail-item">
                  📧 <a href="mailto:mariacarrillocarrasco12@gmail.com">Contactar por Email</a>
                </div>
                <div className="detail-item">
                  🎓 <strong>Educación & Integración Social</strong>
                </div>
                <div className="detail-item">
                  💻 <strong>Frontend Web Developer (F5)</strong>
                </div>
              </div>

              <a 
                href="/Portfolio-Videocurr-culum---Mar-a-Carrillo-Carrasco/CV_Maria_Carrillo.pdf" 
                download="CV_Maria_Carrillo_Carrasco.pdf"
                className="btn-cv"
                aria-label="Descargar currículum vitae en formato PDF"
              >
                📥 Descargar CV completo
              </a>
            </div>

            {/* Trajectory Blocks */}
            <div className="trajectory-grid">
              <div className="trajectory-card logros">
                <div className="card-icon icon-logros">🏆</div>
                <h3>Logros clave</h3>
                <ul className="trajectory-list">
                  {trajectory.logros.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="trajectory-card aprendizajes">
                <div className="card-icon icon-aprendizajes">📚</div>
                <h3>Aprendizajes & Skills</h3>
                <ul className="trajectory-list">
                  {trajectory.aprendizajes.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="trajectory-card metas">
                <div className="card-icon icon-metas">🎯</div>
                <h3>Metas profesionales</h3>
                <ul className="trajectory-list">
                  {trajectory.metas.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className="trajectory-card desarrollo">
                <div className="card-icon icon-desarrollo">📈</div>
                <h3>Áreas de desarrollo</h3>
                <ul className="trajectory-list">
                  {trajectory.desarrollo.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MI PERFIL TECH SECTION */}
        <section id="perfil-tech" className="section-container tech-profile-section">
          <h2 className="section-title">
            <span className="section-title-text">
              Mi Perfil <span className="tech-title-accent">TECH</span>
            </span>
          </h2>
          
          <div className="tech-profile-grid">
            {techSlides.map((slide, index) => (
              <div key={slide.id} className="tech-profile-card">
                <div className="tech-card-img-wrap">
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="tech-card-img"
                    onClick={() => window.open(slide.image, '_blank')}
                  />
                  <span className="zoom-hint">🔍 Ampliar Reporte</span>
                </div>
                
                <div className="tech-card-info">
                  <span className="tech-card-index">Reporte {index + 1}</span>
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MI IKIGAI SECTION */}
        <section id="ikigai" className="section-container ikigai-section">
          <h2 className="section-title">
            <span className="section-title-text">
              Mi <span className="tech-title-accent">IKIGAI</span>
            </span>
          </h2>
          
          <div className="ikigai-content-container">
            <div className="ikigai-card">
              <div className="ikigai-img-wrap">
                <img 
                  src="ikigai.jpg" 
                  alt="Mi Diagrama Ikigai" 
                  className="ikigai-img"
                  onClick={() => window.open('/ikigai.jpg', '_blank')}
                />
                <span className="zoom-hint">🔍 Haz clic en el diagrama para abrir en grande</span>
              </div>
              
              <div className="ikigai-info">
                <h3>El sentido de la vida, de la vocación y del desarrollo</h3>
                <p>
                  Mi Ikigai representa la intersección perfecta entre mis pasiones, mis habilidades profesionales en Educación Social y Desarrollo Web, lo que el mundo necesita y por lo que puedo ser valorada y remunerada. Es el motor diario que impulsa mi compromiso de crear tecnología accesible y de gran impacto social.
                </p>
                <ul className="ikigai-details-list">
                  <li className="ikigai-item-love"><strong>Yo amo:</strong> Ayudar a las personas, la formación, la comunicación y el desarrollo interactivo.</li>
                  <li className="ikigai-item-good"><strong>Soy buena para:</strong> Organizar, planificar, liderar y maquetar interfaces atractivas.</li>
                  <li className="ikigai-item-need"><strong>El mundo necesita:</strong> Computadoras y Tecnología, Inclusión Digital y Diseño centrado en las personas.</li>
                  <li className="ikigai-item-paid"><strong>Pueden pagarme por:</strong> Programación Frontend, Diseño Web interactivo y accesible, y Gestión Social.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUMS SECTION */}
        <section id="curriculums" className="section-container cv-section">
          <h2 className="section-title"><span className="section-title-text">Currículums & Especializaciones</span></h2>
          
          <div className="cv-tabs-container">
            <div className="cv-tabs">
              <button 
                className={`cv-tab-btn ${activeCvTab === 'General' ? 'active' : ''}`}
                onClick={() => setActiveCvTab('General')}
              >
                📄 CV General (Fiel al Original)
              </button>
              <button 
                className={`cv-tab-btn ${activeCvTab === 'Social' ? 'active' : ''}`}
                onClick={() => setActiveCvTab('Social')}
              >
                🤝 CV Sector Social
              </button>
              <button 
                className={`cv-tab-btn ${activeCvTab === 'Tecnológico' ? 'active' : ''}`}
                onClick={() => setActiveCvTab('Tecnológico')}
              >
                💻 CV Sector Tecnológico
              </button>
              <button 
                className={`cv-tab-btn ${activeCvTab === 'TechIngles' ? 'active' : ''}`}
                onClick={() => setActiveCvTab('TechIngles')}
              >
                🇬🇧 Tech en Inglés
              </button>
            </div>
            <a 
              href="/Portfolio-Videocurr-culum---Mar-a-Carrillo-Carrasco/CV_Maria_Carrillo.pdf" 
              download="CV_Maria_Carrillo_Carrasco.pdf"
              className="btn-cv-download-secondary"
            >
              📥 Descargar PDF Original
            </a>
          </div>

          <div className="cv-display-container">
            {activeCvTab === 'General' && (
              <div className="cv-replica-container">
                <div className="cv-replica-layout">
                  {/* SIDEBAR COL */}
                  <aside className="cv-replica-sidebar">
                    <div className="cv-sidebar-avatar-wrap">
                      <img src="profile-maria.jpg" alt="Foto de María Carrillo Carrasco" className="cv-sidebar-avatar" />
                    </div>
                    <h3 className="cv-sidebar-name">MARÍA CARRILLO CARRASCO</h3>
                    
                    <div className="cv-sidebar-section">
                      <h4 className="cv-sidebar-title">SOBRE MI</h4>
                      <p className="cv-sidebar-text">
                        Educadora Social e integradora Social, resolutiva, organizada y empática. 
                        Comprometida con la mejora del bienestar y la integración de personas en riesgo de 
                        exclusión social, con motivación por el acompañamiento y la intervención a nivel individual, 
                        grupal y comunitario.
                      </p>
                    </div>

                    <div className="cv-sidebar-section">
                      <h4 className="cv-sidebar-title">CONTACTO</h4>
                      <ul className="cv-contact-list">
                        <li>
                          <span className="contact-icon">📞</span>
                          <span>657028674</span>
                        </li>
                        <li>
                          <span className="contact-icon">✉️</span>
                          <a href="mailto:mariacuario12@hotmail.es">mariacuario12@hotmail.es</a>
                        </li>
                        <li>
                          <span className="contact-icon">📍</span>
                          <span>Alcalá de Henares</span>
                        </li>
                        <li>
                          <span className="contact-icon">🌐</span>
                          <div className="cv-social-links-stacked">
                            <strong>Redes Profesionales:</strong>
                            <span>María Carrillo Carrasco</span>
                            <span className="cv-sub-networks">LinkedIn, InfoJobs, Facebook, Instagram</span>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="cv-sidebar-section">
                      <h4 className="cv-sidebar-title">DISPONIBILIDAD</h4>
                      <ul className="cv-bullet-list">
                        <li>Carnet de conducir y coche propio.</li>
                        <li>Incorporación inmediata y disponibilidad completa.</li>
                      </ul>
                    </div>

                    <div className="cv-sidebar-section">
                      <h4 className="cv-sidebar-title">PROYECTO PERSONAL</h4>
                      <p className="cv-sidebar-text">
                        Apoyo personalizado a domicilio a personas mayores para la realización de trámites por internet. Más info en: 
                        <a href="https://MariaCarrilloCarrasco.github.io/Proyecto-ayuda-a-domicilio/" target="_blank" rel="noopener noreferrer">Ver Web del Proyecto</a>
                      </p>
                      <ul className="cv-bullet-list">
                        <li>Organización del material.</li>
                        <li>Adaptación a sus necesidades.</li>
                      </ul>
                      <div className="cv-project-gallery">
                        <img 
                          src="/personal-project-1.jpg" 
                          alt="Folleto Informativo Clases Mayores" 
                          className="cv-gallery-thumb"
                          onClick={() => window.open('/personal-project-1.jpg', '_blank')}
                          title="Folleto Informativo Clases Mayores"
                        />
                        <img 
                          src="/personal-project-2.jpg" 
                          alt="Foto de María Carrillo Carrasco" 
                          className="cv-gallery-thumb"
                          onClick={() => window.open('/personal-project-2.jpg', '_blank')}
                          title="Foto de María"
                        />
                        <img 
                          src="/personal-project-3.jpg" 
                          alt="Tarjeta de Visita de María" 
                          className="cv-gallery-thumb"
                          onClick={() => window.open('/personal-project-3.jpg', '_blank')}
                          title="Tarjeta de Visita"
                        />
                      </div>
                      <span className="cv-gallery-zoom-hint">🔍 Haz clic en las imágenes para ver en detalle</span>
                    </div>

                    <div className="cv-disability-badge">
                      Discapacidad reconocida 33%
                    </div>
                  </aside>

                  {/* MAIN CONTENT COL */}
                  <main className="cv-replica-main">
                    <section className="cv-main-section">
                      <h3 className="cv-main-title">FORMACIÓN</h3>
                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Grado Universitario en Educación Social</strong>
                          <span className="cv-item-year">2021</span>
                        </div>
                        <p className="cv-item-inst">UAH.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Grado Superior Integración Social</strong>
                          <span className="cv-item-year">2017</span>
                        </div>
                        <p className="cv-item-inst">IES Alonso Avellaneda.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">C. P. Inserción Sociolaboral de Personas con Discapacidad</strong>
                          <span className="cv-item-year">2022</span>
                        </div>
                        <p className="cv-item-inst">Comunidad de Madrid.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Monitora de Ocio y Tiempo Libre</strong>
                          <span className="cv-item-year">2022</span>
                        </div>
                        <p className="cv-item-inst">Casa de la Juventud. Alcalá de Henares.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Curso de Iniciación al Desarrollo con IA</strong>
                          <span className="cv-item-year">2026</span>
                        </div>
                        <p className="cv-item-inst">Big School.</p>
                      </div>
                    </section>

                    <section className="cv-main-section">
                      <h3 className="cv-main-title">FORMACIÓN COMPLEMENTARIA</h3>
                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Certificado de Manipulación de alimentos</strong>
                          <span className="cv-item-year">2022</span>
                        </div>
                        <p className="cv-item-inst">Asociación Henar. Grupo Asonaman.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Curso de TICs inclusión social y educativa</strong>
                          <span className="cv-item-year">2017</span>
                        </div>
                        <p className="cv-item-inst">Ayuntamiento de Tres Cantos.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Seminario de Cursos Interdisciplinares Prevención Violencia de Género</strong>
                          <span className="cv-item-year">2016</span>
                        </div>
                        <p className="cv-item-inst">Concejalía de Igualdad. Ayuntamiento de Tres Cantos.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Título de Prevención de Riesgos Laborales</strong>
                          <span className="cv-item-year">2016</span>
                        </div>
                        <p className="cv-item-inst">Nivel básico. IES Alonso Avellaneda.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Máster en PRL</strong>
                          <span className="cv-item-year">2023 - pend.</span>
                        </div>
                        <p className="cv-item-inst">Nivel superior. Universidad Camilo José Cela.</p>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Curso de Creación de Páginas Web</strong>
                          <span className="cv-item-year">Actualmente</span>
                        </div>
                        <p className="cv-item-inst">Factoría 5. Madrid.</p>
                      </div>
                    </section>

                    <section className="cv-main-section">
                      <h3 className="cv-main-title">EXPERIENCIA LABORAL</h3>
                      
                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Técnica en Educación Social/Integración social</strong>
                          <span className="cv-item-year">2021 - 2024</span>
                        </div>
                        <p className="cv-item-inst">Varios empleadores (destacando Centro Municipal de Barajas - Hartford y CAJE - Colectivo de Acción para el Juego y la Educación, 2024).</p>
                        <ul className="cv-bullets">
                          <li>Intervención socioeducativa con menores, incluidos menores infractores y menores con NEAE.</li>
                          <li>Refuerzo educativo.</li>
                          <li>Prevención, mediación y resolución de conflictos.</li>
                          <li>Planificación, difusión y puesta en práctica de actividades de ocio.</li>
                        </ul>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Técnica de Talleres Sociocomunitarios</strong>
                          <span className="cv-item-year">2022 - 2024</span>
                        </div>
                        <p className="cv-item-inst">Centros de Personas Mayores (Coslada y Alcalá de Henares). Hartford Arcinature - Fundación "la Caixa".</p>
                        <ul className="cv-bullets">
                          <li>Diseño y dinamización de talleres socioeducativos. Gestión de recursos y coordinación con entidades comunitarias. Promoción de la participación activa y resolución de incidencias.</li>
                        </ul>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Monitora de Ocio y Tiempo Libre</strong>
                          <span className="cv-item-year">2021 - 2023</span>
                        </div>
                        <p className="cv-item-inst">CEIP La Garena / CEIP Ernest Hemingway - Casa de la Juventud. Programa Abierto para Jugar - Ayuntamiento de Alcalá de Henares.</p>
                        <ul className="cv-bullets">
                          <li>Dinamización de actividades educativas y de ocio con menores.</li>
                          <li>Gestión de grupos, convivencia y resolución de conflictos.</li>
                          <li>Apoyo en ABVD y habilidades sociales.</li>
                        </ul>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Técnica en Inserción Sociolaboral y Discapacidad</strong>
                          <span className="cv-item-year">2021</span>
                        </div>
                        <p className="cv-item-inst">Fundación Capacis.</p>
                        <ul className="cv-bullets">
                          <li>Apoyo individualizado para la mejora de su empleabilidad.</li>
                          <li>Desarrollo de competencias laborales, sociales y digitales.</li>
                          <li>Orientación laboral y mejora de la empleabilidad.</li>
                        </ul>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Técnica de Prevención de Riesgos Laborales</strong>
                          <span className="cv-item-year">2023</span>
                        </div>
                        <p className="cv-item-inst">UGT Madrid.</p>
                        <ul className="cv-bullets">
                          <li>Detección de riesgos laborales en empresas y asesoramiento preventivo.</li>
                          <li>Información sobre derechos laborales y protocolos de actuación.</li>
                        </ul>
                      </div>

                      <div className="cv-item">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Técnica en Integración Social - Igualdad</strong>
                          <span className="cv-item-year">2018</span>
                        </div>
                        <p className="cv-item-inst">Centro Asesor de la Mujer - Ayuntamiento de Alcalá de Henares.</p>
                        <ul className="cv-bullets">
                          <li>Primera acogida y orientación a mujeres en situación de violencia de género.</li>
                          <li>Gestión de recursos, talleres y coordinación comunitaria.</li>
                        </ul>
                      </div>

                      <div className="cv-item font-coder-special">
                        <div className="cv-item-header">
                          <strong className="cv-item-bold">Fem Coder - Programadora de páginas web</strong>
                          <span className="cv-item-year">2026</span>
                        </div>
                        <p className="cv-item-inst">Factoría F5, Microsoft y Ayuntamiento de Meco.</p>
                        <ul className="cv-bullets">
                          <li>Acompañamiento de menores en la generación de proyectos con IA y evaluación de las dinámicas de trabajo en grupo.</li>
                        </ul>
                      </div>
                    </section>
                  </main>
                </div>
              </div>
            )}

            {activeCvTab === 'Social' && (
              <div className="cv-tailored-container social-focus">
                <h3>Orientación: Intervención Social y Mediación Comunitaria</h3>
                <p className="cv-pitch">
                  Especialista en intervención socioeducativa, dinamización grupal e inserción sociolaboral. Mi trayectoria une la titulación universitaria en <strong>Educación Social</strong> con experiencia real en acompañamiento a colectivos vulnerables, menores NEAE, personas mayores y mujeres víctimas de violencia de género.
                </p>
                <div className="cv-highlights-grid">
                  <div className="cv-highlight-card">
                    <h4>🎓 Formación Social Principal</h4>
                    <ul>
                      <li>Grado Universitario en Educación Social (UAH, 2021)</li>
                      <li>Grado Superior en Integración Social (IES Alonso Avellaneda, 2017)</li>
                      <li>Certificado de Inserción de Personas con Discapacidad (Comunidad de Madrid, 2022)</li>
                    </ul>
                  </div>
                  <div className="cv-highlight-card">
                    <h4>🛠️ Competencias de Intervención</h4>
                    <ul>
                      <li>Diseño de proyectos de dinamización y talleres socioeducativos.</li>
                      <li>Resolución de conflictos y mediación en entornos comunitarios.</li>
                      <li>Apoyo personalizado en empleabilidad y competencias digitales.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="cv-timeline-focus">
                  <h4>Experiencia Destacada en Sector Social</h4>
                  <div className="focus-timeline-item">
                    <h5>Técnica de Educación Social e Integración (2021 - 2024)</h5>
                    <p><em>Barajas & CAJE</em> — Intervención con menores con necesidades especiales (NEAE) y en riesgo de exclusión social. Mediación de conflictos y apoyo socioeducativo diario.</p>
                  </div>
                  <div className="focus-timeline-item">
                    <h5>Técnica de Talleres Sociocomunitarios (2022 - 2024)</h5>
                    <p><em>Fundación "la Caixa" / Arcinature</em> — Maquetación y dinamización de actividades adaptadas para personas mayores fomentando el envejecimiento activo.</p>
                  </div>
                  <div className="focus-timeline-item">
                    <h5>Integración e Igualdad de Género (2018)</h5>
                    <p><em>Centro Asesor de la Mujer (Alcalá de Henares)</em> — Primera acogida, gestión de recursos de emergencia y apoyo a mujeres víctimas de violencia de género.</p>
                  </div>
                </div>
              </div>
            )}

            {activeCvTab === 'Tecnológico' && (
              <div className="cv-tailored-container tech-focus">
                <h3>Orientación: Desarrollo Frontend e Inclusión Digital</h3>
                <p className="cv-pitch">
                  <strong>"Social Developer"</strong>: Integro el análisis y la empatía social en el diseño de productos digitales. Formada como programadora frontend en el bootcamp de Factoría F5, desarrollo interfaces accesibles (WCAG), interactivas y centradas en el usuario.
                </p>
                <div className="cv-highlights-grid">
                  <div className="cv-highlight-card">
                    <h4>💻 Stack Tecnológico</h4>
                    <div className="tech-bar-group">
                      <span>HTML5 / CSS3 / Vanilla JS</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '90%' }}></div></div>
                    </div>
                    <div className="tech-bar-group">
                      <span>React.js</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '85%' }}></div></div>
                    </div>
                    <div className="tech-bar-group">
                      <span>Control de versiones (Git/GitHub)</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '80%' }}></div></div>
                    </div>
                    <div className="tech-bar-group">
                      <span>Accesibilidad Web (WCAG) y UX/UI</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '95%' }}></div></div>
                    </div>
                  </div>
                  
                  <div className="cv-highlight-card">
                    <h4>🚀 Experiencia & Proyectos Híbridos</h4>
                    <ul>
                      <li><strong>Proyecto Kaleidos</strong>: Plataforma de diseño web inclusiva. <a href="https://MariaCarrilloCarrasco.github.io/Kaleidos---Plataforma-de-dise-o-web-con-c-digo-abierto/" target="_blank" rel="noopener noreferrer">Ver Web de Kaleidos</a></li>
                      <li><strong>Proyecto AquaRed</strong>: Desarrollo completo en React de una herramienta web interactiva para gestión comunitaria de agua.</li>
                      <li><strong>Fem Coder (2026)</strong>: Mentora y facilitadora de proyectos con Inteligencia Artificial para jóvenes estudiantes.</li>
                      <li><strong>Proyecto de Apoyo Digital a Domicilio</strong>: Diseño de material y formación en trámites por internet a personas de la tercera edad para reducir la brecha digital. <a href="https://MariaCarrilloCarrasco.github.io/Proyecto-ayuda-a-domicilio/" target="_blank" rel="noopener noreferrer">Ver Web de Apoyo a Domicilio</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="tech-education-focus">
                  <h4>Formación Tecnológica</h4>
                  <div className="tech-edu-item">
                    <h5>Curso de Creación de Páginas Web — Factoría 5</h5>
                    <p>Bootcamp intensivo enfocado en maquetación interactiva, desarrollo de aplicaciones React, lógica JS y metodologías ágiles de trabajo en equipo.</p>
                  </div>
                  <div className="tech-edu-item">
                    <h5>Curso de Iniciación al Desarrollo con IA (2026) — Big School</h5>
                    <p>Uso práctico de APIs de IA, prompt engineering, automatizaciones y su integración en el desarrollo de software moderno.</p>
                  </div>
                </div>
              </div>
            )}

            {activeCvTab === 'TechIngles' && (
              <div className="cv-tailored-container tech-focus-en">
                <h3>Orientation: Frontend Development & Digital Inclusion</h3>
                <p className="cv-pitch">
                  <strong>"Social Developer"</strong>: I integrate social analysis and empathy into digital product design. Trained as a frontend programmer at the Factoría F5 bootcamp, I develop accessible (WCAG), interactive, and user-centered interfaces.
                </p>
                <div className="cv-highlights-grid">
                  <div className="cv-highlight-card">
                    <h4>💻 Tech Stack</h4>
                    <div className="tech-bar-group">
                      <span>HTML5 / CSS3 / Vanilla JS</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '90%' }}></div></div>
                    </div>
                    <div className="tech-bar-group">
                      <span>React.js</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '85%' }}></div></div>
                    </div>
                    <div className="tech-bar-group">
                      <span>Version Control (Git/GitHub)</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '80%' }}></div></div>
                    </div>
                    <div className="tech-bar-group">
                      <span>Web Accessibility (WCAG) & UX/UI</span>
                      <div className="tech-bar"><div className="tech-bar-fill" style={{ width: '95%' }}></div></div>
                    </div>
                  </div>
                  
                  <div className="cv-highlight-card">
                    <h4>🚀 Experience & Hybrid Projects</h4>
                    <ul>
                      <li><strong>AquaRed Project</strong>: Full React development of an interactive web application for community water management.</li>
                      <li><strong>Fem Coder (2026)</strong>: Mentor and facilitator for AI projects with young students.</li>
                      <li><strong>Digital Support Project</strong>: Material design and training in online procedures for elderly people to reduce the digital divide.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="tech-education-focus">
                  <h4>Tech Education</h4>
                  <div className="tech-edu-item">
                    <h5>Web Page Creation Course — Factoría 5</h5>
                    <p>Intensive bootcamp focused on interactive markup, React application development, JS logic, and agile teamwork methodologies (SCRUM).</p>
                  </div>
                  <div className="tech-edu-item">
                    <h5>Intro to AI Development (2026) — Big School</h5>
                    <p>Practical concepts on integrating language models, task automation, and developing AI-enriched interfaces.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* MIS TITULOS SECTION */}
        <section id="mis-titulos" className="section-container title-section">
          <h2 className="section-title"><span className="section-title-text">Mis Títulos & Certificaciones</span></h2>
          
          <div className="title-tabs-layout">
            <div className="title-tabs-sidebar">
              <button 
                className={`title-tab-btn ${activeTitleTab === 'Social' ? 'active' : ''}`}
                onClick={() => setActiveTitleTab('Social')}
              >
                🤝 Formación Social
              </button>
              <button 
                className={`title-tab-btn ${activeTitleTab === 'SocialDeveloper' ? 'active' : ''}`}
                onClick={() => setActiveTitleTab('SocialDeveloper')}
              >
                🚀 Social Developer
              </button>
              <button 
                className={`title-tab-btn ${activeTitleTab === 'DiseñoWeb' ? 'active' : ''}`}
                onClick={() => setActiveTitleTab('DiseñoWeb')}
              >
                💻 Diseño Web
              </button>
              <button 
                className={`title-tab-btn ${activeTitleTab === 'AdaptacionWeb' ? 'active' : ''}`}
                onClick={() => setActiveTitleTab('AdaptacionWeb')}
              >
                🎨 Adaptación Web UX/UI
              </button>
              <button 
                className={`title-tab-btn ${activeTitleTab === 'Discapacidad' ? 'active' : ''}`}
                onClick={() => setActiveTitleTab('Discapacidad')}
              >
                💳 Discapacidad (Tarjeta Acreditativa)
              </button>
            </div>

            <div className="title-content-display">
              {activeTitleTab === 'Social' && (
                <div className="title-content-card animate-fade-in">
                  <h3>Formación en el Ámbito Social</h3>
                  <p className="title-desc">Mis titulaciones oficiales reguladas que avalan mi formación para la intervención socioeducativa, animación sociocultural e inclusión comunitaria.</p>
                  
                  <div className="cert-list">
                    <div className="cert-item">
                      <div className="cert-icon">🎓</div>
                      <div className="cert-details">
                        <h4>Grado Universitario en Educación Social</h4>
                        <span className="cert-meta">Universidad de Alcalá (UAH) | Graduada en 2021</span>
                        <p>Capacitación en diseño, ejecución y evaluación de proyectos socioeducativos, mediación de conflictos y apoyo a colectivos en riesgo de exclusión social.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">🏫</div>
                      <div className="cert-details">
                        <h4>Grado Superior en Integración Social</h4>
                        <span className="cert-meta">IES Alonso Avellaneda | Graduada en 2017</span>
                        <p>Competencias en programación de actividades de integración social, apoyo en habilidades de la vida diaria (ABVD) y fomento de la autonomía personal.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">📜</div>
                      <div className="cert-details">
                        <h4>C. P. Inserción Sociolaboral de Personas con Discapacidad</h4>
                        <span className="cert-meta">Comunidad de Madrid | Certificado en 2022</span>
                        <p>Especialización en técnicas de empleo con apoyo, análisis de puestos de trabajo y dinámicas de inserción para personas con diversidad funcional.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">⛺</div>
                      <div className="cert-details">
                        <h4>Monitora de Ocio y Tiempo Libre</h4>
                        <span className="cert-meta">Casa de la Juventud de Alcalá de Henares | Certificado en 2022</span>
                        <p>Dinamización grupal, actividades deportivas, campamentos y talleres educativos enfocados en la educación en valores en el tiempo libre.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTitleTab === 'SocialDeveloper' && (
                <div className="title-content-card animate-fade-in">
                  <h3>Social Developer: La Intersección</h3>
                  <p className="title-desc">Uniendo la Educación Social y la Programación Frontend para generar herramientas con impacto y accesibilidad real.</p>
                  
                  <div className="cert-list">
                    <div className="cert-item highlight-purple">
                      <div className="cert-icon">⚡</div>
                      <div className="cert-details">
                        <h4>Fem Coder & Programadora de Páginas Web</h4>
                        <span className="cert-meta">Bootcamp Factoría F5 | 2026</span>
                        <p>Formación integral en desarrollo ágil Frontend combinando tecnologías web con el acompañamiento socioeducativo de menores y dinamización de grupos técnicos de trabajo con Inteligencia Artificial.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">🌱</div>
                      <div className="cert-details">
                        <h4>AquaRed & Inclusión Digital Rural</h4>
                        <span className="cert-meta">Proyecto de Impacto Social</span>
                        <p>Aplicación web diseñada e implementada para empoderar a comunidades andaluzas en el consumo y autogestión sostenible del agua, garantizando interfaces sumamente legibles y simplificadas.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTitleTab === 'DiseñoWeb' && (
                <div className="title-content-card animate-fade-in">
                  <h3>Titulaciones y Cursos de Diseño & Desarrollo Web</h3>
                  <p className="title-desc">Mi formación en código, maquetación adaptativa, lenguajes modernos y control de versiones.</p>
                  
                  <div className="cert-list">
                    <div className="cert-item">
                      <div className="cert-icon">💻</div>
                      <div className="cert-details">
                        <h4>Bootcamp Frontend Web Developer</h4>
                        <span className="cert-meta">Factoría F5 en colaboración con Microsoft | 2026</span>
                        <p>Desarrollo interactivo en React.js, programación estructurada en JavaScript (ES6), Git, GitHub, flujos SCRUM y diseño responsive Mobile-First.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">🎨</div>
                      <div className="cert-details">
                        <h4>Curso de Creación de Páginas Web</h4>
                        <span className="cert-meta">Factoría 5 (Madrid) | En curso</span>
                        <p>Profundización en maquetación semántica avanzada HTML5, diseño flexible CSS Grid / Flexbox y desarrollo de componentes UI modernos.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">🤖</div>
                      <div className="cert-details">
                        <h4>Curso de Iniciación al Desarrollo con Inteligencia Artificial</h4>
                        <span className="cert-meta">Big School | Certificado en 2026</span>
                        <p>Conceptos prácticos sobre integración de modelos de lenguaje, automatización de tareas y desarrollo de interfaces enriquecidas con IA.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTitleTab === 'AdaptacionWeb' && (
                <div className="title-content-card animate-fade-in">
                  <h3>Adaptación Web & Experiencia de Usuario (UX/UI)</h3>
                  <p className="title-desc">Certificaciones y enfoques especializados en hacer la web accesible, inclusiva y fácil de usar para todos los usuarios.</p>
                  
                  <div className="cert-list">
                    <div className="cert-item">
                      <div className="cert-icon">♿</div>
                      <div className="cert-details">
                        <h4>Accesibilidad Digital WCAG y Usabilidad</h4>
                        <span className="cert-meta">Enfoque Profesional & Pautas de Diseño Inclusivo</span>
                        <p>Diseño e implementación de páginas web que cumplen con las pautas WCAG 2.1 de accesibilidad, adaptadas para personas de la tercera edad, con diversidad funcional o baja alfabetización digital.</p>
                      </div>
                    </div>

                    <div className="cert-item">
                      <div className="cert-icon">💡</div>
                      <div className="cert-details">
                        <h4>Curso de TICs, Inclusión Social y Educativa</h4>
                        <span className="cert-meta">Ayuntamiento de Tres Cantos | Certificado en 2017</span>
                        <p>Aplicación de las tecnologías de la información para la reducción de la brecha digital en colectivos vulnerables y dinamización de aulas digitales.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTitleTab === 'Discapacidad' && (
                <div className="title-content-card animate-fade-in">
                  <h3>Certificación de Discapacidad</h3>
                  <p className="title-desc">Documentación oficial que acredita el grado de discapacidad reconocido.</p>
                  
                  <div className="disability-card-display">
                    <div className="disability-img-wrap">
                      <img 
                        src="/tarjeta-discapacidad.jpg" 
                        alt="Tarjeta Acreditativa de Grado de Discapacidad de María Carrillo Carrasco" 
                        className="disability-card-image"
                        onClick={() => window.open('/tarjeta-discapacidad.jpg', '_blank')}
                      />
                      <span className="zoom-hint">🔍 Haz clic en la tarjeta para abrir en pestaña nueva</span>
                    </div>
                    <div className="disability-info-details">
                      <div className="disability-badge-large">Grado de Discapacidad: 33%</div>
                      <p>
                        <strong>Tarjeta Acreditativa de Grado de Discapacidad</strong> emitida por la 
                        <em> Consejería de Familia, Juventud y Política Social de la Comunidad de Madrid</em>.
                      </p>
                      <ul className="disability-benefits-list">
                        <li><strong>Inclusión Laboral:</strong> Habilita para participar en ofertas de empleo protegidas y plazas reservadas en convocatorias públicas.</li>
                        <li><strong>Sensibilización:</strong> Fomenta entornos de trabajo inclusivos y accesibles para personas con diversidad funcional.</li>
                        <li><strong>Compromiso:</strong> Evidencia la resiliencia y capacidad de adaptación del perfil para desempeñar labores socioeducativas y tecnológicas con total solvencia.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="proyectos" className="section-container">
          <h2 className="section-title"><span className="section-title-text">Mis Proyectos</span></h2>
          
          {/* Filtering buttons */}
          <div className="filters-container">
            {['Todos', 'Social', 'Tech', 'Mix'].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-img-placeholder">
                  {project.video ? (
                    <iframe src={project.video} className="project-card-video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  ) : (
                    project.icon
                  )}
                  <span className="project-badge">{project.category}</span>
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((t, index) => (
                      <span key={index} className="tag">{t}</span>
                    ))}
                  </div>
                  {project.link && (
                    <div style={{ marginTop: '15px' }}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        Ver Proyecto en Vivo
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* LINKEDIN PUBLICATIONS SECTION */}
        <section id="publicaciones" className="section-container">
          <h2 className="section-title"><span className="section-title-text">Noticias & Publicaciones de LinkedIn</span></h2>
          
          <div className="news-section-banner">
            <img 
              src="/news-header.jpg" 
              alt="Banner de apertura de la sección de Noticias y Publicaciones" 
              className="news-banner-img" 
            />
          </div>

          <div className="pubs-layout">
            
            {/* Form Card */}
            <div className="pub-form-card">
              <h3>Crear nueva publicación</h3>
              <form onSubmit={handleAddPub}>
                <div className="form-group">
                  <label htmlFor="pub-title">Título de la publicación*</label>
                  <input
                    type="text"
                    id="pub-title"
                    name="title"
                    value={formPub.title}
                    onChange={handlePubInputChange}
                    className="form-input"
                    placeholder="Ej. ¡Lanzamiento de AquaRed! 🚀"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pub-category">Categoría</label>
                    <select
                      id="pub-category"
                      name="category"
                      value={formPub.category}
                      onChange={handlePubInputChange}
                      className="form-input"
                    >
                      <option value="Logro">Logro</option>
                      <option value="Artículo">Artículo</option>
                      <option value="Noticia">Noticia</option>
                      <option value="Proyecto">Proyecto</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="pub-date">Fecha</label>
                    <input
                      type="date"
                      id="pub-date"
                      name="date"
                      value={formPub.date}
                      onChange={handlePubInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pub-url">Enlace original de LinkedIn*</label>
                  <input
                    type="url"
                    id="pub-url"
                    name="url"
                    value={formPub.url}
                    onChange={handlePubInputChange}
                    className="form-input"
                    placeholder="https://www.linkedin.com/posts/..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pub-content">Contenido de la publicación*</label>
                  <textarea
                    id="pub-content"
                    name="content"
                    value={formPub.content}
                    onChange={handlePubInputChange}
                    className="form-input"
                    style={{ height: '90px', resize: 'vertical' }}
                    placeholder="Escribe el cuerpo del post, incluyendo hashtags..."
                    required
                  />
                </div>

                <button type="submit" className="btn-add-pub">
                  Compartir Publicación
                </button>
              </form>
            </div>

            {/* Publications Feed */}
            <div className="pubs-feed">
              {publications.length === 0 ? (
                <div className="no-pubs">
                  <p>No hay ninguna publicación registrada. ¡Crea una en el panel de la izquierda!</p>
                </div>
              ) : (
                publications.map((pub) => {
                  const formattedDate = pub.date ? new Date(pub.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Reciente';
                  return (
                    <article key={pub.id} className="linkedin-card">
                      {/* LinkedIn Header */}
                      <div className="linkedin-card-header">
                        <img src="profile-maria.jpg" alt="María Carrillo Carrasco" className="linkedin-card-avatar" />
                        <div className="linkedin-card-user-info">
                          <span className="linkedin-user-name">María Carrillo Carrasco</span>
                          <span className="linkedin-user-headline">Educadora Social | Social Developer | Diseñadora Web</span>
                          <span className="linkedin-post-time">
                            {formattedDate} • 🌐
                          </span>
                        </div>
                        <button 
                          className="btn-delete-pub"
                          onClick={() => handleDeletePub(pub.id)}
                          title="Eliminar publicación"
                        >
                          ✕
                        </button>
                      </div>

                      {/* LinkedIn Body */}
                      <div className="linkedin-card-body">
                        <span className="linkedin-pub-badge">{pub.category}</span>
                        <h4>{pub.title}</h4>
                        <p>{pub.content}</p>
                      </div>

                      {/* Stats */}
                      <div className="linkedin-card-stats">
                        <span className="likes-count">👍 {pub.likes || 0} recomendados</span>
                        <span className="comments-count">💬 {pub.comments || 0} comentarios</span>
                      </div>

                      {/* Actions Bar */}
                      <div className="linkedin-card-actions">
                        <button 
                          className="linkedin-action-btn like-btn"
                          onClick={() => {
                            setPublications((prev) => 
                              prev.map((p) => p.id === pub.id ? { ...p, likes: (p.likes || 0) + 1 } : p)
                            );
                          }}
                        >
                          👍 Recomendar
                        </button>
                        <button 
                          className="linkedin-action-btn comment-btn"
                          onClick={() => {
                            setPublications((prev) => 
                              prev.map((p) => p.id === pub.id ? { ...p, comments: (p.comments || 0) + 1 } : p)
                            );
                          }}
                        >
                          💬 Comentar
                        </button>
                        <a 
                          href={pub.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="linkedin-action-btn view-btn"
                        >
                          🔗 Ver original
                        </a>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

          </div>
        </section>

        {/* EVENTS SECTION */}
        <section id="eventos" className="section-container">
          <h2 className="section-title"><span className="section-title-text">Agenda de Eventos & Asistencia</span></h2>
          
          <div className="events-layout">
            
            {/* Event Form */}
            <div className="event-form-container">
              <h3>Registrar nuevo evento</h3>
              <form onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label htmlFor="title">Nombre del evento*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formEvent.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ej. Hackathon Femcoders"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Fecha*</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formEvent.date}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="category">Categoría</label>
                    <select
                      id="category"
                      name="category"
                      value={formEvent.category}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="Social">Social</option>
                      <option value="Tech">Tech</option>
                      <option value="Mix">Mix / Ambos</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Ubicación / Plataforma</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formEvent.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ej. Madrid / Online"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notas / Aprendizajes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formEvent.notes}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ height: '70px', resize: 'vertical' }}
                    placeholder="Escribe detalles breves del evento..."
                  />
                </div>

                <button type="submit" className="btn-add-event">
                  Agregar a mi Agenda
                </button>
              </form>
            </div>

            {/* Event List */}
            <div className="events-display">
              {events.length === 0 ? (
                <div className="no-events">
                  <p>Aún no has registrado ningún evento. ¡Utiliza el formulario de la izquierda para registrar a los que acudes!</p>
                </div>
              ) : (
                events.map((ev) => {
                  const { day, month } = formatDateString(ev.date);
                  return (
                    <article key={ev.id} className="event-card">
                      <div className="event-main">
                        <div className="event-date-badge">
                          <span className="event-date-day">{day}</span>
                          <span className="event-date-month">{month}</span>
                        </div>
                        <div className="event-details">
                          <h4>{ev.title}</h4>
                          <p>{ev.notes}</p>
                          <div className="event-meta">
                            <span className={`badge-category category-${ev.category}`}>
                              {ev.category === 'Mix' ? 'Social + Tech' : ev.category}
                            </span>
                            {ev.location && (
                              <span className="event-location">📍 {ev.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn-delete-event"
                        onClick={() => handleDeleteEvent(ev.id)}
                        title="Eliminar evento"
                      >
                        ✕
                      </button>
                    </article>
                  );
                })
              )}
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 María Carrillo Carrasco. Creado con ✨ React y CSS de mucho color.</p>
        <div className="footer-socials">
          <a href="mailto:mariacarrillocarrasco12@gmail.com" className="social-link">Email</a>
          <span style={{ color: 'var(--glass-border)' }}>|</span>
          <a href="https://github.com/MariaCarrilloCarrasco" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
        </div>
      </footer>

      {/* Dynamic Animated Nebula Background (inside root, below overlays) */}
      <div className="animated-bg" aria-hidden="true">
        <div className="bg-glow glow-1"></div>
        <div className="bg-glow glow-2"></div>
        <div className="bg-glow glow-3"></div>
        <div className="bg-glow glow-4"></div>
      </div>

      {/* FLOATING ACCESSIBLE ASSISTANT */}
      <div className={`floating-assistant ${isAssistantOpen ? 'expanded' : 'collapsed'}`}>
        {isAssistantOpen ? (
          <div className="assistant-card animate-slide-in">
            <div className="assistant-header">
              <span>🧏 Guía Accesible (Voz y Señas)</span>
              <button className="btn-close-assistant" onClick={() => {
                setIsAssistantOpen(false);
                cancelSpeech();
                setIsAudioPlaying(false);
                setIsSignPlaying(false);
              }}>✕</button>
            </div>
            
             <div className="assistant-body">
              {/* Sign Language Live Webcam Feed simulation */}
              <div className="sign-player-container">
                <div className={`sign-video-screen ${isSignPlaying ? 'playing' : 'paused'}`}>
                  {/* Custom Animated Avatar Interpreter */}
                  <svg viewBox="0 0 100 100" className={`interpreter-svg gesture-${currentGesture}`}>
                    {/* Background */}
                    <rect width="100" height="100" fill="#090615" rx="12" />
                    
                    {/* Subtle webcam lines */}
                    <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                    
                    {/* Character Torso */}
                    <path d="M 20 95 C 20 65, 80 65, 80 95 Z" fill="var(--neon-purple)" className="interpreter-torso" />
                    
                    {/* Head */}
                    <circle cx="50" cy="40" r="16" fill="#ffd1b3" />
                    
                    {/* Hair */}
                    <path d="M 32 40 C 30 22, 70 22, 68 40 C 65 26, 35 26, 32 40 Z" fill="var(--neon-pink)" />
                    <path d="M 32 36 L 30 52 C 30 55, 34 55, 34 52 Z" fill="var(--neon-pink)" />
                    <path d="M 68 36 L 70 52 C 70 55, 66 55, 66 52 Z" fill="var(--neon-pink)" />
                    
                    {/* Eyes */}
                    {isBlinking ? (
                      <>
                        <line x1="43" y1="38" x2="47" y2="38" stroke="#090615" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="53" y1="38" x2="57" y2="38" stroke="#090615" strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    ) : (
                      <>
                        <circle cx="45" cy="38" r="2.5" fill="#090615" />
                        <circle cx="55" cy="38" r="2.5" fill="#090615" />
                        <path d="M 42 33 Q 45 32 48 34" stroke="#090615" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <path d="M 58 33 Q 55 32 52 34" stroke="#090615" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </>
                    )}
                    
                    {/* Nose */}
                    <path d="M 50 38 Q 48 41 50 42" stroke="rgba(9,6,21,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    
                    {/* Mouth */}
                    <path 
                      d="M 45 46 Q 50 49 55 46" 
                      stroke="#ff0055" 
                      strokeWidth="2" 
                      fill="none" 
                      strokeLinecap="round" 
                      className={`interpreter-mouth ${isSignPlaying ? 'talking' : ''}`}
                    />
                    
                    {/* Left Arm */}
                    <path 
                      d="M 25 70 Q 18 52 35 50" 
                      stroke="#ffd1b3" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      fill="none" 
                      className="interpreter-arm left-arm" 
                    />
                    
                    {/* Right Arm */}
                    <path 
                      d="M 75 70 Q 82 52 65 50" 
                      stroke="#ffd1b3" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      fill="none" 
                      className="interpreter-arm right-arm" 
                    />
                  </svg>
                  
                  {isSignPlaying && (
                    <div className="webcam-live-indicator">
                      <span className="live-dot"></span>
                      <span>LSE EN VIVO</span>
                    </div>
                  )}
                  
                  {isSignPlaying && currentCaption && (
                    <div className="sign-captions-overlay">
                      {currentCaption}
                    </div>
                  )}

                  {!isSignPlaying && (
                    <div className="play-overlay" onClick={() => setIsSignPlaying(true)}>
                      <span className="play-icon-sig">▶️ Ver Intérprete LSE</span>
                    </div>
                  )}
                </div>
                <div className="player-controls">
                  <button className="btn-player" onClick={() => setIsSignPlaying(!isSignPlaying)}>
                    {isSignPlaying ? '⏸️ Pausar Intérprete' : '▶️ Ver Intérprete LSE'}
                  </button>
                </div>
              </div>

              {/* Audio explanation controls */}
              <div className="audio-controls-block">
                <h5>🔊 Escuchar esta página</h5>
                <button 
                  className={`btn-audio-speak ${isAudioPlaying ? 'speaking' : ''}`}
                  onClick={handleToggleAudio}
                >
                  {isAudioPlaying ? '⏹️ Parar Audio' : '🔊 Escuchar por Voz'}
                </button>
                <p className="assistant-tip">Haz clic para escuchar la explicación hablada del portafolio.</p>
              </div>

              <div className="assistant-promo">
                <p>¡Hola! Aquí puedes consultar mi videocurrículum, proyectos y contactar conmigo. ¡Te doy la bienvenida!</p>
              </div>
            </div>
          </div>
        ) : (
          <button className="btn-assistant-collapsed" onClick={() => setIsAssistantOpen(true)}>
            <span className="btn-assistant-icons">🧏🔊</span>
            <span className="btn-assistant-text">Accesibilidad</span>
          </button>
        )}
      </div>

    </div>
  );
}










