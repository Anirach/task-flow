import React from 'react';
import { format } from 'date-fns';
import { Bell, Check, MessageSquare, UserPlus, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { SlidePanel } from '../ui/SlidePanel';
import { Button } from '../ui/Button';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead } = useTaskStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_assigned': return <UserPlus size={16} className="text-primary" />;
      case 'comment_added': return <MessageSquare size={16} className="text-purple-500" />;
      case 'task_due_soon': return <AlertCircle size={16} className="text-priority-high" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Notifications">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start ${!notif.isRead ? 'bg-primary-light/30' : ''}`}
                >
                  <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-border">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary leading-snug mb-1">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">
                        {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                      </span>
                      {!notif.isRead && (
                        <button 
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <Check size={10} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Bell size={32} />
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1">All caught up!</h3>
              <p className="text-xs text-text-secondary">No new notifications at the moment.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border bg-slate-50">
          <Button variant="ghost" size="sm" className="w-full text-xs">Clear all notifications</Button>
        </div>
      </div>
    </SlidePanel>
  );
};
