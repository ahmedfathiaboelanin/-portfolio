import { FaChartBar, FaCopy, FaDownload } from 'react-icons/fa'
import Shell from '../ui/Shell'

const STEPS = [
  'Create project at supabase.com → copy Project URL + anon public key (Settings → API).',
  'Create .env from .env.example and restart npm run dev.',
  'SQL Editor → paste + run supabase/schema.sql (creates tables, RLS, seed data).',
  'Authentication → Users → Add user (your admin email + password). Sign in at /admin/login.',
  'Storage → New bucket portfolio-images → Public ON (enables dashboard image uploads).',
  'Deploy: set the same two env vars on Vercel/Netlify and redeploy.',
]

export default function SetupTab({ counts, onCopySchemaPath, onExportBackup, onDeleteRead }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Shell title="Setup guide" subtitle="One-time checklist to go live with Supabase.">
        <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-(--text-secondary)">
          {STEPS.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onCopySchemaPath} className="btn-ghost rounded-full px-4 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5"><FaCopy /> COPY SCHEMA PATH</span>
          </button>
          <button onClick={onExportBackup} className="btn-ghost rounded-full px-4 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5"><FaDownload /> EXPORT BACKUP</span>
          </button>
        </div>
      </Shell>
      <div className="flex flex-col gap-4">
        <Shell title="Data overview" subtitle="Live row counts + storage tips.">
          <div className="grid grid-cols-2 gap-2 text-center">
            {counts.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-(--card-border) bg-(--surface)/50 p-3">
                <p className="font-mono text-[10px] tracking-widest text-(--text-secondary)">{k.toUpperCase()}</p>
                <p className="text-2xl font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-(--text-secondary)">
            <FaChartBar className="mt-0.5 shrink-0 text-(--primary)" />
            Keep project images under ~500&nbsp;KB (WebP/JPG) so the homepage stays fast on mobile networks.
          </p>
        </Shell>
        <Shell title="Danger zone" subtitle="Irreversible actions — export a backup first.">
          <button
            onClick={onDeleteRead}
            className="rounded-full border border-red-500/40 px-4 py-2.5 text-xs text-red-300 hover:bg-red-500/10"
          >
            DELETE ALL READ MESSAGES
          </button>
        </Shell>
      </div>
    </div>
  )
}
