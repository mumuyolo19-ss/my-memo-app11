import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Memo, Filter } from './types';
import MemoItem from './components/MemoItem';

const App: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>(() => {
    try {
      const savedMemos = localStorage.getItem('memos');
      return savedMemos ? JSON.parse(savedMemos) : [];
    } catch (error) {
      console.error('Failed to parse memos from localStorage', error);
      return [];
    }
  });

  const [newMemo, setNewMemo] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  
  useEffect(() => {
    try {
      localStorage.setItem('memos', JSON.stringify(memos));
    } catch (error) {
      console.error('Failed to save memos to localStorage', error);
    }
  }, [memos]);

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemo.trim()) {
      setMemos([
        ...memos,
        { id: Date.now(), text: newMemo.trim(), completed: false },
      ]);
      setNewMemo('');
    }
  };

  const handleToggleMemo = useCallback((id: number) => {
    setMemos(
      memos.map((memo) =>
        memo.id === id ? { ...memo, completed: !memo.completed } : memo
      )
    );
  }, [memos]);

  const handleDeleteMemo = useCallback((id: number) => {
    setMemos(memos.filter((memo) => memo.id !== id));
  }, [memos]);

  const handleEditMemo = useCallback((id: number, text: string) => {
    setMemos(
      memos.map((memo) => (memo.id === id ? { ...memo, text } : memo))
    );
  }, [memos]);

  const filteredMemos = useMemo(() => {
    switch (filter) {
      case 'active':
        return memos.filter((memo) => !memo.completed);
      case 'completed':
        return memos.filter((memo) => memo.completed);
      default:
        return memos;
    }
  }, [memos, filter]);
  
  const FilterButton: React.FC<{
    filterType: Filter;
    text: string;
  }> = ({ filterType, text }) => (
    <button
      onClick={() => setFilter(filterType)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        filter === filterType
          ? 'bg-cyan-600 text-white shadow-sm'
          : 'bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {text}
    </button>
  );

  return (
    <div className="min-h-screen flex items-start justify-center pt-8 sm:pt-16">
      <div className="w-full max-w-lg mx-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">我的零代码备忘录</h1>
          <p className="text-slate-500 mt-2">记录你的每一个想法</p>
        </header>

        <main className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <form onSubmit={handleAddMemo} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              placeholder="添加新的备忘录..."
              className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              添加
            </button>
          </form>

          <div className="flex justify-center items-center gap-3 mb-6 p-2 bg-slate-100 rounded-lg">
             <FilterButton filterType="all" text="所有" />
             <FilterButton filterType="active" text="未完成" />
             <FilterButton filterType="completed" text="已完成" />
          </div>

          <ul className="space-y-3">
            {filteredMemos.length > 0 ? (
                filteredMemos.map((memo) => (
                    <MemoItem
                    key={memo.id}
                    memo={memo}
                    onToggle={handleToggleMemo}
                    onDelete={handleDeleteMemo}
                    onEdit={handleEditMemo}
                    />
                ))
            ) : (
                <li className="text-center text-slate-500 py-4">
                    {filter === 'completed' ? '没有已完成的备忘录' : '太棒了！没有未完成的备忘录'}
                </li>
            )}
            </ul>
        </main>
      </div>
    </div>
  );
};

export default App;
