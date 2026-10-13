import { FaDownload } from 'react-icons/fa'
import Shell from '../ui/Shell'
import { PROFILE_FIELDS } from '../constants'

export default function ProfileTab({ profileForm, setProfileForm, completeness, busy, onSave, onExportBackup }) {
  if (!profileForm) return null

  return (
    <Shell
      title="Profile / hero settings"
      subtitle="Controls the homepage headline, stats, email, resume and GitHub links."
      action={
        <span className="rounded-full border border-(--card-border) px-3 py-1.5 font-mono text-[11px] text-(--text-secondary)">
          {completeness}% COMPLETE
        </span>
      }
    >
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-(--surface-2)">
        <div
          className="h-full rounded-full bg-gradient-to-r from-(--primary) to-emerald-400 transition-all"
          style={{ width: `${completeness}%` }}
        />
      </div>
      <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2">
        {PROFILE_FIELDS.map(([k, label]) => (
          <label key={k} className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">{label.toUpperCase()}</span>
            <input
              className="field"
              value={profileForm[k] ?? ''}
              onChange={(e) => setProfileForm({ ...profileForm, [k]: e.target.value })}
            />
          </label>
        ))}
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">HERO DESCRIPTION</span>
          <textarea
            className="field min-h-24"
            value={profileForm.hero_description ?? ''}
            onChange={(e) => setProfileForm({ ...profileForm, hero_description: e.target.value })}
          />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button disabled={busy} className="btn-primary rounded-full px-6 py-3 text-xs font-semibold tracking-wider disabled:opacity-60">
            SAVE PROFILE
          </button>
          <button type="button" onClick={onExportBackup} className="btn-ghost rounded-full px-6 py-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5"><FaDownload /> EXPORT BACKUP</span>
          </button>
        </div>
      </form>
    </Shell>
  )
}
