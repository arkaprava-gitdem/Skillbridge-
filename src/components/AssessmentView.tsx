import React, { useState } from 'react';
import {
  UserCheck2,
  CheckCircle2,
  Save,
  Sparkles,
  Award,
  Zap,
  RotateCcw,
  Database
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface AssessmentViewProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: 'programming',
    title: 'Core Programming & Scripting',
    question: 'How comfortable are you writing structured, clean code in languages like JavaScript, TypeScript, or Python?',
    default: 75
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    question: 'How confident are you working with trees, graphs, dynamic programming, sorting, and algorithmic complexity?',
    default: 65
  },
  {
    id: 'web',
    title: 'Web Architecture & Modern Frameworks',
    question: 'How proficient are you building responsive frontend user interfaces, state management, and REST APIs?',
    default: 70
  },
  {
    id: 'communication',
    title: 'Technical Communication & Presentation',
    question: 'How effectively can you articulate complex architectural trade-offs, documentation, and stakeholder demos?',
    default: 80
  },
  {
    id: 'problemSolving',
    title: 'Analytical Problem Decomposition',
    question: 'How well do you break an unfamiliar, ambiguous system problem into discrete testable components?',
    default: 75
  }
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({ user, onUserUpdated }) => {
  const initialAnswers: Record<string, number> = {};
  ASSESSMENT_QUESTIONS.forEach((q) => {
    initialAnswers[q.id] = user.skillScores?.[q.id] ?? q.default;
  });

  const [answers, setAnswers] = useState<Record<string, number>>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (id: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(null);
    try {
      const res = await api.submitAssessment(answers);
      onUserUpdated(res.user);
      setSuccess('Assessment recorded! Your skill scores and recommendations in the database have been updated.');
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      } catch (_) {}
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const answerList = Object.values(answers) as number[];
  const calculatedAverage = answerList.length > 0
    ? Math.round(answerList.reduce((a, b) => a + Number(b), 0) / answerList.length)
    : 0;

  return (
    <div id="assessment-view-content" className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <UserCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>DYNAMIC PROFILE CALIBRATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              5-Minute Skill Assessment
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
              Rate your proficiency honestly across each domain. The platform stores your scores in the database to drive personalized recommendation rankings.
            </p>
          </div>
        </div>

        {/* Live average badge */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shrink-0 min-w-[130px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Index</span>
          <div className="text-2xl font-black text-indigo-400 mt-0.5">{calculatedAverage}%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Live Score</span>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-300 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {ASSESSMENT_QUESTIONS.map((q, idx) => {
          const currentVal = answers[q.id] ?? 50;
          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-black text-xs flex items-center justify-center font-mono">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{q.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{q.question}</p>
                  </div>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <span className="text-base font-black text-indigo-400 font-mono">{currentVal}%</span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="pt-2">
                <input
                  id={`slider-${q.id}`}
                  type="range"
                  min="0"
                  max="100"
                  value={currentVal}
                  onChange={(e) => handleChange(q.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                  <span>Beginner (0%)</span>
                  <span>Intermediate (50%)</span>
                  <span>Advanced / Master (100%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4">
        <button
          id="reset-assessment-btn"
          type="button"
          onClick={() => {
            const defaults: Record<string, number> = {};
            ASSESSMENT_QUESTIONS.forEach((q) => {
              defaults[q.id] = q.default;
            });
            setAnswers(defaults);
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>

        <button
          id="save-assessment-btn"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Writing to Database...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Assessment to Database</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
