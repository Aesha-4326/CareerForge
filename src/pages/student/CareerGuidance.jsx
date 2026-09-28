import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Code,
  Layers,
  Lightbulb,
  MessageCircleQuestion,
  RefreshCw,
  Sparkles,
  Target
} from 'lucide-react';
import React, { useState } from 'react';

import { API_URL } from '../../utils/api';
import { generateCareerRoadmap } from '../../utils/aiServices';
import { useAuth } from '../../context/AuthContext';

export default function CareerGuidance({ student }) {
  const { user } = useAuth();
  const [targetGoalInput, setTargetGoalInput] = useState("I want to become a Java Full Stack Developer.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [careerAnswer, setCareerAnswer] = useState(null);

  const handleGenerateRoadmap = async (e = null, customGoal = null) => {
    if (e) e.preventDefault();
    const goalToUse = customGoal || targetGoalInput;
    if (!goalToUse || !goalToUse.trim()) return;
    
    setIsGenerating(true);

    if (user && user.token) {
      try {
        const res = await fetch(`${API_URL}/api/guidance/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ targetGoal: goalToUse.trim() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Roadmap generation failed');
        if (data.roadmap) {
          setRoadmapData({
            targetRole: data.roadmap.targetRole,
            matchPercentage: data.roadmap.matchPercentage,
            currentSkills: data.roadmap.currentSkills || student.skills,
            missingSkills: data.roadmap.missingSkills || [],
            roadmapTimeline: data.roadmap.roadmapTimeline || [],
            recommendedProjects: data.roadmap.recommendedProjects || [],
            dsaFocusTopics: data.roadmap.dsaFocusTopics || [],
            interviewPrepTips: data.roadmap.interviewPrepTips || []
          });
        }
      } catch (err) {
        console.error("Career guidance API error:", err);
        setRoadmapData(generateCareerRoadmap(goalToUse.trim(), student.skills));
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/api/guidance/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetGoal: goalToUse.trim(),
            currentSkills: student.skills || []
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Roadmap preview failed');
        if (data.roadmap) setRoadmapData(data.roadmap);
      } catch (err) {
        console.error("Career guidance preview API error:", err);
        setRoadmapData(generateCareerRoadmap(goalToUse.trim(), student.skills));
      }
    }
    setIsGenerating(false);
  };

  const handleAskAI = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setIsAsking(true);
    setCareerAnswer(null);
    try {
      const endpoint = user?.token ? `${API_URL}/api/guidance/ask-authenticated` : `${API_URL}/api/guidance/ask`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({ question: question.trim(), targetGoal: targetGoalInput, currentSkills: student.skills || [] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to answer this question.');
      setCareerAnswer(data.answer);
    } catch (error) {
      setCareerAnswer({
        field: 'Career guidance',
        answer: error.message || 'Unable to answer right now. Please try again.',
        nextSteps: [],
        resources: []
      });
    } finally {
      setIsAsking(false);
    }
  };

  // Load latest persisted AI Career Roadmap from MongoDB on mount or generate initial Gemini roadmap
  React.useEffect(() => {
    async function loadLatestRoadmap() {
      if (user && user.token) {
        try {
          const res = await fetch(`${API_URL}/api/guidance/latest`, {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok && data.roadmap) {
            setTargetGoalInput(data.roadmap.targetGoal);
            setRoadmapData({
              targetRole: data.roadmap.targetRole,
              matchPercentage: data.roadmap.matchPercentage,
              currentSkills: data.roadmap.currentSkills || student.skills,
              missingSkills: data.roadmap.missingSkills || [],
              roadmapTimeline: data.roadmap.roadmapTimeline || [],
              recommendedProjects: data.roadmap.recommendedProjects || [],
              dsaFocusTopics: data.roadmap.dsaFocusTopics || [],
              interviewPrepTips: data.roadmap.interviewPrepTips || []
            });
          } else {
            handleGenerateRoadmap(null, "I want to become a Java Full Stack Developer.");
          }
        } catch {
          handleGenerateRoadmap(null, "I want to become a Java Full Stack Developer.");
        }
      } else {
        handleGenerateRoadmap(null, "I want to become a Java Full Stack Developer.");
      }
    }
    loadLatestRoadmap();
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Career Advisor Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Career Guidance & Learning Roadmap</h1>
          <p className="text-xs text-slate-400 mt-1">
            Specify your career goal to receive a tailored skill gap analysis, week-by-week learning roadmap, DSA topics, and portfolio projects.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 rounded-xl text-xs text-purple-300">
          <Target className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Active Role Goal: <strong>{roadmapData?.targetRole || "Analyzing Career Path..."}</strong></span>
        </div>
      </div>

      {/* Goal Prompt Form */}
      <form onSubmit={handleGenerateRoadmap} className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" /> Enter Your Desired Career Goal
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text"
            value={targetGoalInput}
            onChange={(e) => setTargetGoalInput(e.target.value)}
            placeholder="e.g., 'I want to become a Java Full Stack Developer' or 'AI Data Scientist'..."
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate AI Roadmap
              </>
            )}
          </button>
        </div>
      </form>

      {/* Skill Gap & Learning Roadmap Content */}
      {!roadmapData ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Google Gemini AI Engine Synthesizing Career Roadmap...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Evaluating candidate profile, extracted technical skills, and target career goal to build your personalized 3-phase study roadmap.
          </p>
        </div>
      ) : (
        <>
          {/* Skill Gap Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Acquired Skills */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Current Acquired Skills ({(roadmapData.currentSkills || []).length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(roadmapData.currentSkills || []).map((skill, i) => (
                  <span key={i} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-lg font-medium">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Recommended Skills to Learn ({(roadmapData.missingSkills || []).length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(roadmapData.missingSkills || []).map((skill, i) => (
                  <span key={i} className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3 py-1 rounded-lg font-medium">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Timeline Learning Roadmap */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Structured Learning Roadmap for {roadmapData.targetRole}
            </h3>

            <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {(roadmapData.roadmapTimeline || []).map((step, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    {idx + 1}
                  </div>
                  <div className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-indigo-300">{step.phase}</h4>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                        {step.focus}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      {(step.topics || []).map((t, i) => (
                        <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                          • {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: Recommended Projects & DSA Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recommended Capstone Projects */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                Recommended Portfolio Projects
              </h3>
              <div className="space-y-3">
                {(roadmapData.recommendedProjects || []).map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white">{p.title}</h4>
                      <span className="text-[10px] text-purple-300 font-medium bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{p.tech}</span>
                    </div>
                    <p className="text-xs text-slate-400">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DSA Focus Topics */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Key DSA Topics to Master
              </h3>
              <div className="space-y-2">
                {(roadmapData.dsaFocusTopics || []).map((topic, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-200">
                    <span>{topic}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">High Frequency</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      <form onSubmit={handleAskAI} className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <MessageCircleQuestion className="w-4 h-4 text-emerald-400" /> Ask about any career or learning field
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. Is cybersecurity a good career for me? How should I learn Python?"
            className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isAsking ? <><RefreshCw className="w-4 h-4 animate-spin" /> Thinking...</> : <><MessageCircleQuestion className="w-4 h-4" /> Ask AI</>}
          </button>
        </div>
        {careerAnswer && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-emerald-300">{careerAnswer.field || 'Career answer'}</h3>
              {careerAnswer.provider && <span className="text-[10px] text-slate-500">{careerAnswer.provider}</span>}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{careerAnswer.answer}</p>
            {careerAnswer.nextSteps?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">Next steps</h4>
                <ul className="list-disc space-y-1 pl-5 text-xs text-slate-400">
                  {careerAnswer.nextSteps.map((step, index) => <li key={index}>{step}</li>)}
                </ul>
              </div>
            )}
            {careerAnswer.resources?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-1">Useful resources</h4>
                <ul className="list-disc space-y-1 pl-5 text-xs text-slate-400">
                  {careerAnswer.resources.map((resource, index) => <li key={index}>{resource}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>

    </div>
  );
}
