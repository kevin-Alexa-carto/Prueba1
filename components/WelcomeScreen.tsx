import React, { useState, useRef } from 'react';
import { BrandData } from '../types';
import { generateFullBrandStrategy } from '../services/geminiService';
import Loader from './Loader';

interface WelcomeScreenProps {
    onNavigateToManual: () => void;
    onBrandGenerated: (data: BrandData) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the "data:mime/type;base64," part
            resolve(result.split(',')[1]); 
        };
        reader.onerror = error => reject(error);
    });
};


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigateToManual, onBrandGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Por favor, introduce una descripción para tu marca.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            let logoContent: {mimeType: string, data: string} | undefined;
            if (logoFile) {
                const base64Data = await fileToBase64(logoFile);
                logoContent = { mimeType: logoFile.type, data: base64Data };
            }

            const result = await generateFullBrandStrategy(prompt, logoContent, pdfFile?.name, websiteUrl);
            onBrandGenerated(result);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al generar la marca.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fade-in text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">Da Vida a tu Marca con IA</h1>
            <p className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto">
                Elige cómo quieres empezar. Genera una estrategia completa automáticamente o construye tu marca paso a paso.
            </p>

            <div className="grid md:grid-cols-5 gap-8 max-w-6xl mx-auto">
                {/* Automatic Generation Card */}
                <div className="md:col-span-3 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg p-6 md:p-8 text-left">
                    <h2 className="text-2xl font-bold text-brand-primary mb-1">Generación Automática con IA</h2>
                    <p className="text-slate-400 mb-6">Describe tu idea y deja que la IA cree una base sólida para tu marca.</p>

                    <div className="space-y-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej: Soy un coach de vida para profesionales de la tecnología que se especializa en la prevención del agotamiento..."
                            rows={5}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                            aria-label="Descripción de la marca"
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Logo (Opcional)</label>
                                <button onClick={() => logoInputRef.current?.click()} className="w-full text-left bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-400 truncate">
                                    <i className="fas fa-upload mr-2"></i>
                                    {logoFile ? logoFile.name : 'Subir imagen...'}
                                </button>
                                <input type="file" ref={logoInputRef} onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="hidden" accept="image/*"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Documento (Opcional)</label>
                                <button onClick={() => pdfInputRef.current?.click()} className="w-full text-left bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-400 truncate">
                                   <i className="fas fa-file-pdf mr-2"></i>
                                   {pdfFile ? pdfFile.name : 'Subir PDF...'}
                                </button>
                                 <input type="file" ref={pdfInputRef} onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf"/>
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Sitio Web (Opcional)</label>
                             <input
                                type="url"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                placeholder="https://ejemplo.com"
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors"
                                aria-label="URL del sitio web"
                            />
                        </div>

                        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md text-sm">{error}</div>}

                        <button 
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-slate-600 disabled:cursor-not-allowed text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader />
                                    <span>Generando Estrategia...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-magic"></i>
                                    <span>Generar Marca Completa</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Manual Creation Card */}
                <div className="md:col-span-2 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-800 hover:border-brand-secondary hover:text-brand-secondary transition-all duration-300 cursor-pointer" onClick={onNavigateToManual}>
                     <i className="fas fa-folder-open text-5xl mb-4"></i>
                     <h2 className="text-2xl font-bold mb-2">Creación Manual</h2>
                     <p>Gestiona tus proyectos existentes o empieza un nuevo borrador desde cero.</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
