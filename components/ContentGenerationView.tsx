import React, { useState, useEffect } from 'react';
import { BrandProject, ContentIdea } from '../types';
import { generateFullContentFromIdea } from '../services/geminiService';
import Loader from './Loader';

interface ContentGenerationViewProps {
    project: BrandProject;
    ideas: ContentIdea[];
    onBack: () => void;
}

const ContentGenerationView: React.FC<ContentGenerationViewProps> = ({ project, ideas, onBack }) => {
    const [generatedContents, setGeneratedContents] = useState<Map<string, string>>(new Map());
    const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map(ideas.map(idea => [idea.id, true])));
    const [error, setError] = useState<string | null>(null);
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const generateAll = async () => {
            setError(null);
            for (const idea of ideas) {
                try {
                    const content = await generateFullContentFromIdea(project, idea);
                    setGeneratedContents(prev => new Map(prev).set(idea.id, content));
                } catch (err: any) {
                    setError(`Error al generar contenido para "${idea.title}": ${err.message}`);
                    setGeneratedContents(prev => new Map(prev).set(idea.id, `No se pudo generar el contenido. ${err.message}`));
                } finally {
                    setLoadingStates(prev => new Map(prev).set(idea.id, false));
                }
            }
        };

        generateAll();
    }, [ideas, project]);
    
    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedStates(prev => ({ ...prev, [id]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [id]: false }));
            }, 2000);
        });
    };

    const allDone = Array.from(loadingStates.values()).every(v => !v);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-bold">Contenido Generado por IA</h2>
                    <p className="text-slate-400">
                        {allDone ? `Se ha generado contenido para ${ideas.length} idea(s).` : `Generando contenido para ${ideas.length} idea(s)...`}
                    </p>
                </div>
                <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                    <i className="fas fa-arrow-left"></i>
                    <span>Volver al Calendario</span>
                </button>
            </div>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-6">{error}</div>}
            
            <div className="space-y-6">
                {ideas.map(idea => (
                    <div key={idea.id} className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-brand-text">{idea.title}</h3>
                                <p className="text-sm text-brand-secondary font-semibold">{idea.contentType}</p>
                            </div>
                            {loadingStates.get(idea.id) && <Loader />}
                        </div>
                        <div className="p-6 relative">
                            <pre className="whitespace-pre-wrap font-sans text-brand-text leading-relaxed">
                                {generatedContents.get(idea.id) || 'Generando...'}
                            </pre>
                             {!loadingStates.get(idea.id) && generatedContents.has(idea.id) && (
                                <button
                                    onClick={() => handleCopy(idea.id, generatedContents.get(idea.id) || '')}
                                    className="absolute top-4 right-4 bg-slate-700 hover:bg-brand-primary text-white text-xs font-bold py-1 px-3 rounded-full transition-colors flex items-center gap-2"
                                >
                                    <i className={`fas ${copiedStates[idea.id] ? 'fa-check' : 'fa-copy'}`}></i>
                                    <span>{copiedStates[idea.id] ? 'Copiado!' : 'Copiar'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentGenerationView;
