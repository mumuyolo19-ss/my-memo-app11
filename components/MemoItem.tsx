import React, { useState } from 'react';
import { Memo } from '../types';
import { TrashIcon, EditIcon, CheckIcon, XIcon } from './icons';

interface MemoItemProps {
  memo: Memo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

const MemoItem: React.FC<MemoItemProps> = ({ memo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(memo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(memo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(memo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <li
      className={`flex items-center p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${
        memo.completed ? 'bg-green-50' : 'bg-white'
      }`}
    >
      <input
        type="checkbox"
        checked={memo.completed}
        onChange={() => onToggle(memo.id)}
        className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        disabled={isEditing}
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow mx-4 px-2 py-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          autoFocus
        />
      ) : (
        <span
          className={`flex-grow mx-4 text-base text-gray-800 transition-colors duration-300 ${
            memo.completed ? 'line-through text-slate-500' : ''
          }`}
        >
          {memo.text}
        </span>
      )}

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-slate-400 hover:text-green-500 transition-colors duration-300"
              aria-label="保存"
            >
              <CheckIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-red-500 transition-colors duration-300"
              aria-label="取消"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-indigo-500 transition-colors duration-300"
              aria-label={`编辑备忘录 "${memo.text}"`}
            >
              <EditIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(memo.id)}
              className="text-slate-400 hover:text-red-500 transition-colors duration-300"
              aria-label={`删除备忘录 "${memo.text}"`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default MemoItem;
