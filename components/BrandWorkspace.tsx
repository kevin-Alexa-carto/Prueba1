import React from 'react';
import { BrandProject, BrandData } from '../types';
import { SECTIONS } from '../constants';
import SectionCard from './SectionCard';

interface BrandWorkspaceProps {
    project: BrandProject;
    onUpdateProject: (project: BrandProject) => void;
}

const BrandWorkspace: React.FC<BrandWorkspaceProps> = ({ project, onUpdateProject }) => {

    const handleDataChange = (field: keyof BrandData, value: any) => {
        const updatedProject = {
            ...project,
            data: {
                ...project.data,
                [field]: value,
            },
        };
        onUpdateProject(updatedProject);
    };

    return (
        <div className="space-y-8">
            <div>
                <p className="text-slate-400 mt-1">
                    Estás trabajando en tu proyecto de marca. Completa cada sección para construir una identidad sólida.
                </p>
            </div>
            
            <div className="space-y-6">
                {SECTIONS.map(section => (
                    <SectionCard
                        key={section.id}
                        section={section}
                        projectData={project.data}
                        onDataChange={handleDataChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default BrandWorkspace;