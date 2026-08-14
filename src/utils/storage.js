const HARD_QUESTIONS_KEY = 'wdu203c_hard_questions';
const EXAM_HISTORY_KEY = 'wdu203c_exam_history';
const PRACTICE_PROGRESS_KEY = 'wdu203c_practice_progress';
const COMPLETED_BATCHES_KEY = 'wdu203c_completed_batches';

// Helper to get Hard Question Set as Array of "SOURCE_ID" (e.g. "WDU1_182")
export const getHardQuestionKeys = () => {
  try {
    const data = localStorage.getItem(HARD_QUESTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load hard questions from localStorage', e);
    return [];
  }
};

export const isHardQuestion = (source, id) => {
  const keys = getHardQuestionKeys();
  return keys.includes(`${source}_${id}`);
};

export const toggleHardQuestion = (source, id) => {
  const key = `${source}_${id}`;
  const keys = getHardQuestionKeys();
  let updated;
  if (keys.includes(key)) {
    updated = keys.filter(k => k !== key);
  } else {
    updated = [...keys, key];
  }
  try {
    localStorage.setItem(HARD_QUESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save hard questions to localStorage', e);
  }
  return updated;
};

// Exam History Management
export const getExamHistory = () => {
  try {
    const data = localStorage.getItem(EXAM_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load exam history from localStorage', e);
    return [];
  }
};

export const saveExamResult = (result) => {
  const history = getExamHistory();
  const newEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleString('vi-VN'),
    ...result
  };
  const updated = [newEntry, ...history];
  try {
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save exam result', e);
  }
  return updated;
};

// Completed Batches Management
export const getCompletedBatches = () => {
  try {
    const data = localStorage.getItem(COMPLETED_BATCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const markBatchCompleted = (batchKey) => {
  const completed = getCompletedBatches();
  if (!completed.includes(batchKey)) {
    const updated = [...completed, batchKey];
    try {
      localStorage.setItem(COMPLETED_BATCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save completed batch', e);
    }
    return updated;
  }
  return completed;
};

export const clearAllData = () => {
  localStorage.removeItem(HARD_QUESTIONS_KEY);
  localStorage.removeItem(EXAM_HISTORY_KEY);
  localStorage.removeItem(PRACTICE_PROGRESS_KEY);
  localStorage.removeItem(COMPLETED_BATCHES_KEY);
};
