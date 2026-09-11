import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Building,
  HelpCircle,
  LogIn,
} from 'lucide-react';
import { EventItem, TicketType } from '../../types';
import { useTicketContext } from '../../context/TicketContext';

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
  onProceedToCheckout: (event: EventItem, ticketType: TicketType, quantity: number) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onProceedToCheckout,
}) => {
  const { isLoggedIn } = useTicketContext();
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!event) return null;

  const currentTicketType =
    event.ticketTypes.find((t) => t.id === selectedTypeId) || event.ticketTypes[0];
  const remaining = currentTicketType ? currentTicketType.quantity - currentTicketType.sold : 0;
  const isAvailable = remaining > 0;
  const subtotal = currentTicketType ? currentTicketType.price * quantity : 0;

  const handleIncrement = () => {
    if (quantity < Math.min(remaining, 10)) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleCheckout = () => {
    if (currentTicketType && isAvailable) {
      onProceedToCheckout(event, currentTicketType, quantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden text-zinc-900 border border-zinc-200/80 my-8 max-h-[90vh] flex flex-col">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white flex items-center justify-center transition backdrop-blur-md"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1">
          {/* Header Banner */}
          <div className="relative h-60 w-full bg-zinc-900 overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover opacity-75"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            <div className="absolute bottom-5 left-6 right-6 text-white space-y-1.5">
              <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[11px] font-semibold rounded-full uppercase tracking-wider">
                {event.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {event.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-zinc-300 flex-wrap font-medium pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  {event.startTime} - {event.endTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  {event.organizer}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Location block */}
            <div className="flex items-start gap-3 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/60">
              <div className="w-8 h-8 rounded-xl bg-white text-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/80 shadow-2xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-semibold text-zinc-900">{event.location}</h4>
                <p className="text-zinc-500 mt-0.5">{event.address}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                About Event
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Ticket Tier Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  Select Admission Tier
                </h4>
                <span className="text-[11px] text-zinc-400 font-medium">Digital QR Pass</span>
              </div>

              <div className="grid gap-2.5">
                {event.ticketTypes.map((type) => {
                  const left = type.quantity - type.sold;
                  const isSold = left <= 0;
                  const isSelected = (selectedTypeId || event.ticketTypes[0].id) === type.id;

                  return (
                    <div
                      key={type.id}
                      onClick={() => !isSold && setSelectedTypeId(type.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-50/80 shadow-2xs'
                          : isSold
                          ? 'border-zinc-200 bg-zinc-50/50 opacity-50 cursor-not-allowed'
                          : 'border-zinc-200/80 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="font-semibold text-sm text-zinc-900">{type.name}</span>
                        </div>
                        <p className="text-xs text-zinc-500 pl-6">{type.description}</p>
                        <div className="text-[11px] text-zinc-400 pl-6">
                          {isSold ? (
                            <span className="text-rose-600 font-medium">Sold Out</span>
                          ) : (
                            <span>{left} remaining</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-extrabold text-zinc-900 font-mono block">
                          ${type.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">each</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            {isAvailable && (
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/70 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-zinc-800 block">Quantity</span>
                  <span className="text-[11px] text-zinc-400">Up to 10 passes</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-zinc-900 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= Math.min(remaining, 10)}
                    className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Admission Rules */}
            {event.rules && event.rules.length > 0 && (
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  Admission Rules
                </h4>
                <ul className="space-y-1 text-xs text-zinc-500 list-disc list-inside">
                  {event.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Checkout Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-zinc-200/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
              Total Due
            </span>
            <span className="text-xl font-black text-zinc-900 font-mono">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleCheckout}
              disabled={!isAvailable}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold rounded-full shadow-xs transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue to Checkout</span>
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleCheckout}
                disabled={!isAvailable}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold rounded-full shadow-xs transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Book</span>
              </button>
              <span className="text-[10px] text-zinc-400">
                Sign in or quick sign up required
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

