import {
  Bell,
  Building2,
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  Moon,
  Search,
  Shield,
  Sparkles,
  Sun,
  User,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

export default function Navbar({ unreadNotifications, setUnreadNotifications, theme, setTheme, isMobileOpen, setIsMobileOpen }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isActive = true;

    async function loadNotifications() {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (isActive && response.ok) {
          setNotifications(data.notifications || []);
          setUnreadNotifications(data.unreadCount || 0);
        }
      } catch {
        if (isActive) {
          setNotifications([]);
          setUnreadNotifications(0);
        }
      }
    }

    loadNotifications();
    const refreshId = window.setInterval(loadNotifications, 60000);
    return () => {
      isActive = false;
      window.clearInterval(refreshId);
    };
  }, [user?.token, setUnreadNotifications]);

  const markNotificationsRead = async () => {
    if (!user?.token || unreadNotifications === 0) return;
    setUnreadNotifications(0);
    setNotifications((currentNotifications) => currentNotifications.map((notification) => ({ ...notification, isRead: true })));
    try {
      await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } catch {
      // The next background refresh restores the server state if needed.
    }
  };

  const formatNotificationTime = (dateValue) => {
    const elapsedMinutes = Math.max(0, Math.round((Date.now() - new Date(dateValue).getTime()) / 60000));
    if (elapsedMinutes < 1) return 'Just now';
    if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
    if (elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)} hr ago`;
    return `${Math.floor(elapsedMinutes / 1440)} days ago`;
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return {
          label: 'STUDENT',
          bg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
          icon: GraduationCap
        };
      case 'company':
        return {
          label: 'RECRUITER',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          icon: Building2
        };
      case 'admin':
        return {
          label: 'TPO ADMIN',
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          icon: Shield
        };
      default:
        return {
          label: 'USER',
          bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
          icon: User
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-3">
      <div className="flex items-center justify-between">
        
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors border border-slate-700/50 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="solid-primary p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">Career<span className="solid-accent">Forge</span></span>
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Campus Placement & Career Hub</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center bg-slate-900/60 border border-slate-700/60 rounded-xl px-3.5 py-1.5 w-72 lg:w-96 focus-within:border-indigo-500 transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input 
            type="text" 
            placeholder="Search jobs, skills, candidates..." 
            className="bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Right Section: Role Tag, Theme Toggle, Profile Menu */}
        <div className="flex items-center space-x-3">
          
          {/* Active Role Indicator Badge */}
          <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${roleInfo.bg}`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{roleInfo.label}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
                markNotificationsRead();
              }}
              className="relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors border border-slate-700/50"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" /> Notifications
                  </h4>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {notifications.length === 0 && (
                    <p className="py-6 text-center text-xs text-slate-400">No notifications yet.</p>
                  )}
                  {notifications.map(notification => (
                    <div key={notification._id} className={`p-2.5 rounded-xl border transition-colors ${notification.isRead ? 'bg-slate-800/40 border-slate-700/40' : 'bg-indigo-500/10 border-indigo-500/30'}`}>
                      <div className="flex items-start justify-between">
                        <h5 className="text-xs font-semibold text-white">{notification.title}</h5>
                        <span className="text-[10px] text-slate-500">{formatNotificationTime(notification.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors border border-slate-700/50"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Profile Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-xl ${user?.avatarBg || 'bg-indigo-600'} flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0`}>
                {user?.initials || 'US'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize truncate max-w-[120px]">
                  {user?.role === 'company' ? user?.companyName || 'Recruiter' : user?.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                {/* User Summary Header */}
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-9 h-9 rounded-xl ${user?.avatarBg || 'bg-indigo-600'} flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0`}>
                      {user?.initials || 'US'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                      <span className={`inline-block mt-1 px-1.5 py-0.2 text-[9px] font-bold rounded border ${roleInfo.bg}`}>
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full mt-1 flex items-center justify-between px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </span>
                  <span className="text-[10px] text-rose-500/80 font-mono">End Session</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
