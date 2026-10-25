import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signIn } from '../services/martBillingApi';

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn({ email, password });
      navigate(location.state?.from || '/invoice-list', { replace: true });
    } catch (signInError) {
      setError(signInError.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-12 inline-flex items-center gap-3" aria-label="Mart Billing">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <i className="ri-store-2-line text-xl" />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#202235]">Mart Billing</span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Welcome back</p>
            <h1 className="text-3xl font-bold tracking-tight text-[#202235] sm:text-4xl">Sign in to your account</h1>
            <p className="mt-3 text-sm leading-6 text-[#73778a]">
              Manage your products, customers, and sales from one place.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#34374a]" htmlFor="email">Email address</label>
              <div className="relative">
                <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#9a9daf]" />
                <input
                  autoComplete="username"
                  className="form-input h-12 w-full rounded-xl border-[#e3e5ed] bg-white pl-11 text-sm shadow-sm transition placeholder:text-[#a4a7b5] focus:border-primary focus:ring-primary/20"
                  id="email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@yourstore.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-[#34374a]" htmlFor="password">Password</label>
                <span className="text-xs text-[#9295a5]">Use your staff account</span>
              </div>
              <div className="relative">
                <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#9a9daf]" />
                <input
                  autoComplete="current-password"
                  className="form-input h-12 w-full rounded-xl border-[#e3e5ed] bg-white pl-11 pr-12 text-sm shadow-sm transition placeholder:text-[#a4a7b5] focus:border-primary focus:ring-primary/20"
                  id="password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#9295a5] transition hover:bg-black/5 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/[0.06] px-4 py-3 text-sm text-danger" role="alert">
                <i className="ri-error-warning-line mt-0.5 text-base" />
                <span>{error}</span>
              </div>
            )}

            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
              disabled={submitting}
              type="submit"
            >
              {submitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <i className="ri-arrow-right-line text-lg" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#9295a5]">
            <i className="ri-shield-check-line text-base text-success" />
            Secure access for authorized staff
          </div>
        </div>
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden bg-[#17152a] px-12 py-12 text-white lg:flex lg:items-center xl:px-20">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-28 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative mx-auto w-full max-w-xl">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/75">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Your store, running smoothly
          </div>
          <h2 className="max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Everything your store needs,
            <span className="mt-2 block bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">all in one place.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/60">
            Keep your catalog organized, serve customers faster, and stay on top of every sale.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: 'ri-box-3-line', title: 'Product catalog', detail: 'Organize items, categories, and barcodes.' },
              { icon: 'ri-receipt-line', title: 'Fast billing', detail: 'Create sales and print customer receipts.' },
              { icon: 'ri-line-chart-line', title: 'Clear business overview', detail: 'Keep customer and invoice records together.' },
            ].map((feature) => (
              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur-sm" key={feature.title}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-violet-200">
                  <i className={`${feature.icon} text-xl`} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="mt-1 text-xs text-white/50">{feature.detail}</p>
                </div>
                <i className="ri-check-line ml-auto text-lg text-emerald-300" />
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
            <i className="ri-shield-keyhole-line text-base" />
            Private and secure access for your team
          </div>
        </div>
      </aside>
    </main>
  );
};

export default Signin;
