import React from 'react';
import { BrandProject } from '../types';

interface ProjectListProps {
    projects: BrandProject[];
    onCreateProject: () => void;
    onSelectProject: (id: string) => void;
    onDeleteProject: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onCreateProject, onSelectProject, onDeleteProject }) => {
    
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onDeleteProject(id);
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-brand-text mb-2">Tus Proyectos de Marca</h2>
                <p className="text-lg text-slate-400">Selecciona un proyecto para continuar o crea uno nuevo para empezar desde cero.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <button 
                    onClick={onCreateProject}
                    className="border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-800 hover:border-brand-primary hover:text-brand-primary transition-all duration-300 min-h-[180px]"
                >
                    <i className="fas fa-plus-circle text-4xl mb-3"></i>
                    <span className="font-semibold text-lg">Crear Proyecto Manual</span>
                </button>
                {projects.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(project => (
                    <div 
                        key={project.id}
                        onClick={() => onSelectProject(project.id)}
                        className="bg-slate-800 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:shadow-brand-primary/20 hover:ring-2 hover:ring-brand-primary transition-all duration-300 flex flex-col justify-between min-h-[180px] relative group"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-brand-text mb-2">{project.name}</h3>
                            <p className="text-sm text-slate-400">
                                Creado: {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <button 
                            onClick={(e) => handleDelete(e, project.id)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Eliminar proyecto"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
