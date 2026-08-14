import React, { useState, useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';
import QuestionPalette from './QuestionPalette';
import ExamResultModal from './ExamResultModal';
import { saveExamResult } from '../utils/storage';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

const EXAM_DURATION_SECONDS = 40 * 60;

export default function ExamMode({
  allQuestions,
  hardQuestionKeys,
  onToggleHard,
  onFinishExam
}) {
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [examResult, setExamResult] = useState(null);

  const timerRef = useRef(null);

  const startNewExam = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 50);
    setExamQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(EXAM_DURATION_SECONDS);
    setIsSubmitted(false);
    setIsReviewing(false);
    setExamResult(null);
  };

  useEffect(() => {
    startNewExam();
  }, [allQuestions]);

  useEffect(() => {
    if (isSubmitted || examQuestions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isSubmitted, examQuestions]);

  const handleSelectOption = (qKey, labels) => {
    if (isSubmitted && !isReviewing) return;
    setUserAnswers(prev => ({ ...prev, [qKey]: labels }));
  };

  const handleSubmitExam = () => {
    if (isSubmitted) return;
    clearInterval(timerRef.current);

    let correct = 0;
    examQuestions.forEach(q => {
      const key = `${q.source}_${q.id}`;
      const ans = userAnswers[key] || [];
      const userStr = Array.isArray(ans) ? ans.join('') : ans;
      if (userStr === q.answer) {
        correct++;
      }
    });

    const timeSpent = EXAM_DURATION_SECONDS - timeLeft;
    const scorePct = Math.round((correct / examQuestions.length) * 100);

    const resultData = {
      scorePercentage: scorePct,
      correctCount: correct,
      totalQuestions: examQuestions.length,
      timeSpentSeconds: timeSpent,
      userAnswers,
      examQuestions
    };

    saveExamResult(resultData);
    setExamResult(resultData);
    setIsSubmitted(true);
  };

  const handleAddMissedToHard = () => {
    if (!examResult) return;
    let count = 0;
    examQuestions.forEach(q => {
      const key = `${q.source}_${q.id}`;
      const ans = userAnswers[key] || [];
      const userStr = Array.isArray(ans) ? ans.join('') : ans;
      if (userStr !== q.answer) {
        if (!hardQuestionKeys.includes(key)) {
          onToggleHard(q.source, q.id);
          count++;
        }
      }
    });
    alert(`Đã thêm ${count} câu làm sai vào Danh sách câu khó!`);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (examQuestions.length === 0) return null;

  const currentQ = examQuestions[currentIndex];
  const qKey = `${currentQ.source}_${currentQ.id}`;
  const isHard = hardQuestionKeys.includes(qKey);
  const currentAns = userAnswers[qKey] || [];

  const isLowTime = timeLeft < 300;

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in flex flex-col min-h-[calc(100vh-140px)]">
      {/* Top Header Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-heading gradient-text">Thi thử 50 câu</span>
          <span className="badge badge-wdu1">40 phút</span>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold border ${
          isLowTime
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
            : 'bg-slate-900/90 text-cyan-300 border-cyan-500/30'
        }`}>
          <Clock className={`w-5 h-5 ${isLowTime ? 'text-rose-400' : 'text-cyan-400'}`} />
          <span>{formatTimer(timeLeft)}</span>
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmitExam}
            className="btn btn-accent text-sm py-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Nộp bài thi
          </button>
        ) : (
          <button
            onClick={startNewExam}
            className="btn btn-primary text-sm py-2"
          >
            <RotateCcw className="w-4 h-4" /> Làm đề mới
          </button>
        )}
      </div>

      {/* Main Grid: Question Card & Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Question Card with scroll */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div className="overflow-y-auto max-h-[calc(100vh-270px)] pr-1 mb-4">
            <QuestionCard
              question={currentQ}
              questionIndex={currentIndex}
              totalQuestions={examQuestions.length}
              userAnswer={currentAns}
              onSelectOption={(labels) => handleSelectOption(qKey, labels)}
              isHard={isHard}
              onToggleHard={() => onToggleHard(currentQ.source, currentQ.id)}
              showAnswer={isSubmitted}
              mode={isSubmitted ? 'review' : 'exam'}
            />
          </div>

          {/* Sticky Nav Controls Bar */}
          <div className="sticky bottom-2 z-30 glass-panel p-3 flex items-center justify-between gap-4 border border-indigo-500/30 shadow-2xl backdrop-blur-xl flex-shrink-0">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Câu trước
            </button>

            {currentIndex < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                className="btn btn-primary text-sm"
              >
                Câu tiếp <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              !isSubmitted && (
                <button
                  onClick={handleSubmitExam}
                  className="btn btn-accent text-sm"
                >
                  Nộp bài ngay <CheckCircle2 className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div>
          <QuestionPalette
            questions={examQuestions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            hardQuestionKeys={hardQuestionKeys}
            onSelectIndex={setCurrentIndex}
            showAnswerStatus={isSubmitted}
          />
        </div>
      </div>

      {isSubmitted && !isReviewing && examResult && (
        <ExamResultModal
          result={examResult}
          onReview={() => setIsReviewing(true)}
          onStartNewExam={startNewExam}
          onAddMissedToHard={handleAddMissedToHard}
        />
      )}
    </div>
  );
}
