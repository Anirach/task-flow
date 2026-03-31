import React, { useState } from 'react';
import { User, Lock, Sun, Moon, Save, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { useThemeStore } from '../store/useThemeStore';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import * as api from '../lib/api';

export const Settings: React.FC = () => {
  const { currentUser, updateProfile } = useTaskStore();
  const { theme, setTheme } = useThemeStore();

  // Profile form
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await updateProfile({ name, role });
      setProfileMsg('Profile updated');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(''), 3000);
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError('');
    setPasswordMsg('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.auth.changePassword({ currentPassword, newPassword });
      setPasswordMsg('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
      setTimeout(() => setPasswordMsg(''), 3000);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary-dark mb-2">Settings</h1>
      <p className="text-text-secondary mb-8">Manage your account and preferences</p>

      {/* Profile Section */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-primary-dark">Profile</h2>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
          <div>
            <p className="font-bold text-text-primary">{currentUser.name}</p>
            <p className="text-sm text-text-secondary">{currentUser.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Email</label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border rounded-lg p-2.5 text-sm text-text-secondary cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          {profileMsg && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 size={14} /> {profileMsg}
            </span>
          )}
          <div className="ml-auto">
            <Button onClick={handleProfileSave} isLoading={profileSaving} disabled={!name.trim()} className="gap-2">
              <Save size={16} />
              Save Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Password Section */}
      <section className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-primary-dark">Change Password</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {passwordError && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
        )}

        <div className="flex items-center justify-between mt-6">
          {passwordMsg && (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 size={14} /> {passwordMsg}
            </span>
          )}
          <div className="ml-auto">
            <Button
              onClick={handlePasswordSave}
              isLoading={passwordSaving}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="gap-2"
            >
              <Lock size={16} />
              Update Password
            </Button>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sun size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-primary-dark">Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-text-primary">Theme</p>
            <p className="text-xs text-text-secondary">Choose light or dark mode</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sun size={16} />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Moon size={16} />
              Dark
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
