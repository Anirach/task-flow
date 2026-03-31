import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const progress = project.taskCount > 0 
    ? Math.round((project.completedCount / project.taskCount) * 100) 
    : 0;

  return (
    <Link to={`/projects/${project.id}/board`} className="card p-5 group">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20"
          style={{ backgroundColor: project.color }}
        >
          {project.name[0]}
        </div>
        <div className="flex items-center gap-1 text-text-secondary text-xs font-medium">
          <CheckCircle2 size={14} className="text-green-500" />
          <span>{project.completedCount}/{project.taskCount} Tasks</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-primary-dark mb-1 group-hover:text-primary transition-colors">
        {project.name}
      </h3>
      <p className="text-sm text-text-secondary line-clamp-2 mb-6 h-10">
        {project.description}
      </p>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-text-secondary uppercase tracking-wider">Progress</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <ProgressBar progress={progress} color={project.color} />
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.memberIds.slice(0, 3).map((id, i) => (
            <div 
              key={id} 
              className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden"
            >
              <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="Member" referrerPolicy="no-referrer" />
            </div>
          ))}
          {project.memberIds.length > 3 && (
            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-text-secondary">
              +{project.memberIds.length - 3}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <Users size={14} />
          <span className="text-xs font-medium">{project.memberIds.length} members</span>
        </div>
      </div>
    </Link>
  );
};
