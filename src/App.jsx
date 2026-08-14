import React, { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PracticeMode from './components/PracticeMode';
import ExamMode from './components/ExamMode';
import HardQuestions from './components/HardQuestions';
import HistoryView from './components/HistoryView';
import { getHardQuestionKeys, toggleHardQuestion, getExamHistory } from './utils/storage';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hardQuestionKeys, setHardQuestionKeys] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [practiceBatchSize, setPracticeBatchSize] = useState(30);

  const allQuestions = questionsData.questions || [];

  useEffect(() => {
    setHardQuestionKeys(getHardQuestionKeys());
    setExamHistory(getExamHistory());
  }, []);

  const handleToggleHard = (source, id) => {
    const updated = toggleHardQuestion(source, id);
    setHardQuestionKeys(updated);
  };

  const handleStartPractice = (batchSize = 30) => {
    setPracticeBatchSize(batchSize);
    setActiveTab('practice');
  };

  const handleStartExam = () => {
    setActiveTab('exam');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('wdu203c_exam_history');
    setExamHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hardQuestionsCount={hardQuestionKeys.length}
        />

        <main className="px-4 lg:px-8 pb-12">
          {activeTab === 'dashboard' && (
            <Dashboard
              questionsCount={allQuestions.length}
              hardQuestionsCount={hardQuestionKeys.length}
              examHistory={examHistory}
              onStartPractice={handleStartPractice}
              onStartExam={handleStartExam}
              onOpenHardQuestions={() => setActiveTab('hard')}
              onOpenHistory={() => setActiveTab('history')}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeMode
              allQuestions={allQuestions}
              initialBatchSize={practiceBatchSize}
              hardQuestionKeys={hardQuestionKeys}
              onToggleHard={handleToggleHard}
            />
          )}

          {activeTab === 'exam' && (
            <ExamMode
              allQuestions={allQuestions}
              hardQuestionKeys={hardQuestionKeys}
              onToggleHard={handleToggleHard}
              onFinishExam={() => {
                setExamHistory(getExamHistory());
              }}
            />
          )}

          {activeTab === 'hard' && (
            <HardQuestions
              allQuestions={allQuestions}
              hardQuestionKeys={hardQuestionKeys}
              onToggleHard={handleToggleHard}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              examHistory={examHistory}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>

      {/* Footer honoring Khánh Trịnh */}
      <footer className="glass-panel border-t border-white/10 py-6 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>WDU203c KT • Học cùng Khánh Trịnh - Chinh phục đỉnh cao UX Research & Design</span>
          </div>
          <div className="text-amber-300 font-semibold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Hệ thống ôn luyện dành riêng cho Khánh Trịnh</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
