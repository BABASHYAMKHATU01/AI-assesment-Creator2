'use client';

import React, { useState } from 'react';
import { 
  Printer, ArrowLeft, RefreshCw, KeyRound, Key, 
  BookOpenCheck, AlertCircle, Eye, EyeOff, Loader2 
} from 'lucide-react';

interface AssessmentViewerProps {
  activeAssignment: any;
  onBack: () => void;
}

export default function AssessmentViewer({ activeAssignment, onBack }: AssessmentViewerProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  const toggleExpandedAnswer = (qId: string) => {
    setExpandedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="assessment-print-container">
      
      {/* Interactive Workspace Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-orange-50/40 border border-orange-100 rounded-2xl p-4 shadow-xs no-print">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Back to Generator"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">Review Assessment Output</h4>
            <p className="text-xs text-slate-500 font-medium">Live examination preview sheet & active fine-tuning tools</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            {showAnswers ? (
              <>
                <EyeOff className="h-4 w-4 text-[#EA580C]" />
                <span>Hide Answer Key</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 text-[#EA580C]" />
                <span>Reveal Answer Key</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#EA580C] text-white hover:bg-[#F97316] text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* PDF Generation Print Hints */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-slate-650 leading-relaxed no-print font-medium">
        <AlertCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-slate-900">Vector PDF Generation: </span>
          Clicking <span className="font-bold text-slate-800">Export / Print PDF</span> invokes native vector print engines. 
          Make sure to toggle <span className="italic font-semibold">"Background graphics"</span> to ON in your print dialog and select <span className="italic font-semibold">"Save as PDF"</span>. 
          All action buttons, toolbars, and layout rails will be cleanly stripped, leaving a pristine physical question exam paper!
        </div>
      </div>

      {/* The Printable Test Sheet Body - Styled in editorial Lora Serif */}
      <div className="bg-white border border-slate-300 rounded-[32px] p-8 sm:p-14 font-serif text-slate-900 relative print-shadow-none print-border-none assessment-paper shadow-md" id="examination-sheet">
        
        {/* Printable Examination Header Block */}
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6 mb-8 text-slate-900">
          <div className="text-[10px] uppercase font-sans tracking-widest font-extrabold text-[#EA580C] no-print">VEDA AI ACADEMIC SYSTEM</div>
          <h2 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-wider font-sans text-slate-950">{activeAssignment.title}</h2>
          <div className="font-sans text-xs flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-slate-600 uppercase font-bold mt-1">
            <span>Subject: <strong className="text-slate-950 font-extrabold">{activeAssignment.subject}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Target Group: <strong className="text-slate-950 font-extrabold">{activeAssignment.grade}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Duration Limit: <strong className="text-slate-950 font-extrabold">2 Hours</strong></span>
          </div>
        </div>

        {/* Dynamic Student Information Details Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans text-xs uppercase text-slate-800 tracking-wider mb-8 border border-slate-200 rounded-2xl p-6 bg-slate-50/60 no-print font-medium">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-550 shrink-0">Student Name:</span>
            <input 
              type="text" 
              placeholder="......................................................................." 
              className="border-none bg-transparent flex-1 text-slate-900 font-serif font-semibold outline-none placeholder-slate-400 focus:placeholder-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-550 shrink-0">Roll Number:</span>
            <input 
              type="text" 
              placeholder=".........................................." 
              className="border-none bg-transparent flex-1 text-slate-900 font-serif font-semibold outline-none placeholder-slate-400 focus:placeholder-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-550 shrink-0">Section / Class:</span>
            <input 
              type="text" 
              placeholder=".........................................." 
              className="border-none bg-transparent flex-1 text-slate-900 font-serif font-semibold outline-none placeholder-slate-400 focus:placeholder-transparent"
            />
          </div>
          <div className="md:col-span-3 text-slate-405 normal-case flex flex-col sm:flex-row justify-between font-mono text-[10px] mt-2 border-t border-slate-200/60 pt-3 pb-0 text-slate-500 gap-2">
            <span>Generated At: {new Date(activeAssignment.createdAt).toLocaleDateString()}</span>
            <span>Submission Due Date: {new Date(activeAssignment.dueDate).toLocaleDateString()}</span>
            <span className="font-bold text-[#EA580C]">Evaluation Total WEIGHT: {activeAssignment.totalMarks} MARKS</span>
          </div>
        </div>

        {/* Student Info Lines specifically rendered during PRINT ONLY */}
        <div className="hidden print:grid grid-cols-3 gap-6 font-sans text-xs uppercase tracking-widest text-slate-950 mb-8 pb-4 border-b border-slate-300">
          <div>STUDENT NAME: ____________________________</div>
          <div>ROLL NUMBER: _______________________</div>
          <div>SECTION / CLASS: _____________________</div>
        </div>

        {/* Static Exam Rules & Instructions Block */}
        <div className="mb-10 p-5 border-l-4 border-[#0F172A] text-slate-700 font-sans text-xs italic bg-slate-50/50 rounded-r-2xl leading-relaxed">
          <p className="font-extrabold text-slate-950 not-italic mr-1.5 uppercase text-[10px] tracking-widest mb-1.5 text-[#EA580C]">General Directives & Instructions:</p>
          <ul className="list-disc list-inside space-y-1 font-medium">
            <li>Verify you have received the exact {activeAssignment.totalQuestionsCount} assessment questions specified across sections.</li>
            <li>All questions must be answered as categorized in chronological section sequence.</li>
            {activeAssignment.additionalInstructions && (
              <li>Target Reference Criteria: <span className="not-italic font-bold text-slate-900">{activeAssignment.additionalInstructions}</span></li>
            )}
          </ul>
        </div>

        {/* Structured Sections & Questions */}
        <div className="space-y-10" id="exams-sections">
          {activeAssignment.sections.map((section: any, sIdx: number) => (
            <div key={section.id} className="space-y-5 section-block" id={section.id}>
              
              {/* Section Header */}
              <div className="border-b border-slate-900 pb-2.5">
                <div className="flex justify-between items-end gap-4">
                  <h3 className="font-extrabold text-lg tracking-tight text-slate-950 uppercase font-sans">
                    Section {String.fromCharCode(65 + sIdx)}: {section.title}
                  </h3>
                  <span className="text-[10px] font-sans font-extrabold text-slate-500 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 uppercase tracking-wider italic shrink-0">
                    {section.questionType}
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-500 italic mt-1.5 font-medium leading-relaxed">
                  Instruction: {section.instruction}
                </p>
              </div>

              {/* Questions Loop */}
              <div className="space-y-8">
                {section.questions.map((question: any, qIdx: number) => (
                  <div key={question.id} className="relative group text-sm leading-relaxed" id={question.id}>
                    
                    <div className="flex justify-between items-start space-x-5">
                      
                      {/* Left: Question Text with Index */}
                      <div className="flex-1 space-y-3 mt-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <p className="text-slate-950 font-medium leading-relaxed font-serif text-base">
                            <strong className="font-mono mr-2 text-slate-400 text-sm align-middle select-none">{qIdx + 1}.</strong> 
                            {question.text}
                          </p>
                          
                          {/* Reveal solution buttons */}
                          {question.correctAnswer && (
                            <button
                              type="button"
                              onClick={() => toggleExpandedAnswer(question.id)}
                              className="self-start inline-flex items-center space-x-1.5 text-xxs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-slate-100/70 hover:bg-orange-55 border border-slate-200/80 text-slate-600 hover:text-[#EA580C] hover:border-[#EA580C]/40 transition duration-150 no-print shadow-xs shrink-0 cursor-pointer"
                            >
                              <KeyRound className="h-3.5 w-3.5 text-[#F97316]" />
                              <span>{expandedAnswers[question.id] ? 'Hide Answer' : 'Show Answer'}</span>
                            </button>
                          )}
                        </div>
                        
                        {/* MCQ Choices Map */}
                        {section.questionType === 'Multiple Choice' && question.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-sans text-xs text-slate-750 pl-6 pt-1">
                            {question.options.map((option: string, oIdx: number) => (
                              <div key={oIdx} className="flex items-baseline space-x-3 text-slate-800 font-medium">
                                <span className="font-sans font-extrabold text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 scale-95 shrink-0 select-none">
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Collapsible Answer Keys */}
                        {(showAnswers || expandedAnswers[question.id]) && question.correctAnswer && (
                          <div className="mt-4 pl-6 py-3 px-4 rounded-xl bg-orange-50/50 border border-orange-100/80 text-slate-800 font-sans text-xs animate-fade-in print:bg-slate-50 print:border-slate-200 pb-3">
                            <span className="font-extrabold text-[#EA580C] inline-flex items-center space-x-1 mr-1.5 uppercase font-mono tracking-wider text-[10px]">
                              <Key className="h-3.5 w-3.5 mr-1 text-[#F97316]" />
                              Core Solution Explanations:
                            </span>
                            <span className="font-sans mt-1 block font-medium leading-relaxed">{question.correctAnswer}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Question Metadata */}
                      <div className="flex flex-col items-end space-y-1.5 shrink-0 mt-1.5">
                        <span className="text-xs font-sans font-extrabold text-slate-700 bg-slate-100 print:bg-transparent px-2.5 py-1 rounded-xl uppercase leading-none border border-slate-200/50 print:border-none print:px-0 shrink-0">
                          {question.marks} Marks
                        </span>
                        
                        <span className="text-[8px] font-sans font-extrabold tracking-widest uppercase border rounded-lg bg-white px-2 py-0.5 leading-none shadow-xxs no-print shrink-0 bg-rose-50 text-rose-800 border-rose-200">
                          {question.difficulty}
                        </span>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Sheet Footer Accent */}
        <div className="border-t border-slate-300 mt-14 pt-8 flex justify-between text-slate-400 font-sans text-[10px] uppercase tracking-widest font-bold">
          <span>End of Examination Paper</span>
          <span>Powered by VedaAI Builder</span>
          <span>CONFIDENTIAL</span>
        </div>

      </div>
    </div>
  );
}
