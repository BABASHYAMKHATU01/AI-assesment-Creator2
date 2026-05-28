'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, LayoutGrid, Users, BookOpen, PieChart, Settings, X, Edit3 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  assignmentsCount: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  assignmentsCount
}: SidebarProps) {
  
  // Profile editable states with localStorage persistence
  const [schoolName, setSchoolName] = useState('Delhi Public School');
  const [schoolArea, setSchoolArea] = useState('Bokaro Steel City');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempSchoolName, setTempSchoolName] = useState(schoolName);
  const [tempSchoolArea, setTempSchoolArea] = useState(schoolArea);

  useEffect(() => {
    const savedName = localStorage.getItem('veda_school_name');
    const savedArea = localStorage.getItem('veda_school_area');
    if (savedName) setSchoolName(savedName);
    if (savedArea) setSchoolArea(savedArea);
  }, []);

  const handleSaveProfile = () => {
    setSchoolName(tempSchoolName);
    setSchoolArea(tempSchoolArea);
    localStorage.setItem('veda_school_name', tempSchoolName);
    localStorage.setItem('veda_school_area', tempSchoolArea);
    setIsEditingProfile(false);
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
        />
      )}

      {/* Vertical Sidebar Card */}
      <aside className={`fixed top-4 bottom-4 z-50 bg-white border border-slate-200 w-[280px] shrink-0 flex flex-col justify-between p-6 transition-all duration-300 rounded-[32px] shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] ${
        mobileMenuOpen ? 'left-4' : '-left-[320px] lg:left-0'
      }`}>
        
        {/* Top Branding Logo */}
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo icon */}
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#EA580C] via-[#EA580C] to-[#E15A3C] flex items-center justify-center text-white font-extrabold text-2xl shadow-md border border-[#EA580C]/40 shrink-0 select-none">
                V
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                VedaAI
              </span>
            </div>
            {/* Close button for mobile menu */}
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition animate-pulse"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sparkles Create Assignment Capsule CTA */}
          <button
            onClick={() => {
              setActiveTab('create');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] border-2 border-[#EA580C] text-sm font-bold tracking-wide text-white transition-all shadow-md hover:shadow-[#EA580C]/10 cursor-pointer active:scale-98"
          >
            <Sparkles className="h-4.5 w-4.5 text-white" />
            <span>Create Assignment</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2 flex-1">
            {/* Home */}
            <button
              onClick={() => {
                setActiveTab('assignments');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-slate-100 text-slate-900 font-extrabold shadow-xxs'
                  : 'text-[#8A8A8A] hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-5 w-5 shrink-0" />
              <span>Home</span>
            </button>

            {/* My Groups */}
            <button
              onClick={() => {
                setActiveTab('groups');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === 'groups'
                  ? 'bg-slate-100 text-slate-900 font-extrabold shadow-xxs'
                  : 'text-[#8A8A8A] hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="h-5 w-5 shrink-0" />
              <span>My Groups</span>
            </button>

            {/* Assignments (Active selected tab in screenshot) */}
            <button
              onClick={() => {
                setActiveTab('assignments');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-slate-100 text-slate-900 font-extrabold shadow-xxs'
                  : 'text-[#8A8A8A] hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="h-5 w-5 shrink-0" />
              <span>Assignments</span>
              <span className="ml-auto bg-[#EA580C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                {assignmentsCount}
              </span>
            </button>

            {/* AI Teacher's Toolkit */}
            <button
              onClick={() => {
                setActiveTab('toolkit');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === 'toolkit'
                  ? 'bg-slate-100 text-slate-900 font-extrabold shadow-xxs'
                  : 'text-[#8A8A8A] hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-5 w-5 shrink-0" />
              <span>AI Teacher’s Toolkit</span>
            </button>

            {/* My Library */}
            <button
              onClick={() => {
                setActiveTab('assignments');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight text-[#8A8A8A] hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            >
              <PieChart className="h-5 w-5 shrink-0" />
              <span>My Library</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-slate-100 text-slate-900 font-extrabold shadow-xxs'
                  : 'text-[#8A8A8A] hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile Widget with inline editing */}
        {isEditingProfile ? (
          <div className="bg-[#F1F1F1] rounded-2xl p-3 flex flex-col space-y-2 mt-6 border border-slate-200 shadow-sm animate-fade-in">
            <div className="text-[10px] font-extrabold uppercase text-[#EA580C] px-1 tracking-wider">Edit School Identity</div>
            <input
              type="text"
              value={tempSchoolName}
              onChange={(e) => setTempSchoolName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#EA580C] font-semibold"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveProfile();
                if (e.key === 'Escape') setIsEditingProfile(false);
              }}
            />
            <input
              type="text"
              value={tempSchoolArea}
              onChange={(e) => setTempSchoolArea(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#EA580C] font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveProfile();
                if (e.key === 'Escape') setIsEditingProfile(false);
              }}
            />
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-[10px] uppercase transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="p-1.5 px-3.5 rounded-lg bg-[#EA580C] hover:bg-[#F97316] text-white font-bold text-[10px] uppercase transition cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => {
              setTempSchoolName(schoolName);
              setTempSchoolArea(schoolArea);
              setIsEditingProfile(true);
            }}
            className="bg-[#F1F1F1] hover:bg-[#EAEAEA] rounded-2xl p-3 flex items-center space-x-3 mt-6 border border-slate-200/40 shadow-xxs select-none cursor-pointer transition group"
            title="Click to edit school details"
          >
            {/* Custom Bored Ape vector avatar */}
            <svg viewBox="0 0 100 100" className="h-10 w-10 shrink-0 rounded-full border border-slate-200/80 bg-[#FFEAE5] p-0.5 shadow-sm">
              <circle cx="50" cy="50" r="46" fill="#FCE7E2" />
              <path d="M50,30 C35,30 32,45 32,55 C32,65 38,70 50,70 C62,70 68,65 68,55 C68,45 65,30 50,30 Z" fill="#9F7047" />
              <circle cx="28" cy="55" r="10" fill="#9F7047" />
              <circle cx="28" cy="55" r="6" fill="#D3A27D" />
              <circle cx="72" cy="55" r="10" fill="#9F7047" />
              <circle cx="72" cy="55" r="6" fill="#D3A27D" />
              <path d="M50,48 C42,48 38,52 38,60 C38,66 42,68 50,68 C58,68 62,66 62,60 C62,52 58,48 50,48 Z" fill="#D3A27D" />
              <ellipse cx="50" cy="55" rx="3" ry="2" fill="#5A3A22" />
              <path d="M44,60 Q50,64 56,60" stroke="#5A3A22" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="43" cy="44" r="5" fill="#FFF" />
              <circle cx="43" cy="44" r="2.5" fill="#333" />
              <circle cx="57" cy="44" r="5" fill="#FFF" />
              <circle cx="57" cy="44" r="2.5" fill="#333" />
              <path d="M30,36 C32,22 68,22 70,36 Z" fill="#4B5563" /> 
              <path d="M26,36 Q50,32 74,36 L80,41 L20,41 Z" fill="#374151" /> 
              <path d="M25,82 Q50,75 75,82 L78,95 L22,95 Z" fill="#E2E8F0" />
              <path d="M42,76 L50,86 L58,76 Z" fill="#FCE7E2" /> 
              <path d="M38,78 Q50,88 62,78" stroke="#F59E0B" strokeWidth="3" fill="none" />
              <rect x="47" y="85" width="6" height="8" rx="1.5" fill="#F59E0B" />
            </svg>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-extrabold text-slate-800 truncate leading-snug group-hover:text-[#EA580C] transition">{schoolName}</div>
              <div className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{schoolArea}</div>
            </div>
            <Edit3 className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
          </div>
        )}
      </aside>
    </>
  );
}
