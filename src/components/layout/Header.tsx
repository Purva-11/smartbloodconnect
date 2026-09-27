import React, { useState } from 'react';
import {
  Sun, Moon, Bell, Globe, Home, Tent, AlertTriangle, Search,
  Brain, User2, Building2, ShieldCheck, Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/Badge';
import { initialNotifications } from '../../data/mockData';
import type { Language } from '../../translations';

type Section =
  | 'home' | 'camps' | 'emergency' | 'search'
  | 'intelligence' | 'donor' | 'org' | 'audit';

interface HeaderProps {
  activeSection: Section;
  onNavigate: (s: Section) => void;
  onLogout: () => void;
}

const NAV_INDIVIDUAL = [
  { id: 'home', label: 'Overview', icon: <Home size={15} /> },
  { id: 'camps', label: 'Camps', icon: <Tent size={15} /> },
  { id: 'emergency', label: 'Emergency', icon: <AlertTriangle size={15} /> },
  { id: 'search', label: 'Smart Search', icon: <Search size={15} /> },
  { id: 'intelligence', label: 'Intelligence', icon: <Brain size={15} /> },
  { id: 'donor', label: 'Donor Space', icon: <User2 size={15} /> },
  { id: 'audit', label: 'Audit', icon: <ShieldCheck size={15} /> },
] as const;

const NAV_ORG = [
  { id: 'home', label: 'Overview', icon: <Home size={15} /> },
  { id: 'org', label: 'Organization', icon: <Building2 size={15} /> },
  { id: 'camps', label: 'Camps', icon: <Tent size={15} /> },
  { id: 'emergency', label: 'Emergency', icon: <AlertTriangle size={15} /> },
  { id: 'intelligence', label: 'Intelligence', icon: <Brain size={15} /> },
  { id: 'audit', label: 'Audit', icon: <ShieldCheck size={15} /> },
] as const;

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'mr', label: 'मराठी' },
];

export function Header({ activeSection, onNavigate, onLogout }: HeaderProps) {
  const { user, switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isOrg = user?.role === 'organization';
  const navItems = isOrg ? NAV_ORG : NAV_INDIVIDUAL;
  const unreadCount = initialNotifications.filter(n => !n.read).length;

  const nav = (s: Section) => {
    onNavigate(s);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel-strong border-b border-[var(--glass-border)]">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-4">

          {/* Brand */}
          <button
            onClick={() => nav('home')}
            className="flex items-center gap-2 font-extrabold text-lg shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="text-[var(--red)]">✦</span>
            <span className="text-[var(--text)]">Blood<span className="text-[var(--blue)]">Connect</span></span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => nav(item.id as Section)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-all',
                  activeSection === item.id
                    ? 'bg-[var(--blue)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/20',
                ].join(' ')}
              >
                {item.icon}{item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Role Badge */}
            <button
              onClick={() => switchRole(isOrg ? 'individual' : 'organization')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/30 transition-all"
              title="Switch Role"
            >
              {isOrg ? <Building2 size={12} /> : <User2 size={12} />}
              <span className="text-[var(--text-secondary)]">{isOrg ? 'Org' : 'Donor'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <select
                value={lang}
                onChange={e => setLang(e.target.value as Language)}
                className="appearance-none pl-6 pr-2 py-1 text-xs rounded-full bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer focus:outline-none"
                aria-label="Language selector"
              >
                {LANG_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="bg-[var(--bg)]">{o.label}</option>
                ))}
              </select>
              <Globe size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                className="relative p-2 rounded-full hover:bg-[var(--glass)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-all"
                aria-label="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--red)] text-white text-[9px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 glass-panel-strong rounded-[var(--radius-lg)] shadow-xl border border-[var(--glass-border)] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--glass-border)] flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--text)]">Notifications</span>
                    <span className="text-xs text-[var(--muted)]">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {initialNotifications.map(n => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-[var(--glass-border)] hover:bg-[var(--glass)] cursor-pointer transition-all ${!n.read ? 'bg-[var(--blue)]/5' : ''}`}
                        onClick={() => { if (n.linkSection) nav(n.linkSection as Section); setNotifOpen(false); }}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 text-xs shrink-0 ${n.type === 'emergency' ? 'text-[var(--red)]' : n.type === 'success' ? 'text-[var(--green)]' : 'text-[var(--blue)]'}`}>
                            {n.type === 'emergency' ? '⚡' : n.type === 'success' ? '✓' : 'ℹ'}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-[var(--text)]">{n.title}</p>
                            <p className="text-xs text-[var(--muted)] mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-[var(--muted)] mt-1">{n.timestamp}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--blue)] ml-auto mt-1 shrink-0" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--glass)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[var(--glass)] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--cyan)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(user?.name?.[0] ?? 'U').toUpperCase()}
                </div>
                <span className="hidden sm:block text-xs font-semibold text-[var(--text)] max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={12} className="text-[var(--muted)]" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-10 w-52 glass-panel-strong rounded-[var(--radius-lg)] shadow-xl border border-[var(--glass-border)] z-50 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-[var(--glass-border)]">
                    <p className="text-sm font-bold text-[var(--text)] truncate">{user?.name}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{user?.email}</p>
                    <Badge variant={isOrg ? 'cyan' : 'blue'} className="mt-1.5">
                      {isOrg ? 'Organization' : 'Individual Donor'}
                    </Badge>
                  </div>
                  <button
                    onClick={() => { nav(isOrg ? 'org' : 'donor'); setProfileOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text)] transition-all"
                  >
                    <User2 size={14} /> My Profile
                  </button>
                  <button
                    onClick={() => { onLogout(); setProfileOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--red)] hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(p => !p)}
              className="lg:hidden p-2 rounded-full hover:bg-[var(--glass)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 z-30 glass-panel-strong border-b border-[var(--glass-border)] px-4 py-3 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => nav(item.id as Section)}
              className={[
                'flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all text-left',
                activeSection === item.id
                  ? 'bg-[var(--blue)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text)]',
              ].join(' ')}
            >
              {item.icon}{item.label}
            </button>
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--glass-border)] mt-1">
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Language)}
              className="flex-1 px-3 py-2 text-xs rounded-[var(--radius-md)] bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--text-secondary)] cursor-pointer focus:outline-none"
            >
              {LANG_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-[var(--bg)]">{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => switchRole(isOrg ? 'individual' : 'organization')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] text-xs font-semibold bg-[var(--glass)] border border-[var(--glass-border)]"
            >
              {isOrg ? <User2 size={12} /> : <Building2 size={12} />}
              Switch to {isOrg ? 'Donor' : 'Org'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
