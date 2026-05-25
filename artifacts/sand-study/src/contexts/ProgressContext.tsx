import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface UnitProgress {
  studied: boolean;
  exerciseScores: Record<string, boolean>;
  studiedAt?: string;
}

interface ExamAttempt {
  questionId: string;
  answer: string;
  attempted: boolean;
}

interface ProgressState {
  units: Record<string, UnitProgress>;
  examAttempts: Record<string, ExamAttempt>;
  xp: number;
  lastStudyDate: string | null;
  streak: number;
}

interface ProgressContextType {
  progress: ProgressState;
  markUnitStudied: (unitId: string) => void;
  recordExerciseScore: (unitId: string, exerciseId: string, correct: boolean) => void;
  saveExamAnswer: (questionId: string, answer: string) => void;
  getTotalExerciseScore: (unitId: string) => { correct: number; total: number };
  getUnitProgress: (unitId: string) => UnitProgress;
  resetProgress: () => void;
}

const defaultState: ProgressState = {
  units: {},
  examAttempts: {},
  xp: 0,
  lastStudyDate: null,
  streak: 0,
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem("sand-progress");
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem("sand-progress", JSON.stringify(progress));
  }, [progress]);

  const updateStreak = useCallback((state: ProgressState): ProgressState => {
    const today = new Date().toDateString();
    if (state.lastStudyDate === today) return state;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = state.lastStudyDate === yesterday ? state.streak + 1 : 1;
    return { ...state, lastStudyDate: today, streak: newStreak };
  }, []);

  const markUnitStudied = useCallback((unitId: string) => {
    setProgress((prev) => {
      const alreadyStudied = prev.units[unitId]?.studied;
      const xpGain = alreadyStudied ? 0 : 15;
      const updated = updateStreak(prev);
      return {
        ...updated,
        xp: updated.xp + xpGain,
        units: {
          ...updated.units,
          [unitId]: {
            ...updated.units[unitId],
            studied: true,
            exerciseScores: updated.units[unitId]?.exerciseScores ?? {},
            studiedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, [updateStreak]);

  const recordExerciseScore = useCallback((unitId: string, exerciseId: string, correct: boolean) => {
    setProgress((prev) => {
      const alreadyAnswered = prev.units[unitId]?.exerciseScores?.[exerciseId] !== undefined;
      const xpGain = !alreadyAnswered && correct ? 5 : 0;
      const updated = updateStreak(prev);
      return {
        ...updated,
        xp: updated.xp + xpGain,
        units: {
          ...updated.units,
          [unitId]: {
            ...updated.units[unitId],
            studied: updated.units[unitId]?.studied ?? false,
            exerciseScores: {
              ...updated.units[unitId]?.exerciseScores,
              [exerciseId]: correct,
            },
          },
        },
      };
    });
  }, [updateStreak]);

  const saveExamAnswer = useCallback((questionId: string, answer: string) => {
    setProgress((prev) => {
      const alreadyAttempted = prev.examAttempts[questionId]?.attempted;
      const xpGain = !alreadyAttempted && answer.trim().length > 0 ? 10 : 0;
      return {
        ...prev,
        xp: prev.xp + xpGain,
        examAttempts: {
          ...prev.examAttempts,
          [questionId]: { questionId, answer, attempted: true },
        },
      };
    });
  }, []);

  const getTotalExerciseScore = useCallback((unitId: string) => {
    const scores = progress.units[unitId]?.exerciseScores ?? {};
    const values = Object.values(scores);
    return { correct: values.filter(Boolean).length, total: values.length };
  }, [progress]);

  const getUnitProgress = useCallback((unitId: string): UnitProgress => {
    return progress.units[unitId] ?? { studied: false, exerciseScores: {} };
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress(defaultState);
  }, []);

  return (
    <ProgressContext.Provider value={{
      progress,
      markUnitStudied,
      recordExerciseScore,
      saveExamAnswer,
      getTotalExerciseScore,
      getUnitProgress,
      resetProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
