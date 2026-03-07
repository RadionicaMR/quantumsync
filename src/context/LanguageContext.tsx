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
    'image.radionicGraphic': 'Imagen del EMISOR',
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

    // Auth
    'auth.createAccount': 'Crear tu cuenta',
    'auth.completeForm': 'Completa el formulario para acceder a todas las funcionalidades',
    'auth.fullName': 'Nombre completo',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.createAccountBtn': 'Crear cuenta',
    'auth.registering': 'Registrando...',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.login': 'Iniciar sesión',
    'auth.registrationSuccess': '¡Registro exitoso!',
    'auth.accountCreated': 'Tu cuenta ha sido creada correctamente. Ahora puedes acceder a todas las funcionalidades de QuantumSync.',
    'auth.startUsing': 'Comenzar a usar QuantumSync',
    'auth.passwordMismatch': 'Las contraseñas no coinciden',
    'auth.passwordMinLength': 'La contraseña debe tener al menos 6 caracteres',
    'auth.requiredFields': 'Todos los campos son obligatorios',
    'auth.emailInUse': 'El correo electrónico ya está registrado o hubo un problema con el registro.',
    'auth.registrationError': 'Ocurrió un error al registrar la cuenta.',
    'auth.loginTitle': 'Iniciar Sesión',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.noAccount': '¿No tienes una cuenta? Contacta con el administrador después de realizar tu pago.',
    'auth.loggingIn': 'Cargando...',
    'auth.invalidCredentials': 'Usuario o contraseña incorrectos',
    'auth.loginSuccess': 'Inicio de sesión exitoso',
    'auth.welcomeBack': 'Bienvenido a QuantumSync',
    'auth.loginError': 'Error de inicio de sesión',
    'auth.loginErrorDesc': 'Usuario o contraseña incorrectos. Revisa tus credenciales.',
    'auth.recoverPassword': 'Recuperar Contraseña',
    'auth.enterEmail': 'Por favor ingresa tu correo electrónico',
    'auth.yourPassword': 'Tu contraseña es',
    'auth.recoverySuccess': 'Recuperación exitosa',
    'auth.recoverySuccessDesc': 'Se ha encontrado una cuenta con el correo',
    'auth.noUserFound': 'No se encontró ninguna cuenta con este correo electrónico',
    'auth.noUsersRegistered': 'No hay usuarios registrados en el sistema',
    'auth.recoveryError': 'Error de recuperación',
    'auth.back': 'Volver',

    // Home Page - Video Showcase
    'home.videoShowcaseTitle': 'Una mirada al interior de QuantumSync',

    // Home Page - Hero
    'home.heroTitle1': 'Transformá la energía de tus pacientes',
    'home.heroTitle2': 'a distancia con precisión cuántica',
    'home.heroDesc': 'Quantumsync es una tecnología de',
    'home.heroQuantumRadionics': 'Radiónica Cuántica',
    'home.heroDescMiddle': 'que amplifica el poder de tus terapias energéticas mediante frecuencias en Hertz, conectando',
    'home.heroScienceConsciousness': 'ciencia y conciencia',
    'home.startNow': 'INICIA AHORA',

    // Home Page - Problem Section
    'home.problemTitle1': 'Tu energía sana.',
    'home.problemTitle2': 'Pero sentís que podrías llegar más lejos.',
    'home.problem1': 'Limitaciones del trabajo presencial',
    'home.problem2': 'Dificultad para medir resultados tangibles',
    'home.problem3': 'Necesidad de evolucionar tu práctica',
    'home.problemQuote': 'Visualiza tu energía expandiéndose más allá de las limitaciones físicas...',

    // Home Page - Solution Section
    'home.solutionTitle1': 'Nace',
    'home.solutionTitle2': 'la evolución de la Radiónica Cuántica',
    'home.solutionDesc1': 'Quantumsync te permite realizar',
    'home.solutionDistanceTherapies': 'terapias a distancia',
    'home.solutionDesc1End': 'con la misma precisión que si estuvieras presente físicamente.',
    'home.solutionDesc2': 'Mediante',
    'home.solutionFrequenciesHz': 'frecuencias en Hertz',
    'home.solutionDesc2End': 'y tecnología cuántica, amplificás tu intención terapéutica sin necesidad de aparatos físicos.',
    'home.solutionDesc3': 'Todo desde tu dispositivo móvil o computadora.',
    'home.solutionIntention': 'Intención',
    'home.solutionFrequency': 'Frecuencia',
    'home.solutionTransformation': 'Transformación',
    'home.solutionFeature1': 'Sin aparatos físicos costosos',
    'home.solutionFeature2': 'Precisión cuántica en cada sesión',
    'home.solutionFeature3': 'Amplifica tu don terapéutico',

    // Home Page - Benefits Section
    'home.benefitsTitle1': 'No reemplaza tu don.',
    'home.benefitsTitle2': 'Lo amplifica.',
    'home.benefit1Title': 'Potenciá tus terapias',
    'home.benefit1Desc': 'Amplifica tu don natural con frecuencias cuánticas precisas',
    'home.benefit2Title': 'Sesiones a distancia',
    'home.benefit2Desc': 'Trabaja con pacientes en cualquier parte del mundo',
    'home.benefit3Title': 'Registro de resultados',
    'home.benefit3Desc': 'Seguimiento personalizado y medible de cada tratamiento',
    'home.benefit4Title': 'Profesionalización',
    'home.benefit4Desc': 'Eleva tu práctica con tecnología de vanguardia',
    'home.benefit5Title': 'Sin desgaste energético',
    'home.benefit5Desc': 'Mayor alcance sin agotar tu propia energía',
    'home.benefit6Title': 'Desde cualquier dispositivo',
    'home.benefit6Desc': 'Móvil, tablet o computadora - siempre disponible',

    // Home Page - App Showcase
    'home.showcaseTitle1': 'Tecnología simple.',
    'home.showcaseTitle2': 'Energía avanzada.',
    'home.showcaseSubtitle': 'Diseñada para terapeutas, no técnicos. Interfaz intuitiva y soporte humano.',
    'home.showcase1Title': 'Equilibrio de Chakras',
    'home.showcase1Desc': 'Armoniza tu energía vital',
    'home.showcase2Title': 'Selector de Frecuencia',
    'home.showcase2Desc': 'Ajusta las vibraciones con precisión',
    'home.showcase3Title': 'Sesión Activa',
    'home.showcase3Desc': 'Monitoreo en tiempo real del tratamiento',

    // Home Page - Quantum Foundation
    'home.quantumTitle1': 'La energía es información.',
    'home.quantumTitle2': 'La frecuencia es el lenguaje del cambio.',
    'home.quantumDesc1': 'La física cuántica ha demostrado que todo en el universo vibra a una frecuencia específica. Desde las partículas subatómicas hasta las células de tu cuerpo, todo es',
    'home.quantumEnergyMotion': 'energía en movimiento',
    'home.quantumDesc2': 'La',
    'home.quantumRadionicsName': 'Radiónica Cuántica',
    'home.quantumDesc2End': 'se basa en el principio de que cuando emitimos frecuencias específicas con una intención clara, podemos influir en el campo energético de una persona, independientemente de la distancia física.',
    'home.quantumDesc3': 'Quantumsync traduce tu intención terapéutica en',
    'home.quantumFrequenciesHz': 'frecuencias medidas en Hertz',
    'home.quantumDesc3End': ', creando un puente entre la conciencia y la materia.',
    'home.quantumFeature1Title': 'Coherencia Vibracional',
    'home.quantumFeature1Desc': 'Las ondas se sincronizan creando resonancia',
    'home.quantumFeature2Title': 'Campo Cuántico',
    'home.quantumFeature2Desc': 'Conexión más allá del espacio-tiempo',
    'home.quantumFeature3Title': 'Tecnología Consciente',
    'home.quantumFeature3Desc': 'Hardware que responde a la intención',
    'home.quantumQuote': '"La intención enfocada + Frecuencia precisa = Transformación energética real"',

    // Home Page - Testimonials
    'home.testimonialsTitle1': 'Lo invisible ahora tiene',
    'home.testimonialsTitle2': 'resultados visibles',
    'home.testimonial1Name': 'María González',
    'home.testimonial1Role': 'Terapeuta Holística',
    'home.testimonial1Content': 'Desde que uso Quantumsync, mis sesiones a distancia tienen resultados medibles. Mis pacientes sienten la energía como si estuviera presente.',
    'home.testimonial2Name': 'Carlos Mendoza',
    'home.testimonial2Role': 'Biodescodificador',
    'home.testimonial2Content': 'La precisión de las frecuencias me permite trabajar con varios pacientes al día sin agotarme. Es la evolución que necesitaba mi práctica.',
    'home.testimonial3Name': 'Ana Fernández',
    'home.testimonial3Role': 'Reikista Certificada',
    'home.testimonial3Content': 'Quantumsync complementa perfectamente mi Reiki. Ahora puedo llegar a personas en otros países y mantener la efectividad de las sesiones.',

    // Home Page - FAQ
    'home.faqTitle1': 'Preguntas que seguro',
    'home.faqTitle2': 'te hiciste...',
    'home.faq1Question': '¿Necesito conocimientos técnicos para usar Quantumsync?',
    'home.faq1Answer': 'No. La interfaz está diseñada para terapeutas, no para técnicos. Si sabes usar un smartphone, puedes usar Quantumsync. Incluye guías paso a paso y soporte personalizado.',
    'home.faq2Question': '¿Requiere equipos o aparatos físicos?',
    'home.faq2Answer': 'No necesitas ningún aparato radiónico físico. Todo funciona desde tu dispositivo móvil, tablet o computadora. La tecnología está integrada en la aplicación.',
    'home.faq3Question': '¿Cómo funciona la terapia a distancia?',
    'home.faq3Answer': 'Basado en principios de Radiónica Cuántica, la aplicación emite frecuencias específicas dirigidas a tu paciente mediante tu intención y sus datos. La física cuántica demuestra que la distancia no es una barrera para la información energética.',
    'home.faq4Question': '¿Cuándo se puede cancelar?',
    'home.faq4Answer': 'Puedes cancelar en cualquier momento, cuando quieras.',
    'home.faq5Question': '¿Es compatible con otras terapias?',
    'home.faq5Answer': 'Absolutamente. Quantumsync complementa Reiki, Biodescodificación, terapias florales, y cualquier otra práctica energética. No reemplaza tu método, lo amplifica.',

    // Home Page - Pricing
    'home.pricingTitle': 'Tu energía merece evolucionar',
    'home.pricingDesc': 'Cada día que pasa sin amplificar tu potencial terapéutico es una oportunidad perdida de transformar más vidas.',
    'home.pricingBoxDesc': 'No es solo una herramienta. Es el puente entre tu intención y el campo cuántico. Es la evolución que tu práctica necesita.',
    'home.pricingQuote': 'Un terapeuta frente a una interfaz de energía expandiéndose hacia infinitas posibilidades...',

    // Home Page - Affiliate
    'home.affiliateTitle': 'Programa de Afiliados',
    'home.affiliateSubtitle': 'Gana comisiones recomendando QuantumSync',
    'home.affiliateCommission': '50% de Comisión',
    'home.affiliateCommissionDesc': 'Gana el 50% en cada venta que generes',
    'home.affiliateTracking': 'Trackeo Automático',
    'home.affiliateTrackingDesc': 'Sistema de cookies de 30 días para trackear ventas',
    'home.affiliateDashboard': 'Dashboard Completo',
    'home.affiliateDashboardDesc': 'Ve tus estadísticas y comisiones en tiempo real',
    'home.affiliatePayments': 'Pagos Semanales',
    'home.affiliatePaymentsDesc': 'Las comisiones se abonan todos los lunes de cada semana',
    'home.affiliateJoin': 'Unirse Ahora',
    'home.affiliateAlready': 'Ya soy afiliado',

    // Home Page - Final Closing
    'home.closingLine1': 'La intención crea la vibración.',
    'home.closingLine2': 'La vibración crea la realidad.',
    'home.closingLine3': 'Con Quantumsync, cada pensamiento se convierte en frecuencia,',
    'home.closingLine4': 'y cada frecuencia, en transformación.',
    'home.closingTagline1': '💫 Ciencia para el alma.',
    'home.closingTagline2': 'Frecuencia para la vida.',
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
    'image.radionicGraphic': 'EMITTER Image',
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

    // Auth
    'auth.createAccount': 'Create your account',
    'auth.completeForm': 'Complete the form to access all features',
    'auth.fullName': 'Full name',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.createAccountBtn': 'Create account',
    'auth.registering': 'Registering...',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.login': 'Login',
    'auth.registrationSuccess': 'Registration successful!',
    'auth.accountCreated': 'Your account has been created successfully. You can now access all QuantumSync features.',
    'auth.startUsing': 'Start using QuantumSync',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.passwordMinLength': 'Password must be at least 6 characters',
    'auth.requiredFields': 'All fields are required',
    'auth.emailInUse': 'Email already registered or there was a registration problem.',
    'auth.registrationError': 'An error occurred while creating the account.',
    'auth.loginTitle': 'Login',
    'auth.forgotPassword': 'Forgot your password?',
    'auth.noAccount': "Don't have an account? Contact the administrator after making your payment.",
    'auth.loggingIn': 'Loading...',
    'auth.invalidCredentials': 'Invalid username or password',
    'auth.loginSuccess': 'Login successful',
    'auth.welcomeBack': 'Welcome to QuantumSync',
    'auth.loginError': 'Login error',
    'auth.loginErrorDesc': 'Invalid username or password. Check your credentials.',
    'auth.recoverPassword': 'Recover Password',
    'auth.enterEmail': 'Please enter your email address',
    'auth.yourPassword': 'Your password is',
    'auth.recoverySuccess': 'Recovery successful',
    'auth.recoverySuccessDesc': 'An account was found with the email',
    'auth.noUserFound': 'No account found with this email address',
    'auth.noUsersRegistered': 'No users registered in the system',
    'auth.recoveryError': 'Recovery error',
    'auth.back': 'Back',

    // Home Page - Video Showcase
    'home.videoShowcaseTitle': 'A look inside QuantumSync',

    // Home Page - Hero
    'home.heroTitle1': 'Transform your patients\' energy',
    'home.heroTitle2': 'remotely with quantum precision',
    'home.heroDesc': 'Quantumsync is a',
    'home.heroQuantumRadionics': 'Quantum Radionics',
    'home.heroDescMiddle': 'technology that amplifies the power of your energy therapies through Hertz frequencies, connecting',
    'home.heroScienceConsciousness': 'science and consciousness',
    'home.startNow': 'START NOW',

    // Home Page - Problem Section
    'home.problemTitle1': 'Your energy heals.',
    'home.problemTitle2': 'But you feel you could go further.',
    'home.problem1': 'Limitations of in-person work',
    'home.problem2': 'Difficulty measuring tangible results',
    'home.problem3': 'Need to evolve your practice',
    'home.problemQuote': 'Visualize your energy expanding beyond physical limitations...',

    // Home Page - Solution Section
    'home.solutionTitle1': 'Introducing',
    'home.solutionTitle2': 'the evolution of Quantum Radionics',
    'home.solutionDesc1': 'Quantumsync allows you to perform',
    'home.solutionDistanceTherapies': 'distance therapies',
    'home.solutionDesc1End': 'with the same precision as if you were physically present.',
    'home.solutionDesc2': 'Through',
    'home.solutionFrequenciesHz': 'Hertz frequencies',
    'home.solutionDesc2End': 'and quantum technology, you amplify your therapeutic intention without the need for physical devices.',
    'home.solutionDesc3': 'All from your mobile device or computer.',
    'home.solutionIntention': 'Intention',
    'home.solutionFrequency': 'Frequency',
    'home.solutionTransformation': 'Transformation',
    'home.solutionFeature1': 'No expensive physical devices',
    'home.solutionFeature2': 'Quantum precision in every session',
    'home.solutionFeature3': 'Amplify your therapeutic gift',

    // Home Page - Benefits Section
    'home.benefitsTitle1': 'It doesn\'t replace your gift.',
    'home.benefitsTitle2': 'It amplifies it.',
    'home.benefit1Title': 'Boost your therapies',
    'home.benefit1Desc': 'Amplify your natural gift with precise quantum frequencies',
    'home.benefit2Title': 'Remote sessions',
    'home.benefit2Desc': 'Work with patients anywhere in the world',
    'home.benefit3Title': 'Track results',
    'home.benefit3Desc': 'Personalized and measurable tracking of each treatment',
    'home.benefit4Title': 'Professionalization',
    'home.benefit4Desc': 'Elevate your practice with cutting-edge technology',
    'home.benefit5Title': 'No energy drain',
    'home.benefit5Desc': 'Greater reach without depleting your own energy',
    'home.benefit6Title': 'From any device',
    'home.benefit6Desc': 'Mobile, tablet or computer - always available',

    // Home Page - App Showcase
    'home.showcaseTitle1': 'Simple technology.',
    'home.showcaseTitle2': 'Advanced energy.',
    'home.showcaseSubtitle': 'Designed for therapists, not technicians. Intuitive interface and human support.',
    'home.showcase1Title': 'Chakra Balance',
    'home.showcase1Desc': 'Harmonize your vital energy',
    'home.showcase2Title': 'Frequency Selector',
    'home.showcase2Desc': 'Adjust vibrations with precision',
    'home.showcase3Title': 'Active Session',
    'home.showcase3Desc': 'Real-time treatment monitoring',

    // Home Page - Quantum Foundation
    'home.quantumTitle1': 'Energy is information.',
    'home.quantumTitle2': 'Frequency is the language of change.',
    'home.quantumDesc1': 'Quantum physics has shown that everything in the universe vibrates at a specific frequency. From subatomic particles to the cells in your body, everything is',
    'home.quantumEnergyMotion': 'energy in motion',
    'home.quantumDesc2': '',
    'home.quantumRadionicsName': 'Quantum Radionics',
    'home.quantumDesc2End': 'is based on the principle that when we emit specific frequencies with clear intention, we can influence a person\'s energy field, regardless of physical distance.',
    'home.quantumDesc3': 'Quantumsync translates your therapeutic intention into',
    'home.quantumFrequenciesHz': 'frequencies measured in Hertz',
    'home.quantumDesc3End': ', creating a bridge between consciousness and matter.',
    'home.quantumFeature1Title': 'Vibrational Coherence',
    'home.quantumFeature1Desc': 'Waves synchronize creating resonance',
    'home.quantumFeature2Title': 'Quantum Field',
    'home.quantumFeature2Desc': 'Connection beyond space-time',
    'home.quantumFeature3Title': 'Conscious Technology',
    'home.quantumFeature3Desc': 'Hardware that responds to intention',
    'home.quantumQuote': '"Focused intention + Precise frequency = Real energetic transformation"',

    // Home Page - Testimonials
    'home.testimonialsTitle1': 'The invisible now has',
    'home.testimonialsTitle2': 'visible results',
    'home.testimonial1Name': 'María González',
    'home.testimonial1Role': 'Holistic Therapist',
    'home.testimonial1Content': 'Since I started using Quantumsync, my remote sessions have measurable results. My patients feel the energy as if I were present.',
    'home.testimonial2Name': 'Carlos Mendoza',
    'home.testimonial2Role': 'Biodecoding Specialist',
    'home.testimonial2Content': 'The precision of the frequencies allows me to work with multiple patients a day without burning out. It\'s the evolution my practice needed.',
    'home.testimonial3Name': 'Ana Fernández',
    'home.testimonial3Role': 'Certified Reiki Master',
    'home.testimonial3Content': 'Quantumsync perfectly complements my Reiki. Now I can reach people in other countries and maintain session effectiveness.',

    // Home Page - FAQ
    'home.faqTitle1': 'Questions you probably',
    'home.faqTitle2': 'asked yourself...',
    'home.faq1Question': 'Do I need technical knowledge to use Quantumsync?',
    'home.faq1Answer': 'No. The interface is designed for therapists, not technicians. If you know how to use a smartphone, you can use Quantumsync. It includes step-by-step guides and personalized support.',
    'home.faq2Question': 'Does it require physical equipment or devices?',
    'home.faq2Answer': 'You don\'t need any physical radionic device. Everything works from your mobile device, tablet or computer. The technology is integrated into the application.',
    'home.faq3Question': 'How does distance therapy work?',
    'home.faq3Answer': 'Based on Quantum Radionics principles, the app emits specific frequencies directed at your patient through your intention and their data. Quantum physics demonstrates that distance is not a barrier for energetic information.',
    'home.faq4Question': 'When can I cancel?',
    'home.faq4Answer': 'You can cancel at any time, whenever you want.',
    'home.faq5Question': 'Is it compatible with other therapies?',
    'home.faq5Answer': 'Absolutely. Quantumsync complements Reiki, Biodecoding, flower therapies, and any other energetic practice. It doesn\'t replace your method, it amplifies it.',

    // Home Page - Pricing
    'home.pricingTitle': 'Your energy deserves to evolve',
    'home.pricingDesc': 'Every day that passes without amplifying your therapeutic potential is a missed opportunity to transform more lives.',
    'home.pricingBoxDesc': 'It\'s not just a tool. It\'s the bridge between your intention and the quantum field. It\'s the evolution your practice needs.',
    'home.pricingQuote': 'A therapist facing an interface of energy expanding towards infinite possibilities...',

    // Home Page - Affiliate
    'home.affiliateTitle': 'Affiliate Program',
    'home.affiliateSubtitle': 'Earn commissions recommending QuantumSync',
    'home.affiliateCommission': '50% Commission',
    'home.affiliateCommissionDesc': 'Earn 50% on every sale you generate',
    'home.affiliateTracking': 'Automatic Tracking',
    'home.affiliateTrackingDesc': '30-day cookie system to track sales',
    'home.affiliateDashboard': 'Complete Dashboard',
    'home.affiliateDashboardDesc': 'See your stats and commissions in real time',
    'home.affiliatePayments': 'Weekly Payments',
    'home.affiliatePaymentsDesc': 'Commissions are paid every Monday',
    'home.affiliateJoin': 'Join Now',
    'home.affiliateAlready': 'Already an affiliate',

    // Home Page - Final Closing
    'home.closingLine1': 'Intention creates vibration.',
    'home.closingLine2': 'Vibration creates reality.',
    'home.closingLine3': 'With Quantumsync, every thought becomes frequency,',
    'home.closingLine4': 'and every frequency, transformation.',
    'home.closingTagline1': '💫 Science for the soul.',
    'home.closingTagline2': 'Frequency for life.',
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
