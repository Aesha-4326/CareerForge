import {
  CheckCircle2,
  Code,
  Flame,
  Play,
  RotateCcw,
  Terminal
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { API_URL } from '../../utils/api';
import { DSA_PROBLEMS } from '../../data/dsaProblems';
import { useAuth } from '../../context/AuthContext';

export default function DsaPractice() {
  const { user } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState(DSA_PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState('java'); // java, python, javascript
  const [codeContent, setCodeContent] = useState(DSA_PROBLEMS[0].starterCode.java);
  const [executionOutput, setExecutionOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState(DSA_PROBLEMS[0].timeComplexity);
  const [spaceComplexity, setSpaceComplexity] = useState(DSA_PROBLEMS[0].spaceComplexity);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [dsaStats, setDsaStats] = useState({
    totalSolved: 14,
    currentStreak: 5,
    solvedProblemIds: []
  });

  // Fetch student DSA statistics and streak from MongoDB on mount
  useEffect(() => {
    async function loadDsaStats() {
      if (user && user.token) {
        try {
          const res = await fetch(`${API_URL}/api/dsa/stats`, {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok && data.progress) {
            setDsaStats({
              totalSolved: data.progress.totalSolved || 0,
              currentStreak: data.progress.currentStreak || 1,
              solvedProblemIds: data.progress.solvedProblemIds || []
            });
          }
        } catch {
          // Fallback to default state
        }
      }
    }
    loadDsaStats();
  }, [user]);

  useEffect(() => {
    async function loadSubmissionHistory() {
      if (!user?.token) return;
      setIsHistoryLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/dsa/history`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.history)) setSubmissionHistory(data.history);
      } catch {
        setSubmissionHistory([]);
      } finally {
        setIsHistoryLoading(false);
      }
    }

    loadSubmissionHistory();
  }, [user]);

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setCodeContent(problem.starterCode[selectedLanguage] || problem.starterCode.java);
    setExecutionOutput(null);
    setTimeComplexity(problem.timeComplexity);
    setSpaceComplexity(problem.spaceComplexity);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setCodeContent(selectedProblem.starterCode[lang] || "");
    setExecutionOutput(null);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);

    try {
      const response = await fetch(`${API_URL}/api/dsa/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ code: codeContent, language: selectedLanguage })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to run code.');
      setExecutionOutput({
        status: data.result.status,
        runtime: data.result.time,
        memory: data.result.memory,
        testCasesPassed: data.result.stderr ? 'Code runner returned an error.' : 'Code execution completed.',
        output: data.result.stdout || 'No output',
        expected: data.result.stderr || 'No runtime errors reported.'
      });
    } catch (error) {
      setExecutionOutput({ status: 'Run unavailable', runtime: '-', memory: '-', testCasesPassed: error.message, output: '-', expected: 'Configure Judge0 to enable code execution.' });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitPractice = async () => {
    setIsSubmitting(true);

    const submissionPayload = {
      problemId: String(selectedProblem.id),
      problemTitle: selectedProblem.title,
      difficulty: selectedProblem.difficulty,
      language: selectedLanguage,
      code: codeContent,
      timeComplexity,
      spaceComplexity,
      status: "Submitted",
      testsPassed: 0,
      totalTests: 0,
      executionTimeMs: 0
    };

    if (user && user.token) {
      try {
          const res = await fetch(`${API_URL}/api/dsa/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify(submissionPayload)
        });
        const data = await res.json();
        if (res.ok && data.progress) {
          setDsaStats({
            totalSolved: data.progress.totalSolved,
            currentStreak: data.progress.currentStreak,
            solvedProblemIds: data.progress.solvedProblemIds || []
          });
          if (data.submission) {
            setSubmissionHistory((history) => [data.submission, ...history.filter((item) => item._id !== data.submission._id)].slice(0, 20));
          }
        }
      } catch {
        // Fallback to local execution state
      }
    }

    setTimeout(() => {
      setExecutionOutput({
        status: "Submitted for Practice",
        runtime: "Not evaluated",
        memory: "Not evaluated",
        testCasesPassed: "Your code was saved to your practice history.",
        output: "Use your own test cases while practicing.",
        expected: "Automatic judging is not enabled."
      });
      setIsSubmitting(false);
    }, 600);
  };

  const filteredProblems = DSA_PROBLEMS.filter(p => filterDifficulty === 'All' || p.difficulty === filterDifficulty);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Code className="w-4 h-4" />
            <span>Interactive Placement Coding Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-white">DSA & Coding Practice Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Master high-frequency campus placement coding problems asked in Google, Microsoft, and Amazon interviews.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Current Streak</p>
            <p className="text-xs font-bold text-white">{dsaStats.currentStreak} Days Active 🔥</p>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <p className="text-[10px] text-slate-400">Total Solved</p>
            <p className="text-xs font-bold text-emerald-400">{dsaStats.totalSolved} Problems</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Problem Selector + Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Placement Problem Set</h3>
              
              {/* Difficulty Filter */}
              <select 
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-slate-900 text-xs text-slate-300 border border-slate-800 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredProblems.map(problem => {
                const isSelected = selectedProblem.id === problem.id;
                return (
                  <div
                    key={problem.id}
                    onClick={() => handleSelectProblem(problem)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs">{problem.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{problem.category}</p>
                    
                    <div className="flex items-center space-x-1 mt-2">
                      {problem.companies.map((c, i) => (
                        <span key={i} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Code Editor & Execution Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Problem Details Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{selectedProblem.title}</h2>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                  selectedProblem.difficulty === 'Easy'
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : selectedProblem.difficulty === 'Medium'
                      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                }`}>{selectedProblem.difficulty}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedProblem.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <h3 className="font-bold text-white mb-1">Input</h3>
                <p className="text-slate-400">{selectedProblem.inputFormat}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <h3 className="font-bold text-white mb-1">Output</h3>
                <p className="text-slate-400">{selectedProblem.outputFormat}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white mb-2">Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedProblem.examples.slice(0, 2).map((example, index) => (
                <div key={index} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <span className="text-indigo-400 font-bold block mb-1">Example {index + 1}:</span>
                  <p className="text-slate-300"><span className="text-slate-500">Input:</span> {example.input}</p>
                  <p className="text-emerald-400 font-bold"><span className="text-slate-500">Output:</span> {example.output}</p>
                  {example.explanation && <p className="text-slate-400 mt-2 font-sans">Explanation: {example.explanation}</p>}
                </div>
              ))}
            </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white mb-2">Constraints</h3>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
                {selectedProblem.constraints?.map((constraint) => <li key={constraint}>{constraint}</li>)}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="text-xs text-slate-400">
                Time Complexity
                <input
                  value={timeComplexity}
                  onChange={(e) => setTimeComplexity(e.target.value)}
                  placeholder="e.g. O(n)"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-[var(--editor-surface)] px-3 py-2 text-xs text-[var(--editor-text)] placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </label>
              <label className="text-xs text-slate-400">
                Space Complexity
                <input
                  value={spaceComplexity}
                  onChange={(e) => setSpaceComplexity(e.target.value)}
                  placeholder="e.g. O(n)"
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-[var(--editor-surface)] px-3 py-2 text-xs text-[var(--editor-text)] placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Code Editor Header */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Code Editor</span>
              </div>

              {/* Language Selector */}
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                {['java', 'python', 'javascript'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded font-mono uppercase text-[10px] transition-all ${
                      selectedLanguage === lang ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Input Area */}
            <textarea
              rows={10}
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="dsa-code-editor w-full rounded-xl p-4 text-xs font-mono focus:outline-none leading-relaxed resize-none shadow-inner"
              spellCheck="false"
            ></textarea>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => setCodeContent(selectedProblem.starterCode[selectedLanguage])}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Starter Code
              </button>

              <div className="flex items-center gap-2">
              <button 
                onClick={handleRunCode}
                disabled={isExecuting}
                className="px-4 py-2.5 rounded-xl border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 font-bold text-xs flex items-center gap-2 transition-all"
              >
                {isExecuting ? (
                  <>Running...</>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Run Code
                  </>
                )}
              </button>
              <button 
                onClick={handleSubmitPractice}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Submit Practice'}
              </button>
              </div>
            </div>
          </div>

          {/* Execution Output Panel */}
          {executionOutput && (
            <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {executionOutput.status} - {executionOutput.testCasesPassed}
                </span>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                  <span>Runtime: <strong className="text-white">{executionOutput.runtime}</strong></span>
                  <span>Memory: <strong className="text-white">{executionOutput.memory}</strong></span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                <p className="text-slate-400">Standard Output: <span className="text-emerald-300 font-bold">{executionOutput.output}</span></p>
                <p className="text-slate-400">Expected Output: <span className="text-emerald-300 font-bold">{executionOutput.expected}</span></p>
              </div>
            </div>
          )}

        </div>

      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">DSA Submission History</h2>
            <p className="text-xs text-slate-400 mt-1">Your saved solutions, including the code submitted for each problem.</p>
          </div>
          <span className="text-[10px] text-slate-500">{submissionHistory.length} recent submissions</span>
        </div>

        {isHistoryLoading ? (
          <p className="text-xs text-slate-400 py-3">Loading your submissions...</p>
        ) : submissionHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-3">No submissions yet. Submit a solution to create your history.</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {submissionHistory.map((submission) => (
              <details key={submission._id} className="bg-slate-900/70 border border-slate-800 rounded-xl p-3">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white">{submission.problemTitle}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {submission.language} | {new Date(submission.createdAt).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Time: {submission.timeComplexity || 'Not specified'} | Space: {submission.spaceComplexity || 'Not specified'}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${submission.status === 'Passed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                      {submission.status}
                    </span>
                  </div>
                </summary>
                <pre className="mt-3 whitespace-pre-wrap bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-300 font-mono overflow-x-auto">{submission.code}</pre>
              </details>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
