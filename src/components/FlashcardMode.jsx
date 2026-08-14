import React, { useState, useEffect } from 'react';
import { Star, RotateCw, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export default function FlashcardMode({
  allQuestions,
  hardQuestionKeys,
  onToggleHard
}) {
  const [batchSize, setBatchSize] = useState(30);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [activeBatchIndex, setActiveBatchIndex] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredQuestions = allQuestions.filter(q => {
    if (sourceFilter === 'WDU1') return q.source === 'WDU1';
    if (sourceFilter === 'WDU2') return q.source === 'WDU2';
    return true;
  });

  // Calculate Batches
  const totalBatches = Math.ceil(filteredQuestions.length / batchSize);
  const batches = Array.from({ length: totalBatches }, (_, idx) => {
    const start = idx * batchSize;
    const end = Math.min((idx + 1) * batchSize, filteredQuestions.length);
    return {
      index: idx,
      title: `Đợt ${idx + 1}`,
      questions: filteredQuestions.slice(start, end),
      startNum: start + 1,
      endNum: end
    };
  });

  const handleSelectBatch = (batchIdx) => {
    setActiveBatchIndex(batchIdx);
    setCurrentQIndex(0);
    setIsFlipped(false);
  };

  const activeBatch = activeBatchIndex !== null ? batches[activeBatchIndex] : null;

  // Reset flip status when index changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentQIndex, activeBatchIndex]);

  // Keyboard navigation support
  useEffect(() => {
    if (activeBatchIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (activeBatch && currentQIndex < activeBatch.questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (currentQIndex > 0) {
          setCurrentQIndex(prev => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQIndex, activeBatchIndex, activeBatch]);

  // Render Batch Selection Menu
  if (!activeBatch) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-8">
        <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-heading gradient-text">Học Flashcard (Lật thẻ)</h2>
            <p className="text-sm text-slate-400">Chọn đợt học 30 câu để lật thẻ học nhanh</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { setBatchSize(30); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  batchSize === 30 ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                30 câu / đợt
              </button>
              <button
                onClick={() => { setBatchSize(50); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  batchSize === 50 ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                50 câu / đợt
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { setSourceFilter('ALL'); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sourceFilter === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({allQuestions.length})
              </button>
              <button
                onClick={() => { setSourceFilter('WDU1'); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sourceFilter === 'WDU1' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                WDU1
              </button>
              <button
                onClick={() => { setSourceFilter('WDU2'); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sourceFilter === 'WDU2' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                WDU2
              </button>
            </div>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.index}
              onClick={() => handleSelectBatch(batch.index)}
              className="glass-panel p-5 cursor-pointer hover:border-purple-500/50 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold font-heading text-white group-hover:text-purple-300">
                  {batch.title}
                </span>
                <span className="badge badge-warning">
                  {batch.questions.length} câu
                </span>
              </div>

              <div className="text-xs text-slate-400">
                Flashcard câu {batch.startNum} - {batch.endNum}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Học Flashcard đợt này</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Flashcard Batch Screen
  const currentQ = activeBatch.questions[currentQIndex];
  const qKey = `${currentQ.source}_${currentQ.id}`;
  const isHard = hardQuestionKeys.includes(qKey);

  const isMultiSelect = (currentQ.answer && currentQ.answer.length > 1) || 
    (currentQ.question && (currentQ.question.toLowerCase().includes('choose all') || currentQ.question.toLowerCase().includes('pick all')));

  const correctLabels = currentQ.answer ? currentQ.answer.split('') : [];
  const progressPercent = Math.round(((currentQIndex + 1) / activeBatch.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in flex flex-col min-h-[calc(100vh-140px)]">
      {/* Top Header Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4 flex-shrink-0">
        <button
          onClick={() => setActiveBatchIndex(null)}
          className="btn btn-secondary text-xs px-3 py-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Chọn đợt khác
        </button>

        <div className="flex-1 max-w-md mx-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Flashcard {activeBatch.title} ({activeBatch.questions.length} câu)</span>
            <span>{currentQIndex + 1} / {activeBatch.questions.length}</span>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="btn btn-accent text-xs px-3 py-1.5"
        >
          <RotateCw className="w-4 h-4" /> {isFlipped ? 'Quay lại câu hỏi' : 'Lật xem đáp án'}
        </button>
      </div>

      {/* Main Flashcard Card Area with Scroll Constraint */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 mb-4">
        {!isFlipped ? (
          /* FRONT SIDE - Question & Options */
          <div className="glass-panel p-6 md:p-8 space-y-6 border-indigo-500/30">
            {/* Header info */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/30">
                  Câu {currentQIndex + 1} / {activeBatch.questions.length}
                </span>
                {isMultiSelect ? (
                  <span className="badge badge-multi">Chọn nhiều đáp án</span>
                ) : (
                  <span className="badge badge-wdu1">Chọn 1 đáp án</span>
                )}
              </div>

              <button
                onClick={() => onToggleHard(currentQ.source, currentQ.id)}
                className={`btn btn-star text-xs px-3 py-1.5 rounded-lg ${isHard ? 'active' : ''}`}
              >
                <Star className={`w-4 h-4 ${isHard ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isHard ? 'Đã lưu câu khó' : 'Lưu câu khó'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-lg md:text-xl font-medium text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options list */}
            <div className="space-y-3">
              {currentQ.options.map(opt => (
                <div key={opt.label} className="glass-card p-4 flex items-start gap-3 border-white/10 text-slate-200">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-xs text-indigo-300 flex-shrink-0">
                    {opt.label}
                  </span>
                  <span className="text-base">{opt.text}</span>
                </div>
              ))}
            </div>

            {/* Flip prompt button */}
            <div className="pt-4 text-center border-t border-white/10">
              <button
                onClick={() => setIsFlipped(true)}
                className="btn btn-primary px-6 py-2.5 text-sm shadow-xl w-full sm:w-auto"
              >
                <RotateCw className="w-4 h-4" /> Click hoặc bấm phím cách (Space) để Lật xem đáp án đúng
              </button>
            </div>
          </div>
        ) : (
          /* BACK SIDE - Correct Answer & Explanation */
          <div className="glass-panel p-6 md:p-8 space-y-6 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900">
            {/* Back Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-500/30">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-base shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  ĐÁP ÁN ĐÚNG: {currentQ.answer}
                </span>
              </div>

              <button
                onClick={() => onToggleHard(currentQ.source, currentQ.id)}
                className={`btn btn-star text-xs px-3 py-1.5 rounded-lg ${isHard ? 'active' : ''}`}
              >
                <Star className={`w-4 h-4 ${isHard ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isHard ? 'Đã lưu câu khó' : 'Lưu câu khó'}</span>
              </button>
            </div>

            <h4 className="text-base font-medium text-slate-300">
              {currentQ.question}
            </h4>

            {/* Highlighted Options */}
            <div className="space-y-3">
              {currentQ.options.map(opt => {
                const isCorrect = correctLabels.includes(opt.label);
                return (
                  <div 
                    key={opt.label} 
                    className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                      isCorrect
                        ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-900/40 border-white/5 opacity-40 text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {opt.label}
                    </span>
                    <span className="text-base">{opt.text}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Answer details */}
            {currentQ.answer_text && currentQ.answer_text.length > 0 && (
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Giải thích chi tiết:</h5>
                {currentQ.answer_text.map((txt, idx) => (
                  <div key={idx} className="text-sm text-slate-200 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 text-center border-t border-emerald-500/30">
              <button
                onClick={() => setIsFlipped(false)}
                className="btn btn-secondary px-6 py-2.5 text-sm w-full sm:w-auto"
              >
                <RotateCw className="w-4 h-4" /> Quay lại xem mặt trước câu hỏi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Controls */}
      <div className="sticky bottom-2 z-30 glass-panel p-3 flex items-center justify-between gap-4 border border-indigo-500/30 shadow-2xl backdrop-blur-xl flex-shrink-0">
        <button
          onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQIndex === 0}
          className="btn btn-secondary text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Câu trước
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="btn btn-accent text-sm px-4 py-2 shadow-lg"
        >
          <RotateCw className="w-4 h-4" /> {isFlipped ? 'Mặt trước' : 'Lật xem đáp án'}
        </button>

        <button
          onClick={() => setCurrentQIndex(prev => Math.min(activeBatch.questions.length - 1, prev + 1))}
          disabled={currentQIndex === activeBatch.questions.length - 1}
          className="btn btn-primary text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Câu tiếp <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
