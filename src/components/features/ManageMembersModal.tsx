import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Project, User } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { Avatar } from '../ui/Avatar';
import { Search, Check, Plus, X } from 'lucide-react';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ 
  isOpen, 
  onClose, 
  project 
}) => {
  const { users, updateProject } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');

  const projectMembers = users.filter(u => project.memberIds.includes(u.id));
  const nonMembers = users.filter(u => !project.memberIds.includes(u.id));

  const filteredNonMembers = nonMembers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (userId: string) => {
    const isMember = project.memberIds.includes(userId);
    let newMemberIds: string[];

    if (isMember) {
      newMemberIds = project.memberIds.filter(id => id !== userId);
    } else {
      newMemberIds = [...project.memberIds, userId];
    }

    updateProject(project.id, { memberIds: newMemberIds });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Project Members"
      size="md"
    >
      <div className="space-y-6">
        {/* Current Members */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center justify-between">
            Current Members
            <span className="text-xs font-medium text-text-secondary bg-slate-100 px-2 py-0.5 rounded-full">
              {projectMembers.length}
            </span>
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {projectMembers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-secondary">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleMember(user.id)}
                  className="p-1.5 text-text-secondary hover:text-priority-high hover:bg-red-50 rounded-md transition-all"
                  title="Remove from project"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Add New Members */}
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-3">Add Members</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-border rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {filteredNonMembers.length > 0 ? (
              filteredNonMembers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-3 gap-1.5"
                    onClick={() => toggleMember(user.id)}
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-text-secondary">No users found</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
};
