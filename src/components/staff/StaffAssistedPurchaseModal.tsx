import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  Globe,
  CheckCircle2,
  Ticket as TicketIcon,
  Printer,
  ArrowRight,
} from 'lucide-react';
import { TicketType, PaymentMethod, Ticket, OrderItem } from '../../types';
import { useTicketContext } from '../../context/TicketContext';

interface StaffAssistedPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewGeneratedTicket: (ticket: Ticket) => void;
}

export const StaffAssistedPurchaseModal: React.FC<StaffAssistedPurchaseModalProps> = ({
  isOpen,
  onClose,
  onViewGeneratedTicket,
}) => {
  const { events, purchaseTickets, currentUser } = useTicketContext();

  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('Walk-in box office purchase');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [completedResult, setCompletedResult] = useState<{
    order: OrderItem;
    tickets: Ticket[];
  } | null>(null);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const activeTicketTypes = currentEvent?.ticketTypes || [];
  const currentTicketType =
    activeTicketTypes.find((t) => t.id === selectedTypeId) || activeTicketTypes[0];

  const remaining = currentTicketType ? currentTicketType.quantity - currentTicketType.sold : 0;
  const totalAmount = currentTicketType ? currentTicketType.price * quantity : 0;

  const handleNextToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setStep('confirm');
  };

  const handleExecutePurchase = () => {
    if (!currentEvent || !currentTicketType) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const emailValue = customerEmail.trim() || `${customerPhone.replace(/\s+/g, '')}@walkin.guest`;

      const result = purchaseTickets({
        event: currentEvent,
        ticketType: currentTicketType,
        quantity,
        customerInfo: {
          name: customerName,
          phone: customerPhone,
          email: emailValue,
          notes,
        },
        paymentMethod,
        source: 'STAFF_ASSISTED',
        staffCreator: currentUser,
      });

      setIsSubmitting(false);
      setCompletedResult(result);
      setStep('success');

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }, 500);
  };

  const handleResetAndClose = () => {
    setStep('form');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCompletedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-xl overflow-hidden text-zinc-900 border border-zinc-200/80 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg font-mono font-semibold text-[11px] uppercase tracking-wider">
              Box Office
            </span>
            <div>
              <h3 className="font-semibold text-base text-zinc-900">
                Staff-Assisted Booking
              </h3>
              <p className="text-xs text-zinc-400">
                Walk-in counter issuance & direct ticketing
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: FORM INPUT */}
        {step === 'form' && (
          <form onSubmit={handleNextToConfirm} className="p-6 space-y-5">
            {/* Event & Ticket Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                1. Select Event & Ticket
              </h4>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-700">
                  Target Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    const ev = events.find((item) => item.id === e.target.value);
                    if (ev && ev.ticketTypes[0]) {
                      setSelectedTypeId(ev.ticketTypes[0].id);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Ticket Tier
                  </label>
                  <select
                    value={selectedTypeId || currentTicketType?.id}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  >
                    {activeTicketTypes.map((tt) => (
                      <option key={tt.id} value={tt.id}>
                        {tt.name} (${tt.price.toFixed(2)}) — {tt.quantity - tt.sold} left
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Pass Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(remaining, 20)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                2. Attendee Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Attendee Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Chan Dara / Walk-in Guest"
                    className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 012 345 678"
                    className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Internal Note / Cash Desk Memo
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Paid cash at counter gate 1"
                    className="w-full px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Record */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                3. Payment Method Received
              </h4>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'CASH', label: 'Cash', icon: Banknote },
                  { id: 'QR_PAYMENT', label: 'QR Pay', icon: QrCode },
                  { id: 'CARD', label: 'Card', icon: CreditCard },
                  { id: 'ONLINE', label: 'Online', icon: Globe },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white font-medium'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-600'}`} />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtotal & Next Button */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">Total Due</span>
                <span className="text-xl font-bold font-mono text-zinc-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={!customerName || !customerPhone || remaining < quantity}
                className="py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-medium rounded-xl transition shadow-xs flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CONFIRMATION VIEW */}
        {step === 'confirm' && (
          <div className="p-6 space-y-5">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-center space-y-1">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Order Verification
              </span>
              <h4 className="text-lg font-bold text-zinc-900">Verify Cash/Payment Collection</h4>
              <p className="text-xs text-zinc-500">
                Confirm payment receipt of{' '}
                <strong className="text-zinc-900 font-mono">${totalAmount.toFixed(2)}</strong> via {paymentMethod}
              </p>
            </div>

            <div className="bg-zinc-50/50 rounded-2xl p-4 border border-zinc-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-zinc-500">Customer Name</span>
                <span className="font-semibold text-zinc-900">{customerName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-zinc-500">Phone Number</span>
                <span className="font-mono font-medium text-zinc-900">{customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-zinc-500">Event</span>
                <span className="font-medium text-zinc-900">{currentEvent?.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-zinc-500">Ticket Tier</span>
                <span className="font-medium text-zinc-900">
                  {quantity}x {currentTicketType?.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 pb-2">
                <span className="text-zinc-500">Payment Mode</span>
                <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 rounded font-mono font-medium text-[11px]">
                  {paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm">
                <span className="font-semibold text-zinc-800">Total Collected</span>
                <span className="text-xl font-bold text-zinc-900 font-mono">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl transition text-xs cursor-pointer"
              >
                Back / Edit
              </button>
              <button
                type="button"
                onClick={handleExecutePurchase}
                disabled={isSubmitting}
                className="flex-2 py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Generating Tickets...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Payment & Issue Passes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & TICKET HANDOVER */}
        {step === 'success' && completedResult && (
          <div className="p-6 text-center space-y-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-mono font-semibold rounded-md uppercase border border-emerald-200">
                Success
              </span>
              <h4 className="text-xl font-bold text-zinc-900 mt-2">
                Passes Issued Successfully
              </h4>
              <p className="text-xs text-zinc-500 mt-1">
                Order <strong className="text-zinc-900 font-mono">{completedResult.order.orderNumber}</strong> • Source:{' '}
                <span className="font-medium text-zinc-800">Staff Assisted</span>
              </p>
            </div>

            {/* Issued Passes */}
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-left space-y-2 max-h-48 overflow-y-auto">
              {completedResult.tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <TicketIcon className="w-4 h-4 text-zinc-600" />
                    <div>
                      <span className="font-mono font-semibold text-zinc-900">{t.ticketNumber}</span>
                      <span className="text-zinc-400 block text-[11px]">{t.customerName}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onViewGeneratedTicket(t);
                    }}
                    className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium rounded-lg transition text-xs cursor-pointer"
                  >
                    View / Print Pass
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (completedResult.tickets[0]) {
                    onViewGeneratedTicket(completedResult.tickets[0]);
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Open Digital QR Pass for Customer</span>
              </button>
              <button
                onClick={handleResetAndClose}
                className="py-2.5 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl transition text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
