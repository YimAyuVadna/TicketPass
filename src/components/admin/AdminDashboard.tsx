import React, { useState } from 'react';
import {
  Calendar,
  ShoppingBag,
  Users,
  Shield,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  BarChart3,
  X,
  Sliders,
  Sparkles,
  Tag,
  Edit3,
} from 'lucide-react';
import { EventItem, StaffRole } from '../../types';
import { useTicketContext } from '../../context/TicketContext';
import { EventFormModal } from './EventFormModal';
import { HeroBannerModal } from './HeroBannerModal';
import { CategoryManageModal } from './CategoryManageModal';

export const AdminDashboard: React.FC = () => {
  const {
    events,
    orders,
    tickets,
    users,
    auditLogs,
    createEvent,
    updateEvent,
    deleteEvent,
    addUser,
    heroBanner,
    categories,
  } = useTicketContext();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'orders' | 'customers' | 'staff' | 'audit' | 'storefront'
  >('overview');

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Storefront modals state
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // New staff modal state
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('STAFF');

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderSourceFilter, setOrderSourceFilter] = useState<'ALL' | 'ONLINE' | 'STAFF_ASSISTED'>('ALL');

  // Statistical calculations
  const totalEvents = events.length;
  const totalTicketsSold = orders.reduce((acc, o) => acc + o.quantity, 0);
  const totalTicketsUsed = tickets.filter((t) => t.status === 'USED').length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const onlineOrders = orders.filter((o) => o.source === 'ONLINE');
  const staffOrders = orders.filter((o) => o.source === 'STAFF_ASSISTED');
  const onlineRevenue = onlineOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const staffRevenue = staffOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const onlinePercent = orders.length > 0 ? Math.round((onlineOrders.length / orders.length) * 100) : 0;
  const staffPercent = 100 - onlinePercent;
  const checkInRate = totalTicketsSold > 0 ? Math.round((totalTicketsUsed / totalTicketsSold) * 100) : 0;

  // Customers calculation
  const customerUsers = users.filter((u) => u.role === 'CUSTOMER');
  const staffUsers = users.filter((u) => u.role === 'STAFF' || u.role === 'ADMIN');

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSource =
      orderSourceFilter === 'ALL' ? true : ord.source === orderSourceFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.eventName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerPhone.includes(orderSearch);
    return matchesSource && matchesSearch;
  });

  const handleCreateOrUpdateEvent = (eventData: Omit<EventItem, 'id' | 'createdAt'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      createEvent(eventData);
    }
    setEditingEvent(null);
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    addUser({
      name: newStaffName,
      email: newStaffEmail,
      phone: newStaffPhone || '012 000 000',
      role: 'STAFF',
      staffRole: newStaffRole,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    });

    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setIsStaffModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-zinc-800 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 bg-white/10 text-zinc-300 border border-white/10 rounded-lg text-[11px] font-mono uppercase tracking-wider">
              Administration Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-2">
              Platform Master Console
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Events catalog, ticket capacity, orders auditing, staff accounts, and sales analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-200/80">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'events', label: `Events (${events.length})`, icon: Calendar },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customerUsers.length})`, icon: Users },
          { id: 'staff', label: `Staff Accounts (${staffUsers.length})`, icon: Shield },
          { id: 'storefront', label: 'Storefront & Banner', icon: Sliders },
          { id: 'audit', label: `Audit Logs (${auditLogs.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs rounded-xl transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200/80 font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REPORTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Total Events
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono mt-1 block">
                {totalEvents}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Catalog live</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Tickets Sold
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono mt-1 block">
                {totalTicketsSold}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">All tiers combined</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Tickets Used
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono mt-1 block">
                {totalTicketsUsed}
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">{checkInRate}% turnout</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono mt-1 block">
                ${totalRevenue.toFixed(2)}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium">Gross sales</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Customers
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 font-mono mt-1 block">
                {customerUsers.length}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">Registered accounts</span>
            </div>
          </div>

          {/* Sales Breakdown & Source Ratio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Online vs Staff-Assisted Ratio */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-zinc-900">Purchase Source Breakdown</h3>
                <span className="text-xs text-zinc-400 font-medium">Online vs Staff Assisted</span>
              </div>

              {/* Progress bar visual */}
              <div className="space-y-2.5">
                <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${onlinePercent}%` }}
                    className="bg-zinc-900 h-full transition-all duration-500"
                    title={`Online: ${onlinePercent}%`}
                  />
                  <div
                    style={{ width: `${staffPercent}%` }}
                    className="bg-zinc-400 h-full transition-all duration-500"
                    title={`Staff Assisted: ${staffPercent}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                    <span className="font-medium text-zinc-800">
                      Online: {onlinePercent}% (${onlineRevenue.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                    <span className="font-medium text-zinc-800">
                      Staff: {staffPercent}% (${staffRevenue.toFixed(2)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-xs text-zinc-600">
                <p>
                  Staff-assisted sales generated <strong className="text-zinc-900 font-mono">${staffRevenue.toFixed(2)}</strong> across{' '}
                  <strong className="text-zinc-900">{staffOrders.length} walk-in orders</strong>.
                </p>
              </div>
            </div>

            {/* Check-in & Gate Turnout */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-zinc-900">Entrance Turnout</h3>
                <span className="text-xs font-semibold text-emerald-600 font-mono">{checkInRate}% Scanned</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase block">Used</span>
                  <span className="text-lg font-bold text-zinc-900 font-mono mt-0.5 block">
                    {totalTicketsUsed}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase block">Pending</span>
                  <span className="text-lg font-bold text-zinc-900 font-mono mt-0.5 block">
                    {totalTicketsSold - totalTicketsUsed}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase block">Total</span>
                  <span className="text-lg font-bold text-zinc-900 font-mono mt-0.5 block">
                    {totalTicketsSold}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-xs text-zinc-600">
                <p>
                  Single-use cryptographic QR validation prevents ticket fraud and duplicate admissions at gates.
                </p>
              </div>
            </div>
          </div>

          {/* Event Sales Report Table */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
            <h3 className="font-semibold text-base text-zinc-900">Event Capacity & Sales Utilization</h3>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200/80">
              <table className="w-full text-left text-xs text-zinc-600">
                <thead className="bg-zinc-50 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider border-b border-zinc-200/80">
                  <tr>
                    <th className="px-4 py-3">Event Title</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Sold</th>
                    <th className="px-4 py-3">Remaining</th>
                    <th className="px-4 py-3">Revenue</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-normal">
                  {events.map((ev) => {
                    const eventOrders = orders.filter((o) => o.eventId === ev.id);
                    const eventSold = ev.ticketTypes.reduce((sum, tt) => sum + tt.sold, 0);
                    const eventRevenue = eventOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                    const remainingCapacity = Math.max(0, ev.capacity - eventSold);

                    return (
                      <tr key={ev.id} className="hover:bg-zinc-50/70 transition">
                        <td className="px-4 py-3 font-semibold text-zinc-900">{ev.name}</td>
                        <td className="px-4 py-3 text-zinc-500">{ev.date}</td>
                        <td className="px-4 py-3 font-mono">{ev.capacity.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                          {eventSold.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-500">
                          {remainingCapacity.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                          ${eventRevenue.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ${
                              ev.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-zinc-900">Events Catalog & Ticket Inventory</h3>
              <p className="text-xs text-zinc-400">Manage listings, date schedules, and ticket pricing tiers</p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => {
              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium uppercase bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {ev.category}
                        </span>
                        <h4 className="font-semibold text-base text-zinc-900 mt-1">{ev.name}</h4>
                        <p className="text-xs text-zinc-500">{ev.location} • {ev.date}</p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium uppercase ${
                          ev.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </div>

                    {/* Ticket Tiers list */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                        Ticket Tiers Inventory
                      </span>
                      <div className="grid gap-1.5">
                        {ev.ticketTypes.map((tt) => (
                          <div
                            key={tt.id}
                            className="p-2 bg-zinc-50 rounded-xl border border-zinc-200/70 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-zinc-800">{tt.name}</span>
                              <span className="text-zinc-500 ml-2 font-mono">
                                ${tt.price.toFixed(2)}
                              </span>
                            </div>
                            <span className="font-mono text-zinc-500 text-[11px]">
                              {tt.sold} / {tt.quantity} sold
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <div className="text-xs text-zinc-500">
                      <span>Total Capacity: </span>
                      <strong className="text-zinc-900 font-mono font-semibold">{ev.capacity}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setIsEventModalOpen(true);
                        }}
                        className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete event "${ev.name}"?`)) {
                            deleteEvent(ev.id);
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-base text-zinc-900">Order Transactions Register</h3>
              <p className="text-xs text-zinc-400">Customer self-checkout and staff-assisted purchases</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Source Filter */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/50">
                {(['ALL', 'ONLINE', 'STAFF_ASSISTED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderSourceFilter(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      orderSourceFilter === s
                        ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {s === 'ALL' ? 'All' : s === 'ONLINE' ? 'Online' : 'Staff'}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-56">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Order #, name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider border-b border-zinc-200/80">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Qty / Tier</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-normal">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/70 transition">
                    <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                      {ord.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-zinc-900 block">{ord.customerName}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">{ord.customerPhone}</span>
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px] text-zinc-700">{ord.eventName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          ord.source === 'ONLINE'
                            ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {ord.source === 'ONLINE' ? 'Online' : 'Staff'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {ord.quantity}x {ord.ticketTypeName}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold rounded border border-emerald-200">
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-500 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-semibold text-base text-zinc-900">Customer Directory</h3>
            <p className="text-xs text-zinc-400">Registered attendee accounts and purchase histories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerUsers.map((cust) => {
              const custOrders = orders.filter((o) => o.customerId === cust.id);
              const custSpend = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);

              return (
                <div
                  key={cust.id}
                  className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={cust.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-zinc-900">{cust.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono">{cust.phone}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-400 text-[11px] block">Total Orders</span>
                      <span className="font-bold text-zinc-900 font-mono">{custOrders.length}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[11px] block">Total Spend</span>
                      <span className="font-bold text-zinc-900 font-mono">${custSpend.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-zinc-900">Staff Account Roster</h3>
              <p className="text-xs text-zinc-400">Role-based access controls for checkpoint and box office staff</p>
            </div>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 text-zinc-400 text-[11px] font-semibold uppercase tracking-wider border-b border-zinc-200/80">
                <tr>
                  <th className="px-4 py-3">Staff Member</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-normal">
                {staffUsers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-zinc-50/70 transition">
                    <td className="px-4 py-3 font-medium text-zinc-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-bold">
                        {staff.name.charAt(0)}
                      </div>
                      <span>{staff.name}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{staff.email}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500">{staff.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 font-mono text-[10px] font-medium rounded border border-zinc-200">
                        {staff.staffRole || staff.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold rounded border border-emerald-200">
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {staff.role === 'ADMIN' ? 'Full Platform Access' : 'Entrance Scanner & Box Office'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-semibold text-base text-zinc-900">System Security & Audit Logs</h3>
            <p className="text-xs text-zinc-400">Immutable trace of purchases, status updates, and scan validations</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 font-mono font-medium text-[10px] rounded">
                      {log.action}
                    </span>
                    <span className="font-medium text-zinc-900">{log.details}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    Executed by: <strong className="text-zinc-700 font-medium">{log.performedBy}</strong>
                  </span>
                </div>

                <span className="font-mono text-zinc-400 shrink-0 text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: STOREFRONT & HERO BANNER */}
      {activeTab === 'storefront' && (
        <div className="space-y-6">
          {/* Hero Banner Section */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-zinc-900">Storefront Hero Banner</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      heroBanner.enabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {heroBanner.enabled ? 'ACTIVE ON STOREFRONT' : 'HIDDEN'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  The primary editorial spotlight displayed atop the events catalog
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsHeroModalOpen(true)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Hero Banner</span>
              </button>
            </div>

            {/* Banner Preview Card */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white p-6 border border-zinc-800 shadow-md group min-h-[190px] flex flex-col justify-end">
              <div className="absolute inset-0">
                <img
                  src={heroBanner.image}
                  alt={heroBanner.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
              </div>

              <div className="relative z-10 space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {heroBanner.tag}
                  </span>
                  {heroBanner.category && (
                    <span className="text-xs text-zinc-300 font-medium">{heroBanner.category}</span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white line-clamp-1">
                  {heroBanner.title}
                </h2>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {heroBanner.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-zinc-300 pt-1">
                  {heroBanner.date && <span>📅 {heroBanner.date}</span>}
                  {heroBanner.startTime && <span>⏰ {heroBanner.startTime}</span>}
                  {heroBanner.location && <span>📍 {heroBanner.location}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Categories Management Section */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-zinc-900">Event Categories & Filters</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Organize the genre tags and filters shown across catalog browsing
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Manage Categories</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 border border-zinc-200/80 text-zinc-800 flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-zinc-400" />
                  <span>{cat}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleCreateOrUpdateEvent}
        initialEvent={editingEvent}
      />

      {/* Add Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-zinc-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-zinc-900">Add Staff Account</h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="w-full px-3 py-2 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Staff Email</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="staff@gmail.com"
                  className="w-full px-3 py-2 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="089 999 111"
                  className="w-full px-3 py-2 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Role & Authority</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                >
                  <option value="STAFF">STAFF (Scanning & Assisted Purchases)</option>
                  <option value="SENIOR_STAFF">SENIOR STAFF (Overriding & Searching)</option>
                  <option value="ADMIN">ADMIN (Full Catalog & Reports)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Permissions)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-medium text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium cursor-pointer shadow-xs"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Banner and Category Management Modals */}
      <HeroBannerModal isOpen={isHeroModalOpen} onClose={() => setIsHeroModalOpen(false)} />
      <CategoryManageModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
    </div>
  );
};
