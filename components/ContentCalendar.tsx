import React, { useState, useMemo } from 'react';
import { BrandProject, ContentIdea } from '../types';
import { generateContentCalendar } from '../services/geminiService';
import Loader from './Loader';
import ContentGenerationView from './ContentGenerationView';

interface ContentCalendarProps {
    project: BrandProject;
}

const CONTENT_TYPE_STYLES: { [key: string]: { icon: string; color: string; bgColor: string } } = {
    'Blog': { icon: 'fas fa-pen-to-square', color: 'border-l-blue-400', bgColor: 'bg-blue-900/20' },
    'Social Media': { icon: 'fas fa-share-nodes', color: 'border-l-green-400', bgColor: 'bg-green-900/20' },
    'Email': { icon: 'fas fa-envelope', color: 'border-l-yellow-400', bgColor: 'bg-yellow-900/20' },
    'Video': { icon: 'fas fa-video', color: 'border-l-red-400', bgColor: 'bg-red-900/20' },
    'Podcast': { icon: 'fas fa-podcast', color: 'border-l-purple-400', bgColor: 'bg-purple-900/20' },
    'Default': { icon: 'fas fa-lightbulb', color: 'border-l-slate-400', bgColor: 'bg-slate-700/20' },
};

const ContentCalendar: React.FC<ContentCalendarProps> = ({ project }) => {
    const [view, setView] = useState<'calendar' | 'generation'>('calendar');
    const [ideasToGenerate, setIdeasToGenerate] = useState<ContentIdea[]>([]);
    const [strategy, setStrategy] = useState({
        month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        niche: project.data.purpose || '',
        objective: 'Lead Generation',
        keywords: project.data.contentPillars || '',
    });
    const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
    const [selectedIdeas, setSelectedIdeas] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStrategyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStrategy(prev => ({ ...prev, [name]: value }));
    };
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setSelectedIdeas(new Set());
        try {
            const result = await generateContentCalendar(project, {
                ...strategy,
                month: new Date(strategy.month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })
            });
            const ideasWithIds = (result.contentIdeas || []).map((idea, index) => ({
                ...idea,
                id: `idea-${Date.now()}-${index}`
            }));
            setContentIdeas(ideasWithIds);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al generar el calendario.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setStrategy({
            month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
            niche: project.data.purpose || '',
            objective: 'Lead Generation',
            keywords: project.data.contentPillars || '',
        });
        setContentIdeas([]);
        setSelectedIdeas(new Set());
        setError(null);
    }

    const handleSelectIdea = (id: string) => {
        const newSelection = new Set(selectedIdeas);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIdeas(newSelection);
    };

    const handleCreateContent = (ideas: ContentIdea[]) => {
        if (ideas.length > 0) {
            setIdeasToGenerate(ideas);
            setView('generation');
        }
    }

    const handleCreateSelected = () => {
        const ideas = contentIdeas.filter(idea => selectedIdeas.has(idea.id));
        handleCreateContent(ideas);
    };

    const calendarData = useMemo(() => {
        const [year, month] = strategy.month.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfWeek = 0; // 0 for Sunday
        const dayOfWeek = date.getDay();
        const paddingDays = (dayOfWeek - firstDayOfWeek + 7) % 7;
        
        const days = Array.from({ length: paddingDays }, () => null);
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    }, [strategy.month]);

    const monthName = new Date(strategy.month + '-02').toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    if (view === 'generation') {
        return <ContentGenerationView 
            project={project} 
            ideas={ideasToGenerate} 
            onBack={() => setView('calendar')}
        />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-fit">
                <h3 className="text-2xl font-bold mb-6">Estrategia de Contenido</h3>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="month" className="block text-sm font-medium text-slate-300 mb-1">Mes</label>
                        <input type="month" id="month" name="month" value={strategy.month} onChange={handleStrategyChange} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                    </div>
                     <div>
                        <label htmlFor="niche" className="block text-sm font-medium text-slate-300 mb-1">Industria / Nicho</label>
                        <input type="text" id="niche" name="niche" value={strategy.niche} onChange={handleStrategyChange} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-1">Público Objetivo</label>
                        <textarea id="targetAudience" name="targetAudience" value={project.data.targetAudience || ''} readOnly rows={3} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 cursor-not-allowed text-slate-400"/>
                    </div>
                     <div>
                        <label htmlFor="objective" className="block text-sm font-medium text-slate-300 mb-1">Objetivo de Marketing</label>
                        <select id="objective" name="objective" value={strategy.objective} onChange={handleStrategyChange} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                            <option>Lead Generation</option>
                            <option>Brand Awareness</option>
                            <option>Engagement</option>
                            <option>Sales Conversion</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="toneOfVoice" className="block text-sm font-medium text-slate-300 mb-1">Tono de Voz</label>
                         <input type="text" id="toneOfVoice" name="toneOfVoice" value={project.data.toneOfVoice || ''} readOnly className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 cursor-not-allowed text-slate-400"/>
                    </div>
                     <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-1">Temas y Palabras Clave</label>
                        <textarea id="keywords" name="keywords" value={strategy.keywords} onChange={handleStrategyChange} rows={3} className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                    </div>
                    {error && <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded-md">{error}</div>}
                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                        <button onClick={handleReset} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Resetear</button>
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-slate-500">
                            {isLoading ? <><Loader/> Generando...</> : 'Generar Calendario'}
                        </button>
                    </div>
                </div>
            </aside>

            <main className="lg:col-span-9">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold capitalize">{monthName}</h2>
                    <div className="flex gap-2">
                        <button onClick={handleCreateSelected} disabled={selectedIdeas.size === 0} className="bg-brand-secondary hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed">
                            <i className="fas fa-check-square"></i>
                            <span>Crear Seleccionados ({selectedIdeas.size})</span>
                        </button>
                        <button onClick={() => handleCreateContent(contentIdeas)} disabled={contentIdeas.length === 0} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed">
                             <i className="fas fa-layer-group"></i>
                            <span>Crear Todos ({contentIdeas.length})</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
                    {weekDays.map(day => <div key={day} className="text-center font-bold text-slate-400 py-2">{day}</div>)}
                    
                    {calendarData.map((day, index) => (
                        <div key={index} className="bg-slate-800 rounded-md min-h-[120px] p-1.5 border border-transparent space-y-1">
                            {day && <span className="text-sm font-semibold text-slate-300 ml-1">{day}</span>}
                            {contentIdeas.filter(idea => idea.day === day).map((idea) => {
                                const style = CONTENT_TYPE_STYLES[idea.contentType] || CONTENT_TYPE_STYLES.Default;
                                return (
                                    <div key={idea.id} className="relative group">
                                        <div className={`p-2 rounded-md border-l-4 ${style.color} ${style.bgColor} text-left`}>
                                            <div className="flex items-start justify-between">
                                                <div className="text-xs font-bold mb-1 opacity-80 flex items-center gap-1.5">
                                                    <i className={style.icon}></i>
                                                    <span>{idea.contentType}</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIdeas.has(idea.id)}
                                                    onChange={() => handleSelectIdea(idea.id)}
                                                    className="form-checkbox h-4 w-4 bg-slate-700 border-slate-500 text-brand-primary rounded focus:ring-brand-primary"
                                                />
                                            </div>
                                            <p className="text-xs font-semibold text-brand-text mb-1 leading-tight">{idea.title}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button onClick={() => handleCreateContent([idea])} className="bg-white/90 hover:bg-white text-slate-900 font-bold text-xs py-1 px-3 rounded-full">
                                                Crear Contenido
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ContentCalendar;