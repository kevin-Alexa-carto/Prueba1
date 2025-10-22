import React, { useState, useEffect } from 'react';
import { BrandProject, CopywriterHistoryItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateCopywritingVariations } from '../services/geminiService';
import Loader from './Loader';

interface CopywriterProps {
    project?: BrandProject;
}

const TONES = [ "Profesional", "Amistoso", "Persuasivo", "Divertido", "Informativo", "Empático", "Urgente", "Lujoso" ];

const ResultCard: React.FC<{ text: string; onCopy: () => void; isCopied: boolean }> = ({ text, onCopy, isCopied }) => (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 relative group">
        <p className="text-brand-text whitespace-pre-wrap">{text}</p>
        <button 
            onClick={onCopy}
            className="absolute top-2 right-2 bg-slate-700 hover:bg-brand-primary text-white text-xs font-bold py-1 px-3 rounded-full transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100"
        >
             <i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
             <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
        </button>
    </div>
);

const Copywriter: React.FC<CopywriterProps> = ({ project }) => {
    const [originalText, setOriginalText] = useState('');
    const [tone, setTone] = useState(project?.data?.toneOfVoice?.split(',')[0].trim() || TONES[0]);
    const [numVariations, setNumVariations] = useState(3);
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<string[]>([]);
    const [history, setHistory] = useLocalStorage<CopywriterHistoryItem[]>('copywriter-history', []);
    const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (project?.data?.toneOfVoice) {
            const projectTone = project.data.toneOfVoice.split(',')[0].trim();
            if (TONES.includes(projectTone)) {
                setTone(projectTone);
            }
        }
        if (project) {
            const projectContext = [
                project.data.targetAudience ? `Público Objetivo: ${project.data.targetAudience}` : '',
                project.data.values ? `Valores: ${project.data.values}` : '',
                project.data.brandPromise ? `Promesa de Marca: ${project.data.brandPromise}`: ''
            ].filter(Boolean).join('\n');
            setContext(projectContext);
        }
    }, [project]);

    const handleGenerate = async () => {
        if (!originalText.trim()) {
            setError('Por favor, introduce el texto que quieres mejorar.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults([]);
        try {
            const response = await generateCopywritingVariations(originalText, tone, numVariations, context);
            setResults(response.variations);
            const newHistoryItem: CopywriterHistoryItem = {
                id: `copy-${Date.now()}`,
                timestamp: new Date().toISOString(),
                originalText,
                tone,
                context,
                variations: response.variations
            };
            setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]); // Keep history to 50 items
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al generar las variaciones.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHistoryClick = (item: CopywriterHistoryItem) => {
        setOriginalText(item.originalText);
        setTone(item.tone);
        setContext(item.context || '');
        setResults(item.variations);
    };
    
    const handleDeleteHistoryItem = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setHistory(prev => prev.filter(item => item.id !== id));
    }
    
    const handleCopy = (index: number, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedStates({ [index]: true });
            setTimeout(() => setCopiedStates({ [index]: false }), 2000);
        });
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
            <main className="lg:col-span-8 space-y-6">
                 <div>
                    <h2 className="text-4xl font-bold">Asistente de Copywriting IA</h2>
                    <p className="text-slate-400 mt-1">
                        Refina tu mensaje. Introduce un texto y genera variaciones pulidas con el tono perfecto.
                    </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
                    <textarea
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        placeholder="Escribe aquí el texto que quieres mejorar o reescribir..."
                        rows={6}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1">Tono de Voz</label>
                            <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2.5 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="numVariations" className="block text-sm font-medium text-slate-300 mb-1">Nº de Variaciones</label>
                            <input type="number" id="numVariations" value={numVariations} onChange={(e) => setNumVariations(Math.max(1, Math.min(5, parseInt(e.target.value, 10))))} min="1" max="5" className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="context" className="block text-sm font-medium text-slate-300 mb-1">Contexto Adicional (Opcional)</label>
                        <textarea
                            id="context"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Ej: El público son desarrolladores. El objetivo es que se registren a un webinar."
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                        />
                    </div>
                    {error && <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded-md">{error}</div>}
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg disabled:bg-slate-500">
                        {isLoading ? <><Loader /> Generando...</> : <><i className="fas fa-magic-wand-sparkles"></i> Mejorar Texto</>}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">Resultados</h3>
                        {results.map((result, index) => (
                            <ResultCard key={index} text={result} onCopy={() => handleCopy(index, result)} isCopied={!!copiedStates[index]}/>
                        ))}
                    </div>
                )}
            </main>

            <aside className="lg:col-span-4 bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-fit self-start">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold">Historial</h3>
                     <button onClick={() => { if(confirm('¿Seguro que quieres borrar el historial?')) setHistory([])}} disabled={history.length === 0} className="text-slate-400 hover:text-red-500 text-sm disabled:text-slate-600 disabled:cursor-not-allowed">Limpiar</button>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {history.length > 0 ? history.map(item => (
                        <div key={item.id} onClick={() => handleHistoryClick(item)} className="bg-slate-900/60 p-3 rounded-lg cursor-pointer hover:bg-slate-700/80 group relative">
                            <p className="text-sm font-semibold truncate text-brand-text">{item.originalText}</p>
                            <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                            <button onClick={(e) => handleDeleteHistoryItem(e, item.id)} className="absolute top-1 right-1 text-slate-500 hover:text-red-500 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    )) : <p className="text-sm text-slate-500 text-center py-4">No hay historial de generaciones.</p>}
                </div>
            </aside>
        </div>
    );
};

export default Copywriter;
