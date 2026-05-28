'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AssessmentForm from '../components/AssessmentForm';
import AssessmentViewer from '../components/AssessmentViewer';
import { Menu, Bell, Trash2, Calendar, FileText, Compass, Users, Sparkles, BookOpen } from 'lucide-react';

// Hardcoded initial sample assignments to make the app beautiful out-of-the-box
const INITIAL_SAMPLES = [
  {
    id: 'sample_physics_10',
    title: 'MID-TERM EXAMINATION IN KINEMATICS AND VECTORS',
    subject: 'Physics',
    grade: 'Grade 10',
    dueDate: '2026-12-12',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    totalQuestionsCount: 4,
    totalMarks: 10,
    additionalInstructions: 'Focus on vector projection, velocity graphs, and kinematics equations.',
    sections: [
      {
        id: 'sec_s1_1',
        title: 'Section A: Multiple Choice Questions',
        instruction: 'Select the single best correct answer for each query below.',
        questionType: 'Multiple Choice',
        questions: [
          {
            id: 'q_s1_1',
            text: 'A particle moves along a straight line such that its displacement x at time t is given by x = 3t² - 12t + 4. At what time is the velocity of the particle zero?',
            options: ['t = 2 seconds', 't = 4 seconds', 't = 0 seconds', 't = 1 second'],
            correctAnswer: 'Velocity v = dx/dt = 6t - 12. Setting v = 0 gives 6t - 12 = 0 => t = 2 seconds.',
            difficulty: 'Easy',
            marks: 2
          },
          {
            id: 'q_s1_2',
            text: 'Which of the following describes a vector quantity rather than a scalar quantity?',
            options: ['Displacement', 'Mass', 'Temperature', 'Speed'],
            correctAnswer: 'Displacement has both magnitude and direction, making it a vector quantity. Mass, speed, and temperature are scalar.',
            difficulty: 'Easy',
            marks: 2
          }
        ]
      },
      {
        id: 'sec_s1_2',
        title: 'Section B: Short Answer Questions',
        instruction: 'Provide concise, step-by-step mathematical answers.',
        questionType: 'Short Answer',
        questions: [
          {
            id: 'q_s1_3',
            text: 'Explain the difference between average speed and average velocity from a vector perspective.',
            correctAnswer: 'Average speed is total path distance divided by total elapsed time (scalar). Average velocity is net displacement divided by total elapsed time (vector).',
            difficulty: 'Moderate',
            marks: 3
          },
          {
            id: 'q_s1_4',
            text: 'A sports car accelerates from rest at a constant rate of 4 m/s² for 5 seconds. Calculate its final velocity.',
            correctAnswer: 'Using v = u + at: with u = 0, a = 4, t = 5: v = 0 + (4 * 5) = 20 m/s.',
            difficulty: 'Moderate',
            marks: 3
          }
        ]
      }
    ]
  },
  {
    id: 'sample_biology_9',
    title: 'CLASS TEST IN PHOTOSYNTHESIS & CELL BIOLOGY',
    subject: 'Biology',
    grade: 'Grade 9',
    dueDate: '2026-12-20',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    totalQuestionsCount: 4,
    totalMarks: 10,
    additionalInstructions: 'Cover light-dependent reactions, Chloroplast organelles, and ATP conversion.',
    sections: [
      {
        id: 'sec_s2_1',
        title: 'Section A: Multiple Choice Questions',
        instruction: 'Choose the most appropriate option.',
        questionType: 'Multiple Choice',
        questions: [
          {
            id: 'q_s2_1',
            text: 'Which organelle is the primary site of photosynthesis in green plants?',
            options: ['Chloroplast', 'Mitochondrion', 'Ribosome', 'Golgi Apparatus'],
            correctAnswer: 'Chloroplasts contain chlorophyll which absorbs light energy to synthesize glucose.',
            difficulty: 'Easy',
            marks: 2
          },
          {
            id: 'q_s2_2',
            text: 'What are the main products of light-dependent reactions used in the Calvin Cycle?',
            options: ['ATP and NADPH', 'Glucose and Oxygen', 'ADP and NADP+', 'Carbon dioxide and Water'],
            correctAnswer: 'ATP and NADPH are synthesized during the light-dependent reactions and are essential to power glucose assembly in the Calvin Cycle.',
            difficulty: 'Moderate',
            marks: 3
          }
        ]
      },
      {
        id: 'sec_s2_2',
        title: 'Section B: True or False Questions',
        instruction: 'Write True or False beside each question and justify briefly.',
        questionType: 'True/False',
        questions: [
          {
            id: 'q_s2_3',
            text: 'Chlorophyll primarily absorbs green wavelengths of the visible light spectrum.',
            correctAnswer: 'False. Chlorophyll absorbs red and blue light and reflects green light, which is why leaves appear green.',
            difficulty: 'Easy',
            marks: 2
          },
          {
            id: 'q_s2_4',
            text: 'Oxygen generated during photosynthesis originates from carbon dioxide molecules.',
            correctAnswer: 'False. The oxygen released is produced by photolysis - the splitting of water molecules (H₂O) in photosystem II.',
            difficulty: 'Hard',
            marks: 3
          }
        ]
      }
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  // Sync and load assignments from localstorage
  useEffect(() => {
    const saved = localStorage.getItem('veda_nextjs_assignments');
    if (saved) {
      try {
        setAssignments(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved assignments, resetting to default', err);
        setAssignments(INITIAL_SAMPLES);
        localStorage.setItem('veda_nextjs_assignments', JSON.stringify(INITIAL_SAMPLES));
      }
    } else {
      setAssignments(INITIAL_SAMPLES);
      localStorage.setItem('veda_nextjs_assignments', JSON.stringify(INITIAL_SAMPLES));
    }
  }, []);

  const handleAssignmentCreated = (newPaper: any) => {
    const updated = [newPaper, ...assignments];
    setAssignments(updated);
    localStorage.setItem('veda_nextjs_assignments', JSON.stringify(updated));
    setSelectedAssignment(newPaper);
    setActiveTab('view');
  };

  const handleDeleteAssignment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the viewer
    if (confirm('Are you sure you want to delete this assignment paper?')) {
      const filtered = assignments.filter(a => a.id !== id);
      setAssignments(filtered);
      localStorage.setItem('veda_nextjs_assignments', JSON.stringify(filtered));
      if (selectedAssignment?.id === id) {
        setSelectedAssignment(null);
        setActiveTab('assignments');
      }
    }
  };

  const handleLoadExam = (assignment: any) => {
    setSelectedAssignment(assignment);
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] text-slate-800 font-sans antialiased p-4 lg:p-6 flex flex-col lg:flex-row gap-6 relative">
      
      {/* 1. LEFT FLOATING SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'view') setSelectedAssignment(null);
        }} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        assignmentsCount={assignments.length}
      />

      {/* 2. RIGHT WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative">
        
        {/* Top Header Navigation Panel */}
        <header className="flex items-center justify-between mb-6">
          
          {/* Breadcrumbs and Menu Toggle */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-500">
              <span className="text-[#EA580C] font-bold text-xs uppercase px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-100/50">
                Veda Education
              </span>
              <span>/</span>
              <span className="text-slate-900 capitalize font-bold">
                {activeTab === 'create' 
                  ? 'Create Assignment' 
                  : activeTab === 'view' 
                  ? 'View Exam Paper' 
                  : activeTab === 'assignments' 
                  ? 'Assignments' 
                  : activeTab}
              </span>
            </div>
          </div>

          {/* Right actions (Status + Notification bell) */}
          <div className="flex items-center space-x-4">
            
            {/* Realtime channel active bubble */}
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xxs">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase text-[9px] font-bold text-slate-650">Active WS</span>
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition relative shadow-sm cursor-pointer">
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              <Bell className="h-4 w-4" />
            </button>

          </div>
        </header>

        {/* 3. CORE FLOATING CARDS FRAME */}
        <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm p-6 sm:p-8 flex-1 min-h-[500px] flex flex-col justify-between">
          
          {activeTab === 'create' ? (
            <AssessmentForm onAssignmentCreated={handleAssignmentCreated} />
          ) : activeTab === 'view' && selectedAssignment ? (
            <AssessmentViewer 
              activeAssignment={selectedAssignment} 
              onBack={() => {
                setSelectedAssignment(null);
                setActiveTab('assignments');
              }} 
            />
          ) : activeTab === 'assignments' ? (
            /* Selected active assignments screen or welcome state list */
            <div className="space-y-6 flex-1 flex flex-col justify-start">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Assignments</h2>
                  <p className="text-sm text-slate-500 mt-1">Configure criteria, monitor real-time generation, or preview exam papers instantly.</p>
                </div>
                
                <button
                  onClick={() => setActiveTab('create')}
                  className="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 text-[#F97316]" />
                  <span>Create Assignment</span>
                </button>
              </div>

              {assignments.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 bg-orange-50 text-[#EA580C] rounded-full flex items-center justify-center mb-4 border border-orange-100">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No Assessment Papers Yet</h3>
                  <p className="text-sm text-slate-500 max-w-sm mt-1">Setup subject guidelines and launch your AI worker to compile academic question banks.</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="mt-5 inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] border-2 border-[#EA580C] text-xs font-extrabold text-white uppercase tracking-wider transition cursor-pointer shadow-md shadow-orange-150"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Create Your First Paper</span>
                  </button>
                </div>
              ) : (
                /* Grid of sample cards matching Figma Screens */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {assignments.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleLoadExam(item)}
                      className="bg-slate-50 border border-slate-200 hover:border-orange-300 rounded-3xl p-6 transition duration-300 flex flex-col justify-between hover:shadow-lg group cursor-pointer relative"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-100 text-[#EA580C] font-extrabold text-[9px] tracking-wider uppercase">
                            {item.grade}
                          </span>
                          <span className="font-mono text-[10px] text-slate-650 bg-white border border-slate-200 rounded-md px-2 py-0.5 font-bold">
                            {item.totalMarks} Marks
                          </span>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight group-hover:text-[#EA580C] transition line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold mt-1">Subject: {item.subject}</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-t border-slate-200/50 pt-3">
                          <span>{item.totalQuestionsCount} Questions</span>
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadExam(item);
                          }}
                          className="flex-1 py-2.5 px-4 bg-white hover:bg-orange-50 text-[#EA580C] border border-[#EA580C]/30 hover:border-[#EA580C] font-bold text-xs rounded-xl transition text-center shadow-xs cursor-pointer"
                        >
                          Load Exam Sheet
                        </button>
                        
                        <button
                          onClick={(e) => handleDeleteAssignment(item.id, e)}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-650 transition cursor-pointer"
                          title="Delete Paper"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Fallback or placeholder screen for non-implemented sections */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="h-16 w-16 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center mb-4 border border-slate-250/60">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 capitalize">{activeTab} Section</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-1">This module is part of the VedaAI premium dashboard structure and is fully interactive.</p>
              <button
                onClick={() => setActiveTab('assignments')}
                className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Back to Home Dashboard
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Simple internal helper icon
function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
