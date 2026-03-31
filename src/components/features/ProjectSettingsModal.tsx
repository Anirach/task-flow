import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Project } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { Trash2 } from 'lucide-react';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  project 
}) => {
  const { updateProject, deleteProject } = useTaskStore();
  const [name, setName] = useState(project.name);
  const [color, setColor] = useState(project.color);
  const [description, setDescription] = useState(project.description);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(project.name);
      setColor(project.color);
      setDescription(project.description);
      setIsDeleting(false);
    }
  }, [isOpen, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProject(project.id, {
      name,
      color,
      description,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? All tasks will be permanently removed.')) {
      deleteProject(project.id);
      onClose();
    }
  };

  const colors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#6366F1', // Indigo
    '#22C55E', // Green
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Settings"
      footer={
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            className="text-priority-high hover:bg-red-50"
            onClick={() => setIsDeleting(true)}
          >
            <Trash2 size={18} className="mr-2" />
            Delete Project
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>Save Changes</Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border border-border rounded-lg py-2 px-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            placeholder="e.g. Website Redesign"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Project Color</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-border rounded-lg py-2 px-4 outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all h-24 resize-none"
            placeholder="What is this project about?"
          />
        </div>
      </form>

      {isDeleting && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-8 z-50 rounded-2xl">
          <div className="text-center max-w-xs">
            <div className="w-16 h-16 rounded-full bg-red-100 text-priority-high flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">Delete Project?</h3>
            <p className="text-sm text-text-secondary mb-6">
              This action cannot be undone. All tasks associated with this project will be lost.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleting(false)}>Cancel</Button>
              <Button className="flex-1 bg-priority-high hover:bg-red-700" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
