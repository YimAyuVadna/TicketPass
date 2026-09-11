import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Check,
  RotateCcw,
  Eye,
  Sliders,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useTicketContext } from '../../context/TicketContext';

interface HeroBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeroBannerModal: React.FC<HeroBannerModalProps> = ({ isOpen, onClose }) => {
  const { heroBanner, updateHeroBanner, resetHeroBanner, events } = useTicketContext();

  const [enabled, setEnabled] = useState(heroBanner.enabled);
  const [tag, setTag] = useState(heroBanner.tag);
  const [category, setCategory] = useState(heroBanner.category || 'Concert');
  const [title, setTitle] = useState(heroBanner.title);
  const [description, setDescription] = useState(heroBanner.description);
  const [date, setDate] = useState(heroBanner.date || '');
  const [startTime, setStartTime] = useState(heroBanner.startTime || '');
  const [location, setLocation] = useState(heroBanner.location || '');
  const [image, setImage] = useState(heroBanner.image);
  const [buttonText, setButtonText] = useState(heroBanner.buttonText || 'Reserve Tickets');
  const [selectedEventId, setSelectedEventId] = useState(heroBanner.eventId || '');

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with context when opened
  useEffect(() => {
    if (isOpen) {
      setEnabled(heroBanner.enabled);
      setTag(heroBanner.tag);
      setCategory(heroBanner.category || 'Concert');
      setTitle(heroBanner.title);
      setDescription(heroBanner.description);
      setDate(heroBanner.date || '');
      setStartTime(heroBanner.startTime || '');
      setLocation(heroBanner.location || '');
      setImage(heroBanner.image);
      setButtonText(heroBanner.buttonText || 'Reserve Tickets');
      setSelectedEventId(heroBanner.eventId || '');
      setUploadError(null);
      setIsSaved(false);
    }
  }, [isOpen, heroBanner]);

  if (!isOpen) return null;

  // Handle choosing a linked event to autofill
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      setTitle(ev.name);
      setDescription(ev.description);
      setCategory(ev.category);
      setDate(ev.date);
      setStartTime(ev.startTime);
      setLocation(ev.location);
      if (ev.image) {
        setImage(ev.image);
      }
    }
  };

  // Image file upload & conversion to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Image exceeds 3MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateHeroBanner({
      enabled,
      tag: tag.trim() || 'Featured Experience',
      category: category.trim() || 'Concert',
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      startTime: startTime.trim(),
      location: location.trim(),
      image: image.trim(),
      buttonText: buttonText.trim() || 'Reserve Tickets',
      eventId: selectedEventId || undefined,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  const handleReset = () => {
    if (window.confirm('Reset the storefront hero banner back to default configuration?')) {
      resetHeroBanner();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden text-zinc-900 border border-zinc-200/80 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900">Hero Banner Editor</h3>
              <p className="text-xs text-zinc-400">Manage headline, featured event, and backdrop media</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visibility Switch */}
          <div className="p-4 bg-zinc-50/80 border border-zinc-200/80 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-xs text-zinc-900">Display Hero Banner</h4>
              <p className="text-[11px] text-zinc-500">
                When enabled, this editorial spotlight appears at the top of the event catalog
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                enabled ? 'bg-zinc-900' : 'bg-zinc-200'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Quick Autofill from Existing Event */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Link to Existing Event (Autofills details)
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => handleEventSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
            >
              <option value="">-- Custom Standalone Banner (No Event Link) --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.category} • {ev.date})
                </option>
              ))}
            </select>
          </div>

          {/* Live Mini Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                Live Preview
              </span>
              <span className="text-[10px] text-zinc-400">Desktop presentation</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white p-5 border border-zinc-800 shadow-xs group min-h-[160px] flex flex-col justify-end">
              <div className="absolute inset-0">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
              </div>

              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {tag || 'Featured Experience'}
                  </span>
                  <span className="text-[11px] text-zinc-300 font-medium">{category}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug line-clamp-1">
                  {title || 'Headline Event Title'}
                </h2>
                <p className="text-[11px] text-zinc-300 line-clamp-1 leading-relaxed">
                  {description || 'Event description and highlights preview will appear here.'}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-300 pt-0.5">
                  {date && <span>📅 {date}</span>}
                  {startTime && <span>⏰ {startTime}</span>}
                  {location && <span>📍 {location}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Badge / Tag Text <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Featured Experience"
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Category Label <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Concert, Conference"
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Headline Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Pulse EDM Night 2026"
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Description & Highlights <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A compelling description for the hero card..."
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Event Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Location / Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Diamond Island Exhibition Center"
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">Action Button Text</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g. Reserve Tickets"
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Image Upload & URL input */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-zinc-700">
              Hero Banner Image (URL or Upload) <span className="text-rose-500">*</span>
            </label>

            <div className="space-y-2">
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-2xl border-2 border-dashed text-center transition cursor-pointer ${
                  isDragging
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-200/80 hover:border-zinc-400 bg-zinc-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-700">
                  <Upload className="w-4 h-4 text-zinc-500" />
                  <span>Upload local image file</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Drag & drop or click to browse (PNG, JPG, WebP max 3MB)
                </p>
              </div>

              {uploadError && (
                <div className="flex items-center gap-1.5 p-2 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200/60">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-full text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-emerald-600 text-white font-semibold rounded-full text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Banner</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
