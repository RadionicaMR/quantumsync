import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    'nav.diagnosis': 'Diagnóstico',
    'nav.balanceChakras': 'Equilibrar Chakras',
    'nav.treatment': 'Tratamiento',
    'nav.manifest': 'Manifestar',
    'nav.affiliates': 'Afiliados',
    'nav.login': 'Iniciar Sesión',
    'nav.start': 'Comenzar',
    'nav.myAccount': 'Mi Cuenta',
    'nav.sessionHistory': 'Historial de Sesiones',
    'nav.adminPanel': 'Panel de Administración',
    'nav.logout': 'Cerrar Sesión',

    // Treat Page
    'treat.title': 'Tratamiento Vibracional',
    'treat.subtitle': 'Aplica patrones de frecuencia dirigidos para restaurar el equilibrio y mejorar tu bienestar.',
    'treat.presetsTab': 'Preajustes',
    'treat.presetsTabSub': 'de Frecuencia',
    'treat.customTab': 'Tratamiento',
    'treat.customTabSub': 'Personalizado',
    'treat.customTitle': 'Diseñador de Frecuencias Personalizadas',
    'treat.customDesc': 'Crea tus propias combinaciones de frecuencias para protocolos de tratamiento personalizados.',
    'treat.diagnosisImported': 'Diagnóstico importado',
    'treat.importingFrom': 'Importando datos del diagnóstico de',
    
    // How It Works
    'howItWorks.title': 'Cómo Funciona el Tratamiento con Frecuencias',
    'howItWorks.subtitle': 'QuantumSync utiliza principios de resonancia y entrenamiento para ayudar a equilibrar tu campo energético.',
    'howItWorks.step1Title': 'Emisión de Frecuencia',
    'howItWorks.step1Desc': 'Tu dispositivo emite frecuencias vibracionales precisas calibradas para resultados específicos de bienestar.',
    'howItWorks.step2Title': 'Resonancia Energética',
    'howItWorks.step2Desc': 'Estas frecuencias resuenan con el campo energético de tu cuerpo, fomentando la armonización y el equilibrio.',
    'howItWorks.step3Title': 'Equilibrio del Campo Energético',
    'howItWorks.step3Desc': 'Con el uso regular, tus sistemas energéticos se ajustan a un funcionamiento óptimo, mejorando el bienestar general.',

    // Treatment Presets
    'preset.selectPreset': 'Seleccionar Preajuste',
    'preset.selectTreatment': 'Seleccionar Tratamiento',
    'preset.frequencySettings': 'Ajustes de Frecuencia',
    'preset.frequency': 'Frecuencia',
    'preset.duration': 'Duración',
    'preset.intensity': 'Intensidad',
    'preset.minutes': 'minutos',
    
    // Preset Names
    'preset.sleep': 'Mejorar el Sueño',
    'preset.stress': 'Reducir el Estrés',
    'preset.focus': 'Mejorar la Concentración',
    'preset.energy': 'Aumentar Energía',
    'preset.harmony': 'Equilibrio Emocional',
    'preset.manifest': 'Manifestación',
    'preset.cleaning': 'Limpieza Energética Ambientes',

    // Treatment Settings
    'settings.useHeadphones': 'Usar auriculares',
    'settings.visualFeedback': 'Mostrar entrenamiento visual',
    'settings.treatmentVisualization': 'Visualización de Tratamiento',

    // Treatment Actions
    'actions.startTreatment': 'INICIAR TRATAMIENTO',
    'actions.stopTreatment': 'DETENER TRATAMIENTO',
    'actions.enterReceptorName': 'Ingrese el nombre del receptor o intención para iniciar',
    'actions.timeRemaining': 'Tiempo restante',
    'actions.backgroundMode': 'Modo de fondo activo',

    // Image Uploader
    'image.receptorImage': 'Imagen del RECEPTOR',
    'image.radionicGraphic': 'Gráfico RADIÓNICO',
    'image.treatmentSubject': 'Sujeto del tratamiento',
    'image.treatmentPatterns': 'Patrones de tratamiento',
    'image.singleImage': 'Imagen Única',
    'image.multipleImages': 'Múltiples Imágenes',
    'image.gallery': 'Galería',
    'image.selectFromGallery': 'Selecciona imágenes de la galería predefinida',
    'image.openGallery': 'Abrir Galería',
    'image.imagesCount': 'imágenes',
    'image.selectUpTo': 'Selecciona hasta',
    'image.imagesForHypnotic': 'imágenes para un efecto hipnótico',

    // Receptor Section
    'receptor.title': 'Datos del Receptor',
    'receptor.namePlaceholder': 'Nombre del receptor',
    'receptor.nameLabel': 'Nombre del receptor o intención',

    // Rate Section
    'rate.title': 'Tasas Radiónicas',
    'rate.rate1': 'Tasa 1',
    'rate.rate2': 'Tasa 2',
    'rate.rate3': 'Tasa 3',

    // Manifestation Page
    'manifest.title': 'Quantum Manifestation',
    'manifest.subtitle': 'Crea y dirige tu propia realidad a través de patrones cuánticos y radiónicos',
    'manifest.presetsTab': 'Preajustes',
    'manifest.presetsTabSub': 'de Frecuencia',
    'manifest.customTab': 'Manifestación',
    'manifest.customTabSub': 'Personalizada',
    'manifest.customTitle': 'Diseñador de Manifestaciones Personalizadas',
    'manifest.customDesc': 'Crea tus propias combinaciones de frecuencias para protocolos de manifestación personalizados.',

    // Balance Chakras Page
    'chakras.title': 'Equilibrar Chakras',
    'chakras.harmonizeDesc': 'Armoniza y equilibra los 7 chakras principales con frecuencias específicas',
    'chakras.personNameLabel': 'Nombre de la persona a tratar',
    'chakras.personNamePlaceholder': 'Ingresa el nombre',
    'chakras.selectOption': 'Opción de equilibrado',
    'chakras.balanceAll': 'Equilibrar todos los chakras',
    'chakras.balanceBlocked': 'Equilibrar solo chakras cerrados o bloqueados',
    'chakras.durationLabel': 'Tiempo por chakra',
    'chakras.minute': 'minuto',
    'chakras.minutes': 'minutos',
    'chakras.startBalance': 'Iniciar Armonización',
    'chakras.stopBalance': 'Finalizar',
    'chakras.startAgain': 'Iniciar Nuevamente',
    'chakras.harmonizing': 'Armonizando chakra',
    'chakras.completed': '¡Armonización Finalizada!',
    'chakras.goToDiagnose': 'Volver a Diagnóstico',
    'chakras.progress': 'Progreso',

    // Diagnosis Page
    'diagnosis.title': 'Diagnóstico Cuántico',
    'diagnosis.subtitle': 'Analiza el estado energético mediante técnicas de radiestesia cuántica',

    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.name': 'Nombre',
    'common.email': 'Email',
    'common.password': 'Contraseña',
    'common.for': 'para',

    // Audio
    'audio.title': 'Audio Subliminal',
    'audio.uploadAudio': 'Subir audio',
    'audio.recordAudio': 'Grabar audio',
    'audio.maxUpload': 'Máximo 10 min para subir',
    'audio.maxRecord': 'Máximo 3 min para grabar',

    // Admin
    'admin.title': 'Panel de Administración',
    'admin.welcome': 'Bienvenido',
    'admin.registeredUsers': 'Usuarios registrados',
    'admin.updateList': 'Actualizar Lista',

    // Language
    'language.spanish': 'Español',
    'language.english': 'English',
  },
  en: {
    // Navbar
    'nav.diagnosis': 'Diagnosis',
    'nav.balanceChakras': 'Balance Chakras',
    'nav.treatment': 'Treatment',
    'nav.manifest': 'Manifest',
    'nav.affiliates': 'Affiliates',
    'nav.login': 'Login',
    'nav.start': 'Get Started',
    'nav.myAccount': 'My Account',
    'nav.sessionHistory': 'Session History',
    'nav.adminPanel': 'Admin Panel',
    'nav.logout': 'Logout',

    // Treat Page
    'treat.title': 'Vibrational Treatment',
    'treat.subtitle': 'Apply targeted frequency patterns to restore balance and improve your wellbeing.',
    'treat.presetsTab': 'Frequency',
    'treat.presetsTabSub': 'Presets',
    'treat.customTab': 'Custom',
    'treat.customTabSub': 'Treatment',
    'treat.customTitle': 'Custom Frequency Designer',
    'treat.customDesc': 'Create your own frequency combinations for personalized treatment protocols.',
    'treat.diagnosisImported': 'Diagnosis imported',
    'treat.importingFrom': 'Importing diagnosis data from',

    // How It Works
    'howItWorks.title': 'How Frequency Treatment Works',
    'howItWorks.subtitle': 'QuantumSync uses principles of resonance and entrainment to help balance your energy field.',
    'howItWorks.step1Title': 'Frequency Emission',
    'howItWorks.step1Desc': 'Your device emits precise vibrational frequencies calibrated for specific wellness outcomes.',
    'howItWorks.step2Title': 'Energetic Resonance',
    'howItWorks.step2Desc': 'These frequencies resonate with your body\'s energy field, promoting harmonization and balance.',
    'howItWorks.step3Title': 'Energy Field Balance',
    'howItWorks.step3Desc': 'With regular use, your energy systems adjust to optimal functioning, improving overall wellbeing.',

    // Treatment Presets
    'preset.selectPreset': 'Select Preset',
    'preset.selectTreatment': 'Select Treatment',
    'preset.frequencySettings': 'Frequency Settings',
    'preset.frequency': 'Frequency',
    'preset.duration': 'Duration',
    'preset.intensity': 'Intensity',
    'preset.minutes': 'minutes',

    // Preset Names
    'preset.sleep': 'Improve Sleep',
    'preset.stress': 'Reduce Stress',
    'preset.focus': 'Improve Focus',
    'preset.energy': 'Increase Energy',
    'preset.harmony': 'Emotional Balance',
    'preset.manifest': 'Manifestation',
    'preset.cleaning': 'Environmental Energy Cleaning',

    // Treatment Settings
    'settings.useHeadphones': 'Use headphones',
    'settings.visualFeedback': 'Show visual training',
    'settings.treatmentVisualization': 'Treatment Visualization',

    // Treatment Actions
    'actions.startTreatment': 'START TREATMENT',
    'actions.stopTreatment': 'STOP TREATMENT',
    'actions.enterReceptorName': 'Enter receptor name or intention to start',
    'actions.timeRemaining': 'Time remaining',
    'actions.backgroundMode': 'Background mode active',

    // Image Uploader
    'image.receptorImage': 'RECEPTOR Image',
    'image.radionicGraphic': 'RADIONIC Graphic',
    'image.treatmentSubject': 'Treatment subject',
    'image.treatmentPatterns': 'Treatment patterns',
    'image.singleImage': 'Single Image',
    'image.multipleImages': 'Multiple Images',
    'image.gallery': 'Gallery',
    'image.selectFromGallery': 'Select images from predefined gallery',
    'image.openGallery': 'Open Gallery',
    'image.imagesCount': 'images',
    'image.selectUpTo': 'Select up to',
    'image.imagesForHypnotic': 'images for hypnotic effect',

    // Receptor Section
    'receptor.title': 'Receptor Data',
    'receptor.namePlaceholder': 'Receptor name',
    'receptor.nameLabel': 'Receptor name or intention',

    // Rate Section
    'rate.title': 'Radionic Rates',
    'rate.rate1': 'Rate 1',
    'rate.rate2': 'Rate 2',
    'rate.rate3': 'Rate 3',

    // Manifestation Page
    'manifest.title': 'Quantum Manifestation',
    'manifest.subtitle': 'Create and direct your own reality through quantum and radionic patterns',
    'manifest.presetsTab': 'Frequency',
    'manifest.presetsTabSub': 'Presets',
    'manifest.customTab': 'Custom',
    'manifest.customTabSub': 'Manifestation',
    'manifest.customTitle': 'Custom Manifestation Designer',
    'manifest.customDesc': 'Create your own frequency combinations for personalized manifestation protocols.',

    // Balance Chakras Page
    'chakras.title': 'Balance Chakras',
    'chakras.harmonizeDesc': 'Harmonize and balance the 7 main chakras with specific frequencies',
    'chakras.personNameLabel': 'Name of person to treat',
    'chakras.personNamePlaceholder': 'Enter name',
    'chakras.selectOption': 'Balancing option',
    'chakras.balanceAll': 'Balance all chakras',
    'chakras.balanceBlocked': 'Balance only closed or blocked chakras',
    'chakras.durationLabel': 'Time per chakra',
    'chakras.minute': 'minute',
    'chakras.minutes': 'minutes',
    'chakras.startBalance': 'Start Harmonization',
    'chakras.stopBalance': 'Finish',
    'chakras.startAgain': 'Start Again',
    'chakras.harmonizing': 'Harmonizing chakra',
    'chakras.completed': 'Harmonization Completed!',
    'chakras.goToDiagnose': 'Back to Diagnosis',
    'chakras.progress': 'Progress',

    // Diagnosis Page
    'diagnosis.title': 'Quantum Diagnosis',
    'diagnosis.subtitle': 'Analyze energetic state using quantum dowsing techniques',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.for': 'for',

    // Audio
    'audio.title': 'Subliminal Audio',
    'audio.uploadAudio': 'Upload audio',
    'audio.recordAudio': 'Record audio',
    'audio.maxUpload': 'Max 10 min for upload',
    'audio.maxRecord': 'Max 3 min for recording',

    // Admin
    'admin.title': 'Admin Panel',
    'admin.welcome': 'Welcome',
    'admin.registeredUsers': 'Registered users',
    'admin.updateList': 'Update List',

    // Language
    'language.spanish': 'Español',
    'language.english': 'English',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
