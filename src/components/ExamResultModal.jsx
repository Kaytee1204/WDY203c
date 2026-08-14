import React from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, Clock, RotateCcw, BookOpen, Star, AlertTriangle } from 'lucide-react';

export default function ExamResultModal({
  result, // { scorePercentage, correctCount, totalQuestions, timeSpentSeconds, userAnswers, examQuestions }
  onReview,
  onStartNewExam,
  onAddMissedToHard
}) {
  const isPassed = result.scorePercentage >= 80;

  // Trigger confetti if passed
  React.useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPassed]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} phút ${s < 10 ? '0' : ''}${s} giây`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-xl w-full p-6 md:p-8 space-y-6 text-center border border-white/20 shadow-2xl">
        {/* Pass/Fail Icon Banner */}
        <div className="mx-auto">
          {isPassed ? (
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Award className="w-10 h-10 animate-bounce" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-white">
            {isPassed ? 'Chúc mừng! Bạn đã ĐẠT' : 'Cố gắng lên! Chưa ĐẠT'}
          </h2>
          <p className="text-sm text-slate-400">
            {isPassed ? 'Bạn đã hoàn thành xuất sắc bài thi thử WDU203c' : 'Cần tối thiểu 80% câu đúng để đạt bài thi'}
          </p>
        </div>

        {/* Score Card Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-white/10">
          <div className="space-y-1">
            <div className="text-xs text-slate-400">Điểm số</div>
            <div className={`text-2xl font-extrabold font-heading ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.scorePercentage}%
            </div>
          </div>

          <div className="space-y-1 border-x border-white/10">
            <div className="text-xs text-slate-400">Số câu đúng</div>
            <div className="text-2xl font-extrabold font-heading text-indigo-300">
              {result.correctCount} / {result.totalQuestions}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">Thời gian làm</div>
            <div className="text-sm font-bold text-slate-200 mt-2">
              {formatTime(result.timeSpentSeconds)}
            </div>
          </div>
        </div>

        {/* Actions Button Stack */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReview}
              className="btn btn-secondary flex-1 text-sm py-2.5"
            >
              <BookOpen className="w-4 h-4" /> Xem chi tiết bài làm
            </button>
            
            <button
              onClick={onAddMissedToHard}
              className="btn btn-star flex-1 text-sm py-2.5"
            >
              <Star className="w-4 h-4" /> Lưu câu sai vào Câu khó
            </button>
          </div>

          <button
            onClick={onStartNewExam}
            className="btn btn-primary w-full text-sm py-3"
          >
            <RotateCcw className="w-4 h-4" /> Làm đề thi thử khác
          </button>
        </div>
      </div>
    </div>
  );
}
