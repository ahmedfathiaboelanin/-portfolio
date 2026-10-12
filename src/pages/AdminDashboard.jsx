import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import {
  FaThLarge, FaFolderOpen, FaCode, FaUser, FaShareAlt, FaInbox, FaCog,
  FaSearch, FaBars, FaTimes, FaPlus, FaSun, FaMoon, FaDownload,
  FaTrash, FaEdit, FaEye, FaEyeSlash, FaStar, FaRegStar, FaCopy,
  FaSignOutAlt, FaSync, FaExternalLinkAlt, FaBolt, FaEnvelope,
  FaCheck, FaCheckDouble, FaChevronLeft, FaChevronRight, FaGlobe,
  FaImage, FaChartBar, FaClock, FaShieldAlt,
} from 'react-icons/fa'

/* ───────────────────────── helpers ───────────────────────── */

const cx = (...c) => c.filter(Boolean).join(' ')

function timeAgo(iso) {
  if (!iso) return '—'
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function downloadFile(filename, content, mime = 'application/json') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function toCSV(rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return rows.map((r) => r.map(esc).join(',')).join('\n')
}

const TABS = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: FaThLarge },
  { id: 'projects', label: 'Projects', short: 'Work', icon: FaFolderOpen },
  { id: 'skills', label: 'Skills', short: 'Skills', icon: FaCode },
  { id: 'profile', label: 'Profile', short: 'You', icon: FaUser },
  { id: 'socials', label: 'Socials', short: 'Links', icon: FaShareAlt },
  { id: 'messages', label: 'Inbox', short: 'Inbox', icon: FaInbox },
  { id: 'setup', label: 'Setup', short: 'Setup', icon: FaCog },
]

const PROFILE_FIELDS = [
  ['full_name', 'Full name'], ['role', 'Role'], ['tagline', 'Tag pill'],
  ['hero_title_line1', 'Hero line 1'], ['hero_title_line2', 'Hero line 2'],
  ['email', 'Email'], ['resume_url', 'Resume URL'], ['github_url', 'GitHub URL'],
  ['linkedin_url', 'LinkedIn URL'], ['years_exp', 'Years exp'],
  ['projects_count', 'Projects count'], ['clients_count', 'Clients count'],
]

const emptyProject = {
  title: '', description: '', image_url: '', live_url: '', code_url: '',
  tech: '', featured: false, is_published: true, sort_order: 0,
}
const emptySkill = { title: '', percentage: 80, category: 'frontend', sort_order: 0, is_visible: true }
const emptySocial = { label: '', href: '', icon: 'github', sort_order: 0, is_visible: true }

/* ───────────────────────── small UI atoms ───────────────────────── */

function Shell({ children, title, subtitle, action }) {
  return (
    <section className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-(--text-secondary) sm:text-sm">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function EmptyState({ icon: Icon, title, hint, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-(--card-border) px-6 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-(--primary-soft) text-xl text-(--primary)">
        <Icon />
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-xs leading-relaxed text-(--text-secondary) sm:text-sm">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

function Skeleton({ className }) {
  return <div className={cx('animate-pulse rounded-xl bg-(--surface-2)', className)} />
}

function Toasts({ toasts, dismiss }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-3 bottom-20 z-[90] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96 lg:bottom-6">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/95 p-3.5 text-sm shadow-2xl backdrop-blur-xl">
          <span className={cx(
            'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs',
            t.type === 'error' ? 'bg-red-500/15 text-red-300' : t.type === 'success' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-(--primary-soft) text-(--primary)',
          )}>
            {t.type === 'error' ? <FaTimes /> : t.type === 'success' ? <FaCheck /> : <FaBolt />}
          </span>
          <p className="min-w-0 flex-1 text-xs leading-relaxed">{t.msg}</p>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="rounded-full p-1.5 text-(--text-secondary) hover:text-(--text-primary)"><FaTimes /></button>
        </div>
      ))}
    </div>
  )
}

function ConfirmDialog({ confirm, onCancel, onConfirm }) {
  if (!confirm) return null
  return (
    <div className="fixed inset-0 z-[95] grid place-items-center p-4" role="alertdialog" aria-modal="true">
      <button aria-label="Close dialog" onClick={onCancel} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="modal-in relative w-full max-w-sm rounded-2xl border border-(--card-border) bg-(--surface) p-5 sm:p-6">
        <p className="font-semibold">{confirm.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{confirm.message}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="btn-ghost flex-1 rounded-full px-4 py-2.5 text-xs font-semibold">CANCEL</button>
          <button onClick={onConfirm} className="flex-1 rounded-full border border-red-500/50 bg-red-500/15 px-4 py-2.5 text-xs font-semibold text-red-200 hover:bg-red-500/25">CONFIRM</button>
        </div>
      </div>
    </div>
  )
}

/** Responsive modal sheet: bottom-sheet on phones, centered dialog on sm+ */
function ModalSheet({ title, subtitle, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={cx(
        'modal-in relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-(--card-border) bg-(--surface) sm:rounded-3xl',
        wide ? 'sm:max-w-2xl' : 'sm:max-w-lg',
      )}>
        <div className="flex items-start justify-between gap-3 border-b border-(--card-border) p-4 sm:p-5">
          <div className="min-w-0">
            <h3 className="truncate font-semibold sm:text-lg">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-(--text-secondary)">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close panel" className="btn-ghost grid h-10 w-10 shrink-0 place-items-center rounded-full"><FaTimes /></button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}

function CommandPalette({ open, query, setQuery, results, onClose, onPick }) {
  const inputRef = useRef(null)
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 40) }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[92] flex items-start justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Quick actions">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="modal-in relative mt-[6dvh] flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-(--card-border) bg-(--surface) shadow-2xl">
        <div className="flex items-center gap-2 border-b border-(--card-border) p-3">
          <FaSearch className="ml-2 shrink-0 text-(--text-secondary)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, messages, actions…  (Esc to close)"
            className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-(--text-secondary)/70"
          />
          <kbd className="hidden shrink-0 rounded-md border border-(--card-border) px-2 py-1 font-mono text-[10px] text-(--text-secondary) sm:block">CTRL K</kbd>
        </div>
        <div className="overflow-y-auto p-2">
          {!results.length && <p className="px-3 py-6 text-center text-sm text-(--text-secondary)">No matches. Try “inbox”, “new project”, or a title.</p>}
          {results.map((r) => (
            <button
              key={r.key}
              onClick={() => onPick(r)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-(--primary-soft)"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--surface-2) text-(--primary)"><r.icon /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{r.label}</span>
                <span className="block truncate font-mono text-[11px] text-(--text-secondary)">{r.hint}</span>
              </span>
              <span className="shrink-0 rounded-full border border-(--card-border) px-2 py-0.5 font-mono text-[10px] text-(--text-secondary)">{r.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── main ───────────────────────── */

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState(() => localStorage.getItem('admin-tab') || 'overview')

  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [socials, setSocials] = useState([])
  const [messages, setMessages] = useState([])
  const [profile, setProfile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [lastSynced, setLastSynced] = useState(null)

  const [toasts, setToasts] = useState([])
  const [confirm, setConfirm] = useState(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('admin-sb') === 'collapsed')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLight, setIsLight] = useState(() => document.body.classList.contains('light-mode'))

  const [activity, setActivity] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin-activity') || '[]') } catch { return [] }
  })

  // per-tab search / filter / sort
  const [projectQuery, setProjectQuery] = useState('')
  const [projectStatus, setProjectStatus] = useState('all')
  const [projectSort, setProjectSort] = useState('order')
  const [projectView, setProjectView] = useState('grid')
  const [skillQuery, setSkillQuery] = useState('')
  const [skillCat, setSkillCat] = useState('all')
  const [socialQuery, setSocialQuery] = useState('')
  const [msgQuery, setMsgQuery] = useState('')
  const [msgFilter, setMsgFilter] = useState('all')
  const [msgVisible, setMsgVisible] = useState(12)

  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const [editingSkill, setEditingSkill] = useState(null)
  const [skillForm, setSkillForm] = useState(emptySkill)

  const [socialForm, setSocialForm] = useState(emptySocial)
  const [editingSocial, setEditingSocial] = useState(null)

  const [profileForm, setProfileForm] = useState(null)

  const pushToast = useCallback((msg, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((t) => [...t.slice(-3), { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const logActivity = useCallback((text) => {
    setActivity((a) => {
      const next = [{ text, at: new Date().toISOString() }, ...a].slice(0, 12)
      try { localStorage.setItem('admin-activity', JSON.stringify(next)) } catch { /* noop */ }
      return next
    })
  }, [])

  /* ── auth guard ── */
  useEffect(() => {
    if (!supabase) { setChecking(false); setInitialLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login', { replace: true })
      else setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate('/admin/login', { replace: true })
      else setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  const loadAll = useCallback(async (silent) => {
    if (!supabase) return
    if (!silent) setBusy(true)
    try {
      const [p, s, so, m, pr] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('sort_order'),
        supabase.from('socials').select('*').order('sort_order'),
        supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('profiles').select('*').order('created_at').limit(1).maybeSingle(),
      ])
      if (p.data) setProjects(p.data)
      if (s.data) setSkills(s.data)
      if (so.data) setSocials(so.data)
      if (m.data) setMessages(m.data)
      if (pr.data) { setProfile(pr.data); setProfileForm(pr.data) }
      setLastSynced(new Date())
      if (p.error || s.error || m.error) pushToast('Some tables failed to load — did you run supabase/schema.sql?', 'error')
    } catch (e) {
      pushToast(String(e.message ?? e), 'error')
    } finally {
      setBusy(false)
      setInitialLoading(false)
    }
  }, [pushToast])

  useEffect(() => { if (session) loadAll() }, [session, loadAll])
  useEffect(() => { localStorage.setItem('admin-tab', tab); setDrawerOpen(false) }, [tab])
  useEffect(() => { localStorage.setItem('admin-sb', sidebarCollapsed ? 'collapsed' : 'open') }, [sidebarCollapsed])

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLight)
  }, [isLight])

  /* keyboard shortcuts: Ctrl/Cmd+K palette, Esc closes overlays */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((v) => !v) }
      if (e.key === 'Escape') { setPaletteOpen(false); setDrawerOpen(false); setConfirm(null) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* lock scroll when an overlay is open */
  useEffect(() => {
    const locked = drawerOpen || paletteOpen || confirm || editingProject || editingSkill || editingSocial
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen, paletteOpen, confirm, editingProject, editingSkill, editingSocial])

  const stats = useMemo(() => ({
    projects: projects.length,
    published: projects.filter((p) => p.is_published).length,
    drafts: projects.filter((p) => !p.is_published).length,
    featured: projects.filter((p) => p.featured).length,
    skills: skills.length,
    unread: messages.filter((m) => !m.is_read).length,
  }), [projects, skills, messages])

  const completeness = useMemo(() => {
    if (!profileForm) return 0
    const keys = [...PROFILE_FIELDS.map(([k]) => k), 'hero_description']
    const filled = keys.filter((k) => String(profileForm[k] ?? '').trim() !== '').length
    return Math.round((filled / keys.length) * 100)
  }, [profileForm])

  const weekActivity = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      return d
    })
    return days.map((d) => {
      const next = new Date(d); next.setDate(d.getDate() + 1)
      const count = messages.filter((m) => {
        const t = new Date(m.created_at)
        return t >= d && t < next
      }).length
      return { label: d.toLocaleDateString(undefined, { weekday: 'narrow' }), count, full: d.toLocaleDateString() }
    })
  }, [messages])
  const maxWeek = Math.max(1, ...weekActivity.map((d) => d.count))

  const skillDist = useMemo(() => {
    const cats = ['frontend', 'backend', 'tool']
    return cats.map((c) => {
      const rows = skills.filter((s) => s.category === c)
      const avg = rows.length ? Math.round(rows.reduce((a, s) => a + Number(s.percentage || 0), 0) / rows.length) : 0
      return { cat: c, count: rows.length, avg }
    })
  }, [skills])

  /* ── filtered lists ── */
  const filteredProjects = useMemo(() => {
    const q = projectQuery.trim().toLowerCase()
    let rows = projects.filter((p) => {
      if (projectStatus === 'published' && !p.is_published) return false
      if (projectStatus === 'draft' && p.is_published) return false
      if (projectStatus === 'featured' && !p.featured) return false
      if (!q) return true
      return [p.title, p.description, (p.tech ?? []).join(' ')].join(' ').toLowerCase().includes(q)
    })
    if (projectSort === 'title') rows = [...rows].sort((a, b) => a.title.localeCompare(b.title))
    else if (projectSort === 'newest') rows = [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else rows = [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return rows
  }, [projects, projectQuery, projectStatus, projectSort])

  const filteredSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase()
    return skills.filter((s) => {
      if (skillCat !== 'all' && s.category !== skillCat) return false
      return !q || s.title.toLowerCase().includes(q)
    })
  }, [skills, skillQuery, skillCat])

  const filteredSocials = useMemo(() => {
    const q = socialQuery.trim().toLowerCase()
    return socials.filter((s) => !q || `${s.label} ${s.href} ${s.icon}`.toLowerCase().includes(q))
  }, [socials, socialQuery])

  const filteredMessages = useMemo(() => {
    const q = msgQuery.trim().toLowerCase()
    return messages.filter((m) => {
      if (msgFilter === 'unread' && m.is_read) return false
      if (msgFilter === 'read' && !m.is_read) return false
      return !q || `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(q)
    })
  }, [messages, msgQuery, msgFilter])

  /* command-palette results */
  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase()
    const out = []
    const match = (s) => !q || s.toLowerCase().includes(q)
    TABS.forEach((t) => {
      if (match(`go to ${t.label} open ${t.label}`)) out.push({ key: `tab-${t.id}`, type: 'Go to', label: `Open ${t.label}`, hint: `Switch to ${t.label} tab`, icon: t.icon, run: () => setTab(t.id) })
    })
    if (match('new project add project')) out.push({ key: 'new-project', type: 'Action', label: 'New project', hint: 'Create a portfolio project', icon: FaPlus, run: () => startEditProject(null) })
    if (match('new skill add skill')) out.push({ key: 'new-skill', type: 'Action', label: 'New skill', hint: 'Add a skill or tool', icon: FaPlus, run: () => startEditSkill(null) })
    if (match('mark all read inbox')) out.push({ key: 'read-all', type: 'Action', label: 'Mark all messages read', hint: `${stats.unread} unread`, icon: FaCheckDouble, run: () => markAllRead() })
    if (match('refresh reload sync')) out.push({ key: 'refresh', type: 'Action', label: 'Refresh data', hint: 'Reload from Supabase', icon: FaSync, run: () => loadAll() })
    projects.filter((p) => match(p.title)).slice(0, 4).forEach((p) =>
      out.push({ key: `p-${p.id}`, type: 'Project', label: p.title, hint: `Edit project · ${p.is_published ? 'published' : 'draft'}`, icon: FaFolderOpen, run: () => { setTab('projects'); startEditProject(p) } }))
    skills.filter((s) => match(s.title)).slice(0, 3).forEach((s) =>
      out.push({ key: `s-${s.id}`, type: 'Skill', label: s.title, hint: `Edit skill · ${s.category} ${s.percentage}%`, icon: FaCode, run: () => { setTab('skills'); startEditSkill(s) } }))
    messages.filter((m) => match(`${m.name} ${m.message}`)).slice(0, 3).forEach((m) =>
      out.push({ key: `m-${m.id}`, type: 'Message', label: `${m.name} — ${m.message.slice(0, 42)}`, hint: m.email, icon: FaEnvelope, run: () => setTab('messages') }))
    return out.slice(0, 12)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paletteQuery, projects, skills, messages, stats.unread])

  const signOut = async () => { await supabase?.auth.signOut(); navigate('/admin/login') }

  /* ── projects CRUD ── */
  const startEditProject = (row) => {
    setEditingProject(row?.id ?? 'new')
    setProjectForm(row ? { ...emptyProject, ...row, tech: (row.tech ?? []).join(', ') } : emptyProject)
  }
  const saveProject = async (e) => {
    e.preventDefault()
    const payload = {
      title: projectForm.title.trim(),
      description: projectForm.description,
      image_url: projectForm.image_url,
      live_url: projectForm.live_url || null,
      code_url: projectForm.code_url || null,
      tech: String(projectForm.tech).split(',').map((t) => t.trim()).filter(Boolean),
      featured: !!projectForm.featured,
      is_published: !!projectForm.is_published,
      sort_order: Number(projectForm.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }
    if (!payload.title) { pushToast('Project title is required.', 'error'); return }
    setBusy(true)
    const res = editingProject === 'new'
      ? await supabase.from('projects').insert([payload]).select()
      : await supabase.from('projects').update(payload).eq('id', editingProject).select()
    setBusy(false)
    if (res.error) pushToast(res.error.message, 'error')
    else { setEditingProject(null); setProjectForm(emptyProject); logActivity(`${editingProject === 'new' ? 'Created' : 'Updated'} project “${payload.title}”`); pushToast('Project saved.', 'success'); loadAll(true) }
  }
  const askDeleteProject = (id, title) => setConfirm({ title: 'Delete project?', message: `“${title}” will be permanently removed from the portfolio.`, onConfirm: async () => { setConfirm(null); const { error } = await supabase.from('projects').delete().eq('id', id); if (error) pushToast(error.message, 'error'); else { logActivity(`Deleted project “${title}”`); pushToast('Project deleted.', 'success'); loadAll(true) } } })
  const togglePublish = async (p) => {
    const { error } = await supabase.from('projects').update({ is_published: !p.is_published }).eq('id', p.id)
    if (error) pushToast(error.message, 'error')
    else { logActivity(`${p.is_published ? 'Unpublished' : 'Published'} “${p.title}”`); loadAll(true) }
  }
  const duplicateProject = async (p) => {
    const { id, created_at, ...rest } = p // eslint-disable-line no-unused-vars
    const { error } = await supabase.from('projects').insert([{ ...rest, title: `${p.title} (copy)`, is_published: false }]).select()
    if (error) pushToast(error.message, 'error')
    else { logActivity(`Duplicated “${p.title}”`); pushToast('Project duplicated as draft.', 'success'); loadAll(true) }
  }
  const uploadImageFile = async (file) => {
    if (!file || !supabase) return
    setUploading(true)
    try {
      const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error } = await supabase.storage.from('portfolio-images').upload(name, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(name)
      setProjectForm((f) => ({ ...f, image_url: data.publicUrl }))
      pushToast('Image uploaded.', 'success')
    } catch (err) {
      pushToast(`Upload failed (create a public bucket named "portfolio-images" first): ${err.message}`, 'error')
    } finally {
      setUploading(false)
      setDragOver(false)
    }
  }

  /* ── skills CRUD ── */
  const startEditSkill = (row) => {
    setEditingSkill(row?.id ?? 'new')
    setSkillForm(row ? { ...emptySkill, ...row } : emptySkill)
  }
  const saveSkill = async (e) => {
    e.preventDefault()
    const payload = {
      title: skillForm.title.trim(),
      percentage: Math.max(0, Math.min(100, Number(skillForm.percentage) || 0)),
      category: skillForm.category,
      sort_order: Number(skillForm.sort_order) || 0,
      is_visible: !!skillForm.is_visible,
    }
    if (!payload.title) { pushToast('Skill title is required.', 'error'); return }
    setBusy(true)
    const res = editingSkill === 'new'
      ? await supabase.from('skills').insert([payload]).select()
      : await supabase.from('skills').update(payload).eq('id', editingSkill).select()
    setBusy(false)
    if (res.error) pushToast(res.error.message, 'error')
    else { setEditingSkill(null); setSkillForm(emptySkill); logActivity(`Saved skill “${payload.title}”`); pushToast('Skill saved.', 'success'); loadAll(true) }
  }
  const askDeleteSkill = (id, title) => setConfirm({ title: 'Delete skill?', message: `“${title}” will be removed.`, onConfirm: async () => { setConfirm(null); const { error } = await supabase.from('skills').delete().eq('id', id); if (error) pushToast(error.message, 'error'); else loadAll(true) } })

  /* ── socials CRUD ── */
  const saveSocial = async (e) => {
    e.preventDefault()
    const payload = { ...socialForm, sort_order: Number(socialForm.sort_order) || 0 }
    if (!payload.label || !payload.href) { pushToast('Social label + URL required.', 'error'); return }
    const res = editingSocial === 'new'
      ? await supabase.from('socials').insert([payload]).select()
      : await supabase.from('socials').update(payload).eq('id', editingSocial).select()
    if (res.error) pushToast(res.error.message, 'error')
    else { setEditingSocial(null); setSocialForm(emptySocial); pushToast('Social link saved.', 'success'); loadAll(true) }
  }
  const askDeleteSocial = (id, label) => setConfirm({ title: 'Delete social link?', message: `“${label}” will be removed from the site footer.`, onConfirm: async () => { setConfirm(null); const { error } = await supabase.from('socials').delete().eq('id', id); if (error) pushToast(error.message, 'error'); else loadAll(true) } })

  /* ── profile ── */
  const saveProfile = async (e) => {
    e.preventDefault()
    setBusy(true)
    const payload = { ...profileForm }
    delete payload.id; delete payload.created_at
    let res
    if (profile?.id) res = await supabase.from('profiles').update(payload).eq('id', profile.id).select()
    else res = await supabase.from('profiles').insert([payload]).select()
    setBusy(false)
    if (res.error) pushToast(res.error.message, 'error')
    else { logActivity('Updated profile / hero'); pushToast('Profile saved — refresh the homepage to see it.', 'success'); loadAll(true) }
  }

  /* ── messages ── */
  const setRead = async (id, is_read) => {
    const { error } = await supabase.from('messages').update({ is_read }).eq('id', id)
    if (!error) setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, is_read } : m)))
  }
  const markAllRead = async () => {
    const ids = messages.filter((m) => !m.is_read).map((m) => m.id)
    if (!ids.length) { pushToast('Inbox is already clear.'); return }
    const { error } = await supabase.from('messages').update({ is_read: true }).in('id', ids)
    if (error) pushToast(error.message, 'error')
    else { setMessages((ms) => ms.map((m) => ({ ...m, is_read: true }))); pushToast(`${ids.length} message(s) marked read.`, 'success') }
  }
  const deleteRead = () => {
    const ids = messages.filter((m) => m.is_read).map((m) => m.id)
    if (!ids.length) { pushToast('No read messages to delete.'); return }
    setConfirm({
      title: `Delete ${ids.length} read message(s)?`, message: 'This cannot be undone.',
      onConfirm: async () => {
        setConfirm(null)
        const { error } = await supabase.from('messages').delete().in('id', ids)
        if (error) pushToast(error.message, 'error')
        else { setMessages((ms) => ms.filter((m) => !m.is_read)); pushToast('Read messages deleted.', 'success') }
      },
    })
  }
  const askDeleteMessage = (id) => setConfirm({ title: 'Delete message?', message: 'The sender copy stays in email; this removes the inbox row.', onConfirm: async () => { setConfirm(null); const { error } = await supabase.from('messages').delete().eq('id', id); if (!error) setMessages((ms) => ms.filter((m) => m.id !== id)) } })

  /* ── backup / export ── */
  const exportBackup = () => {
    downloadFile(`portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ exported_at: new Date().toISOString(), projects, skills, socials, profile }, null, 2))
    pushToast('Backup JSON downloaded.', 'success')
    logActivity('Exported JSON backup')
  }
  const exportMessagesCSV = () => {
    const csv = toCSV([['name', 'email', 'message', 'is_read', 'created_at'], ...filteredMessages.map((m) => [m.name, m.email, m.message, m.is_read, m.created_at])])
    downloadFile(`messages-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv')
    pushToast('Messages CSV downloaded.', 'success')
  }
  const copyText = async (text, label) => {
    try { await navigator.clipboard.writeText(text); pushToast(`${label} copied.`, 'success') }
    catch { pushToast('Copy failed — select the text manually.', 'error') }
  }

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0]
  const publishedPct = stats.projects ? Math.round((stats.published / stats.projects) * 100) : 0

  if (checking) return <main className="grid min-h-screen place-items-center bg-(--neutral) text-(--text-secondary)">Checking session…</main>
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-(--text-primary)">
        <div className="glass rounded-2xl p-6">
          <h1 className="text-xl font-semibold">Supabase not connected</h1>
          <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
            1. Create a project at supabase.com → 2. Copy Project URL + anon key into <code>.env</code> (see <code>.env.example</code>) → 3. Run <code>supabase/schema.sql</code> in the SQL Editor → 4. Create your admin user in Authentication → Users → 5. Restart <code>npm run dev</code> and open <code>/admin/login</code>.
          </p>
          <Link to="/" className="btn-ghost mt-5 inline-block rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider">BACK TO SITE</Link>
        </div>
      </main>
    )
  }

  const NavItems = ({ onNavigate, compact }) => (
    <div className="flex flex-col gap-1">
      {TABS.map((t) => {
        const active = tab === t.id
        const badge = t.id === 'messages' && stats.unread > 0 ? stats.unread : t.id === 'projects' ? stats.projects : null
        return (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); onNavigate?.() }}
            title={compact ? t.label : undefined}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
              active ? 'bg-(--primary-soft) text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border-primary)]' : 'text-(--text-secondary) hover:bg-(--surface-2) hover:text-(--text-primary)',
              compact && 'justify-center px-0',
            )}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-(--surface-2) text-base group-[aria-current]:text-(--primary)"><t.icon /></span>
            {!compact && (
              <>
                <span className="min-w-0 flex-1 truncate font-medium">{t.label}</span>
                {badge !== null && (
                  <span className={cx('shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]', t.id === 'messages' ? 'bg-red-500/15 text-red-300' : 'bg-(--surface-2) text-(--text-secondary)')}>
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </>
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-(--neutral) text-(--text-primary)">
      {/* ═══ Desktop sidebar ═══ */}
      <aside className={cx(
        'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-(--card-border) bg-(--surface)/80 backdrop-blur-xl lg:flex',
        sidebarCollapsed ? 'w-[84px]' : 'w-[264px]',
      )}>
        <div className={cx('flex items-center gap-3 px-4 pt-5 pb-4', sidebarCollapsed && 'justify-center px-2')}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--btn-primary-bg) text-lg font-bold text-(--btn-primary-text)">A</span>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate font-semibold leading-none">Portfolio CMS</p>
              <p className="mt-1 truncate font-mono text-[11px] text-(--text-secondary)">{session?.user?.email}</p>
            </div>
          )}
        </div>

        {/* search trigger */}
        <div className={cx('px-4 pb-3', sidebarCollapsed && 'px-2')}>
          <button
            onClick={() => { setPaletteQuery(''); setPaletteOpen(true) }}
            className={cx('flex w-full items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface-2)/60 px-3 py-2.5 text-xs text-(--text-secondary) hover:border-(--border-primary)', sidebarCollapsed && 'justify-center px-0')}
          >
            <FaSearch className="shrink-0" />
            {!sidebarCollapsed && <><span className="flex-1 text-left">Quick search…</span><kbd className="rounded border border-(--card-border) px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd></>}
          </button>
        </div>

        <nav aria-label="Dashboard sections" className={cx('flex-1 overflow-y-auto px-3 pb-3', sidebarCollapsed && 'px-2')}>
          <NavItems compact={sidebarCollapsed} />
        </nav>

        <div className={cx('border-t border-(--card-border) p-3', sidebarCollapsed && 'flex flex-col items-center gap-2')}>
          {!sidebarCollapsed && (
            <div className="mb-3 rounded-xl border border-(--card-border) bg-(--surface-2)/50 p-3">
              <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-(--text-secondary)"><FaClock /> LAST SYNC</p>
              <p className="mt-1 text-xs">{lastSynced ? timeAgo(lastSynced.toISOString()) : '—'}</p>
              <button onClick={exportBackup} className="btn-ghost mt-2 flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold"><FaDownload /> BACKUP JSON</button>
            </div>
          )}
          <div className={cx('flex gap-2', sidebarCollapsed ? 'flex-col' : 'flex-row')}>
            <button onClick={() => setIsLight((v) => !v)} aria-label="Toggle theme" title="Toggle theme" className="btn-ghost grid h-10 w-10 place-items-center rounded-full">
              {isLight ? <FaSun /> : <FaMoon />}
            </button>
            <Link to="/" title="View site" className="btn-ghost grid h-10 w-10 place-items-center rounded-full"><FaExternalLinkAlt /></Link>
            <button onClick={signOut} title="Sign out" aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10"><FaSignOutAlt /></button>
          </div>
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="btn-ghost mt-2 hidden w-full items-center justify-center gap-1 rounded-full py-2 text-[11px] lg:flex"
          >
            {sidebarCollapsed ? <FaChevronRight /> : <><FaChevronLeft /> COLLAPSE</>}
          </button>
        </div>
      </aside>

      {/* ═══ Mobile drawer ═══ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button aria-label="Close menu" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="drawer-in absolute inset-y-0 left-0 flex w-[86vw] max-w-80 flex-col border-r border-(--card-border) bg-(--surface) p-4">
            <div className="flex items-center gap-3 pb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-(--btn-primary-bg) font-bold text-(--btn-primary-text)">A</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold leading-none">Portfolio CMS</p>
                <p className="mt-1 truncate font-mono text-[11px] text-(--text-secondary)">{session?.user?.email}</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="btn-ghost grid h-10 w-10 place-items-center rounded-full"><FaTimes /></button>
            </div>
            <button onClick={() => { setDrawerOpen(false); setPaletteQuery(''); setPaletteOpen(true) }} className="mb-3 flex items-center gap-2 rounded-xl border border-(--card-border) px-3 py-2.5 text-xs text-(--text-secondary)">
              <FaSearch /> Quick search… <kbd className="ml-auto rounded border border-(--card-border) px-1.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <nav aria-label="Dashboard sections" className="flex-1 overflow-y-auto">
              <NavItems onNavigate={() => setDrawerOpen(false)} />
            </nav>
            <div className="flex gap-2 border-t border-(--card-border) pt-3">
              <button onClick={() => setIsLight((v) => !v)} aria-label="Toggle theme" className="btn-ghost grid h-11 w-11 place-items-center rounded-full">{isLight ? <FaSun /> : <FaMoon />}</button>
              <Link to="/" className="btn-ghost grid h-11 w-11 place-items-center rounded-full" aria-label="View site"><FaExternalLinkAlt /></Link>
              <button onClick={() => loadAll()} className="btn-ghost grid h-11 w-11 place-items-center rounded-full" aria-label="Refresh"><FaSync className={busy ? 'animate-spin' : ''} /></button>
              <button onClick={signOut} className="btn-primary ml-auto rounded-full px-5 text-xs font-semibold">SIGN OUT</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Content column ═══ */}
      <div className={cx(sidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[264px]')}>
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b border-(--card-border) bg-(--neutral)/85 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-3 py-3 sm:px-5">
            <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="btn-ghost grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden"><FaBars /></button>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate font-mono text-[10px] tracking-[0.22em] text-(--text-secondary)">
                <activeTab.icon className="text-(--primary)" /> CMS / {activeTab.label.toUpperCase()}
                {busy && <span className="ml-1 inline-flex items-center gap-1 text-(--primary)"><FaSync className="animate-spin" /> syncing</span>}
              </p>
              <h1 className="truncate text-base font-semibold sm:text-lg">{activeTab.label}</h1>
            </div>
            <button
              onClick={() => { setPaletteQuery(''); setPaletteOpen(true) }}
              className="btn-ghost hidden items-center gap-2 rounded-full px-4 py-2.5 text-xs md:flex"
            >
              <FaSearch /> <span className="text-(--text-secondary)">Search…</span> <kbd className="rounded border border-(--card-border) px-1.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <button onClick={() => loadAll()} disabled={busy} aria-label="Refresh data" title="Refresh data" className="btn-ghost grid h-11 w-11 shrink-0 place-items-center rounded-full disabled:opacity-60">
              <FaSync className={busy ? 'animate-spin' : ''} />
            </button>
            <Link to="/" className="btn-ghost hidden shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wider sm:inline-flex">VIEW SITE</Link>
            <button onClick={signOut} className="btn-primary hidden shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wider lg:inline-flex">SIGN OUT</button>
          </div>
          {/* mobile quick tabs */}
          <nav aria-label="Quick tabs" className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-3 pb-3 lg:hidden">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap',
                  tab === t.id ? 'bg-(--primary-soft) shadow-[inset_0_0_0_1px_var(--border-primary)]' : 'text-(--text-secondary)',
                )}
              >
                <t.icon className="text-xs" /> {t.label.toUpperCase()}
                {t.id === 'messages' && stats.unread > 0 && <span className="rounded-full bg-red-500/20 px-1.5 text-red-200">{stats.unread}</span>}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-5 pb-28 sm:px-5 sm:py-7 lg:pb-10">
          {/* status strip */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-(--text-secondary)">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--card-border) bg-(--surface)/60 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Supabase connected
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--card-border) bg-(--surface)/60 px-3 py-1.5">
              <FaClock /> {lastSynced ? `Synced ${timeAgo(lastSynced.toISOString())}` : 'Not synced yet'}
            </span>
            {stats.unread > 0 && (
              <button onClick={() => setTab('messages')} className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-200">
                <FaEnvelope /> {stats.unread} unread — open inbox
              </button>
            )}
            <span className="ml-auto hidden items-center gap-1.5 font-mono sm:inline-flex"><FaShieldAlt /> RLS: writes require login</span>
          </div>

          {initialLoading ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
              </div>
              <Skeleton className="h-64" />
            </div>
          ) : (
            <>
              {tab === 'overview' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {[
                      { k: 'PROJECTS', v: stats.projects, hint: `${stats.published} live · ${stats.featured} starred`, icon: FaFolderOpen, go: 'projects' },
                      { k: 'PUBLISHED', v: `${publishedPct}%`, hint: `${stats.published}/${stats.projects} visible`, icon: FaEye, go: 'projects' },
                      { k: 'SKILLS', v: stats.skills, hint: `${skillDist.map((d) => `${d.count} ${d.cat.slice(0, 4)}`).join(' · ') || 'none yet'}`, icon: FaCode, go: 'skills' },
                      { k: 'UNREAD', v: stats.unread, hint: `${messages.length} total in inbox`, icon: FaInbox, go: 'messages' },
                    ].map((c) => (
                      <button key={c.k} onClick={() => setTab(c.go)} className="card-hover glass rounded-2xl p-4 text-left">
                        <p className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-(--text-secondary) sm:text-[11px]">
                          {c.k} <c.icon className="text-sm text-(--primary)" />
                        </p>
                        <p className="mt-1 text-2xl font-semibold sm:text-3xl">{c.v}</p>
                        <p className="mt-1 truncate text-[11px] text-(--text-secondary)">{c.hint}</p>
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    {/* inbox activity */}
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
                        <button onClick={() => setTab('messages')} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold">OPEN INBOX</button>
                        <button onClick={markAllRead} className="btn-ghost rounded-full px-4 py-2 text-xs"><span className="inline-flex items-center gap-1.5"><FaCheckDouble /> MARK ALL READ</span></button>
                      </div>
                    </Shell>

                    {/* portfolio health */}
                    <Shell title="Portfolio health" subtitle="Visibility + profile completeness.">
                      <div className="flex items-center gap-4">
                        <div
                          className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
                          style={{ background: `conic-gradient(var(--primary) ${publishedPct * 3.6}deg, var(--surface-2) 0deg)` }}
                          role="img" aria-label={`${publishedPct}% published`}
                        >
                          <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-(--surface) text-sm font-bold">{publishedPct}%</span>
                        </div>
                        <div className="min-w-0 text-xs leading-relaxed text-(--text-secondary)">
                          <p><span className="font-semibold text-(--text-primary)">{stats.published}</span> published · <span className="font-semibold text-(--text-primary)">{stats.drafts}</span> drafts · <span className="font-semibold text-(--text-primary)">{stats.featured}</span> featured</p>
                          <p className="mt-2 font-mono text-[11px] tracking-widest">PROFILE {completeness}%</p>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-(--surface-2)"><div className="h-full rounded-full bg-gradient-to-r from-(--primary) to-emerald-400" style={{ width: `${completeness}%` }} /></div>
                          <button onClick={() => setTab('profile')} className="mt-2 underline underline-offset-2 hover:text-(--text-primary)">Complete profile →</button>
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

                    {/* quick actions + activity */}
                    <div className="flex flex-col gap-4">
                      <Shell title="Quick actions" subtitle="Most-used workflows.">
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => { setTab('projects'); startEditProject(null) }} className="btn-primary rounded-xl px-3 py-3 text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><FaPlus /> PROJECT</span></button>
                          <button onClick={() => { setTab('skills'); startEditSkill(null) }} className="btn-ghost rounded-xl px-3 py-3 text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><FaPlus /> SKILL</span></button>
                          <button onClick={exportBackup} className="btn-ghost rounded-xl px-3 py-3 text-xs"><span className="inline-flex items-center gap-1.5"><FaDownload /> BACKUP</span></button>
                          <button onClick={() => { setPaletteQuery(''); setPaletteOpen(true) }} className="btn-ghost rounded-xl px-3 py-3 text-xs"><span className="inline-flex items-center gap-1.5"><FaBolt /> COMMAND</span></button>
                        </div>
                      </Shell>
                      <Shell title="Recent activity" subtitle="Stored on this device.">
                        {!activity.length && <p className="text-xs text-(--text-secondary)">No actions yet — saves, publishes and exports will appear here.</p>}
                        <ul className="flex max-h-44 flex-col gap-2 overflow-y-auto">
                          {activity.map((a, i) => (
                            <li key={`${a.at}-${i}`} className="flex items-start gap-2 rounded-xl border border-(--card-border) bg-(--surface)/40 px-3 py-2 text-xs">
                              <FaCheck className="mt-0.5 shrink-0 text-emerald-300" />
                              <span className="min-w-0 flex-1 truncate">{a.text}</span>
                              <span className="shrink-0 font-mono text-[10px] text-(--text-secondary)">{timeAgo(a.at)}</span>
                            </li>
                          ))}
                        </ul>
                      </Shell>
                    </div>
                  </div>

                  {/* latest messages preview */}
                  <Shell
                    title="Latest messages"
                    subtitle="Newest 3 — reply via your mail app."
                    action={<button onClick={() => setTab('messages')} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold">VIEW ALL</button>}
                  >
                    <div className="grid gap-2 md:grid-cols-3">
                      {messages.slice(0, 3).map((m) => (
                        <div key={m.id} className="rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3.5">
                          <p className="flex items-center gap-2 text-sm font-semibold">{!m.is_read && <span className="h-2 w-2 rounded-full bg-(--primary)" />}{m.name}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">{m.message}</p>
                          <p className="mt-2 font-mono text-[10px] text-(--text-secondary)">{timeAgo(m.created_at)}</p>
                        </div>
                      ))}
                      {!messages.length && <p className="text-sm text-(--text-secondary)">No messages yet.</p>}
                    </div>
                  </Shell>
                </div>
              )}

              {tab === 'projects' && (
                <Shell
                  title={`Projects (${filteredProjects.length}/${projects.length})`}
                  subtitle="Starred = large on homepage. Drafts stay hidden from visitors."
                  action={<button onClick={() => startEditProject(null)} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><FaPlus /> NEW</span></button>}
                >
                  {/* toolbar */}
                  <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
                    <label className="flex items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface)/60 px-3">
                      <FaSearch className="shrink-0 text-(--text-secondary)" />
                      <input value={projectQuery} onChange={(e) => setProjectQuery(e.target.value)} placeholder="Search title, tech, description…" className="w-full bg-transparent py-2.5 text-sm outline-none" />
                      {projectQuery && <button onClick={() => setProjectQuery('')} aria-label="Clear search"><FaTimes className="text-(--text-secondary)" /></button>}
                    </label>
                    <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} className="field !w-auto py-2.5 text-xs" aria-label="Filter projects">
                      <option value="all">All statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                      <option value="featured">Featured</option>
                    </select>
                    <select value={projectSort} onChange={(e) => setProjectSort(e.target.value)} className="field !w-auto py-2.5 text-xs" aria-label="Sort projects">
                      <option value="order">Sort: manual</option>
                      <option value="newest">Sort: newest</option>
                      <option value="title">Sort: A–Z</option>
                    </select>
                    <div className="flex rounded-xl border border-(--card-border) p-1" role="group" aria-label="View mode">
                      {['grid', 'list'].map((v) => (
                        <button key={v} onClick={() => setProjectView(v)} className={cx('rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest', projectView === v ? 'bg-(--primary-soft)' : 'text-(--text-secondary)')}>{v.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>

                  {!filteredProjects.length && (
                    <EmptyState icon={FaFolderOpen} title="No projects match" hint="Try clearing the search or add a new project." action={<button onClick={() => startEditProject(null)} className="btn-primary rounded-full px-5 py-2.5 text-xs font-semibold">+ NEW PROJECT</button>} />
                  )}

                  {projectView === 'grid' ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredProjects.map((p) => (
                        <article key={p.id} className="card-hover glass flex flex-col overflow-hidden rounded-2xl">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                          ) : (
                            <div className="grid aspect-video place-items-center bg-(--surface-2) text-(--text-secondary)"><FaImage className="text-2xl" /></div>
                          )}
                          <div className="flex flex-1 flex-col gap-2 p-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {p.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] text-amber-200"><FaStar /> FEATURED</span>}
                              <span className={cx('rounded-full px-2 py-0.5 font-mono text-[10px]', p.is_published ? 'bg-emerald-500/15 text-emerald-200' : 'bg-(--surface-2) text-(--text-secondary)')}>{p.is_published ? 'LIVE' : 'DRAFT'}</span>
                              <span className="ml-auto font-mono text-[10px] text-(--text-secondary)">#{p.sort_order}</span>
                            </div>
                            <h3 className="font-semibold">{p.title}</h3>
                            <p className="line-clamp-2 text-xs leading-relaxed text-(--text-secondary)">{p.description || 'No description.'}</p>
                            <p className="truncate font-mono text-[11px] text-(--primary)">{(p.tech ?? []).join(' · ')}</p>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                              <button onClick={() => startEditProject(p)} className="btn-ghost flex-1 rounded-full px-3 py-2 text-[11px]"><span className="inline-flex items-center gap-1"><FaEdit /> EDIT</span></button>
                              <button onClick={() => togglePublish(p)} title={p.is_published ? 'Unpublish' : 'Publish'} className="btn-ghost rounded-full px-3 py-2 text-[11px]">{p.is_published ? <FaEyeSlash /> : <FaEye />}</button>
                              <button onClick={() => duplicateProject(p)} title="Duplicate as draft" className="btn-ghost rounded-full px-3 py-2 text-[11px]"><FaCopy /></button>
                              <button onClick={() => askDeleteProject(p.id, p.title)} title="Delete" className="rounded-full border border-red-500/40 px-3 py-2 text-[11px] text-red-300 hover:bg-red-500/10"><FaTrash /></button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {filteredProjects.map((p) => (
                        <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3">
                          {p.image_url ? <img src={p.image_url} alt="" loading="lazy" className="h-12 w-20 rounded-lg object-cover" /> : <span className="grid h-12 w-20 place-items-center rounded-lg bg-(--surface-2) text-(--text-secondary)"><FaImage /></span>}
                          <div className="min-w-40 flex-1">
                            <p className="font-semibold">{p.title} {p.featured && <FaStar className="inline text-amber-300" />}</p>
                            <p className="truncate font-mono text-[11px] text-(--text-secondary)">#{p.sort_order} · {(p.tech ?? []).join(', ')} · {p.is_published ? 'published' : 'hidden'}</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <button onClick={() => startEditProject(p)} className="btn-ghost rounded-full px-4 py-2 text-xs">EDIT</button>
                            <button onClick={() => togglePublish(p)} className="btn-ghost rounded-full px-3 py-2 text-xs">{p.is_published ? <FaEyeSlash /> : <FaEye />}</button>
                            <button onClick={() => askDeleteProject(p.id, p.title)} className="rounded-full border border-red-500/40 px-4 py-2 text-xs text-red-300">DELETE</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Shell>
              )}

              {tab === 'skills' && (
                <Shell
                  title={`Skills (${filteredSkills.length})`}
                  subtitle="Frontend / backend render as cards, tools as pills."
                  action={<button onClick={() => startEditSkill(null)} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><FaPlus /> NEW</span></button>}
                >
                  <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <label className="flex items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface)/60 px-3">
                      <FaSearch className="text-(--text-secondary)" />
                      <input value={skillQuery} onChange={(e) => setSkillQuery(e.target.value)} placeholder="Search skills…" className="w-full bg-transparent py-2.5 text-sm outline-none" />
                    </label>
                    <div className="flex gap-1 overflow-x-auto rounded-xl border border-(--card-border) p-1">
                      {['all', 'frontend', 'backend', 'tool'].map((c) => (
                        <button key={c} onClick={() => setSkillCat(c)} className={cx('shrink-0 rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest whitespace-nowrap', skillCat === c ? 'bg-(--primary-soft)' : 'text-(--text-secondary)')}>{c.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  {!filteredSkills.length && <EmptyState icon={FaCode} title="No skills found" hint="Add your first skill to fill the homepage section." />}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {filteredSkills.map((s) => (
                      <div key={s.id} className="rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-(--primary-soft) px-2 py-0.5 font-mono text-[10px] tracking-widest text-(--primary)">{s.category.toUpperCase()}</span>
                          {!s.is_visible && <span className="rounded-full bg-(--surface-2) px-2 py-0.5 font-mono text-[10px] text-(--text-secondary)">HIDDEN</span>}
                          <span className="ml-auto flex gap-1.5">
                            <button onClick={() => startEditSkill(s)} aria-label={`Edit ${s.title}`} className="btn-ghost rounded-full p-2 text-xs"><FaEdit /></button>
                            <button onClick={() => askDeleteSkill(s.id, s.title)} aria-label={`Delete ${s.title}`} className="rounded-full border border-red-500/40 p-2 text-xs text-red-300"><FaTrash /></button>
                          </span>
                        </div>
                        <p className="mt-2 font-semibold">{s.title}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-(--surface-2)">
                            <div className="h-full rounded-full bg-gradient-to-r from-(--primary) to-emerald-400" style={{ width: `${s.percentage}%` }} />
                          </div>
                          <span className="font-mono text-xs text-(--text-secondary)">{s.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Shell>
              )}

              {tab === 'profile' && profileForm && (
                <Shell
                  title="Profile / hero settings"
                  subtitle="Controls the homepage headline, stats, email, resume and GitHub links."
                  action={<span className="rounded-full border border-(--card-border) px-3 py-1.5 font-mono text-[11px] text-(--text-secondary)">{completeness}% COMPLETE</span>}
                >
                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-(--surface-2)">
                    <div className="h-full rounded-full bg-gradient-to-r from-(--primary) to-emerald-400 transition-all" style={{ width: `${completeness}%` }} />
                  </div>
                  <form onSubmit={saveProfile} className="grid gap-3 sm:grid-cols-2">
                    {PROFILE_FIELDS.map(([k, label]) => (
                      <label key={k} className="flex flex-col gap-1.5">
                        <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">{label.toUpperCase()}</span>
                        <input className="field" value={profileForm[k] ?? ''} onChange={(e) => setProfileForm({ ...profileForm, [k]: e.target.value })} />
                      </label>
                    ))}
                    <label className="flex flex-col gap-1.5 sm:col-span-2">
                      <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">HERO DESCRIPTION</span>
                      <textarea className="field min-h-24" value={profileForm.hero_description ?? ''} onChange={(e) => setProfileForm({ ...profileForm, hero_description: e.target.value })} />
                    </label>
                    <div className="flex flex-wrap gap-2 sm:col-span-2">
                      <button disabled={busy} className="btn-primary rounded-full px-6 py-3 text-xs font-semibold tracking-wider disabled:opacity-60">SAVE PROFILE</button>
                      <button type="button" onClick={exportBackup} className="btn-ghost rounded-full px-6 py-3 text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><FaDownload /> EXPORT BACKUP</span></button>
                    </div>
                  </form>
                </Shell>
              )}

              {tab === 'socials' && (
                <Shell
                  title={`Social links (${filteredSocials.length})`}
                  subtitle="Icon key: github, linkedin, facebook, gmail, twitter, instagram, globe."
                  action={<button onClick={() => { setEditingSocial('new'); setSocialForm(emptySocial) }} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold"><span className="inline-flex items-center gap-1.5"><FaPlus /> NEW</span></button>}
                >
                  <label className="mb-4 flex items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface)/60 px-3">
                    <FaSearch className="text-(--text-secondary)" />
                    <input value={socialQuery} onChange={(e) => setSocialQuery(e.target.value)} placeholder="Search links…" className="w-full bg-transparent py-2.5 text-sm outline-none" />
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {filteredSocials.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--primary-soft) font-mono text-[11px] text-(--primary)">{s.icon.slice(0, 2).toUpperCase()}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{s.label} {!s.is_visible && <span className="font-mono text-[10px] text-(--text-secondary)">· hidden</span>}</p>
                          <a href={s.href} target="_blank" rel="noreferrer" className="truncate font-mono text-[11px] text-(--primary) hover:underline">{s.href}</a>
                        </div>
                        <span className="flex shrink-0 gap-1.5">
                          <button onClick={() => { setEditingSocial(s.id); setSocialForm(s) }} aria-label={`Edit ${s.label}`} className="btn-ghost rounded-full p-2.5 text-xs"><FaEdit /></button>
                          <button onClick={() => askDeleteSocial(s.id, s.label)} aria-label={`Delete ${s.label}`} className="rounded-full border border-red-500/40 p-2.5 text-xs text-red-300"><FaTrash /></button>
                        </span>
                      </div>
                    ))}
                  </div>
                  {!filteredSocials.length && <EmptyState icon={FaGlobe} title="No social links" hint="Add GitHub, LinkedIn and email so visitors can reach you." />}
                </Shell>
              )}

              {tab === 'messages' && (
                <Shell
                  title={`Inbox (${filteredMessages.length}/${messages.length})`}
                  subtitle="Contact-form submissions. Reply opens your mail app."
                  action={
                    <>
                      <button onClick={exportMessagesCSV} className="btn-ghost rounded-full px-4 py-2 text-xs"><span className="inline-flex items-center gap-1.5"><FaDownload /> CSV</span></button>
                      <button onClick={markAllRead} className="btn-ghost rounded-full px-4 py-2 text-xs"><span className="inline-flex items-center gap-1.5"><FaCheckDouble /> READ ALL</span></button>
                    </>
                  }
                >
                  <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <label className="flex items-center gap-2 rounded-xl border border-(--card-border) bg-(--surface)/60 px-3">
                      <FaSearch className="text-(--text-secondary)" />
                      <input value={msgQuery} onChange={(e) => setMsgQuery(e.target.value)} placeholder="Search name, email, message…" className="w-full bg-transparent py-2.5 text-sm outline-none" />
                    </label>
                    <div className="flex gap-1 rounded-xl border border-(--card-border) p-1">
                      {['all', 'unread', 'read'].map((f) => (
                        <button key={f} onClick={() => setMsgFilter(f)} className={cx('rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-widest', msgFilter === f ? 'bg-(--primary-soft)' : 'text-(--text-secondary)')}>{f.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>
                  {stats.unread > 0 && (
                    <button onClick={deleteRead} className="mb-3 text-xs text-(--text-secondary) underline underline-offset-2 hover:text-(--text-primary)">
                      Delete all read messages ({messages.length - stats.unread})
                    </button>
                  )}
                  <div className="grid gap-3">
                    {filteredMessages.slice(0, msgVisible).map((m) => (
                      <article key={m.id} className={cx('rounded-2xl border p-4', m.is_read ? 'border-(--card-border) opacity-80' : 'border-(--border-primary) bg-(--primary-soft)/40')}>
                        <div className="flex flex-wrap items-center gap-2">
                          {!m.is_read && <span className="h-2 w-2 rounded-full bg-(--primary)" />}
                          <p className="font-semibold">{m.name}</p>
                          <a href={`mailto:${m.email}`} className="min-w-0 truncate font-mono text-[11px] text-(--primary) hover:underline">{m.email}</a>
                          <span className="ml-auto shrink-0 font-mono text-[10px] text-(--text-secondary)">{timeAgo(m.created_at)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{m.message}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => setRead(m.id, !m.is_read)} className="btn-ghost rounded-full px-3 py-1.5 text-xs">{m.is_read ? 'MARK UNREAD' : 'MARK READ'}</button>
                          <a href={`mailto:${m.email}?subject=Re:%20Portfolio%20inquiry&body=${encodeURIComponent(`Hi ${m.name},\n\n`)}`} className="btn-ghost rounded-full px-3 py-1.5 text-xs">REPLY</a>
                          <button onClick={() => copyText(m.email, 'Email')} className="btn-ghost rounded-full px-3 py-1.5 text-xs"><span className="inline-flex items-center gap-1"><FaCopy /> COPY</span></button>
                          <button onClick={() => askDeleteMessage(m.id)} className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300">DELETE</button>
                        </div>
                      </article>
                    ))}
                    {!filteredMessages.length && <EmptyState icon={FaInbox} title="Inbox zero" hint="New contact-form submissions will land here." />}
                  </div>
                  {filteredMessages.length > msgVisible && (
                    <button onClick={() => setMsgVisible((v) => v + 12)} className="btn-ghost mt-4 w-full rounded-full py-3 text-xs font-semibold">SHOW MORE ({filteredMessages.length - msgVisible} left)</button>
                  )}
                </Shell>
              )}

              {tab === 'setup' && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <Shell title="Setup guide" subtitle="One-time checklist to go live with Supabase.">
                    <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-(--text-secondary)">
                      <li>Create project at supabase.com → copy <code>Project URL</code> + <code>anon public key</code> (Settings → API).</li>
                      <li>Create <code>.env</code> from <code>.env.example</code> and restart <code>npm run dev</code>.</li>
                      <li>SQL Editor → paste + run <code>supabase/schema.sql</code> (creates tables, RLS, seed data).</li>
                      <li>Authentication → Users → Add user (your admin email + password). Sign in at <code>/admin/login</code>.</li>
                      <li>Storage → New bucket <code>portfolio-images</code> → Public ON (enables dashboard image uploads).</li>
                      <li>Deploy: set the same two env vars on Vercel/Netlify and redeploy.</li>
                    </ol>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => copyText('supabase/schema.sql', 'Schema path')} className="btn-ghost rounded-full px-4 py-2 text-xs"><span className="inline-flex items-center gap-1.5"><FaCopy /> COPY SCHEMA PATH</span></button>
                      <button onClick={exportBackup} className="btn-ghost rounded-full px-4 py-2 text-xs"><span className="inline-flex items-center gap-1.5"><FaDownload /> EXPORT BACKUP</span></button>
                    </div>
                  </Shell>
                  <div className="flex flex-col gap-4">
                    <Shell title="Data overview" subtitle="Live row counts + storage tips.">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        {[['Projects', projects.length], ['Skills', skills.length], ['Socials', socials.length], ['Messages', messages.length]].map(([k, v]) => (
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
                      <button onClick={deleteRead} className="rounded-full border border-red-500/40 px-4 py-2.5 text-xs text-red-300 hover:bg-red-500/10">DELETE ALL READ MESSAGES</button>
                    </Shell>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* ═══ Mobile bottom nav ═══ */}
        <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-(--card-border) bg-(--surface)/90 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="grid grid-cols-5">
            {[
              TABS[0],
              TABS[1],
              TABS[2],
              TABS[5],
              { id: '__menu', label: 'Menu', short: 'Menu', icon: FaBars },
            ].map((t) => {
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => (t.id === '__menu' ? setDrawerOpen(true) : setTab(t.id))}
                  aria-current={active ? 'page' : undefined}
                  className={cx('flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-mono tracking-wider', active ? 'text-(--primary)' : 'text-(--text-secondary)')}
                >
                  <span className="relative text-lg">
                    <t.icon />
                    {t.id === 'messages' && stats.unread > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{stats.unread > 9 ? '9+' : stats.unread}</span>
                    )}
                  </span>
                  {t.short.toUpperCase()}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* ═══ Overlays ═══ */}
      <CommandPalette
        open={paletteOpen}
        query={paletteQuery}
        setQuery={setPaletteQuery}
        results={paletteResults}
        onClose={() => setPaletteOpen(false)}
        onPick={(r) => { setPaletteOpen(false); setPaletteQuery(''); r.run() }}
      />
      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={() => confirm?.onConfirm?.()} />
      <Toasts toasts={toasts} dismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* project editor */}
      {editingProject && (
        <ModalSheet wide title={editingProject === 'new' ? 'New project' : 'Edit project'} subtitle="Changes go live instantly when published." onClose={() => setEditingProject(null)}>
          <form onSubmit={saveProject} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
              <input className="field" placeholder="Title *" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
              <input className="field" placeholder="Order (0 first)" type="number" value={projectForm.sort_order} onChange={(e) => setProjectForm({ ...projectForm, sort_order: e.target.value })} />
            </div>
            <textarea className="field min-h-24" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
            <p className="text-right font-mono text-[10px] text-(--text-secondary)">{String(projectForm.description || '').length} chars</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Live URL https://…" inputMode="url" value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} />
              <input className="field" placeholder="Code URL https://github.com/…" inputMode="url" value={projectForm.code_url} onChange={(e) => setProjectForm({ ...projectForm, code_url: e.target.value })} />
            </div>
            {/* drag-drop image */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); uploadImageFile(e.dataTransfer.files?.[0]) }}
              className={cx('grid gap-3 rounded-2xl border border-dashed p-3 transition-colors sm:grid-cols-[1fr_auto]', dragOver ? 'border-(--primary) bg-(--primary-soft)' : 'border-(--card-border)')}
            >
              <input className="field" placeholder="Image URL or upload →" value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost rounded-full px-4 py-2.5 text-xs font-semibold disabled:opacity-60">
                {uploading ? 'UPLOADING…' : 'UPLOAD / DROP'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImageFile(e.target.files?.[0])} />
              {projectForm.image_url && (
                <div className="relative sm:col-span-2">
                  <img src={projectForm.image_url} alt="preview" className="aspect-video w-full rounded-xl border border-(--card-border) object-cover" />
                  <button type="button" onClick={() => setProjectForm({ ...projectForm, image_url: '' })} className="absolute top-2 right-2 rounded-full bg-black/70 px-3 py-1.5 text-[11px] text-white">REMOVE</button>
                </div>
              )}
            </div>
            <input className="field" placeholder="Tech (comma separated): React, Tailwind, Laravel" value={projectForm.tech} onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })} />
            <div className="flex flex-wrap gap-2">
              {[
                { k: 'featured', label: 'Featured', icon: FaStar, off: FaRegStar },
                { k: 'is_published', label: 'Published', icon: FaEye, off: FaEyeSlash },
              ].map((t) => {
                const on = !!projectForm[t.k]
                return (
                  <button key={t.k} type="button" onClick={() => setProjectForm({ ...projectForm, [t.k]: !on })}
                    aria-pressed={on}
                    className={cx('inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold', on ? 'border-(--border-primary) bg-(--primary-soft)' : 'border-(--card-border) text-(--text-secondary)')}>
                    {on ? <t.icon /> : <t.off />} {t.label.toUpperCase()}
                  </button>
                )
              })}
            </div>
            <div className="sticky bottom-0 flex gap-2 bg-(--surface)/90 pt-2 pb-1 backdrop-blur">
              <button disabled={busy} className="btn-primary flex-1 rounded-full px-5 py-3 text-xs font-semibold disabled:opacity-60">SAVE PROJECT</button>
              <button type="button" onClick={() => setEditingProject(null)} className="btn-ghost rounded-full px-5 py-3 text-xs font-semibold">CANCEL</button>
            </div>
          </form>
        </ModalSheet>
      )}

      {/* skill editor */}
      {editingSkill && (
        <ModalSheet title={editingSkill === 'new' ? 'New skill' : 'Edit skill'} onClose={() => setEditingSkill(null)}>
          <form onSubmit={saveSkill} className="grid gap-3">
            <input className="field" placeholder="Title *" value={skillForm.title} onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest text-(--text-secondary)">LEVEL {skillForm.percentage}%</span>
                <input className="field" type="number" min="0" max="100" value={skillForm.percentage} onChange={(e) => setSkillForm({ ...skillForm, percentage: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] tracking-widest text-(--text-secondary)">CATEGORY</span>
                <select className="field" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                  <option value="frontend">frontend</option>
                  <option value="backend">backend</option>
                  <option value="tool">tool</option>
                </select>
              </label>
            </div>
            <input className="field accent-(--primary)" type="range" min="0" max="100" value={skillForm.percentage} onChange={(e) => setSkillForm({ ...skillForm, percentage: e.target.value })} aria-label="Skill level" />
            <div className="grid grid-cols-2 gap-3">
              <input className="field" type="number" placeholder="Sort order" value={skillForm.sort_order} onChange={(e) => setSkillForm({ ...skillForm, sort_order: e.target.value })} />
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={skillForm.is_visible} onChange={(e) => setSkillForm({ ...skillForm, is_visible: e.target.checked })} className="h-4 w-4 accent-(--primary)" /> Visible on site</label>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1 rounded-full px-5 py-3 text-xs font-semibold">SAVE SKILL</button>
              <button type="button" onClick={() => setEditingSkill(null)} className="btn-ghost rounded-full px-5 py-3 text-xs font-semibold">CANCEL</button>
            </div>
          </form>
        </ModalSheet>
      )}

      {/* social editor */}
      {editingSocial && (
        <ModalSheet title={editingSocial === 'new' ? 'New social link' : 'Edit social link'} onClose={() => setEditingSocial(null)}>
          <form onSubmit={saveSocial} className="grid gap-3">
            <input className="field" placeholder="Label * (e.g. GitHub)" value={socialForm.label} onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })} />
            <input className="field" placeholder="https://…" inputMode="url" value={socialForm.href} onChange={(e) => setSocialForm({ ...socialForm, href: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="field" value={socialForm.icon} onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}>
                {['github', 'linkedin', 'facebook', 'gmail', 'twitter', 'instagram', 'globe'].map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <input className="field" type="number" placeholder="Sort order" value={socialForm.sort_order} onChange={(e) => setSocialForm({ ...socialForm, sort_order: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={!!socialForm.is_visible} onChange={(e) => setSocialForm({ ...socialForm, is_visible: e.target.checked })} className="h-4 w-4 accent-(--primary)" /> Visible on site</label>
            <div className="flex gap-2">
              <button className="btn-primary flex-1 rounded-full px-5 py-3 text-xs font-semibold">{editingSocial === 'new' ? 'ADD LINK' : 'UPDATE LINK'}</button>
              <button type="button" onClick={() => setEditingSocial(null)} className="btn-ghost rounded-full px-5 py-3 text-xs font-semibold">CANCEL</button>
            </div>
          </form>
        </ModalSheet>
      )}
    </div>
  )
}
