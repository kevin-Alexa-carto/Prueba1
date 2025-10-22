
export const SECTIONS = [
    {
        id: 'identity',
        title: 'I. Fundamentos e Identidad de Marca',
        description: 'Define el alma de tu marca: tu "qué" y tu "por qué".',
        fields: [
            { id: 'purpose', label: 'Propósito y Misión', placeholder: '¿Por qué existes y qué haces?', type: 'textarea' },
            { id: 'vision', label: 'Visión', placeholder: '¿Dónde quieres estar en el futuro?', type: 'textarea' },
            { id: 'values', label: 'Valores Centrales', placeholder: 'Principios éticos que guían tu comportamiento.', type: 'textarea' },
            { id: 'targetAudience', label: 'Público Objetivo (Buyer Persona)', placeholder: 'Define a quién quieres servir.', type: 'textarea' },
            { id: 'brandPromise', label: 'Promesa de Marca (PVU)', placeholder: '¿Qué beneficio único ofreces?', type: 'textarea', isGenerated: true },
        ]
    },
    {
        id: 'positioning',
        title: 'II. Posicionamiento y Diferenciación',
        description: 'Define el lugar que ocuparás en la mente de tu audiencia.',
        fields: [
            { id: 'competitorAnalysis', label: 'Análisis Competitivo', placeholder: 'Investiga a tus competidores.', type: 'textarea' },
            { id: 'positioning', label: 'Posicionamiento de Marca', placeholder: '¿Cómo quieres ser percibido?', type: 'textarea', isGenerated: true },
            { id: 'toneOfVoice', label: 'Tono de Voz', placeholder: 'Formal, divertido, técnico, etc.', type: 'textarea', isGenerated: true },
            { id: 'brandArchetype', label: 'Arquetipo de Marca', placeholder: 'El Sabio, El Héroe, El Creador, etc.', type: 'textarea', isGenerated: true },
        ]
    },
    {
        id: 'visual',
        title: 'III. Identidad Visual',
        description: 'Crea la "cara" de tu marca, la primera impresión tangible.',
        fields: [
            { id: 'visualIdentity', label: 'Identidad Visual', placeholder: '', type: 'visual', isGenerated: true },
        ]
    },
    {
        id: 'communication',
        title: 'IV. Estrategia de Contenidos y Comunicación',
        description: 'Define cómo entregarás tu valor al mundo a través de tu mensaje.',
        fields: [
            { id: 'contentPillars', label: 'Pilares de Contenido', placeholder: 'Los 3-5 temas centrales sobre los que hablarás.', type: 'textarea', isGenerated: true },
            { id: 'keyPlatforms', label: 'Plataformas Clave', placeholder: 'LinkedIn, Instagram, TikTok, etc.', type: 'textarea', isGenerated: true },
            { id: 'ctas', label: 'Llamadas a la Acción (CTA)', placeholder: '"Suscríbete", "Agenda una llamada", etc.', type: 'textarea', isGenerated: true },
            { id: 'storytelling', label: 'Narrativa de Marca (Storytelling)', placeholder: 'La historia detrás de tu marca.', type: 'textarea', isGenerated: true },
        ]
    },
     {
        id: 'experience',
        title: 'V. Experiencia de Marca y Consistencia',
        description: 'Planifica la implementación de tu marca en cada punto de contacto.',
        fields: [
            { id: 'touchpoints', label: 'Puntos de Contacto (Touchpoints)', placeholder: 'Sitio web, correo electrónico, tarjetas, etc.', type: 'textarea' },
            { id: 'consistency', label: 'Estrategia de Consistencia', placeholder: '¿Cómo asegurarás la coherencia en todos los canales?', type: 'textarea' },
            { id: 'feedback', label: 'Mecanismos de Feedback', placeholder: '¿Cómo recolectarás comentarios para mejorar?', type: 'textarea' },
            { id: 'commitment', label: 'Compromiso de Marca', placeholder: '¿Cómo tus acciones reflejarán tus valores?', type: 'textarea' },
        ]
    },
];
