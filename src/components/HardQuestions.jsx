import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { Star, ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function HardQuestions({
  allQuestions,
  hardQuestionKeys,
  onToggleHard
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [justMasteredKey, setJustMasteredKey] = useState(null);

  // Filter full question objects that are saved in hardQuestionKeys
  const hardQuestionsList = allQuestions.filter(q => {
    const key = `${q.source}_${q.id}`;
    return hardQuestionKeys.includes(key);
  });

  // Keep currentIdx bounded if hardQuestionsList shrinks
  useEffect(() => {
    if (currentIdx >= hardQuestionsList.length && hardQuestionsList.length > 0) {
      setCurrentIdx(hardQuestionsList.length - 1);
    }
  }, [hardQuestionsList.length, currentIdx]);

  const currentQ = hardQuestionsList[currentIdx];

  const handleSelectOption = (qKey, labels) => {
    setUserAnswers(prev => ({ ...prev, [qKey]: labels }));
    const userStr = Array.isArray(labels) ? labels.join('') : labels;

    // Check if correct -> auto remove from hard list after brief toast
    if (currentQ && userStr === currentQ.answer) {
      setJustMasteredKey(qKey);
      setTimeout(() => {
        onToggleHard(currentQ.source, currentQ.id);
        setJustMasteredKey(null);
      }, 1200);
    }
  };

  if (hardQuestionsList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto glass-panel p-10 text-center space-y-4 animate-fade-in my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-white">Tuyệt vời! Không còn câu hỏi khó nào.</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Bạn đã hoàn thành xuất sắc tất cả các câu hỏi khó. Trong quá trình học nếu gặp câu chưa vững, hãy nhấn <strong>"Lưu câu khó ⭐"</strong> nhé.
        </p>
      </div>
    );
  }

  const qKey = currentQ ? `${currentQ.source}_${currentQ.id}` : '';
  const currentAns = userAnswers[qKey] || [];
  const isMastered = justMasteredKey === qKey;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in flex flex-col min-h-[calc(100vh-140px)]">
      {/* Header Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Star className="w-5 h-5 fill-amber-400/40" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-white">Luyện tập Câu hỏi khó</h2>
            <p className="text-xs text-slate-400">Còn {hardQuestionsList.length} câu khó • Làm đúng sẽ tự động biến mất</p>
          </div>
        </div>

        <div className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30">
          Câu {currentIdx + 1} / {hardQuestionsList.length}
        </div>
      </div>

      {/* Mastered Feedback Toast */}
      {isMastered && (
        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 p-3 rounded-xl text-center text-sm font-bold animate-fade-in flex items-center justify-center gap-2 flex-shrink-0">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Chính xác! Đã tự động xóa câu này khỏi danh sách câu khó 🎉</span>
        </div>
      )}

      {/* Scrollable Question Container */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 mb-4">
        {currentQ && (
          <QuestionCard
            question={currentQ}
            questionIndex={currentIdx}
            totalQuestions={hardQuestionsList.length}
            userAnswer={currentAns}
            onSelectOption={(labels) => handleSelectOption(qKey, labels)}
            isHard={true}
            onToggleHard={() => onToggleHard(currentQ.source, currentQ.id)}
            showAnswer={currentAns.length > 0}
            mode="study"
          />
        )}
      </div>

      {/* Sticky Bottom Navigation Controls Bar */}
      <div className="sticky bottom-2 z-30 glass-panel p-3 flex items-center justify-between gap-4 border border-indigo-500/30 shadow-2xl backdrop-blur-xl flex-shrink-0">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="btn btn-secondary text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Câu trước
        </button>

        <span className="text-xs text-slate-300 font-medium hidden sm:inline">
          Còn <strong className="text-amber-400">{hardQuestionsList.length}</strong> câu khó cần luyện
        </span>

        <button
          onClick={() => setCurrentIdx(prev => Math.min(hardQuestionsList.length - 1, prev + 1))}
          disabled={currentIdx === hardQuestionsList.length - 1}
          className="btn btn-primary text-sm px-5 py-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Câu tiếp <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
