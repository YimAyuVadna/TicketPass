import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ticket,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Shield,
  Camera,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useTicketContext } from '../../context/TicketContext';
import { User, UserRole } from '../../types';

interface AuthViewProps {
  onAuthSuccess: (role: UserRole) => void;
  onBrowseAsGuest: () => void;
  authNotice?: string | null;
  pendingEventName?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthSuccess,
  onBrowseAsGuest,
  authNotice,
  pendingEventName,
}) => {
  const { users, switchUser, login, register, currentUser, isLoggedIn, logout } = useTicketContext();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In state
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInIdentifier.trim()) {
      setSignInError('Please enter your email address or phone number.');
      return;
    }

    const success = login(signInIdentifier);
    if (success) {
      const loggedUser = users.find(
        (u) =>
          u.email.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
          u.phone.replace(/\s+/g, '') === signInIdentifier.trim().replace(/\s+/g, '') ||
          u.id.toLowerCase() === signInIdentifier.trim().toLowerCase()
      );
      const targetRole = loggedUser ? loggedUser.role : 'CUSTOMER';
      onAuthSuccess(targetRole);
    } else {
      setSignInError(
        'Account not found. Select a demo persona on the right or enter a registered email (e.g. chandara@gmail.com).'
      );
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPhone.trim()) {
      setSignUpError('Please complete all required fields.');
      return;
    }

    if (!signUpPassword) {
      setSignUpError('Please create a password.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    // Check if email already exists
    const existing = users.find(
      (u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase()
    );
    if (existing) {
      setSignUpError('An account with this email address already exists. Please sign in.');
      return;
    }

    const newUser = register({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      phone: signUpPhone.trim(),
      role: 'CUSTOMER',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    });

    onAuthSuccess(newUser.role);
  };

  const handleSelectDemoPersona = (persona: User) => {
    switchUser(persona.id);
    onAuthSuccess(persona.role);
  };

  const handleAutofillPersona = (persona: User) => {
    setSignInIdentifier(persona.email);
    setSignInPassword('password123');
    setSignInError(null);
    setMode('signin');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-xs font-medium shadow-2xs">
          <Ticket className="w-3.5 h-3.5 -rotate-12 text-zinc-900" />
          <span>TicketPass Access Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Sign in or explore demo portals
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
          Manage your personal tickets, access gate checkpoint scanners, or control platform administration.
        </p>
      </div>

      {/* Guest Booking Gate Notice */}
      {authNotice && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Ticket className="w-5 h-5 -rotate-12" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-950">Sign In Required to Complete Booking</h3>
              {pendingEventName && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-200/80 text-amber-900">
                  {pendingEventName}
                </span>
              )}
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {authNotice} Select a demo profile on the right or sign in below to instantly continue your checkout.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Auth Card (Tabs: Sign In / Create Account) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-zinc-200/80 shadow-xs p-6 sm:p-8 lg:p-9 space-y-6">
          {/* Active Session Notice if already signed in */}
          {isLoggedIn && (
            <div className="p-4 sm:p-5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                  }
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500">
                      Currently Signed In
                    </span>
                    <span className="px-1.5 py-0.5 bg-zinc-200/70 text-zinc-700 rounded text-[10px] font-mono font-medium">
                      {currentUser.staffRole || currentUser.role}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">{currentUser.name}</p>
                  <p className="text-xs text-zinc-500 truncate max-w-[200px]">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onAuthSuccess(currentUser.role)}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3.5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Segmented Mode Selector with Sliding Background Animation */}
          <div className="relative flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setSignInError(null);
              }}
              className={`relative flex-1 py-2.5 px-4 rounded-xl transition-colors cursor-pointer z-10 ${
                mode === 'signin'
                  ? 'text-zinc-950 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {mode === 'signin' && (
                <motion.div
                  layoutId="auth-active-tab-pill"
                  className="absolute inset-0 bg-white rounded-xl shadow-xs border border-zinc-200/50 -z-10"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignUpError(null);
              }}
              className={`relative flex-1 py-2.5 px-4 rounded-xl transition-colors cursor-pointer z-10 ${
                mode === 'signup'
                  ? 'text-zinc-950 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {mode === 'signup' && (
                <motion.div
                  layoutId="auth-active-tab-pill"
                  className="absolute inset-0 bg-white rounded-xl shadow-xs border border-zinc-200/50 -z-10"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              <span>Create Account</span>
            </button>
          </div>

          {/* Form Container with Smooth Slide & Fade Transition */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.26, ease: [0.16, 1, 0.3, 1] } }}
            className="relative overflow-hidden"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {mode === 'signin' ? (
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-5 w-full"
                >
                  {signInError && (
                    <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200/80 text-rose-700 rounded-xl text-xs font-medium">
                      {signInError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Email or Phone Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        placeholder="e.g. chandara@gmail.com or 012 345 678"
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Password
                      </label>
                      <span className="text-[11px] text-zinc-400">Any demo password</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer mt-2"
                  >
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={onBrowseAsGuest}
                      className="text-xs text-zinc-500 hover:text-zinc-900 transition font-medium cursor-pointer"
                    >
                      Continue browsing events as Guest &rarr;
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onSubmit={handleSignUpSubmit}
                  className="space-y-5 w-full"
                >
                  {signUpError && (
                    <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200/80 text-rose-700 rounded-xl text-xs font-medium">
                      {signUpError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Chan Dara"
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="chandara@gmail.com"
                          className="w-full pl-11 pr-4 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          placeholder="012 345 678"
                          className="w-full pl-11 pr-4 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Create Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full pl-11 pr-11 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg"
                        >
                          {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSignUpConfirmPassword ? 'text' : 'password'}
                          required
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-11 pr-11 py-3 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg"
                        >
                          {showSignUpConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer mt-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Create Account & Sign In</span>
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={onBrowseAsGuest}
                      className="text-xs text-zinc-500 hover:text-zinc-900 transition font-medium cursor-pointer"
                    >
                      Continue browsing events as Guest &rarr;
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column: Demo Personas (Moved from Navbar) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-zinc-900">
                Interactive Demo Personas
              </h3>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">
              One-click instant login
            </span>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Select any pre-configured test profile below to explore different roles and security scopes without typing passwords.
          </p>

          {/* Demo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5 pt-1">
            {users.map((persona) => {
              const isCurrent = currentUser.id === persona.id;

              const roleTag =
                persona.role === 'ADMIN'
                  ? 'Admin Console'
                  : persona.role === 'STAFF'
                  ? persona.staffRole === 'SENIOR_STAFF'
                    ? 'Senior Staff'
                    : 'Staff Scanner'
                  : 'Customer Wallet';

              const roleBadgeColor =
                persona.role === 'ADMIN'
                  ? 'bg-zinc-900 text-white'
                  : persona.role === 'STAFF'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              const capabilities =
                persona.role === 'ADMIN'
                  ? 'Event listings, sales ratio charts, staff accounts, system audit'
                  : persona.role === 'STAFF'
                  ? 'Camera QR validation, check-in logs, walk-in box office sale'
                  : 'Event catalog, instant multi-pass checkout, Apple Wallet passbook';

              return (
                <div
                  key={persona.id}
                  className={`bg-white rounded-2xl border p-5 space-y-3.5 transition flex flex-col justify-between ${
                    isCurrent
                      ? 'border-zinc-900 ring-1 ring-zinc-900 shadow-sm'
                      : 'border-zinc-200/80 hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={persona.avatar}
                          alt={persona.name}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-xs text-zinc-900 leading-tight truncate">
                            {persona.name}
                          </h4>
                          <span
                            className="text-[11px] text-zinc-400 font-mono truncate block mt-0.5"
                            title={persona.email}
                          >
                            {persona.email}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border whitespace-nowrap self-start ${roleBadgeColor}`}
                      >
                        {roleTag}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      {capabilities}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleAutofillPersona(persona)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-700 font-medium cursor-pointer transition py-1"
                      title="Fill email into sign in form"
                    >
                      Fill Form
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDemoPersona(persona)}
                      className="py-2 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 sm:p-5 bg-zinc-100/70 border border-zinc-200/80 rounded-2xl text-xs text-zinc-600 flex items-start gap-3">
            <Layers className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Tip:</strong> You can switch roles at any time from this page. Role-based security routes will automatically adjust based on whether you are signed in as an Attendee, Staff Checkpoint, or Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
