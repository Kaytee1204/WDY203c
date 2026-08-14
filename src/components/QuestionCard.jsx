import React from 'react';
import { Star, CheckCircle2, XCircle } from 'lucide-react';

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  onSelectOption,
  isHard,
  onToggleHard,
  showAnswer = false,
  mode = 'study'
}) {
  const isMultiSelect = (question.answer && question.answer.length > 1) || 
    (question.question && (question.question.toLowerCase().includes('choose all') || question.question.toLowerCase().includes('pick all')));

  const selectedLabels = Array.isArray(userAnswer) 
    ? userAnswer 
    : (userAnswer ? userAnswer.split('') : []);

  const correctLabels = question.answer ? question.answer.split('') : [];

  const handleOptionClick = (label) => {
    if (mode === 'review' || (mode === 'study' && showAnswer)) return;

    if (isMultiSelect) {
      if (selectedLabels.includes(label)) {
        onSelectOption(selectedLabels.filter(l => l !== label));
      } else {
        onSelectOption([...selectedLabels, label].sort());
      }
    } else {
      onSelectOption([label]);
    }
  };

  return (
    <div className="glass-panel p-6 mb-4 animate-fade-in relative overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          {questionIndex !== undefined && (
            <span className="text-sm font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/30">
              Câu {questionIndex + 1} {totalQuestions ? `/ ${totalQuestions}` : ''}
            </span>
          )}
          {isMultiSelect ? (
            <span className="badge badge-multi">Chọn nhiều đáp án</span>
          ) : (
            <span className="badge badge-wdu1">Chọn 1 đáp án</span>
          )}
        </div>

        {/* Hard question bookmark toggle */}
        <button
          onClick={onToggleHard}
          className={`btn btn-star text-xs px-3 py-1.5 rounded-lg ${isHard ? 'active' : ''}`}
          title={isHard ? 'Đã lưu vào danh sách câu khó' : 'Đánh dấu câu khó'}
        >
          <Star className={`w-4 h-4 ${isHard ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{isHard ? 'Đã lưu câu khó' : 'Lưu câu khó'}</span>
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedLabels.includes(option.label);
          const isCorrectOption = correctLabels.includes(option.label);

          let optionStyle = "glass-card p-4 flex items-start gap-3.5 cursor-pointer border transition-all ";
          
          if (showAnswer) {
            if (isCorrectOption) {
              optionStyle += "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
            } else if (isSelected && !isCorrectOption) {
              optionStyle += "bg-rose-950/40 border-rose-500/60 text-rose-200";
            } else {
              optionStyle += "opacity-50 border-white/5";
            }
          } else {
            if (isSelected) {
              optionStyle += "bg-indigo-600/25 border-indigo-500 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]";
            } else {
              optionStyle += "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-200";
            }
          }

          return (
            <div
              key={option.label}
              onClick={() => handleOptionClick(option.label)}
              className={optionStyle}
            >
              <div className="mt-0.5 flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-${isMultiSelect ? 'md' : 'full'} flex items-center justify-center font-bold text-xs border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'border-slate-500 bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {option.label}
                </div>
              </div>

              <div className="flex-1 text-base">
                {option.text}
              </div>

              {showAnswer && (
                <div className="flex-shrink-0">
                  {isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-fade-in" />
                  )}
                  {isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 animate-fade-in" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
