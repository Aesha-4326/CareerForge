import * as pdfjsLib from 'pdfjs-dist';

import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
  UploadCloud,
  Zap
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import { API_URL } from '../../utils/api';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useAuth } from '../../context/AuthContext';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function ResumeAnalyzer({ setStudent }) {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const fileInputRef = useRef(null);
  const hasResume = Boolean(resumeText.trim() && fileName);
  const displayScore = analysisResult ? Math.min(89, Math.max(0, analysisResult.score)) : null;

  const handleChooseResume = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteResume = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch(`${API_URL}/api/resume/latest`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to delete resume.');
      setAnalysisResult(null);
      setResumeText('');
      setTargetJobDescription('');
      setFileName('');
      setIsSaved(false);
      setSaveMessage('');
      setStudent(prev => ({ ...prev, atsScore: null }));
    } catch (error) {
      window.alert(error instanceof TypeError
        ? 'Cannot reach the backend. Start it with `npm start` from the backend folder, then try deleting again.'
        : error.message || 'Unable to delete resume.');
    }
  };

  const readResumeFile = async (file) => {
    if (!file) return;

    const supportedExtensions = ['.pdf', '.txt', '.md', '.text'];
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isSupported = supportedExtensions.some(extension =>
      file.name.toLowerCase().endsWith(extension)
    );
    if (!isSupported) {
      window.alert('Please choose a PDF or plain text resume file (.pdf, .txt, .md, or .text).');
      return;
    }

    if (isPdf) {
      try {
        const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        const pages = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          pages.push(content.items.map(item => item.str).join(' '));
        }

        const extractedText = pages.join('\n\n').trim();
        if (!extractedText) {
          window.alert('This PDF has no selectable text. Please upload a text-based PDF or paste the resume text.');
          return;
        }

        setFileName(file.name);
        setResumeText(extractedText);
        setAnalysisResult(null);
        setIsSaved(false);
        setSaveMessage('Resume uploaded. Run the ATS check, then save it separately to use it for applications.');
      } catch (error) {
        console.error('PDF resume extraction error:', error);
        window.alert('Could not read this PDF. Please try another PDF or paste the resume text.');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        if (!text.trim()) {
          window.alert('This file is empty. Please choose another resume.');
          return;
        }
        setFileName(file.name);
        setResumeText(text);
        setAnalysisResult(null);
        setIsSaved(false);
        setSaveMessage('Resume uploaded. Run the ATS check, then save it separately to use it for applications.');
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    if (!user?.token) {
      setSaveMessage('Please sign in to check your resume with ATS.');
      return;
    }

    setIsAnalyzing(true);
    setSaveMessage('');
    try {
      const response = await fetch(`${API_URL}/api/resume/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ resumeText, targetJobDescription, fileName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Resume analysis failed.');
      const result = data.analysisResult;
      setAnalysisResult({
        score: result.atsScore,
        keywordMatchRate: result.keywordMatchRate,
        foundKeywords: result.foundKeywords || [],
        missingKeywords: result.missingKeywords || [],
        actionVerbsScore: result.actionVerbsScore,
        sectionChecks: result.sectionChecks || [],
        suggestions: result.suggestions || []
      });
      setIsSaved(false);
      setSaveMessage('ATS check complete. Save this resume separately to use it for applications.');
    } catch (error) {
      console.error('Resume analysis API error:', error);
      setAnalysisResult(null);
      setSaveMessage(error instanceof TypeError
        ? 'Cannot reach the backend. Start the backend server, then try again.'
        : error.message || 'Resume analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveResume = async () => {
    if (!resumeText.trim() || !analysisResult || !user?.token) return;
    setIsAnalyzing(true);
    setSaveMessage('');
    try {
      const response = await fetch(`${API_URL}/api/resume/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          resumeText,
          targetJobDescription,
          fileName,
          analysisResult: {
            atsScore: analysisResult.score,
            keywordMatchRate: analysisResult.keywordMatchRate,
            foundKeywords: analysisResult.foundKeywords,
            missingKeywords: analysisResult.missingKeywords,
            actionVerbsScore: analysisResult.actionVerbsScore,
            sectionChecks: analysisResult.sectionChecks,
            suggestions: analysisResult.suggestions
          }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not save resume.');
      setIsSaved(true);
      setSaveMessage('Resume saved successfully. This resume will be attached to applications.');
      setStudent(prev => ({ ...prev, atsScore: analysisResult.score }));
    } catch (error) {
      console.error('Resume save API error:', error);
      setSaveMessage(error instanceof TypeError
        ? 'Cannot reach the backend. Start the backend server, then try again.'
        : error.message || 'Could not save resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load latest persisted ATS resume analysis from MongoDB or trigger initial AI analysis
  React.useEffect(() => {
    async function loadLatestResume() {
      if (user && user.token) {
        try {
          const res = await fetch(`${API_URL}/api/resume/latest`, {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok && data.analysisResult) {
            setResumeText(data.analysisResult.resumeText);
            setTargetJobDescription(data.analysisResult.targetJobDescription || "");
            setFileName(data.analysisResult.fileName || 'resume.txt');
            setAnalysisResult({
              score: data.analysisResult.atsScore,
              keywordMatchRate: data.analysisResult.keywordMatchRate,
              foundKeywords: data.analysisResult.foundKeywords,
              missingKeywords: data.analysisResult.missingKeywords,
              actionVerbsScore: data.analysisResult.actionVerbsScore,
              sectionChecks: data.analysisResult.sectionChecks,
              suggestions: data.analysisResult.suggestions
            });
            setIsSaved(true);
            setSaveMessage('Saved resume loaded. It will be attached to your applications.');
            setStudent(prev => ({ ...prev, atsScore: data.analysisResult.atsScore }));
          } else {
            setResumeText('');
            setFileName('');
            setAnalysisResult(null);
            setIsSaved(false);
          }
        } catch {
          setResumeText('');
          setFileName('');
          setAnalysisResult(null);
          setIsSaved(false);
        }
      }
    }
    loadLatestResume();
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Resume Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Resume ATS Analyzer & Enhancer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload or paste your resume content below to evaluate ATS compatibility, keyword match rate, and recruiter suggestions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={handleChooseResume}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <UploadCloud className="w-4 h-4" /> Upload New Resume
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Check ATS Score
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleSaveResume}
            disabled={isAnalyzing || !analysisResult || isSaved}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> {isSaved ? 'Resume Saved' : 'Save Resume'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Resume Content Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Resume Content Source
              </h3>
              <span className="text-[10px] text-slate-400">PDF / Plain Text Parser</span>
            </div>

            {/* Resume file picker and drag-and-drop target */}
            <div
              className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500/50 rounded-xl p-4 text-center bg-slate-900/40 transition-colors cursor-pointer block"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                readResumeFile(event.dataTransfer.files?.[0]);
              }}
            >
                <UploadCloud className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-slate-300 hover:text-indigo-300"
              >
                {hasResume ? 'Choose a different resume file' : 'Click to choose a resume file'}
              </button>
              <p className="text-xs font-semibold text-slate-300">or drag and drop it here</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Upload a file, check its ATS score, then save it for applications</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.txt,.md,.text,application/pdf,text/plain,text/markdown" 
                className="sr-only" 
                onChange={(event) => {
                  readResumeFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </div>

            {saveMessage && <p className={`text-xs ${isSaved ? 'text-emerald-400' : 'text-amber-400'}`} role="status">{saveMessage}</p>}

            {hasResume && (
              <>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">Resume Text Preview</label>
                    <button type="button" onClick={handleDeleteResume} className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300">
                      <Trash2 className="h-3.5 w-3.5" /> Delete resume
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={resumeText}
                    readOnly
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none leading-relaxed resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-400" /> Target Job Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    placeholder="e.g. SDE-1 at Microsoft requiring Java, Spring Boot, MySQL..."
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Col: ATS Score Breakdown & AI Insights */}
        <div className="lg:col-span-6 space-y-4">
          {!analysisResult ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
              <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto" />
              <h3 className="text-base font-bold text-white">{hasResume ? 'Check your resume to see ATS results' : 'Upload your resume to see ATS results'}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Check your ATS score first, then use Save Resume. Only a saved resume is attached when you apply.
              </p>
            </div>
          ) : (
            <>
              {/* ATS Score Card */}
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <div className="flex items-center justify-center">
                  
                  {/* Circular Gauge Simulation */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="58" stroke="currentColor" strokeWidth="10" className="text-slate-800" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="58" 
                        stroke="var(--primary)" 
                        strokeWidth="10" 
                        strokeDasharray={364}
                        strokeDashoffset={364 - (364 * displayScore) / 89}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out" 
                        fill="transparent" 
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-black text-white">{displayScore}%</span>
                      <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">ATS Score</p>
                    </div>
                  </div>

                </div>
              </div>

          {/* Section Checks */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Core Resume Section Check</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysisResult.sectionChecks.map((sec, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  {sec.present ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className={sec.present ? "text-slate-200 font-medium" : "text-slate-400"}>{sec.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords & Suggestions */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Detected Tech Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.foundKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md font-semibold">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Missing High-Impact Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.missingKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-md font-semibold">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> AI Suggestions to Improve Your ATS Score
              </h4>
              {analysisResult.suggestions.map((s, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-0.5">
                  <span className="font-semibold text-slate-200 block">{s.title}</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{s.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </>
      )}

        </div>

      </div>

    </div>
  );
}
