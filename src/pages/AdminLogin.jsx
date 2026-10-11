import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin', { replace: true })
    })
  }, [navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!supabase) {
      setError('Supabase is not configured yet. Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to .env, then restart.')
      return
    }
    setBusy(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) setError(err.message)
    else navigate('/admin', { replace: true })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-clip bg-(--neutral) px-4 py-10 text-(--text-primary)">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-24 left-1/2 h-56 w-[min(42rem,120vw)] -translate-x-1/2 rounded-full bg-(--primary) opacity-10 blur-[100px]" />
      </div>
      <div className="glass relative z-10 w-full max-w-md rounded-2xl p-6 sm:p-8">
        <p className="font-mono text-[11px] tracking-[0.28em] text-(--primary)">ADMIN_ACCESS</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Dashboard login</h1>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
          Sign in with your Supabase Auth user. Create it in Supabase → Authentication → Users.
        </p>
        {!isSupabaseConfigured && (
          <div className="mt-4 rounded-xl border border-(--card-border) bg-(--primary-soft) p-3 text-xs leading-relaxed text-(--text-secondary)">
            Supabase env vars missing — the site runs on fallback data and login is disabled until you add them. See{' '}
            <code>.env.example</code> + <code>supabase/schema.sql</code>.
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">EMAIL</span>
            <input className="field" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">PASSWORD</span>
            <input className="field" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs leading-relaxed text-red-300">{error}</p>}
          <button disabled={busy} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold tracking-wider disabled:opacity-60">
            {busy ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>
        <Link to="/" className="mt-5 inline-block text-xs tracking-wider text-(--text-secondary) hover:text-(--text-primary)">← BACK TO SITE</Link>
      </div>
    </main>
  )
}
