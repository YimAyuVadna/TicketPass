import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  QrCode,
  Globe,
  Lock,
  CheckCircle2,
  Ticket as TicketIcon,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { EventItem, TicketType, PaymentMethod, Ticket, OrderItem } from '../../types';
import { useTicketContext } from '../../context/TicketContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  ticketType: TicketType | null;
  quantity: number;
  onSuccessViewTickets: (tickets: Ticket[]) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  event,
  ticketType,
  quantity,
  onSuccessViewTickets,
}) => {
  const { currentUser, isLoggedIn, purchaseTickets } = useTicketContext();

  const [name, setName] = useState(isLoggedIn ? currentUser.name : '');
  const [phone, setPhone] = useState(isLoggedIn ? currentUser.phone : '');
  const [email, setEmail] = useState(isLoggedIn ? currentUser.email : '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QR_PAYMENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    order: OrderItem;
    tickets: Ticket[];
  } | null>(null);

  // Sync with current user when opening or auth changes
  React.useEffect(() => {
    if (isOpen) {
      if (isLoggedIn) {
        setName(currentUser.name);
        setPhone(currentUser.phone);
        setEmail(currentUser.email);
      } else {
        setName('');
        setPhone('');
        setEmail('');
      }
    }
  }, [isOpen, isLoggedIn, currentUser]);

  if (!isOpen || !event || !ticketType) return null;

  const total = ticketType.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = purchaseTickets({
        event,
        ticketType,
        quantity,
        customerInfo: {
          name,
          phone,
          email,
          notes: notes.trim() || undefined,
        },
        paymentMethod,
        source: 'ONLINE',
      });

      setIsSubmitting(false);
      setCompletedOrder(result);

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }, 500);
  };

  const handleReset = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden text-zinc-900 border border-zinc-200/80 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h3 className="font-bold text-base text-zinc-900">
              {completedOrder ? 'Order Confirmed' : 'Checkout & Ticketing'}
            </h3>
            <p className="text-xs text-zinc-400">
              {completedOrder
                ? 'Your admission pass is ready'
                : 'Instant digital passes with entrance QR validation'}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="p-6 text-center space-y-5">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Payment Successful
              </span>
              <h4 className="text-xl font-bold text-zinc-900 pt-1">
                Thank You, {completedOrder.order.customerName}
              </h4>
              <p className="text-xs text-zinc-500 font-mono">
                Order Reference: {completedOrder.order.orderNumber}
              </p>
            </div>

            {/* Generated Tickets Card */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Event</span>
                  <h5 className="font-semibold text-zinc-900">{event.name}</h5>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Issued</span>
                  <span className="font-semibold text-zinc-700">
                    {completedOrder.tickets.length} Digital {completedOrder.tickets.length > 1 ? 'Passes' : 'Pass'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {completedOrder.tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 bg-white rounded-xl border border-zinc-200/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <TicketIcon className="w-3.5 h-3.5 text-zinc-600" />
                      <div>
                        <span className="font-mono font-bold text-zinc-900">{t.ticketNumber}</span>
                        <span className="text-zinc-400 ml-2">({t.customerName})</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md">
                      VALID
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onSuccessViewTickets(completedOrder.tickets);
                }}
                className="flex-1 py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-full transition-all text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <span>View & Present QR Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-full transition text-xs"
              >
                Back to Events
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Order Summary banner */}
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  {event.name}
                </span>
                <span className="text-xs font-bold text-zinc-900">
                  {quantity}x {ticketType.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Total</span>
                <span className="text-lg font-black text-zinc-900 font-mono">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                  Attendee Information
                </h4>
                <span className={`text-[10px] font-medium ${isLoggedIn ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  {isLoggedIn ? `Signed in as ${currentUser.name}` : 'Guest Checkout'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chan Dara"
                    className="w-full px-3 py-2 bg-white border border-zinc-200/80 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 012 345 678"
                    className="w-full px-3 py-2 bg-white border border-zinc-200/80 rounded-xl text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chandara@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-zinc-200/80 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Special Requests / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Seating preferences, accessibility..."
                    className="w-full px-3 py-2 bg-white border border-zinc-200/80 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5 pt-1">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                Payment Method
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR_PAYMENT')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'QR_PAYMENT'
                      ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900 shadow-2xs'
                      : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-600'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-zinc-800" />
                  <span className="text-xs font-semibold">QR Pay</span>
                  <span className="text-[10px] text-zinc-400">Scan & Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'CARD'
                      ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900 shadow-2xs'
                      : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-zinc-800" />
                  <span className="text-xs font-semibold">Credit/Debit</span>
                  <span className="text-[10px] text-zinc-400">Visa / Master</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'ONLINE'
                      ? 'border-zinc-900 bg-zinc-50 font-semibold text-zinc-900 shadow-2xs'
                      : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-600'
                  }`}
                >
                  <Globe className="w-4 h-4 text-zinc-800" />
                  <span className="text-xs font-semibold">Online Bank</span>
                  <span className="text-[10px] text-zinc-400">Direct Pay</span>
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1">
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>Encrypted checkout with real-time ticket issuance.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !name || !phone || !email}
              className="w-full py-3 px-6 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold rounded-full transition-all shadow-xs flex items-center justify-center gap-2 text-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Issuing Tickets...</span>
                </>
              ) : (
                <>
                  <span>Pay ${total.toFixed(2)} & Issue Digital Passes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

