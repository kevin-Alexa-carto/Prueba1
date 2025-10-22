import { GoogleGenAI, Type } from "@google/genai";
import { BrandData, BrandProject, ContentIdea } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const generateContent = async (prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw new Error("No se pudo generar el contenido. Por favor, inténtalo de nuevo.");
    }
};

const generateJsonContent = async (prompt: any, schema: any) => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        let jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating JSON content with Gemini:", error);
        throw new Error("No se pudo generar el contenido JSON. Por favor, inténtalo de nuevo.");
    }
}

export const generateBrandIdeas = async (sectionId: string, context: Partial<BrandData>) => {
    let prompt = `Eres un experto estratega de marca personal. Basado en la siguiente información sobre una marca:
    
    Propósito y Misión: ${context.purpose || 'No definido'}
    Visión: ${context.vision || 'No definido'}
    Valores: ${context.values || 'No definido'}
    Público Objetivo: ${context.targetAudience || 'No definido'}
    Análisis de Competencia: ${context.competitorAnalysis || 'No definido'}

    Por favor, genera sugerencias para la siguiente sección de la estrategia de marca. Sé conciso, inspirador y profesional.
    `;

    switch(sectionId) {
        case 'brandPromise':
            prompt += `\nGenera 3 opciones para una "Promesa de Marca (Propuesta de Valor Única - PVU)".`;
            return await generateContent(prompt);
        case 'positioning':
            prompt += `\nGenera 3 opciones para una declaración de "Posicionamiento de Marca".`;
            return await generateContent(prompt);
        case 'toneOfVoice':
            prompt += `\nDefine un "Tono de Voz" para la marca, describiendo su personalidad y proporcionando ejemplos. Sugiere 2 opciones.`;
            return await generateContent(prompt);
        case 'brandArchetype':
            prompt += `\nSugiere un "Arquetipo de Marca" principal y uno secundario que se alineen con la identidad de la marca y explica por qué.`;
            return await generateContent(prompt);
        case 'contentPillars':
            prompt += `\nGenera 4-5 "Pilares de Contenido" sobre los que esta marca debería crear contenido.`;
             return await generateContent(prompt);
        case 'keyPlatforms':
            prompt += `\nRecomienda 2-3 "Plataformas Clave" (redes sociales, blogs, etc.) donde esta marca debería tener presencia, y justifica por qué.`;
            return await generateContent(prompt);
        case 'ctas':
            prompt += `\nSugiere 5 "Llamadas a la Acción (CTAs)" que esta marca podría usar consistentemente.`;
            return await generateContent(prompt);
        case 'storytelling':
            prompt += `\nEsboza un arco narrativo para el "Storytelling" de esta marca. Define el héroe, el conflicto, la resolución y la moraleja.`;
            return await generateContent(prompt);
        default:
            throw new Error('Sección no válida para generación de IA');
    }
};

export const generateVisualIdentity = async (context: Partial<BrandData>) => {
    const prompt = `Eres un director de arte y diseñador de marcas experto. Basado en la siguiente información de marca:
    
    Propósito y Misión: ${context.purpose || 'No definido'}
    Visión: ${context.vision || 'No definido'}
    Valores: ${context.values || 'No definido'}
    Público Objetivo: ${context.targetAudience || 'No definido'}
    Tono de Voz: ${context.toneOfVoice || 'No definido'}
    Arquetipo de Marca: ${context.brandArchetype || 'No definido'}

    Genera una identidad visual completa en formato JSON.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            logoConcept: {
                type: Type.STRING,
                description: "Un concepto detallado para un logotipo, describiendo el símbolo, la tipografía y el sentimiento que debe evocar."
            },
            colorPalette: {
                type: Type.ARRAY,
                description: "Una paleta de 5 colores (primario, secundario, acento, neutro claro, neutro oscuro).",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        hex: { type: Type.STRING, description: "El código hexadecimal del color (ej. #4F46E5)." },
                        name: { type: Type.STRING, description: "Un nombre evocador para el color (ej. Azul Confianza)." },
                        description: { type: Type.STRING, description: "Cómo y cuándo usar este color." }
                    },
                    required: ["hex", "name", "description"]
                }
            },
            primaryTypography: {
                type: Type.OBJECT,
                description: "Tipografía para títulos. Sugiere una fuente de Google Fonts.",
                properties: {
                    fontFamily: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["fontFamily", "description"]
            },
            secondaryTypography: {
                type: Type.OBJECT,
                description: "Tipografía para cuerpo de texto. Sugiere una fuente de Google Fonts que combine bien.",
                properties: {
                    fontFamily: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                 required: ["fontFamily", "description"]
            },
            photographyStyle: {
                type: Type.STRING,
                description: "Describe el estilo fotográfico (ej. minimalista, vibrante, documental, profesional, etc.)."
            }
        },
        required: ["logoConcept", "colorPalette", "primaryTypography", "secondaryTypography", "photographyStyle"]
    };

    return await generateJsonContent(prompt, schema);
};


export const generateFullBrandStrategy = async (basePrompt: string, logo?: {mimeType: string, data: string}, pdfName?: string, websiteUrl?: string) => {

    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [
        {text: `Eres un estratega de marca de clase mundial y un director creativo. Un cliente te ha proporcionado la siguiente descripción para una nueva marca personal o de producto:\n\n---\n${basePrompt}\n---\n\n`},
    ];

    if(logo) {
        parts.push({text: "También han proporcionado una imagen de logotipo existente como inspiración. Analízala para entender el estilo visual y el tono."});
        parts.push({inlineData: {mimeType: logo.mimeType, data: logo.data}});
    }
    if (pdfName) {
        parts.push({text: `\nAdemás, han subido un documento llamado "${pdfName}". Asume que este documento contiene información relevante sobre la marca y tenlo en cuenta.`});
    }
    if (websiteUrl) {
         parts.push({text: `\nTambién han proporcionado un enlace a su sitio web actual o de inspiración: ${websiteUrl}. Extrae el tono, el estilo y la audiencia de este sitio.`});
    }

    parts.push({text: "\nTu tarea es generar una estrategia de marca completa y coherente en formato JSON. Cubre todos los aspectos, desde los fundamentos hasta la experiencia del cliente. Sé creativo, profesional y estratégico."});
    
    const visualIdentitySchema = {
        type: Type.OBJECT,
        properties: {
            logoConcept: { type: Type.STRING, description: "Un concepto detallado para un logotipo, describiendo el símbolo, la tipografía y el sentimiento que debe evocar." },
            colorPalette: {
                type: Type.ARRAY, description: "Una paleta de 5 colores (primario, secundario, acento, neutro claro, neutro oscuro).",
                items: {
                    type: Type.OBJECT, properties: {
                        hex: { type: Type.STRING, description: "El código hexadecimal del color (ej. #4F46E5)." },
                        name: { type: Type.STRING, description: "Un nombre evocador para el color (ej. Azul Confianza)." },
                        description: { type: Type.STRING, description: "Cómo y cuándo usar este color." }
                    }, required: ["hex", "name", "description"]
                }
            },
            primaryTypography: { type: Type.OBJECT, description: "Tipografía para títulos. Sugiere una fuente de Google Fonts.", properties: { fontFamily: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["fontFamily", "description"] },
            secondaryTypography: { type: Type.OBJECT, description: "Tipografía para cuerpo de texto. Sugiere una fuente de Google Fonts que combine bien.", properties: { fontFamily: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["fontFamily", "description"] },
            photographyStyle: { type: Type.STRING, description: "Describe el estilo fotográfico (ej. minimalista, vibrante, documental, profesional, etc.)." }
        },
        required: ["logoConcept", "colorPalette", "primaryTypography", "secondaryTypography", "photographyStyle"]
    };

    const fullSchema = {
        type: Type.OBJECT,
        properties: {
            purpose: { type: Type.STRING, description: "El por qué existe la marca (propósito) y qué hace (misión)." },
            vision: { type: Type.STRING, description: "La meta a largo plazo de la marca." },
            values: { type: Type.STRING, description: "Una lista o párrafo con los 3-5 principios éticos y profesionales de la marca." },
            targetAudience: { type: Type.STRING, description: "Una descripción detallada del 'Buyer Persona' o público objetivo." },
            brandPromise: { type: Type.STRING, description: "La Propuesta de Valor Única (PVU), el beneficio específico que ofrece." },
            competitorAnalysis: { type: Type.STRING, description: "Un breve análisis de 2-3 competidores, destacando sus debilidades." },
            positioning: { type: Type.STRING, description: "Una declaración clara de posicionamiento de marca." },
            toneOfVoice: { type: Type.STRING, description: "La personalidad de la marca al comunicarse (ej. 'Amigable y profesional, con un toque de humor')." },
            brandArchetype: { type: Type.STRING, description: "El arquetipo principal que encarna la marca (ej. 'El Sabio')." },
            visualIdentity: visualIdentitySchema,
            contentPillars: { type: Type.STRING, description: "Una lista de 3-5 temas centrales para la creación de contenido." },
            keyPlatforms: { type: Type.STRING, description: "Las 2-3 plataformas (redes sociales, etc.) más importantes para la marca y por qué." },
            ctas: { type: Type.STRING, description: "Una lista de 3-5 llamadas a la acción (CTAs) comunes." },
            storytelling: { type: Type.STRING, description: "Un breve arco narrativo o la historia central de la marca." },
            touchpoints: { type: Type.STRING, description: "Lista de puntos de contacto clave del cliente con la marca." },
            consistency: { type: Type.STRING, description: "Una breve estrategia para mantener la consistencia de la marca." },
            feedback: { type: Type.STRING, description: "Sugerencias de mecanismos para recolectar feedback." },
            commitment: { type: Type.STRING, description: "Una declaración de cómo las acciones de la marca reflejarán sus valores." }
        },
        required: [
            "purpose", "vision", "values", "targetAudience", "brandPromise", "competitorAnalysis",
            "positioning", "toneOfVoice", "brandArchetype", "visualIdentity", "contentPillars",
            "keyPlatforms", "ctas", "storytelling", "touchpoints", "consistency", "feedback", "commitment"
        ]
    };

    return await generateJsonContent({ parts }, fullSchema);
};

export const generateContentCalendar = async (
    project: BrandProject,
    strategy: { month: string; niche: string; objective: string; keywords: string }
): Promise<{ contentIdeas: Omit<ContentIdea, 'id'>[] }> => {
    const prompt = `Eres un experto en marketing de contenidos y redes sociales. Te proporciono los detalles de una marca y una estrategia. Tu tarea es crear un calendario de contenidos para un mes específico.

    **Información de la Marca:**
    *   **Nombre del Proyecto:** ${project.name}
    *   **Público Objetivo:** ${project.data.targetAudience || 'No definido'}
    *   **Tono de Voz:** ${project.data.toneOfVoice || 'Profesional y accesible'}
    *   **Pilares de Contenido:** ${project.data.contentPillars || 'No definidos'}
    *   **Propósito/Misión:** ${project.data.purpose || 'No definido'}

    **Estrategia para este Calendario:**
    *   **Mes:** ${strategy.month}
    *   **Industria/Nicho:** ${strategy.niche}
    *   **Objetivo de Marketing Principal:** ${strategy.objective}
    *   **Temas/Palabras Clave Adicionales:** ${strategy.keywords}

    **Instrucciones:**
    1.  Genera entre 8 y 12 ideas de contenido distribuidas a lo largo del mes. No es necesario rellenar todos los días.
    2.  Varía los tipos de contenido entre 'Blog', 'Social Media', 'Video', 'Email', y 'Podcast'.
    3.  Asegúrate de que cada idea incluya un título atractivo y una breve descripción (1-2 frases) de lo que trata el contenido.
    4.  Alinea las ideas con la información de la marca y los objetivos de la estrategia.
    5.  Distribuye el contenido de forma lógica a lo largo de la semana (por ejemplo, blogs a mitad de semana, emails los martes, etc.).
    6.  Devuelve el resultado únicamente en el formato JSON especificado.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            contentIdeas: {
                type: Type.ARRAY,
                description: "Una lista de ideas de contenido para el calendario.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.NUMBER, description: "El día del mes para esta publicación (1-31)." },
                        contentType: { type: Type.STRING, description: "El tipo de contenido (e.g., 'Blog', 'Social Media', 'Video', 'Email', 'Podcast')." },
                        title: { type: Type.STRING, description: "El título o titular del contenido." },
                        description: { type: Type.STRING, description: "Una breve descripción del contenido." }
                    },
                    required: ["day", "contentType", "title", "description"]
                }
            }
        },
        required: ["contentIdeas"]
    };

    return await generateJsonContent(prompt, schema);
};


export const generateFullContentFromIdea = async (
    project: BrandProject,
    idea: ContentIdea
): Promise<string> => {
    const contentTypeMap: { [key: string]: string } = {
        'Blog': 'un artículo de blog completo y atractivo de al menos 500 palabras',
        'Social Media': 'una publicación para redes sociales (por ejemplo, LinkedIn o Instagram), incluyendo un texto atractivo, emojis relevantes y 3-5 hashtags estratégicos',
        'Video': 'un guion detallado para un video corto (aproximadamente 1-3 minutos), incluyendo indicaciones de escena y diálogo o voz en off',
        'Email': 'un correo electrónico de marketing para un newsletter, con un asunto llamativo, un cuerpo de texto persuasivo y una clara llamada a la acción',
        'Podcast': 'un esquema detallado para un episodio de podcast de 5-10 minutos, con puntos de conversación clave, introducción y conclusión',
    };

    const contentTypeInstruction = contentTypeMap[idea.contentType] || `un contenido de tipo "${idea.contentType}"`;

    const prompt = `Eres un experto creador de contenido y copywriter. Basado en la siguiente información de marca y una idea de contenido específica, genera el contenido completo.

    **Información de la Marca:**
    *   **Nombre del Proyecto:** ${project.name}
    *   **Público Objetivo:** ${project.data.targetAudience || 'No definido'}
    *   **Tono de Voz:** ${project.data.toneOfVoice || 'Profesional y accesible'}
    *   **Propósito/Misión:** ${project.data.purpose || 'No definido'}

    **Idea de Contenido a Desarrollar:**
    *   **Tipo de Contenido:** ${idea.contentType}
    *   **Título:** "${idea.title}"
    *   **Descripción:** ${idea.description}

    **Tu Tarea:**
    Escribe ${contentTypeInstruction} basado en el título y la descripción proporcionados. Asegúrate de que el contenido sea de alta calidad, esté bien estructurado, se alinee perfectamente con el tono de voz y el público objetivo de la marca, y sea original y valioso. Devuelve únicamente el texto del contenido generado, listo para ser copiado y pegado. Usa formato Markdown para una mejor legibilidad (encabezados, listas, negritas, etc.).`;

    return await generateContent(prompt);
};

export const generateCopywritingVariations = async (
    originalText: string,
    tone: string,
    numVariations: number,
    context?: string
): Promise<{ variations: string[] }> => {
    const prompt = `Eres un experto copywriter y estratega de comunicación. Tu tarea es reescribir un texto para mejorar su claridad, impacto y engagement, siguiendo un tono específico.

    **Texto Original:**
    "${originalText}"

    **Instrucciones:**
    1.  Adopta un tono **${tone}**.
    2.  Genera **${numVariations}** variaciones diferentes del texto original.
    3.  ${context ? `Ten en cuenta el siguiente contexto adicional: "${context}"` : 'El objetivo es de propósito general.'}
    4.  Asegúrate de que cada variación sea única y ofrezca una perspectiva ligeramente diferente o una mejor redacción.
    5.  Devuelve el resultado únicamente en el formato JSON especificado, sin texto introductorio ni explicaciones adicionales.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            variations: {
                type: Type.ARRAY,
                description: `Una lista de ${numVariations} variaciones del texto.`,
                items: {
                    type: Type.STRING
                }
            }
        },
        required: ["variations"]
    };

    return await generateJsonContent(prompt, schema);
};
