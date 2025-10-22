import React, { useState } from 'react';
import { BrandProject } from '../types';
import BrandWorkspace from './BrandWorkspace';
import ContentCalendar from './ContentCalendar';
import Copywriter from './Copywriter';

interface ProjectViewProps {
    project: BrandProject;
    onUpdateProject: (project: BrandProject) => void;
}

type ActiveTab = 'strategy' | 'content' | 'copywriter';

const ProjectView: React.FC<ProjectViewProps> = ({ project, onUpdateProject }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('strategy');
    const [projectName, setProjectName] = useState(project.name);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
    };

    const handleNameBlur = () => {
        if (projectName.trim() && projectName.trim() !== project.name) {
            onUpdateProject({ ...project, name: projectName.trim() });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNameBlur();
            (e.target as HTMLInputElement).blur();
        }
    };
    
    const TABS: { id: ActiveTab; label: string; icon: string }[] = [
        { id: 'strategy', label: 'Estrategia de Marca', icon: 'fas fa-compass' },
        { id: 'content', label: 'Creación de Contenido', icon: 'fas fa-calendar-alt' },
        { id: 'copywriter', label: 'Asistente de Copywriting', icon: 'fas fa-pencil-alt' },
    ];
    
    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                 <input 
                    type="text"
                    value={projectName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    onKeyDown={handleKeyDown}
                    className="text-4xl font-bold bg-transparent border-b-2 border-transparent focus:border-brand-primary focus:outline-none text-brand-text transition-colors w-full"
                    aria-label="Nombre del proyecto"
                />
            </div>
            
            <div className="border-b border-slate-700 mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-brand-primary text-brand-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 flex items-center`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            <i className={`${tab.icon} mr-2 w-5`}></i> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'strategy' && <BrandWorkspace project={project} onUpdateProject={onUpdateProject} />}
            {activeTab === 'content' && <ContentCalendar project={project} />}
            {activeTab === 'copywriter' && <Copywriter project={project} />}
        </div>
    );
};

export default ProjectView;