import React from 'react';

interface HeaderProps {
    onGoHome: () => void;
    onGoToTools: () => void;
    showHomeButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, showHomeButton, onGoToTools }) => {
    
    const handleTitleClick = () => {
        // If we are already on a project, go to project list. Otherwise do nothing.
         if (showHomeButton) {
            onGoHome();
         }
    }
    
    return (
        <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleTitleClick}>
                    <i className="fas fa-brain text-3xl text-brand-primary"></i>
                    <h1 className="text-2xl font-bold text-brand-text">Asistente de Marca IA</h1>
                </div>
                <div className="flex items-center gap-4">
                     <button
                        onClick={onGoToTools}
                        className="bg-brand-secondary/90 hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        aria-label="Ir a herramientas de IA"
                    >
                        <i className="fas fa-magic-wand-sparkles"></i>
                        <span className="hidden sm:inline">Herramientas IA</span>
                    </button>
                    {showHomeButton && (
                        <button
                            onClick={onGoHome}
                            className="bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
                        >
                            <i className="fas fa-folder"></i>
                            <span className="hidden sm:inline">Mis Proyectos</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;