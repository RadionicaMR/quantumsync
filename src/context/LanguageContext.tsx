import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
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
    'common.submit': 'Enviar',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.start': 'Iniciar',
    'common.stop': 'Detener',
    'common.pause': 'Pausar',
    'common.resume': 'Reanudar',
    'common.finish': 'Finalizar',
    'common.reset': 'Reiniciar',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.select': 'Seleccionar',
    'common.upload': 'Subir',
    'common.download': 'Descargar',
    'common.remove': 'Quitar',
    'common.clear': 'Limpiar',
    'common.confirm': 'Confirmar',
    'common.minutes': 'minutos',
    'common.seconds': 'segundos',
    'common.hours': 'horas',
    'common.duration': 'Duración',
    'common.frequency': 'Frecuencia',
    'common.volume': 'Volumen',

    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.forgotPassword': 'Olvidé mi contraseña',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.loginSuccess': 'Sesión iniciada correctamente',
    'auth.logoutSuccess': 'Sesión cerrada correctamente',
    'auth.invalidCredentials': 'Credenciales inválidas',

    // Home
    'home.hero.title': 'Sincroniza tu Energía con el Universo',
    'home.hero.subtitle': 'Descubre el poder de la radiónica cuántica',
    'home.features.title': 'Características',
    'home.testimonials.title': 'Testimonios',
    'home.cta.title': 'Comienza tu viaje cuántico',
    'home.cta.button': 'Comenzar ahora',

    // Diagnosis
    'diagnosis.title': 'Diagnóstico Cuántico',
    'diagnosis.personName': 'Nombre de la persona',
    'diagnosis.startDiagnosis': 'Iniciar Diagnóstico',
    'diagnosis.stopDiagnosis': 'Detener Diagnóstico',
    'diagnosis.results': 'Resultados',
    'diagnosis.analyzing': 'Analizando...',

    // Treatment
    'treatment.title': 'Tratamiento Radiónico',
    'treatment.preset': 'Preestablecido',
    'treatment.custom': 'Personalizado',
    'treatment.selectPreset': 'Seleccionar tratamiento',
    'treatment.receptorName': 'Nombre del receptor',
    'treatment.rates': 'Tasas radiónicos',
    'treatment.rate1': 'Tasa 1',
    'treatment.rate2': 'Tasa 2',
    'treatment.startTreatment': 'Iniciar Tratamiento',
    'treatment.stopTreatment': 'Detener Tratamiento',
    'treatment.duration': 'Duración',
    'treatment.frequency': 'Frecuencia',
    'treatment.images': 'Imágenes',
    'treatment.uploadImage': 'Subir imagen',
    'treatment.selectFromGallery': 'Seleccionar de galería',

    // Manifestation
    'manifest.title': 'Manifestación Cuántica',
    'manifest.preset': 'Preestablecido',
    'manifest.custom': 'Personalizado',
    'manifest.intention': 'Intención',
    'manifest.enterIntention': 'Escribe tu intención...',
    'manifest.receptorName': 'Nombre del receptor',
    'manifest.pattern': 'Patrón',
    'manifest.selectPattern': 'Seleccionar patrón',
    'manifest.startManifestation': 'Iniciar Manifestación',
    'manifest.stopManifestation': 'Detener Manifestación',
    'manifest.exposureTime': 'Tiempo de exposición',

    // Balance Chakras
    'chakras.title': 'Equilibrar Chakras',
    'chakras.personName': 'Nombre de la persona',
    'chakras.duration': 'Duración por chakra',
    'chakras.startBalance': 'Iniciar Equilibrado',
    'chakras.stopBalance': 'Detener Equilibrado',
    'chakras.balancing': 'Equilibrando',
    'chakras.completed': 'Equilibrado completado',
    'chakras.root': 'Raíz',
    'chakras.sacral': 'Sacro',
    'chakras.solarPlexus': 'Plexo Solar',
    'chakras.heart': 'Corazón',
    'chakras.throat': 'Garganta',
    'chakras.thirdEye': 'Tercer Ojo',
    'chakras.crown': 'Corona',

    // Audio
    'audio.title': 'Audio Subliminal',
    'audio.uploadAudio': 'Subir audio',
    'audio.recordAudio': 'Grabar audio',
    'audio.stopRecording': 'Detener grabación',
    'audio.playPreview': 'Reproducir',
    'audio.stopPreview': 'Detener',
    'audio.removeAudio': 'Quitar audio',
    'audio.volume': 'Volumen',
    'audio.maxUpload': 'Máximo 10 min para subir',
    'audio.maxRecord': 'Máximo 3 min para grabar',
    'audio.audioLoaded': 'Audio cargado correctamente',
    'audio.invalidFormat': 'Formato de audio no válido',
    'audio.fileTooLarge': 'Archivo demasiado grande (máximo 50MB)',

    // Affiliates
    'affiliates.title': 'Programa de Afiliados',
    'affiliates.dashboard': 'Panel de Afiliado',
    'affiliates.myLink': 'Mi enlace de afiliado',
    'affiliates.copyLink': 'Copiar enlace',
    'affiliates.linkCopied': 'Enlace copiado',
    'affiliates.totalClicks': 'Clics totales',
    'affiliates.totalSales': 'Ventas totales',
    'affiliates.totalCommissions': 'Comisiones totales',
    'affiliates.pendingCommissions': 'Comisiones pendientes',
    'affiliates.paidCommissions': 'Comisiones pagadas',

    // Admin
    'admin.title': 'Panel de Administración',
    'admin.users': 'Usuarios',
    'admin.affiliates': 'Afiliados',
    'admin.sales': 'Ventas',
    'admin.gallery': 'Galería',
    'admin.reports': 'Reportes',
    'admin.registeredUsers': 'Usuarios registrados',
    'admin.updateList': 'Actualizar Lista',

    // Session History
    'history.title': 'Historial de Sesiones',
    'history.noSessions': 'No hay sesiones registradas',
    'history.sessionType': 'Tipo de sesión',
    'history.date': 'Fecha',
    'history.notes': 'Notas',

    // Purchase
    'purchase.title': 'Adquirir QuantumSync',
    'purchase.selectPlan': 'Selecciona tu plan',
    'purchase.monthly': 'Mensual',
    'purchase.annual': 'Anual',
    'purchase.lifetime': 'De por vida',

    // Footer
    'footer.rights': 'Todos los derechos reservados',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.contact': 'Contacto',

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
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.start': 'Start',
    'common.stop': 'Stop',
    'common.pause': 'Pause',
    'common.resume': 'Resume',
    'common.finish': 'Finish',
    'common.reset': 'Reset',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.select': 'Select',
    'common.upload': 'Upload',
    'common.download': 'Download',
    'common.remove': 'Remove',
    'common.clear': 'Clear',
    'common.confirm': 'Confirm',
    'common.minutes': 'minutes',
    'common.seconds': 'seconds',
    'common.hours': 'hours',
    'common.duration': 'Duration',
    'common.frequency': 'Frequency',
    'common.volume': 'Volume',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.forgotPassword': 'Forgot password',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginSuccess': 'Logged in successfully',
    'auth.logoutSuccess': 'Logged out successfully',
    'auth.invalidCredentials': 'Invalid credentials',

    // Home
    'home.hero.title': 'Sync Your Energy with the Universe',
    'home.hero.subtitle': 'Discover the power of quantum radionics',
    'home.features.title': 'Features',
    'home.testimonials.title': 'Testimonials',
    'home.cta.title': 'Start your quantum journey',
    'home.cta.button': 'Start now',

    // Diagnosis
    'diagnosis.title': 'Quantum Diagnosis',
    'diagnosis.personName': 'Person name',
    'diagnosis.startDiagnosis': 'Start Diagnosis',
    'diagnosis.stopDiagnosis': 'Stop Diagnosis',
    'diagnosis.results': 'Results',
    'diagnosis.analyzing': 'Analyzing...',

    // Treatment
    'treatment.title': 'Radionic Treatment',
    'treatment.preset': 'Preset',
    'treatment.custom': 'Custom',
    'treatment.selectPreset': 'Select treatment',
    'treatment.receptorName': 'Receptor name',
    'treatment.rates': 'Radionic rates',
    'treatment.rate1': 'Rate 1',
    'treatment.rate2': 'Rate 2',
    'treatment.startTreatment': 'Start Treatment',
    'treatment.stopTreatment': 'Stop Treatment',
    'treatment.duration': 'Duration',
    'treatment.frequency': 'Frequency',
    'treatment.images': 'Images',
    'treatment.uploadImage': 'Upload image',
    'treatment.selectFromGallery': 'Select from gallery',

    // Manifestation
    'manifest.title': 'Quantum Manifestation',
    'manifest.preset': 'Preset',
    'manifest.custom': 'Custom',
    'manifest.intention': 'Intention',
    'manifest.enterIntention': 'Enter your intention...',
    'manifest.receptorName': 'Receptor name',
    'manifest.pattern': 'Pattern',
    'manifest.selectPattern': 'Select pattern',
    'manifest.startManifestation': 'Start Manifestation',
    'manifest.stopManifestation': 'Stop Manifestation',
    'manifest.exposureTime': 'Exposure time',

    // Balance Chakras
    'chakras.title': 'Balance Chakras',
    'chakras.personName': 'Person name',
    'chakras.duration': 'Duration per chakra',
    'chakras.startBalance': 'Start Balance',
    'chakras.stopBalance': 'Stop Balance',
    'chakras.balancing': 'Balancing',
    'chakras.completed': 'Balance completed',
    'chakras.root': 'Root',
    'chakras.sacral': 'Sacral',
    'chakras.solarPlexus': 'Solar Plexus',
    'chakras.heart': 'Heart',
    'chakras.throat': 'Throat',
    'chakras.thirdEye': 'Third Eye',
    'chakras.crown': 'Crown',

    // Audio
    'audio.title': 'Subliminal Audio',
    'audio.uploadAudio': 'Upload audio',
    'audio.recordAudio': 'Record audio',
    'audio.stopRecording': 'Stop recording',
    'audio.playPreview': 'Play',
    'audio.stopPreview': 'Stop',
    'audio.removeAudio': 'Remove audio',
    'audio.volume': 'Volume',
    'audio.maxUpload': 'Max 10 min for upload',
    'audio.maxRecord': 'Max 3 min for recording',
    'audio.audioLoaded': 'Audio loaded successfully',
    'audio.invalidFormat': 'Invalid audio format',
    'audio.fileTooLarge': 'File too large (max 50MB)',

    // Affiliates
    'affiliates.title': 'Affiliate Program',
    'affiliates.dashboard': 'Affiliate Dashboard',
    'affiliates.myLink': 'My affiliate link',
    'affiliates.copyLink': 'Copy link',
    'affiliates.linkCopied': 'Link copied',
    'affiliates.totalClicks': 'Total clicks',
    'affiliates.totalSales': 'Total sales',
    'affiliates.totalCommissions': 'Total commissions',
    'affiliates.pendingCommissions': 'Pending commissions',
    'affiliates.paidCommissions': 'Paid commissions',

    // Admin
    'admin.title': 'Admin Panel',
    'admin.users': 'Users',
    'admin.affiliates': 'Affiliates',
    'admin.sales': 'Sales',
    'admin.gallery': 'Gallery',
    'admin.reports': 'Reports',
    'admin.registeredUsers': 'Registered users',
    'admin.updateList': 'Update List',

    // Session History
    'history.title': 'Session History',
    'history.noSessions': 'No sessions recorded',
    'history.sessionType': 'Session type',
    'history.date': 'Date',
    'history.notes': 'Notes',

    // Purchase
    'purchase.title': 'Get QuantumSync',
    'purchase.selectPlan': 'Select your plan',
    'purchase.monthly': 'Monthly',
    'purchase.annual': 'Annual',
    'purchase.lifetime': 'Lifetime',

    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',

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
