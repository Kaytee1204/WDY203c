import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import { getCompletedBatches, markBatchCompleted } from '../utils/storage';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function PracticeMode({
  allQuestions,
  initialBatchSize = 30,
  hardQuestionKeys,
  onToggleHard
}) {
  const [batchSize, setBatchSize] = useState(initialBatchSize);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [activeBatchIndex, setActiveBatchIndex] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedBatches, setCompletedBatches] = useState([]);

  // Load completed batches on mount
  useEffect(() => {
    setCompletedBatches(getCompletedBatches());
  }, []);

  const filteredQuestions = allQuestions.filter(q => {
    if (sourceFilter === 'WDU1') return q.source === 'WDU1';
    if (sourceFilter === 'WDU2') return q.source === 'WDU2';
    return true;
  });

  const totalBatches = Math.ceil(filteredQuestions.length / batchSize);
  const batches = Array.from({ length: totalBatches }, (_, idx) => {
    const start = idx * batchSize;
    const end = Math.min((idx + 1) * batchSize, filteredQuestions.length);
    const key = `batch_${sourceFilter}_${batchSize}_${idx}`;
    return {
      index: idx,
      key,
      title: `Đợt ${idx + 1}`,
      questions: filteredQuestions.slice(start, end),
      startNum: start + 1,
      endNum: end
    };
  });

  // Handle selecting a batch -> ALWAYS start with clean slate (userAnswers = {})
  const handleSelectBatch = (batchIdx) => {
    setActiveBatchIndex(batchIdx);
    setCurrentQIndex(0);
    setIsCompleted(false);
    setUserAnswers({}); // Always fresh slate when re-entering batch!
  };

  const activeBatch = activeBatchIndex !== null ? batches[activeBatchIndex] : null;

  const handleSelectOption = (qKey, labels) => {
    setUserAnswers(prev => ({ ...prev, [qKey]: labels }));
  };

  // Submit batch and mark as completed
  const handleFinishBatch = () => {
    if (activeBatch) {
      const updated = markBatchCompleted(activeBatch.key);
      setCompletedBatches(updated);
    }
    setIsCompleted(true);
  };

  if (!activeBatch) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-8">
        {/* Header Controls */}
        <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-heading gradient-text">Chế độ Luyện tập</h2>
            <p className="text-sm text-slate-400">Chọn đợt học 30 hoặc 50 câu (Các đợt đã học có đánh dấu ✅)</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { setBatchSize(30); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  batchSize === 30 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                30 câu / đợt
              </button>
              <button
                onClick={() => { setBatchSize(50); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  batchSize === 50 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                50 câu / đợt
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => { setSourceFilter('ALL'); setActiveBatchIndex(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sourceFilter === 'ALL' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
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
                  sourceFilter === 'WDU2' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                WDU2
              </button>
            </div>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {batches.map((batch) => {
            const isDone = completedBatches.includes(batch.key);

            return (
              <div
                key={batch.index}
                onClick={() => handleSelectBatch(batch.index)}
                className={`glass-panel p-5 cursor-pointer hover:shadow-lg transition-all group flex flex-col justify-between space-y-4 border ${
                  isDone
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-heading text-white group-hover:text-indigo-300">
                    {batch.title}
                  </span>
                  
                  {isDone ? (
                    <span className="badge badge-success flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã học
                    </span>
                  ) : (
                    <span className="badge badge-wdu1">
                      {batch.questions.length} câu
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  Câu {batch.startNum} đến câu {batch.endNum}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-semibold group-hover:translate-x-1 transition-transform text-indigo-400">
                  <span>{isDone ? 'Học lại đợt này' : 'Bắt đầu học ngay'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = activeBatch.questions[currentQIndex];
  const qKey = `${currentQ.source}_${currentQ.id}`;
  const isHard = hardQuestionKeys.includes(qKey);
  const currentAnswer = userAnswers[qKey] || [];

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentQIndex + 1) / activeBatch.questions.length) * 100);

  const calculateScore = () => {
    let correct = 0;
    activeBatch.questions.forEach(q => {
      const key = `${q.source}_${q.id}`;
      const ans = userAnswers[key] || [];
      const userStr = Array.isArray(ans) ? ans.join('') : ans;
      if (userStr === q.answer) {
        correct++;
      }
    });
    return {
      correct,
      total: activeBatch.questions.length,
      percentage: Math.round((correct / activeBatch.questions.length) * 100)
    };
  };

  const scoreResult = calculateScore();

  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-140px)] animate-fade-in">
      {/* Top Header Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4 mb-4 flex-shrink-0">
        <button
          onClick={() => setActiveBatchIndex(null)}
          className="btn btn-secondary text-xs px-3 py-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Đổi đợt
        </button>

        <div className="flex-1 max-w-md mx-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{activeBatch.title} ({activeBatch.questions.length} câu)</span>
            <span>{currentQIndex + 1} / {activeBatch.questions.length}</span>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <button
          onClick={handleFinishBatch}
          className="btn btn-primary text-xs px-3 py-1.5"
        >
          Nộp bài đợt
        </button>
      </div>

      {!isCompleted ? (
        <>
          {/* Scrollable Question Container */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 mb-4">
            <QuestionCard
              question={currentQ}
              questionIndex={currentQIndex}
              totalQuestions={activeBatch.questions.length}
              userAnswer={currentAnswer}
              onSelectOption={(labels) => handleSelectOption(qKey, labels)}
              isHard={isHard}
              onToggleHard={() => onToggleHard(currentQ.source, currentQ.id)}
              showAnswer={currentAnswer.length > 0}
              mode="study"
            />
          </div>

          {/* Sticky Navigation Controls Footer Bar */}
          <div className="sticky bottom-2 z-30 glass-panel p-3 flex items-center justify-between gap-4 border border-indigo-500/30 shadow-2xl backdrop-blur-xl flex-shrink-0">
            <button
              onClick={() => {
                setCurrentQIndex(prev => Math.max(0, prev - 1));
              }}
              disabled={currentQIndex === 0}
              className="btn btn-secondary text-sm px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Câu trước
            </button>

            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Đã trả lời <strong className="text-indigo-400">{answeredCount}</strong> / {activeBatch.questions.length}
            </span>

            {currentQIndex < activeBatch.questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentQIndex(prev => Math.min(activeBatch.questions.length - 1, prev + 1));
                }}
                className="btn btn-primary text-sm px-5 py-2 shadow-lg"
              >
                Câu tiếp <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishBatch}
                className="btn btn-accent text-sm px-5 py-2 shadow-lg"
              >
                Xem kết quả <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      ) : (
        /* Completion Screen */
        <div className="glass-panel p-8 text-center space-y-6 my-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-white">Hoàn thành {activeBatch.title}!</h2>
            <p className="text-sm text-emerald-400 font-semibold">Đã ghi nhận đợt này vào danh sách Đã Học ✅</p>
          </div>

          <div className="inline-block p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="text-4xl font-extrabold font-heading gradient-text">
              {scoreResult.correct} / {scoreResult.total}
            </div>
            <div className="text-sm font-semibold text-slate-300">
              Chính xác: {scoreResult.percentage}%
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => { setIsCompleted(false); setCurrentQIndex(0); setUserAnswers({}); }}
              className="btn btn-secondary text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Học lại đợt này (Mới)
            </button>
            <button
              onClick={() => setActiveBatchIndex(null)}
              className="btn btn-primary text-sm"
            >
              Chọn đợt khác <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
