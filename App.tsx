import React, { useState, useCallback } from 'react';
import { BrandProject, BrandData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import ProjectList from './components/ProjectList';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ProjectView from './components/ProjectView';
import Copywriter from './components/Copywriter';

type View = 'welcome' | 'projectList' | 'tools';

const App: React.FC = () => {
    const [projects, setProjects] = useLocalStorage<BrandProject[]>('brand-projects', []);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [view, setView] = useState<View>('welcome');

    const handleCreateProject = () => {
        const newProject: BrandProject = {
            id: `brand-${Date.now()}`,
            name: `Nuevo Proyecto Manual ${projects.filter(p => p.name.startsWith("Nuevo Proyecto Manual")).length + 1}`,
            createdAt: new Date().toISOString(),
            data: {},
        };
        setProjects([...projects, newProject]);
        setSelectedProjectId(newProject.id);
    };
    
    const handleBrandGenerated = (data: BrandData) => {
        const newProject: BrandProject = {
            id: `brand-${Date.now()}`,
            name: `Proyecto IA - ${data.purpose?.substring(0, 25) || 'Concepto'}...`,
            createdAt: new Date().toISOString(),
            data: data,
        };
        setProjects(prev => [...prev, newProject]);
        setSelectedProjectId(newProject.id);
    };

    const handleSelectProject = (id: string) => {
        setSelectedProjectId(id);
        setView('welcome'); // Reset view so project view takes precedence
    };

    const handleDeleteProject = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            const updatedProjects = projects.filter(p => p.id !== id);
            setProjects(updatedProjects);
            if (selectedProjectId === id) {
                setSelectedProjectId(null);
            }
        }
    };
    
    const handleUpdateProject = useCallback((updatedProject: BrandProject) => {
        setProjects(prevProjects => 
            prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
        );
    }, [setProjects]);

    const handleGoHome = () => {
        setSelectedProjectId(null);
        setView('projectList');
    };
    
    const handleGoToTools = () => {
        setSelectedProjectId(null);
        setView('tools');
    };

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    const renderContent = () => {
        if (selectedProject) {
            return <ProjectView project={selectedProject} onUpdateProject={handleUpdateProject} />;
        }
        switch (view) {
            case 'projectList':
                return <ProjectList 
                    projects={projects} 
                    onCreateProject={handleCreateProject} 
                    onSelectProject={handleSelectProject}
                    onDeleteProject={handleDeleteProject}
                />;
            case 'tools':
                return <Copywriter />;
            case 'welcome':
            default:
                return <WelcomeScreen 
                    onNavigateToManual={() => setView('projectList')}
                    onBrandGenerated={handleBrandGenerated}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark">
            <Header onGoHome={handleGoHome} onGoToTools={handleGoToTools} showHomeButton={!!selectedProject || view === 'projectList' || view === 'tools'} />
            <main className="container mx-auto px-4 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;