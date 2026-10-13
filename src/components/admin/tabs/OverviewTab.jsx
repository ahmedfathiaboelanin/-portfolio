import { FaBolt, FaCheck, FaCheckDouble, FaCode, FaDownload, FaEye, FaFolderOpen, FaInbox, FaPlus } from 'react-icons/fa'
import Shell from '../ui/Shell'
import { timeAgo } from '../utils'

function StatCards({ stats, publishedPct, skillDist, totalMessages, onSelectTab }) {
  const cards = [
    { k: 'PROJECTS', v: stats.projects, hint: `${stats.published} live · ${stats.featured} starred`, icon: FaFolderOpen, go: 'projects' },
    { k: 'PUBLISHED', v: `${publishedPct}%`, hint: `${stats.published}/${stats.projects} visible`, icon: FaEye, go: 'projects' },
    { k: 'SKILLS', v: stats.skills, hint: skillDist.map((d) => `${d.count} ${d.cat.slice(0, 4)}`).join(' · ') || 'none yet', icon: FaCode, go: 'skills' },
    { k: 'UNREAD', v: stats.unread, hint: `${totalMessages} total in inbox`, icon: FaInbox, go: 'messages' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((c) => (
        <button key={c.k} onClick={() => onSelectTab(c.go)} className="card-hover glass rounded-2xl p-4 text-left">
          <p className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-(--text-secondary) sm:text-[11px]">
            {c.k} <c.icon className="text-sm text-(--primary)" />
          </p>
          <p className="mt-1 text-2xl font-semibold sm:text-3xl">{c.v}</p>
          <p className="mt-1 truncate text-[11px] text-(--text-secondary)">{c.hint}</p>
        </button>
      ))}
    </div>
  )
}

function InboxChart({ weekActivity, maxWeek, onOpenInbox, onMarkAllRead }) {
  return (
    <Shell title="Inbox activity" subtitle="Messages per day — last 7 days.">
      <div className="flex h-32 items-end gap-1.5 sm:h-36" role="img" aria-label="Messages per day chart">
        {weekActivity.map((d) => (
          <div key={d.full} title={`${d.full}: ${d.count}`} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end rounded-lg bg-(--surface-2)/60 p-1">
              <div
                className="w-full rounded-md bg-gradient-to-t from-(--primary)/40 to-(--primary)"
                style={{ height: `${Math.max(d.count ? 12 : 4, (d.count / maxWeek) * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-(--text-secondary)">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onOpenInbox} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold">
          OPEN INBOX
        </button>
        <button onClick={onMarkAllRead} className="btn-ghost rounded-full px-4 py-2 text-xs">
          <span className="inline-flex items-center gap-1.5"><FaCheckDouble /> MARK ALL READ</span>
        </button>
      </div>
    </Shell>
  )
}

function HealthCard({ stats, publishedPct, completeness, skillDist, onSelectTab }) {
  return (
    <Shell title="Portfolio health" subtitle="Visibility + profile completeness.">
      <div className="flex items-center gap-4">
        <div
          className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--primary) ${publishedPct * 3.6}deg, var(--surface-2) 0deg)` }}
          role="img"
          aria-label={`${publishedPct}% published`}
        >
          <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-(--surface) text-sm font-bold">
            {publishedPct}%
          </span>
        </div>
        <div className="min-w-0 text-xs leading-relaxed text-(--text-secondary)">
          <p>
            <span className="font-semibold text-(--text-primary)">{stats.published}</span> published ·{' '}
            <span className="font-semibold text-(--text-primary)">{stats.drafts}</span> drafts ·{' '}
            <span className="font-semibold text-(--text-primary)">{stats.featured}</span> featured
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-widest">PROFILE {completeness}%</p>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-(--surface-2)">
            <div className="h-full rounded-full bg-gradient-to-r from-(--primary) to-emerald-400" style={{ width: `${completeness}%` }} />
          </div>
          <button onClick={() => onSelectTab('profile')} className="mt-2 underline underline-offset-2 hover:text-(--text-primary)">
            Complete profile →
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {skillDist.map((d) => (
          <div key={d.cat} className="rounded-xl border border-(--card-border) bg-(--surface)/50 p-2.5">
            <p className="font-mono text-[10px] tracking-widest text-(--primary)">{d.cat.toUpperCase()}</p>
            <p className="text-lg font-semibold">{d.count}</p>
            <p className="font-mono text-[10px] text-(--text-secondary)">avg {d.avg}%</p>
          </div>
        ))}
      </div>
    </Shell>
  )
}

export default function OverviewTab({
  stats,
  publishedPct,
  skillDist,
  weekActivity,
  maxWeek,
  completeness,
  messages,
  activity,
  onSelectTab,
  onNewProject,
  onNewSkill,
  onExportBackup,
  onOpenPalette,
  onMarkAllRead,
}) {
  return (
    <div className="flex flex-col gap-4">
      <StatCards
        stats={stats}
        publishedPct={publishedPct}
        skillDist={skillDist}
        totalMessages={messages.length}
        onSelectTab={onSelectTab}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <InboxChart
          weekActivity={weekActivity}
          maxWeek={maxWeek}
          onOpenInbox={() => onSelectTab('messages')}
          onMarkAllRead={onMarkAllRead}
        />
        <HealthCard
          stats={stats}
          publishedPct={publishedPct}
          completeness={completeness}
          skillDist={skillDist}
          onSelectTab={onSelectTab}
        />
        <div className="flex flex-col gap-4">
          <Shell title="Quick actions" subtitle="Most-used workflows.">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={onNewProject} className="btn-primary rounded-xl px-3 py-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5"><FaPlus /> PROJECT</span>
              </button>
              <button onClick={onNewSkill} className="btn-ghost rounded-xl px-3 py-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5"><FaPlus /> SKILL</span>
              </button>
              <button onClick={onExportBackup} className="btn-ghost rounded-xl px-3 py-3 text-xs">
                <span className="inline-flex items-center gap-1.5"><FaDownload /> BACKUP</span>
              </button>
              <button onClick={onOpenPalette} className="btn-ghost rounded-xl px-3 py-3 text-xs">
                <span className="inline-flex items-center gap-1.5"><FaBolt /> COMMAND</span>
              </button>
            </div>
          </Shell>
          <Shell title="Recent activity" subtitle="Stored on this device.">
            {!activity.length && (
              <p className="text-xs text-(--text-secondary)">
                No actions yet — saves, publishes and exports will appear here.
              </p>
            )}
            <ul className="flex max-h-44 flex-col gap-2 overflow-y-auto">
              {activity.map((a, i) => (
                <li
                  key={`${a.at}-${i}`}
                  className="flex items-start gap-2 rounded-xl border border-(--card-border) bg-(--surface)/40 px-3 py-2 text-xs"
                >
                  <FaCheck className="mt-0.5 shrink-0 text-emerald-300" />
                  <span className="min-w-0 flex-1 truncate">{a.text}</span>
                  <span className="shrink-0 font-mono text-[10px] text-(--text-secondary)">{timeAgo(a.at)}</span>
                </li>
              ))}
            </ul>
          </Shell>
        </div>
      </div>

      <Shell
        title="Latest messages"
        subtitle="Newest 3 — reply via your mail app."
        action={
          <button onClick={() => onSelectTab('messages')} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold">
            VIEW ALL
          </button>
        }
      >
        <div className="grid gap-2 md:grid-cols-3">
          {messages.slice(0, 3).map((m) => (
            <div key={m.id} className="rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3.5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                {!m.is_read && <span className="h-2 w-2 rounded-full bg-(--primary)" />}{m.name}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">{m.message}</p>
              <p className="mt-2 font-mono text-[10px] text-(--text-secondary)">{timeAgo(m.created_at)}</p>
            </div>
          ))}
          {!messages.length && <p className="text-sm text-(--text-secondary)">No messages yet.</p>}
        </div>
      </Shell>
    </div>
  )
}
