import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { QuizState, Question, QuizResult } from './types';
import { fetchQuestions } from './services/gemini';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<QuizState>('START');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const startGame = async (count: number) => {
    setGameState('LOADING');
    try {
      const fetchedQuestions = await fetchQuestions(count);
      // Limit to the requested count in case API returns more
      setQuestions(fetchedQuestions.slice(0, count));
      setGameState('QUIZ');
    } catch (error) {
      console.error("Error starting game:", error);
      setGameState('START'); // Reset on error
      alert("問題の読み込みに失敗しました。もう一度お試しください。");
    }
  };

  const finishQuiz = (history: { question: Question; userAnswer: boolean; isCorrect: boolean }[]) => {
    const score = history.filter(h => h.isCorrect).length;
    setResult({
      score,
      total: history.length,
      history
    });
    setGameState('RESULT');
  };

  const resetGame = () => {
    setGameState('START');
    setQuestions([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
            <span>🔰</span>
            <span>原付免許合格道場</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex flex-col items-center">
        {gameState === 'START' && (
          <StartScreen onStart={startGame} />
        )}

        {gameState === 'LOADING' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-gray-600 font-medium">教官が問題を作成中...</p>
            <p className="text-xs text-gray-400">Gemini AI powered</p>
          </div>
        )}

        {gameState === 'QUIZ' && questions.length > 0 && (
          <QuizScreen questions={questions} onFinish={finishQuiz} />
        )}

        {gameState === 'RESULT' && result && (
          <ResultScreen result={result} onRetry={resetGame} />
        )}
      </main>
      
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© 2024 Gentuki Dojo - Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;