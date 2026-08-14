import React from 'react';
import { BookOpen, Clock, Star, Award, CheckCircle, ArrowRight, BookMarked, HelpCircle, Sparkles } from 'lucide-react';

export default function Dashboard({
  questionsCount,
  hardQuestionsCount,
  examHistory,
  onStartPractice,
  onStartExam,
  onOpenHardQuestions,
  onOpenHistory
}) {
  const totalExams = examHistory.length;
  const avgScore = totalExams > 0
    ? Math.round(examHistory.reduce((acc, curr) => acc + (curr.scorePercentage || 0), 0) / totalExams)
    : 0;

  const passedExams = examHistory.filter(e => e.scorePercentage >= 80).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-8">
      {/* Hero Welcome Banner */}
      <div className="glass-panel p-8 md:p-10 relative overflow-hidden bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 translate-y-12 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" /> WDU203c KT
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Học WDU203c với <span className="gradient-text">Khánh Trịnh</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg">
            Ôn luyện 468 câu hỏi chuẩn Coursera, luyện tập chia đợt 30-50 câu và thi thử 40 phút.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartPractice(30)}
              className="btn btn-primary px-6 py-3 text-base shadow-xl hover:scale-105"
            >
              <BookOpen className="w-5 h-5" /> Luyện tập (30 câu/đợt)
            </button>
            <button
              onClick={onStartExam}
              className="btn btn-accent px-6 py-3 text-base shadow-xl hover:scale-105"
            >
              <Clock className="w-5 h-5" /> Thi thử ngay (40 phút)
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-white">{questionsCount}</div>
            <div className="text-xs text-slate-400">Tổng ngân hàng câu hỏi</div>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 cursor-pointer hover:border-amber-500/40 transition-colors" onClick={onOpenHardQuestions}>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-6 h-6 fill-amber-400/30" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-amber-300">{hardQuestionsCount}</div>
            <div className="text-xs text-slate-400">Câu khó đã lưu</div>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4 cursor-pointer hover:border-purple-500/40 transition-colors" onClick={onOpenHistory}>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-purple-300">{totalExams} lần</div>
            <div className="text-xs text-slate-400">Bài thi đã làm (Đạt: {passedExams})</div>
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-emerald-300">{avgScore}%</div>
            <div className="text-xs text-slate-400">Điểm trung bình thi thử</div>
          </div>
        </div>
      </div>

      {/* Main Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4 flex flex-col justify-between border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Chế độ Luyện tập chia đợt</h3>
            <p className="text-sm text-slate-300">
              Chia đợt 30 hoặc 50 câu/lần. Tự giải bài tập và xem ngay đáp án khi chọn.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartPractice(30)}
              className="btn btn-primary flex-1 text-sm py-2.5"
            >
              Học đợt 30 câu <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartPractice(50)}
              className="btn btn-secondary flex-1 text-sm py-2.5"
            >
              Học đợt 50 câu <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4 flex flex-col justify-between border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Chế độ Thi thử 40 Phút</h3>
            <p className="text-sm text-slate-300">
              50 câu ngẫu nhiên, thời gian 40 phút, bảng ma trận chuyển câu và tự động chấm điểm.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onStartExam}
              className="btn btn-accent w-full text-sm py-2.5"
            >
              Vào bài thi 50 câu (40 phút) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
