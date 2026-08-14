import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export default function QuestionPalette({
  questions,
  currentIndex,
  userAnswers, // { [qKey]: ['A'] }
  hardQuestionKeys, // Array of hard question keys
  onSelectIndex,
  showAnswerStatus = false // if true, show green for correct, red for incorrect
}) {
  return (
    <div className="glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-200 font-heading">Bảng Ma trận Câu hỏi</h4>
        <span className="text-xs text-slate-400">
          Đã chọn {Object.keys(userAnswers).length} / {questions.length}
        </span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
        {questions.map((q, idx) => {
          const qKey = `${q.source}_${q.id}`;
          const ans = userAnswers[qKey];
          const hasAnswer = ans && ans.length > 0;
          const isHard = hardQuestionKeys.includes(qKey);
          const isCurrent = idx === currentIndex;

          let btnClass = "relative w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer border ";

          if (showAnswerStatus) {
            const userStr = Array.isArray(ans) ? ans.join('') : (ans || '');
            const isCorrect = userStr === q.answer;
            if (isCorrect) {
              btnClass += "bg-emerald-600/30 text-emerald-300 border-emerald-500/50 ";
            } else if (hasAnswer && !isCorrect) {
              btnClass += "bg-rose-600/30 text-rose-300 border-rose-500/50 ";
            } else {
              btnClass += "bg-slate-800 text-slate-400 border-white/5 ";
            }
          } else {
            if (hasAnswer) {
              btnClass += "bg-indigo-600 text-white border-indigo-400 shadow-md ";
            } else {
              btnClass += "bg-slate-800/80 text-slate-300 border-white/10 hover:border-white/20 ";
            }
          }

          if (isCurrent) {
            btnClass += "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-105 ";
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={btnClass}
              title={`Câu ${idx + 1}`}
            >
              <span>{idx + 1}</span>

              {/* Hard Question Indicator Star */}
              {isHard && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center text-[8px] text-slate-900 font-bold shadow">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-600 border border-indigo-400" />
          <span>Đã làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-800 border border-white/10" />
          <span>Chưa làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-400" />
          <span>Câu khó</span>
        </div>
      </div>
    </div>
  );
}
