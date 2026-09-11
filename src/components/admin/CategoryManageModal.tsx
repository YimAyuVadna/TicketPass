import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Tag,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTicketContext } from '../../context/TicketContext';

interface CategoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SUGGESTIONS = [
  'Festival',
  'Workshop',
  'Comedy',
  'Nightlife',
  'Exhibition',
  'Charity Gala',
  'Technology',
  'Classical Music',
];

export const CategoryManageModal: React.FC<CategoryManageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, addCategory, removeCategory, resetCategories } = useTicketContext();

  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError(`Category "${trimmed}" already exists.`);
      return;
    }

    addCategory(trimmed);
    setNewCategoryInput('');
  };

  const handleAddPreset = (preset: string) => {
    setError(null);
    if (!categories.some((c) => c.toLowerCase() === preset.toLowerCase())) {
      addCategory(preset);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all categories back to default values?')) {
      resetCategories();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden text-zinc-900 border border-zinc-200/80 my-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Manage Event Categories</h3>
              <p className="text-xs text-zinc-400">Add, organize, or remove storefront category filters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-700">
              Create New Category
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => {
                    setNewCategoryInput(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. Comedy, Art Festival..."
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>
              <button
                type="submit"
                disabled={!newCategoryInput.trim()}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
          </form>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SUGGESTIONS.map((sug) => {
                const alreadyExists = categories.some(
                  (c) => c.toLowerCase() === sug.toLowerCase()
                );
                return (
                  <button
                    key={sug}
                    type="button"
                    disabled={alreadyExists}
                    onClick={() => handleAddPreset(sug)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                      alreadyExists
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-transparent'
                        : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{sug}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Categories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Current Filter Categories ({categories.length})
              </span>
              <span className="text-[11px] text-zinc-400">Pills shown on storefront</span>
            </div>

            <div className="space-y-1.5">
              {categories.map((cat) => {
                const isAll = cat.toLowerCase() === 'all';
                return (
                  <div
                    key={cat}
                    className="p-3 bg-zinc-50 border border-zinc-200/70 rounded-2xl flex items-center justify-between group hover:bg-zinc-100/70 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-2xs text-xs font-semibold">
                        {cat.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-zinc-800">{cat}</span>
                      {isAll && (
                        <span className="px-2 py-0.5 bg-zinc-200 text-zinc-600 rounded text-[10px] font-medium">
                          Default Filter (Protected)
                        </span>
                      )}
                    </div>

                    {!isAll && (
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title={`Remove "${cat}" category`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-full text-xs shadow-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
