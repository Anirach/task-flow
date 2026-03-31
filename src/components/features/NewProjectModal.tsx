import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, users } = useTaskStore();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1A73E8');
  const [description, setDescription] = useState('');

  const colors = [
    '#1A73E8', // Blue
    '#6A1B9A', // Purple
    '#E65100', // Orange
    '#2E7D32', // Green
    '#C62828', // Red
    '#00838F', // Cyan
    '#F9A825', // Yellow
    '#37474F', // Blue Grey
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name,
      color,
      description,
      memberIds: [useTaskStore.getState().currentUser.id], // Start with current user
    });

    // Reset and close
    setName('');
    setDescription('');
    setColor('#1A73E8');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>Create Project</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Project Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Redesign"
            className="w-full bg-white border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Theme Color</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            className="w-full bg-white border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all h-24 resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
