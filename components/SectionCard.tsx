
import React, { useState } from 'react';
import { BrandData, VisualIdentity } from '../types';
import { generateBrandIdeas, generateVisualIdentity } from '../services/geminiService';
import Loader from './Loader';
import VisualIdentityDisplay from './VisualIdentityDisplay';

interface SectionCardProps {
    section: {
        id: string;
        title: string;
        description: string;
        fields: { id: string; label: string; placeholder: string; type: string; isGenerated?: boolean }[];
    };
    projectData: Partial<BrandData>;
    onDataChange: (field: keyof BrandData, value: any) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, projectData, onDataChange }) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleGenerate = async (fieldId: string) => {
        setLoadingStates(prev => ({ ...prev, [fieldId]: true }));
        setError(null);
        try {
            let result;
            if (fieldId === 'visualIdentity') {
                 result = await generateVisualIdentity(projectData);
            } else {
                 result = await generateBrandIdeas(fieldId, projectData);
            }
            onDataChange(fieldId as keyof BrandData, result);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error');
        } finally {
            setLoadingStates(prev => ({ ...prev, [fieldId]: false }));
        }
    };
    
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg transition-all duration-300">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full text-left p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-brand-text">{section.title}</h3>
                    <p className="text-slate-400">{section.description}</p>
                </div>
                <i className={`fas fa-chevron-down text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}></i>
            </button>
            
            {!isCollapsed && (
                <div className="p-6 border-t border-slate-700 space-y-6">
                {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md">{error}</div>}
                
                {section.fields.map(field => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="block text-lg font-semibold mb-2 text-brand-text">{field.label}</label>
                        {field.type === 'textarea' && (
                            <textarea
                                id={field.id}
                                value={(projectData[field.id as keyof BrandData] as string) || ''}
                                onChange={(e) => onDataChange(field.id as keyof BrandData, e.target.value)}
                                placeholder={field.placeholder}
                                rows={5}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                            />
                        )}

                        {field.type === 'visual' && (
                            <VisualIdentityDisplay data={projectData.visualIdentity as VisualIdentity | undefined} />
                        )}

                        {field.isGenerated && (
                            <button
                                onClick={() => handleGenerate(field.id)}
                                disabled={loadingStates[field.id]}
                                className="mt-3 bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                {loadingStates[field.id] ? (
                                    <>
                                        <Loader />
                                        <span>Generando...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-magic"></i>
                                        <span>Generar con IA</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default SectionCard;
