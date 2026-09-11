import React, { useState } from 'react';
import {
  Ticket as TicketIcon,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Search,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Ticket } from '../../types';
import { useTicketContext } from '../../context/TicketContext';

interface MyTicketsViewProps {
  onSelectTicket: (ticket: Ticket) => void;
  onBrowseEvents: () => void;
  onSignIn?: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  onSelectTicket,
  onBrowseEvents,
  onSignIn,
}) => {
  const { tickets, currentUser, isLoggedIn } = useTicketContext();

  const [activeFilter, setActiveFilter] = useState<'UPCOMING' | 'USED' | 'ALL'>('UPCOMING');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center mx-auto text-zinc-400 shadow-xs">
          <TicketIcon className="w-8 h-8 text-zinc-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Sign in to view your passes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Your admission tickets, digital QR passes, and order history will appear here once you sign in to your account.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onSignIn}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            Sign In to Wallet
          </button>
          <button
            onClick={onBrowseEvents}
            className="px-5 py-2.5 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  // Filter tickets belonging to current user
  const userTickets = tickets.filter(
    (t) =>
      t.customerId === currentUser.id ||
      t.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      t.customerPhone === currentUser.phone
  );

  const filteredTickets = userTickets.filter((t) => {
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'UPCOMING'
        ? t.status === 'VALID'
        : t.status === 'USED' || t.status === 'CANCELLED' || t.status === 'EXPIRED';

    const matchesSearch =
      t.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketTypeName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const validCount = userTickets.filter((t) => t.status === 'VALID').length;
  const usedCount = userTickets.filter((t) => t.status !== 'VALID').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Wallet Header */}
      <section className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Attendee Wallet
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Digital Passes
            </h1>
            <p className="text-xs text-zinc-500">
              Tap any ticket to view its secure QR admission pass or present at the entrance checkpoint.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBrowseEvents}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-full border border-zinc-200/60 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('UPCOMING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-1 sm:flex-none ${
              activeFilter === 'UPCOMING'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Active Passes ({validCount})
          </button>
          <button
            onClick={() => setActiveFilter('USED')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-1 sm:flex-none ${
              activeFilter === 'USED'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Past & Used ({usedCount})
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex-1 sm:flex-none ${
              activeFilter === 'ALL'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            All ({userTickets.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search passes..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-zinc-200/80 rounded-full text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-2xs"
          />
        </div>
      </section>

      {/* Tickets List Grid */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => {
            const isValid = ticket.status === 'VALID';
            const isUsed = ticket.status === 'USED';

            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-zinc-700 tracking-wide">
                        {ticket.ticketNumber}
                      </span>
                      <h4 className="font-bold text-base text-zinc-900 group-hover:text-zinc-700 transition-colors mt-0.5">
                        {ticket.eventName}
                      </h4>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        isValid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          : isUsed
                          ? 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-500 my-3 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{ticket.eventDate}</span>
                      <span className="text-zinc-300">•</span>
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{ticket.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{ticket.eventLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 block">
                      {ticket.ticketTypeName}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Attendee: {ticket.customerName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTicket(ticket);
                    }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View QR</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center mx-auto">
            <TicketIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-zinc-800">No Tickets Found</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'No tickets matched your query.'
                : 'You have no digital passes in this section yet. Explore upcoming experiences!'}
            </p>
          </div>
          <button
            onClick={onBrowseEvents}
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-full hover:bg-zinc-800 transition shadow-xs"
          >
            Explore Available Events
          </button>
        </div>
      )}
    </div>
  );
};

