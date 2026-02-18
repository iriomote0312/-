import React, { useState } from 'react';
import { Question } from '../types';
import { Check, X, AlertCircle, ArrowRight } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (results: { question: Question; userAnswer: boolean; isCorrect: boolean }[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ question: Question; userAnswer: boolean; isCorrect: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    const isCorrect = answer === currentQuestion.isCorrect;
    
    setHistory(prev => [
      ...prev,
      {
        question: currentQuestion,
        userAnswer: answer,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onFinish(history);
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    }
  };

  const getButtonStyles = (type: boolean) => {
    if (!showExplanation) {
      return type 
        ? "bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
        : "bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-600";
    }

    // Explanation mode logic
    if (type === currentQuestion.isCorrect) {
       // This is the correct button
       return "bg-green-100 border-2 border-green-500 text-green-700 ring-2 ring-green-300 ring-offset-2";
    }
    
    if (type === selectedAnswer && type !== currentQuestion.isCorrect) {
       // This is the wrong answer selected by user
       return "bg-red-100 border-2 border-red-500 text-red-700 opacity-50";
    }

    return "bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-50";
  };

  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto w-full p-4">
      {/* Header / Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-blue-600">第 {currentIndex + 1} 問</span>
          <span className="text-xs text-gray-400">全 {questions.length} 問</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6">
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed min-h-[120px] flex items-center justify-center text-center">
            {currentQuestion.text}
          </h2>
        </div>
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          disabled={showExplanation}
          onClick={() => handleAnswer(true)}
          className={`h-32 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${getButtonStyles(true)}`}
        >
          <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full border-4 border-current"></div>
          </div>
          <span className="font-bold text-lg">正しい</span>
        </button>

        <button
          disabled={showExplanation}
          onClick={() => handleAnswer(false)}
          className={`h-32 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${getButtonStyles(false)}`}
        >
          <div className="w-16 h-16 relative mb-2">
             <X size={64} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg">間違い</span>
        </button>
      </div>

      {/* Explanation Area */}
      {showExplanation && (
        <div className="animate-fade-in-up">
          <div className={`p-6 rounded-xl border-l-4 shadow-sm mb-6 ${
            selectedAnswer === currentQuestion.isCorrect 
              ? 'bg-green-50 border-green-500' 
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full flex-shrink-0 ${
                selectedAnswer === currentQuestion.isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
              }`}>
                {selectedAnswer === currentQuestion.isCorrect ? <Check size={24} /> : <X size={24} />}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-2 ${
                   selectedAnswer === currentQuestion.isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {selectedAnswer === currentQuestion.isCorrect ? '正解！' : '不正解...'}
                </h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="font-bold text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <AlertCircle size={16} />
                    Gemini教官の解説
                  </p>
                  {currentQuestion.explanation}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>{isLastQuestion ? '結果を見る' : '次の問題へ'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;