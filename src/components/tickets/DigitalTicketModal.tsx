import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  Clock,
  MapPin,
  Check,
  Copy,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Ticket } from '../../types';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface DigitalTicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  allOrderTickets?: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  ticket,
  onClose,
  allOrderTickets = [],
  onSelectTicket,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticket.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden text-zinc-900 border border-zinc-200/80 print:border-none print:shadow-none my-8">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 print:hidden">
          <div className="flex items-center gap-1.5">
            <TicketIcon className="w-4 h-4 text-zinc-800" />
            <span className="font-semibold text-xs text-zinc-800">Digital Pass</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              title="Print Pass"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyCode}
              title="Copy Ticket ID"
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition ml-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-pass switcher */}
        {allOrderTickets.length > 1 && onSelectTicket && (
          <div className="px-5 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center gap-1.5 overflow-x-auto print:hidden">
            <span className="text-[11px] font-medium text-zinc-500 shrink-0">Pass:</span>
            {allOrderTickets.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => onSelectTicket(t)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition shrink-0 ${
                  t.id === ticket.id
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
                }`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Printable Ticket Body */}
        <div ref={printRef} className="p-4 sm:p-5 bg-[#fafafa]">
          {/* Ticket Card Container */}
          <div className="border border-zinc-200/90 rounded-3xl overflow-hidden bg-white shadow-xs">
            {/* Top Pass Header */}
            <div className="bg-zinc-950 text-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-medium tracking-wide text-zinc-300 uppercase">
                  {ticket.ticketTypeName}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ticket.status === 'VALID'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : ticket.status === 'USED'
                      ? 'bg-zinc-700 text-zinc-300'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
                {ticket.eventName}
              </h4>

              <div className="space-y-1 text-xs text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{ticket.eventDate}</span>
                  <span className="text-zinc-600">•</span>
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{ticket.eventTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{ticket.eventLocation}</span>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative flex items-center justify-between bg-white py-1">
              <div className="w-4 h-6 bg-[#fafafa] rounded-r-full -ml-2 border-r border-zinc-200" />
              <div className="flex-1 border-b-2 border-dashed border-zinc-200 mx-2" />
              <div className="w-4 h-6 bg-[#fafafa] rounded-l-full -mr-2 border-l border-zinc-200" />
            </div>

            {/* QR Code Section */}
            <div className="p-5 text-center space-y-3.5 bg-white">
              <div className="inline-block relative">
                <QRCodeDisplay value={ticket.qrToken} size={160} />
                {ticket.status === 'USED' && (
                  <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                    <span className="px-3 py-1 bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-zinc-600">
                      TICKET USED
                    </span>
                  </div>
                )}
                {ticket.status === 'CANCELLED' && (
                  <div className="absolute inset-0 bg-rose-950/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                    <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm">
                      CANCELLED
                    </span>
                  </div>
                )}
              </div>

              {/* Status explanation */}
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase">
                  Admission QR Code
                </p>
                <p className="text-[11px] text-zinc-500">
                  Scan at entrance gate or checkpoint
                </p>
              </div>

              {/* Ticket Details Grid */}
              <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2.5 text-left text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Pass ID</span>
                  <span className="font-mono font-bold text-zinc-900 text-xs">
                    {ticket.ticketNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Order Reference</span>
                  <span className="font-mono font-medium text-zinc-700 text-xs">
                    {ticket.orderNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Attendee</span>
                  <span className="font-semibold text-zinc-900 truncate block text-xs">
                    {ticket.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Price</span>
                  <span className="font-mono font-bold text-zinc-900 text-xs">
                    ${ticket.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {ticket.usedAt && (
                <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-700 text-left">
                  <span className="font-semibold block">Checked In:</span>
                  <span>
                    {new Date(ticket.usedAt).toLocaleTimeString()} • {ticket.usedBy || 'Staff'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-5 py-3 bg-white border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 print:hidden">
          <span className="text-[11px]">Valid Digital Pass</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-full transition text-xs shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

