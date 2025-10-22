
import React from 'react';
import { VisualIdentity } from '../types';

interface VisualIdentityDisplayProps {
    data?: VisualIdentity;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700">
        <h4 className="font-semibold text-brand-secondary mb-2">{title}</h4>
        <div className="text-slate-300 space-y-1">{children}</div>
    </div>
);

const VisualIdentityDisplay: React.FC<VisualIdentityDisplayProps> = ({ data }) => {
    if (!data) {
        return <div className="text-slate-400 p-4 border-2 border-dashed border-slate-600 rounded-lg">Genera una identidad visual para ver los resultados aquí.</div>;
    }

    return (
        <div className="space-y-6">
            <InfoCard title="Concepto del Logotipo">
                <p>{data.logoConcept}</p>
            </InfoCard>

            <div>
                <h4 className="font-semibold text-brand-secondary mb-2 text-lg">Paleta de Colores</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {data.colorPalette?.map(color => (
                        <div key={color.hex} className="border border-slate-700 rounded-lg overflow-hidden">
                            <div className="h-20" style={{ backgroundColor: color.hex }}></div>
                            <div className="p-3 bg-slate-900/70">
                                <p className="font-bold text-white">{color.name}</p>
                                <p className="text-sm text-slate-300 font-mono">{color.hex}</p>
                                <p className="text-xs text-slate-400 mt-1">{color.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                 <InfoCard title="Tipografía Primaria (Títulos)">
                    <p className="text-2xl" style={{ fontFamily: data.primaryTypography?.fontFamily }}>{data.primaryTypography?.fontFamily}</p>
                    <p className="text-sm">{data.primaryTypography?.description}</p>
                </InfoCard>
                <InfoCard title="Tipografía Secundaria (Cuerpo)">
                    <p style={{ fontFamily: data.secondaryTypography?.fontFamily }}>{data.secondaryTypography?.fontFamily}</p>
                     <p className="text-sm">{data.secondaryTypography?.description}</p>
                </InfoCard>
            </div>
            
            <InfoCard title="Estilo Fotográfico">
                <p>{data.photographyStyle}</p>
            </InfoCard>
        </div>
    );
};

export default VisualIdentityDisplay;
