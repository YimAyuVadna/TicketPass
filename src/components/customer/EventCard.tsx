import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const minPrice = Math.min(...event.ticketTypes.map((t) => t.price));
  const totalAvailable = event.ticketTypes.reduce((acc, t) => acc + (t.quantity - t.sold), 0);
  const isSoldOut = totalAvailable <= 0;

  return (
    <article
      onClick={() => onSelect(event)}
      className="group bg-white rounded-2xl border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Banner Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-zinc-950/70 backdrop-blur-md text-white border border-white/15">
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-rose-500/90 backdrop-blur-md text-white shadow-xs">
              Sold Out
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white/90 backdrop-blur-md text-zinc-900 border border-zinc-200/60 shadow-2xs">
              {totalAvailable} left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-zinc-900 line-clamp-1 group-hover:text-zinc-700 transition-colors">
            {event.name}
          </h3>

          <div className="space-y-1 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{event.date}</span>
              <span className="text-zinc-300">•</span>
              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{event.startTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed pt-1">
            {event.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">
              From
            </span>
            <span className="text-base font-extrabold text-zinc-900 font-mono">
              ${minPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-medium transition-all flex items-center gap-1 shadow-xs group-hover:scale-[1.02]"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};

