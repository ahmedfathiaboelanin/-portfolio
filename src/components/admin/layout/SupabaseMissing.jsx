import { Link } from 'react-router-dom'

export default function SupabaseMissing() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-(--text-primary)">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Supabase not connected</h1>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
          1. Create a project at supabase.com → 2. Copy Project URL + anon key into <code>.env</code> (see{' '}
          <code>.env.example</code>) → 3. Run <code>supabase/schema.sql</code> in the SQL Editor → 4. Create your
          admin user in Authentication → Users → 5. Restart <code>npm run dev</code> and open{' '}
          <code>/admin/login</code>.
        </p>
        <Link to="/" className="btn-ghost mt-5 inline-block rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider">
          BACK TO SITE
        </Link>
      </div>
    </main>
  )
}
