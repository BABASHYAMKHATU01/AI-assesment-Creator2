'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, Trash2, HelpCircle, FileText, Calendar, Compass, 
  BookOpen, Layers, Upload, X, AlertTriangle, CheckCircle, Loader2 
} from 'lucide-react';

interface SectionInput {
  id: string;
  type: string;
  questionCount: number;
  marksPerQuestion: number;
}

interface AssessmentFormProps {
  onAssignmentCreated: (newAssignment: any) => void;
}

export default function AssessmentForm({ onAssignmentCreated }: AssessmentFormProps) {
  // Form Inputs
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [sections, setSections] = useState<SectionInput[]>([
    { id: 'sec_1', type: 'Multiple Choice', questionCount: 5, marksPerQuestion: 2 }
  ]);

  // Loading & File upload states
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Alert States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const questionTypes = [
    'Multiple Choice',
    'Short Answer',
    'Long Answer',
    'Fill in the Blanks',
    'True/False'
  ];

  // Load pre-fills if redirected from Student Groups
  useEffect(() => {
    const prefillSubject = localStorage.getItem('veda_prefill_subject');
    const prefillGrade = localStorage.getItem('veda_prefill_grade');
    if (prefillSubject) {
      setSubject(prefillSubject);
      localStorage.removeItem('veda_prefill_subject');
    }
    if (prefillGrade) {
      setGrade(prefillGrade);
      localStorage.removeItem('veda_prefill_grade');
    }
  }, []);

  const handleAddSection = () => {
    setSections([
      ...sections,
      { 
        id: 'sec_' + Date.now() + Math.random().toString(36).substr(2, 4), 
        type: 'Multiple Choice', 
        questionCount: 5, 
        marksPerQuestion: 2 
      }
    ]);
  };

  const handleRemoveSection = (id: string) => {
    if (sections.length === 1) {
      setErrorMsg('Assessment must contain at least one question section');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSectionChange = (id: string, field: keyof SectionInput, value: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateTotalQuestions = () => {
    return sections.reduce((sum, s) => sum + s.questionCount, 0);
  };

  const calculateTotalMarks = () => {
    return sections.reduce((sum, s) => sum + (s.questionCount * s.marksPerQuestion), 0);
  };

  // Drag-and-Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile({ name: dropped.name, size: Math.round(dropped.size / 1024) });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploaded = e.target.files[0];
      setFile({ name: uploaded.name, size: Math.round(uploaded.size / 1024) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!subject.trim()) {
      setErrorMsg('Subject or Topic Name is required');
      return;
    }
    if (!grade.trim()) {
      setErrorMsg('Target Class or Grade is required');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Due Date is required');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/assignments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          dueDate,
          sections: sections.map(s => ({
            type: s.type,
            questionCount: s.questionCount,
            marksPerQuestion: s.marksPerQuestion
          })),
          additionalInstructions: additionalInstructions + (file ? `\n(Referenced Syllabus File: ${file.name})` : '')
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Serverless AI generation worker failed');
      }

      const generatedPaper = await res.json();

      // Commit to localStorage persistence array
      const existing = localStorage.getItem('veda_nextjs_assignments');
      const list = existing ? JSON.parse(existing) : [];
      const updatedList = [generatedPaper, ...list];
      localStorage.setItem('veda_nextjs_assignments', JSON.stringify(updatedList));

      setSuccessMsg('AI Assessment Paper generated in real-time successfully!');
      
      // Load generated output preview
      setTimeout(() => {
        onAssignmentCreated(generatedPaper);
        setIsGenerating(false);
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || 'AI Generation failed. Please check your API key.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="h-6 w-6 text-[#EA580C]" /> Setup AI Assessment Criteria
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Configure subjects, classes, target grade levels, question groupings and prompt requirements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Top inputs block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Subject */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-700 mb-1.5 flex items-center uppercase tracking-wide" htmlFor="subj">
              <BookOpen className="h-4 w-4 text-slate-400 mr-1.5" />
              Subject / Topic Name
            </label>
            <input
              id="subj"
              type="text"
              placeholder="e.g. Ancient Rome, Algebra 101"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100/50 transition duration-150 font-medium"
              required
              disabled={isGenerating}
            />
          </div>

          {/* Grade */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-700 mb-1.5 flex items-center uppercase tracking-wide" htmlFor="grade">
              <Compass className="h-4 w-4 text-slate-400 mr-1.5" />
              Target Class / Grade
            </label>
            <input
              id="grade"
              type="text"
              placeholder="e.g. Grade 9, high school seniors"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100/50 transition duration-150 font-medium"
              required
              disabled={isGenerating}
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col">
            <label className="text-xs font-extrabold text-slate-700 mb-1.5 flex items-center uppercase tracking-wide" htmlFor="due">
              <Calendar className="h-4 w-4 text-slate-400 mr-1.5" />
              Due Date
            </label>
            <input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100/50 transition duration-150 cursor-pointer font-medium"
              required
              disabled={isGenerating}
            />
          </div>

        </div>

        {/* Modular Question Groupings */}
        <div className="border border-slate-100 rounded-3xl p-5 sm:p-6 bg-slate-50/50">
          
          {/* Groupings Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-[#EA580C]" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 tracking-tight">Question Section Groupings</h4>
                <p className="text-[11px] text-slate-500 font-medium">Configure question format, quantity sliders, and score evaluations</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-[#EA580C]/30 text-[#EA580C] font-bold text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
              disabled={isGenerating}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Section rows */}
          <div className="space-y-4">
            {sections.map((sect, index) => (
              <div 
                key={sect.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative group animate-fade-in"
              >
                {/* Section Letter Accent */}
                <div className="absolute top-0 left-0 bg-[#0F172A] text-[#F97316] px-3 py-1 text-[10px] font-mono rounded-br-xl font-bold uppercase tracking-wider">
                  Section {String.fromCharCode(65 + index)}
                </div>

                {/* Format Type */}
                <div className="md:col-span-5 flex flex-col pt-2">
                  <label className="text-xs font-extrabold text-slate-600 mb-1.5 uppercase" htmlFor={`type-${sect.id}`}>
                    Question Format Type
                  </label>
                  <select
                    id={`type-${sect.id}`}
                    value={sect.type}
                    onChange={(e) => handleSectionChange(sect.id, 'type', e.target.value)}
                    className="border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-xs text-slate-705 cursor-pointer focus:outline-none focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100/50 font-semibold"
                    disabled={isGenerating}
                  >
                    {questionTypes.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity Range Slider */}
                <div className="md:col-span-4 flex flex-col">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5 uppercase">
                    <label htmlFor={`count-${sect.id}`}>Quantity</label>
                    <span className="font-mono text-xs font-extrabold text-[#EA580C] bg-orange-50 border border-orange-100 rounded-md px-2 py-0.5">{sect.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center space-x-3 py-2 px-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400">1</span>
                    <input
                      id={`count-${sect.id}`}
                      type="range"
                      min="1"
                      max="20"
                      value={sect.questionCount}
                      onChange={(e) => handleSectionChange(sect.id, 'questionCount', parseInt(e.target.value) || 1)}
                      className="h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EA580C] flex-1 hover:accent-[#F97316]"
                      disabled={isGenerating}
                    />
                    <span className="text-[10px] font-bold font-mono text-slate-400">20</span>
                  </div>
                </div>

                {/* Marks per Question */}
                <div className="md:col-span-2 flex flex-col">
                  <label className="text-xs font-extrabold text-slate-600 mb-1.5 uppercase" htmlFor={`marks-${sect.id}`}>
                    Marks Each
                  </label>
                  <input
                    id={`marks-${sect.id}`}
                    type="number"
                    min="1"
                    max="100"
                    placeholder="2"
                    value={sect.marksPerQuestion || ''}
                    onChange={(e) => handleSectionChange(sect.id, 'marksPerQuestion', parseInt(e.target.value) || 0)}
                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100/50"
                    disabled={isGenerating}
                  />
                </div>

                {/* Delete button */}
                <div className="md:col-span-1 flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(sect.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-rose-50/50 rounded-xl transition duration-150 cursor-pointer"
                    title="Remove Section"
                    disabled={isGenerating}
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Summary bar */}
          <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-t border-slate-200/60 mt-5 pt-4">
            <span>Aggregated Questions: {calculateTotalQuestions()}</span>
            <span className="font-extrabold text-sm text-[#EA580C]">Cumulative Weight: {calculateTotalMarks()} Marks</span>
          </div>

        </div>

        {/* Syllabus Resource file upload */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 mb-1.5 block uppercase tracking-wide">
            Referenced Syllabus Material (PDF / Text is optional)
          </label>
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 transition-all duration-300 text-center relative cursor-pointer ${
              dragActive 
                ? 'border-[#EA580C] bg-orange-50/30' 
                : 'border-slate-350 bg-slate-50/40 hover:border-[#EA580C] hover:bg-orange-50/20'
            }`}
          >
            <input 
              type="file" 
              id="file-up" 
              accept=".pdf,.txt"
              onChange={handleFileInput}
              className="hidden" 
              disabled={isGenerating}
            />
            
            {file ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-2 animate-fade-in">
                <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm animate-bounce">
                  <FileText className="h-7 w-7 text-[#EA580C]" />
                </div>
                <div className="text-sm font-extrabold text-slate-800">{file.name}</div>
                <div className="text-xs text-slate-400 font-mono">Size: {file.size} KB</div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-650 py-1.5 px-3.5 rounded-xl bg-rose-50 border border-rose-100 transition cursor-pointer"
                  disabled={isGenerating}
                >
                  <X className="h-3 w-3 mr-1" />
                  Discard File
                </button>
              </div>
            ) : (
              <label htmlFor="file-up" className="cursor-pointer flex flex-col items-center justify-center space-y-3 py-4">
                <div className="h-12 w-12 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center border border-orange-100 hover:scale-105 transition-transform">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-sm font-extrabold text-slate-800 tracking-tight">Drag or drop syllabus resource files here</div>
                <div className="text-xs text-slate-550 font-semibold text-slate-550">Supports PDF or Raw TXT formatted syllabus documents (Max 5MB)</div>
              </label>
            )}
          </div>
        </div>

        {/* Additional Directives */}
        <div className="flex flex-col">
          <label className="text-xs font-extrabold text-slate-700 mb-1.5 flex items-center uppercase tracking-wide" htmlFor="directives">
            Additional Directives or Topic Prompts (Optional)
          </label>
          <textarea
            id="directives"
            placeholder="e.g. Include questions on covalent chemical bond formulas, avoid general organic chemistry queries..."
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            rows={3}
            className="border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-4 focus:ring-orange-100/50 transition font-medium"
            disabled={isGenerating}
          />
        </div>

        {/* Banner Alert triggers */}
        {errorMsg && (
          <div className="flex items-start space-x-2.5 p-4 bg-rose-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium animate-fade-in">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium animate-fade-in">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Generate submit CTA */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-2xl font-bold tracking-wider uppercase text-white flex items-center justify-center space-x-2 transition duration-200 shadow-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 hover:from-slate-800 hover:to-slate-900 border-t border-slate-700 cursor-pointer shadow-orange-500/5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-[#F97316]" />
              <span className="font-extrabold text-[#F97316]">AI Worker: Compiling structured questions in real-time...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-[#F97316] animate-pulse" />
              <span>Generate Assessment Paper via AI Worker</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
}
