import { useState } from 'react';
import type { Page } from '../data';
import { api, setToken } from '../lib/api';

interface AuthPageProps {
  navigate: (page: Page) => void;
  onAuthenticated?: () => void;
}

type Mode = 'login' | 'register' | 'forgot';

export default function AuthPage({ navigate, onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [forgotSent, setForgotSent] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [registration, setRegistration] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const signIn = async () => { try { const result = await api.login(credentials); setToken(result.token); onAuthenticated?.(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in'); } };
  const signUp = async () => { try { const result = await api.register(registration); setToken(result.token); onAuthenticated?.(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create account'); } };

  return (
    <div className="min-h-screen bg-[#FAF8F5] grid lg:grid-cols-2">
      {/* Left — image */}
      <div className="hidden lg:block relative overflow-hidden bg-[#2C1810]">
        <img
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&h=1200&fit=crop&auto=format"
          alt="Améora Jewellery"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p className="font-display text-4xl text-[#FAF8F5] mb-3">
            Crafted for<br />
            <em className="text-[#C9A96E]">the ones who know</em>
          </p>
          <p className="text-[#C8BAB0] text-sm font-body">Join Améora and enjoy exclusive access to new arrivals, private sales, and curated recommendations.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="block text-center mb-10 w-full">
            <span className="font-display text-2xl tracking-widest text-[#2C1810]">AMÉORA</span>
          </button>

          {/* Tabs */}
          {mode !== 'forgot' && (
            <div className="flex border-b border-[#E8D5B0] mb-8">
              {(['login', 'register'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 text-xs tracking-widest uppercase font-body transition-colors border-b-2 -mb-px ${mode === m ? 'border-[#C9A96E] text-[#2C1810]' : 'border-transparent text-[#9E8E80] hover:text-[#5C3D2E]'}`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Login */}
          {mode === 'login' && (
            <div className="space-y-5">
              <div>
                <p className="font-display text-2xl text-[#2C1810] mb-1">Welcome back</p>
                <p className="text-sm text-[#9E8E80] font-body">Sign in to your Améora account</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Email Address</label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] tracking-widest uppercase text-[#9E8E80] font-body">Password</label>
                    <button onClick={() => setMode('forgot')} className="text-[10px] text-[#C9A96E] hover:text-[#A8854A] font-body tracking-wide uppercase transition-colors">Forgot?</button>
                  </div>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#C9A96E]" />
                <span className="text-xs text-[#9E8E80] font-body">Keep me signed in</span>
              </label>
              <button
                onClick={signIn}
                className="w-full py-4 bg-[#2C1810] text-[#E8D5B0] text-sm tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
              >
                Sign In
              </button>
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#E8D5B0]" />
                <span className="mx-4 text-xs text-[#C8BAB0] font-body">or</span>
                <div className="flex-1 border-t border-[#E8D5B0]" />
              </div>
              <button className="w-full py-3.5 border border-[#E8D5B0] text-sm text-[#5C3D2E] font-body hover:border-[#C9A96E] transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* Register */}
          {mode === 'register' && (
            <div className="space-y-5">
              <div>
                <p className="font-display text-2xl text-[#2C1810] mb-1">Create your account</p>
                <p className="text-sm text-[#9E8E80] font-body">Join the world of Améora</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['First Name', 'Last Name'].map((label) => (
                  <div key={label}>
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">{label}</label>
                    <input value={label === 'First Name' ? registration.firstName : registration.lastName} onChange={(e) => setRegistration({ ...registration, [label === 'First Name' ? 'firstName' : 'lastName']: e.target.value })} className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm focus:outline-none focus:border-[#C9A96E] font-body" />
                  </div>
                ))}
              </div>
              {[
                { label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', type: 'password', placeholder: '8+ characters' },
                { label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">{label}</label>
                  <input
                    type={type}
                    value={label === 'Email Address' ? registration.email : registration.password}
                    onChange={(e) => setRegistration({ ...registration, [label === 'Email Address' ? 'email' : 'password']: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                  />
                </div>
              ))}
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#C9A96E] mt-0.5" />
                <span className="text-xs text-[#9E8E80] font-body leading-relaxed">I agree to the <a href="#" className="text-[#C9A96E] hover:underline">Terms of Service</a> and <a href="#" className="text-[#C9A96E] hover:underline">Privacy Policy</a></span>
              </label>
              <button
                onClick={signUp}
                className="w-full py-4 bg-[#2C1810] text-[#E8D5B0] text-sm tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Forgot Password */}
          {mode === 'forgot' && (
            <div className="space-y-5">
              <button onClick={() => setMode('login')} className="text-xs text-[#9E8E80] hover:text-[#C9A96E] font-body tracking-widest uppercase flex items-center gap-1">
                ← Back to Sign In
              </button>
              {!forgotSent ? (
                <>
                  <div>
                    <p className="font-display text-2xl text-[#2C1810] mb-1">Reset your password</p>
                    <p className="text-sm text-[#9E8E80] font-body">Enter your email and we'll send a reset link.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#9E8E80] font-body mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-[#E8D5B0] bg-white text-sm text-[#2C1810] focus:outline-none focus:border-[#C9A96E] font-body"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    onClick={() => api.forgotPassword(credentials.email).then(() => setForgotSent(true)).catch((e) => setError(e instanceof Error ? e.message : 'Unable to send reset link'))}
                    className="w-full py-4 bg-[#2C1810] text-[#E8D5B0] text-sm tracking-widest uppercase font-body hover:bg-[#5C3D2E] transition-colors"
                  >
                    Send Reset Link
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-[#C9A96E]/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#C9A96E]">✓</span>
                  </div>
                  <p className="font-display text-xl text-[#2C1810] mb-2">Check your inbox</p>
                  <p className="text-sm text-[#9E8E80] font-body">If an account exists, a reset link has been sent.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
