import React, { useEffect, useState } from 'react';
import { QuizResult } from '../types';
import { fetchEncouragement } from '../services/gemini';
import { Trophy, RefreshCcw, CheckCircle, XCircle, Filter } from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  onRetry: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetry }) => {
  const [message, setMessage] = useState<string>('教官からのメッセージを受信中...');
  const [filterMistakes, setFilterMistakes] = useState(false);

  useEffect(() => {
    const getMessage = async () => {
      const msg = await fetchEncouragement(result.score, result.total);
      setMessage(msg);
    };
    getMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const percentage = Math.round((result.score / result.total) * 100);
  const isPass = percentage >= 90; // Usually 90% is pass for license exams
  const hasMistakes = result.score < result.total;

  const displayedHistory = result.history
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(item => !filterMistakes || !item.isCorrect);

  return (
    <div className="max-w-2xl mx-auto w-full p-4 pb-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
        <div className={`p-8 text-center ${isPass ? 'bg-gradient-to-b from-yellow-50 to-white' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
          <div className="inline-block p-4 rounded-full bg-white shadow-sm mb-4">
             {isPass ? <Trophy className="text-yellow-500" size={48} /> : <Trophy className="text-gray-400" size={48} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">試験結果</h2>
          <div className="text-6xl font-black text-gray-900 mb-4">
            {result.score}<span className="text-3xl font-medium text-gray-400">/{result.total}</span>
          </div>
          <div className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-600 font-bold">
            正答率 {percentage}%
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-blue-50/50">
          <h3 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">Gemini教官より</h3>
          <p className="text-gray-700 leading-relaxed italic bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            "{message}"
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-end px-2">
          <h3 className="font-bold text-gray-700">回答の振り返り</h3>
          {hasMistakes && (
            <button
              onClick={() => setFilterMistakes(!filterMistakes)}
              className={`text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                filterMistakes
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter size={14} />
              {filterMistakes ? '全て表示' : '間違いのみ表示'}
            </button>
          )}
        </div>

        {displayedHistory.length === 0 && filterMistakes && (
           <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
             表示する問題がありません
           </div>
        )}

        {displayedHistory.map((item) => (
          <div key={item.question.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="flex-shrink-0 mt-1">
              {item.isCorrect ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 mb-1">Q{item.originalIndex + 1}</p>
              <p className="text-gray-800 font-medium mb-2">{item.question.text}</p>
              {!item.isCorrect && (
                <div className="text-sm bg-red-50 text-red-700 p-3 rounded-lg border border-red-100">
                  <div className="font-bold mb-1">正解: {item.question.isCorrect ? '○' : '×'}</div>
                  <div className="text-gray-700 text-xs leading-relaxed">
                    {item.question.explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onRetry}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center space-x-2"
      >
        <RefreshCcw size={20} />
        <span>もう一度挑戦する</span>
      </button>
    </div>
  );
};

export default ResultScreen;