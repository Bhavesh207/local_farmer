import React, { useState } from 'react';
import { User, Eye, EyeOff, Check, X, Sparkles } from 'lucide-react';
import { IMAGES } from '../constants/data';

interface GlassmorphicLoginProps {
  isOpen?: boolean;
  onClose?: () => void;
  isStandalone?: boolean;
  onLoginSuccess?: (username: string) => void;
  onSwitchToEcoland?: () => void;
}

export const GlassmorphicLoginModal: React.FC<GlassmorphicLoginProps> = ({
  isOpen = true,
  onClose,
  isStandalone = false,
  onLoginSuccess,
  onSwitchToEcoland,
}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalone) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setSubmittedMessage('Please enter your User Name.');
      return;
    }
    if (!password.trim()) {
      setSubmittedMessage('Please enter your Password.');
      return;
    }
    const name = userName.trim();
    setSubmittedMessage(`Welcome, ${name}! Redirecting to Local Farmer webpage...`);
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess(name);
      if (onClose) onClose();
      setSubmittedMessage(null);
    }, 900);
  };

  const cardContent = (
    <div className="relative w-full max-w-[420px] bg-white/10 backdrop-blur-xl border border-white/30 rounded-[28px] shadow-2xl p-7 text-white flex flex-col justify-between transition-all">
      {/* Top right close button if modal mode */}
      {!isStandalone && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div>
        {/* Title & Subtitle matching Image 1 */}
        <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        <p className="text-white/80 text-sm mb-6 font-normal">
          {isSignup
            ? 'Create a new account to join Local Farmer'
            : 'Welcome back please login to your account'}
        </p>

        {submittedMessage ? (
          <div className="p-4 bg-emerald-500/30 border border-emerald-400/50 rounded-2xl text-center mb-6 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-2 animate-bounce" />
            <p className="font-semibold text-white">{submittedMessage}</p>
          </div>
        ) : null}

        {/* Login / Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Name Input Field */}
          <div>
            <div className="relative flex items-center bg-white/10 border border-white/40 focus-within:border-white/80 focus-within:bg-white/20 rounded-2xl px-4 py-3 transition">
              <input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/70 outline-none text-base pr-3"
              />
              <User className="w-5 h-5 text-white/80 shrink-0" />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <div className="relative flex items-center bg-white/10 border border-white/40 focus-within:border-white/80 focus-within:bg-white/20 rounded-2xl px-4 py-3 transition">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/70 outline-none text-base pr-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/80 hover:text-white transition focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 shrink-0" />
                ) : (
                  <EyeOff className="w-5 h-5 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2 pt-1 pb-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded flex items-center justify-center transition ${
                rememberMe
                  ? 'bg-[#52b72a] text-white shadow-sm'
                  : 'bg-white/20 border border-white/40'
              }`}
            >
              {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span
              onClick={() => setRememberMe(!rememberMe)}
              className="text-sm font-medium text-white/90 cursor-pointer select-none"
            >
              Remember me
            </span>
          </div>

          {/* Gradient Submit Button matching Image 1 green-yellow gradient */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#b3d328] via-[#61b138] to-[#21a14c] hover:brightness-110 active:scale-[0.98] text-white font-bold text-lg shadow-lg hover:shadow-emerald-900/30 transition duration-200 mt-2"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {/* Don't have an account? Signup text link */}
        <div className="text-center mt-4">
          <p className="text-sm text-white/90">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="font-bold text-white hover:underline ml-1"
            >
              {isSignup ? 'Login' : 'Signup'}
            </button>
          </p>
        </div>
      </div>


    </div>
  );

  // If rendering in standalone full-screen view (matching Image 1 exactly)
  if (isStandalone) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative bg-cover bg-center px-4 py-8 select-none"
        style={{
          backgroundImage: `url(${IMAGES.loginHillsBg})`,
        }}
      >
        {/* Subtle overlay darkening to match image depth */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        <div className="z-10">{cardContent}</div>
      </div>
    );
  }

  // Else rendering as an overlay modal over the Ecoland page
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="max-h-[90vh] overflow-y-auto">
        {cardContent}
      </div>
    </div>
  );
};
