import React, { useState } from 'react';
import { Bike, PlayCircle, BookOpen } from 'lucide-react';

interface StartScreenProps {
  onStart: (count: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [questionCount, setQuestionCount] = useState(10);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-blue-200 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Bike size={64} className="text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">原付免許<br/>合格道場</h1>
        <p className="text-gray-600 mb-6">
          Gemini教官が厳選した<br/>
          ひっかけ問題に挑戦！
        </p>

        <div className="space-y-4 text-left bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <div className="flex items-start space-x-3">
            <BookOpen className="text-green-500 mt-1 flex-shrink-0" size={20} />
            <p className="text-sm text-gray-700">最新の交通ルールに対応した問題をランダムに出題</p>
          </div>
          <div className="flex items-start space-x-3">
            <PlayCircle className="text-orange-500 mt-1 flex-shrink-0" size={20} />
            <p className="text-sm text-gray-700">回答後すぐに詳しい解説を表示</p>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-3 text-sm">問題数を選択してください</label>
          <div className="flex justify-center gap-3">
            {[5, 10, 15].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${
                  questionCount === count
                    ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm transform scale-105'
                    : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'
                }`}
              >
                {count}問
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(questionCount)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center space-x-2 text-lg"
        >
          <span>試験を開始する</span>
          <PlayCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default StartScreen;