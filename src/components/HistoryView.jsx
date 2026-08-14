import React from 'react';
import { History, Award, Clock, CheckCircle2, XCircle, Trash2, Calendar } from 'lucide-react';
import { clearAllData } from '../utils/storage';

export default function HistoryView({ examHistory, onClearHistory }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} phút ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">Lịch sử Học tập & Thi thử</h2>
            <p className="text-sm text-slate-400">Tự động lưu trữ tiến trình bài thi trên trình duyệt</p>
          </div>
        </div>

        {examHistory.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi thử không?')) {
                onClearHistory();
              }
            }}
            className="btn btn-danger text-xs px-3 py-2"
          >
            <Trash2 className="w-4 h-4" /> Xóa lịch sử thi
          </button>
        )}
      </div>

      {/* History List */}
      {examHistory.length === 0 ? (
        <div className="glass-panel p-10 text-center space-y-3">
          <History className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-300">Chưa có lịch sử bài thi nào</h3>
          <p className="text-sm text-slate-400">Hãy thực hiện một bài thi thử 40 phút để ghi lại thành tích nhé.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {examHistory.map((item) => {
            const isPassed = item.scorePercentage >= 80;

            return (
              <div
                key={item.id}
                className="glass-panel p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${isPassed ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {isPassed ? 'ĐẠT' : 'CHƯA ĐẠT'} ({item.scorePercentage}%)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.correctCount} / {item.totalQuestions} câu đúng
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(item.timeSpentSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {item.scorePercentage >= 80 ? 'Xuất sắc' : 'Cần cải thiện'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
