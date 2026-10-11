import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const TABS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'profile', label: 'PROFILE' },
  { id: 'socials', label: 'SOCIALS' },
  { id: 'messages', label: 'INBOX' },
  { id: 'setup', label: 'SETUP' },
]

const emptyProject = {
  title: '', description: '', image_url: '', live_url: '', code_url: '',
  tech: '', featured: false, is_published: true, sort_order: 0,
}
const emptySkill = { title: '', percentage: 80, category: 'frontend', sort_order: 0, is_visible: true }

function Shell({ children, title, subtitle, action }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-(--text-secondary) sm:text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState('overview')

  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [socials, setSocials] = useState([])
  const [messages, setMessages] = useState([])
  const [profile, setProfile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [uploading, setUploading] = useState(false)

  const [editingSkill, setEditingSkill] = useState(null)
  const [skillForm, setSkillForm] = useState(emptySkill)

  const [socialForm, setSocialForm] = useState({ label: '', href: '', icon: 'github', sort_order: 0, is_visible: true })
  const [editingSocial, setEditingSocial] = useState(null)

  const [profileForm, setProfileForm] = useState(null)

  // ── auth guard ──
  useEffect(() => {
    if (!supabase) { setChecking(false); return }
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

  const loadAll = async () => {
    if (!supabase) return
    setBusy(true)
    setNotice('')
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
      if (p.error || s.error || m.error) setNotice('Some tables failed to load — did you run supabase/schema.sql?')
    } catch (e) {
      setNotice(String(e.message ?? e))
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { if (session) loadAll() }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => ({
    projects: projects.length,
    published: projects.filter((p) => p.is_published).length,
    skills: skills.length,
    unread: messages.filter((m) => !m.is_read).length,
  }), [projects, skills, messages])

  const signOut = async () => { await supabase?.auth.signOut(); navigate('/admin/login') }

  // ── projects CRUD ──
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
    if (!payload.title) { setNotice('Project title is required.'); return }
    setBusy(true)
    const res = editingProject === 'new'
      ? await supabase.from('projects').insert([payload]).select()
      : await supabase.from('projects').update(payload).eq('id', editingProject).select()
    setBusy(false)
    if (res.error) setNotice(res.error.message)
    else { setEditingProject(null); setProjectForm(emptyProject); loadAll() }
  }
  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) setNotice(error.message); else loadAll()
  }
  const onImageFile = async (file) => {
    if (!file || !supabase) return
    setUploading(true)
    try {
      const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error } = await supabase.storage.from('portfolio-images').upload(name, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('portfolio-images').getPublicUrl(name)
      setProjectForm((f) => ({ ...f, image_url: data.publicUrl }))
    } catch (e) {
      setNotice(`Upload failed (create a public bucket named "portfolio-images" first): ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  // ── skills CRUD ──
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
    if (!payload.title) { setNotice('Skill title is required.'); return }
    setBusy(true)
    const res = editingSkill === 'new'
      ? await supabase.from('skills').insert([payload]).select()
      : await supabase.from('skills').update(payload).eq('id', editingSkill).select()
    setBusy(false)
    if (res.error) setNotice(res.error.message)
    else { setEditingSkill(null); setSkillForm(emptySkill); loadAll() }
  }
  const deleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) setNotice(error.message); else loadAll()
  }

  // ── socials CRUD ──
  const saveSocial = async (e) => {
    e.preventDefault()
    const payload = { ...socialForm, sort_order: Number(socialForm.sort_order) || 0 }
    if (!payload.label || !payload.href) { setNotice('Social label + URL required.'); return }
    const res = editingSocial === 'new'
      ? await supabase.from('socials').insert([payload]).select()
      : await supabase.from('socials').update(payload).eq('id', editingSocial).select()
    if (res.error) setNotice(res.error.message)
    else { setEditingSocial(null); setSocialForm({ label: '', href: '', icon: 'github', sort_order: 0, is_visible: true }); loadAll() }
  }
  const deleteSocial = async (id) => {
    if (!confirm('Delete this social link?')) return
    const { error } = await supabase.from('socials').delete().eq('id', id)
    if (error) setNotice(error.message); else loadAll()
  }

  // ── profile save ──
  const saveProfile = async (e) => {
    e.preventDefault()
    setBusy(true)
    const payload = { ...profileForm }
    delete payload.id; delete payload.created_at
    let res
    if (profile?.id) res = await supabase.from('profiles').update(payload).eq('id', profile.id).select()
    else res = await supabase.from('profiles').insert([payload]).select()
    setBusy(false)
    if (res.error) setNotice(res.error.message)
    else { setNotice('Profile saved — refresh the homepage to see it.'); loadAll() }
  }

  // ── messages ──
  const setRead = async (id, is_read) => {
    const { error } = await supabase.from('messages').update({ is_read }).eq('id', id)
    if (!error) setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, is_read } : m)))
  }
  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (!error) setMessages((ms) => ms.filter((m) => m.id !== id))
  }

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

  return (
    <div className="min-h-screen bg-(--neutral) text-(--text-primary)">
      <header className="sticky top-0 z-40 border-b border-(--card-border) bg-(--neutral)/85 backdrop-blur-xl">
        <div className="container-x flex min-h-16 items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-(--btn-primary-bg) font-bold text-(--btn-primary-text)">A</span>
            <div>
              <p className="font-semibold leading-none">Portfolio CMS</p>
              <p className="mt-1 truncate font-mono text-[11px] text-(--text-secondary)">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold tracking-wider">VIEW SITE</Link>
            <button onClick={loadAll} disabled={busy} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold tracking-wider disabled:opacity-60">REFRESH</button>
            <button onClick={signOut} className="btn-primary rounded-full px-4 py-2 text-xs font-semibold tracking-wider">SIGN OUT</button>
          </div>
        </div>
        <nav className="container-x flex gap-1 overflow-x-auto pb-3">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.18em] whitespace-nowrap ${tab === t.id ? 'bg-(--primary-soft) shadow-[inset_0_0_0_1px_var(--border-primary)]' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}>
              {t.label}{t.id === 'messages' && stats.unread > 0 ? ` (${stats.unread})` : ''}
            </button>
          ))}
        </nav>
      </header>

      <main className="container-x flex flex-col gap-4 py-6 sm:py-8">
        {notice && (
          <div className="rounded-2xl border border-(--card-border) bg-(--primary-soft) p-4 text-xs leading-relaxed">
            {notice} <button onClick={() => setNotice('')} className="ml-2 underline">dismiss</button>
          </div>
        )}

        {tab === 'overview' && (
          <Shell title="Overview" subtitle="Live counts from Supabase. The public site falls back to bundled data if a table is empty.">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[['PROJECTS', stats.projects], ['PUBLISHED', stats.published], ['SKILLS', stats.skills], ['UNREAD MSGS', stats.unread]].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-(--card-border) bg-(--surface)/60 p-4">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">{k}</p>
                  <p className="mt-1 text-3xl font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-(--card-border) p-4 text-xs leading-relaxed text-(--text-secondary)">
                <p className="font-mono tracking-[0.2em] text-(--primary)">QUICK ACTIONS</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => { setTab('projects'); startEditProject(null) }} className="btn-primary rounded-full px-4 py-2 text-xs font-semibold">+ NEW PROJECT</button>
                  <button onClick={() => { setTab('skills'); startEditSkill(null) }} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold">+ NEW SKILL</button>
                  <button onClick={() => setTab('messages')} className="btn-ghost rounded-full px-4 py-2 text-xs font-semibold">OPEN INBOX</button>
                </div>
              </div>
              <div className="rounded-2xl border border-(--card-border) p-4 text-xs leading-relaxed text-(--text-secondary)">
                <p className="font-mono tracking-[0.2em] text-(--primary)">CONNECTION</p>
                <p className="mt-2">Supabase: <span className="text-(--text-primary)">connected</span> · Auth: <span className="text-(--text-primary)">{session?.user?.email}</span></p>
                <p className="mt-1">Public site reads: profiles, projects (published), skills & socials (visible), site_settings. Writes require login (RLS).</p>
              </div>
            </div>
          </Shell>
        )}

        {tab === 'projects' && (
          <Shell title={`Projects (${projects.length})`} subtitle="Featured project appears large on the homepage. Unpublished items are hidden from visitors."
            action={<button onClick={() => startEditProject(null)} className="btn-primary rounded-full px-4 py-2 text-xs font-semibold">+ NEW</button>}>
            {editingProject && (
              <form onSubmit={saveProject} className="mb-5 grid gap-3 rounded-2xl border border-(--border-primary) bg-(--surface)/60 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="field" placeholder="Title *" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
                  <input className="field" placeholder="Sort order (0 = first)" type="number" value={projectForm.sort_order} onChange={(e) => setProjectForm({ ...projectForm, sort_order: e.target.value })} />
                </div>
                <textarea className="field min-h-24" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="field" placeholder="Live URL https://…" value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} />
                  <input className="field" placeholder="Code URL https://github.com/…" value={projectForm.code_url} onChange={(e) => setProjectForm({ ...projectForm, code_url: e.target.value })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input className="field" placeholder="Image URL or uploaded path" value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} />
                  <label className="btn-ghost cursor-pointer rounded-full px-4 py-2 text-center text-xs font-semibold">
                    {uploading ? 'UPLOADING…' : 'UPLOAD IMAGE'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onImageFile(e.target.files?.[0])} />
                  </label>
                </div>
                <input className="field" placeholder="Tech (comma separated): React, Tailwind, Laravel" value={projectForm.tech} onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })} />
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} /> Featured</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={projectForm.is_published} onChange={(e) => setProjectForm({ ...projectForm, is_published: e.target.checked })} /> Published</label>
                </div>
                <div className="flex gap-2">
                  <button disabled={busy} className="btn-primary rounded-full px-5 py-2.5 text-xs font-semibold">SAVE</button>
                  <button type="button" onClick={() => setEditingProject(null)} className="btn-ghost rounded-full px-5 py-2.5 text-xs font-semibold">CANCEL</button>
                </div>
              </form>
            )}
            <div className="grid gap-3">
              {projects.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-(--card-border) bg-(--surface)/50 p-3">
                  {p.image_url && <img src={p.image_url} alt="" className="h-12 w-20 rounded-lg object-cover" />}
                  <div className="min-w-40 flex-1">
                    <p className="font-semibold">{p.title} {p.featured && <span className="ml-1 rounded-full bg-(--primary-soft) px-2 py-0.5 font-mono text-[10px]">FEATURED</span>}</p>
                    <p className="truncate font-mono text-[11px] text-(--text-secondary)">#{p.sort_order} · {(p.tech ?? []).join(', ')} · {p.is_published ? 'published' : 'hidden'}</p>
                  </div>
                  <button onClick={() => startEditProject(p)} className="btn-ghost rounded-full px-4 py-2 text-xs">EDIT</button>
                  <button onClick={() => deleteProject(p.id)} className="rounded-full border border-red-500/40 px-4 py-2 text-xs text-red-300">DELETE</button>
                </div>
              ))}
              {!projects.length && <p className="text-sm text-(--text-secondary)">No rows yet — the site is showing fallback data. Add your first project.</p>}
            </div>
          </Shell>
        )}

        {tab === 'skills' && (
          <Shell title={`Skills (${skills.length})`} subtitle="Category controls where it renders: frontend / backend cards, tool pills."
            action={<button onClick={() => startEditSkill(null)} className="btn-primary rounded-full px-4 py-2 text-xs font-semibold">+ NEW</button>}>
            {editingSkill && (
              <form onSubmit={saveSkill} className="mb-5 grid gap-3 rounded-2xl border border-(--border-primary) bg-(--surface)/60 p-4 sm:grid-cols-2">
                <input className="field" placeholder="Title *" value={skillForm.title} onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="field" type="number" min="0" max="100" value={skillForm.percentage} onChange={(e) => setSkillForm({ ...skillForm, percentage: e.target.value })} />
                  <select className="field" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                    <option value="frontend">frontend</option>
                    <option value="backend">backend</option>
                    <option value="tool">tool</option>
                  </select>
                </div>
                <input className="field" type="number" placeholder="Sort order" value={skillForm.sort_order} onChange={(e) => setSkillForm({ ...skillForm, sort_order: e.target.value })} />
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={skillForm.is_visible} onChange={(e) => setSkillForm({ ...skillForm, is_visible: e.target.checked })} /> Visible</label>
                <div className="flex gap-2 sm:col-span-2">
                  <button className="btn-primary rounded-full px-5 py-2.5 text-xs font-semibold">SAVE</button>
                  <button type="button" onClick={() => setEditingSkill(null)} className="btn-ghost rounded-full px-5 py-2.5 text-xs font-semibold">CANCEL</button>
                </div>
              </form>
            )}
            <div className="grid gap-2">
              {skills.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-(--card-border) px-3 py-2 text-sm">
                  <span className="font-mono text-[10px] tracking-widest text-(--primary)">{s.category.toUpperCase()}</span>
                  <span className="font-semibold">{s.title}</span>
                  <span className="font-mono text-xs text-(--text-secondary)">{s.percentage}%</span>
                  <span className="ml-auto flex gap-2">
                    <button onClick={() => startEditSkill(s)} className="btn-ghost rounded-full px-3 py-1.5 text-xs">EDIT</button>
                    <button onClick={() => deleteSkill(s.id)} className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300">DEL</button>
                  </span>
                </div>
              ))}
            </div>
          </Shell>
        )}

        {tab === 'profile' && profileForm && (
          <Shell title="Profile / hero settings" subtitle="Controls the homepage headline, stats, email, resume and GitHub links.">
            <form onSubmit={saveProfile} className="grid gap-3 sm:grid-cols-2">
              {[['full_name', 'Full name'], ['role', 'Role'], ['tagline', 'Tag pill'], ['hero_title_line1', 'Hero line 1'], ['hero_title_line2', 'Hero line 2'], ['email', 'Email'], ['resume_url', 'Resume URL'], ['github_url', 'GitHub URL'], ['linkedin_url', 'LinkedIn URL'], ['years_exp', 'Years exp'], ['projects_count', 'Projects count'], ['clients_count', 'Clients count']].map(([k, label]) => (
                <label key={k} className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">{label.toUpperCase()}</span>
                  <input className="field" value={profileForm[k] ?? ''} onChange={(e) => setProfileForm({ ...profileForm, [k]: e.target.value })} />
                </label>
              ))}
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-mono text-[11px] tracking-[0.2em] text-(--text-secondary)">HERO DESCRIPTION</span>
                <textarea className="field min-h-24" value={profileForm.hero_description ?? ''} onChange={(e) => setProfileForm({ ...profileForm, hero_description: e.target.value })} />
              </label>
              <div className="sm:col-span-2"><button disabled={busy} className="btn-primary rounded-full px-6 py-3 text-xs font-semibold tracking-wider">SAVE PROFILE</button></div>
            </form>
          </Shell>
        )}

        {tab === 'socials' && (
          <Shell title={`Social links (${socials.length})`} subtitle="Icon key: github, linkedin, facebook, gmail, twitter, instagram, globe.">
            <form onSubmit={saveSocial} className="mb-5 grid gap-3 rounded-2xl border border-(--card-border) p-4 sm:grid-cols-2">
              <input className="field" placeholder="Label *" value={socialForm.label} onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })} />
              <input className="field" placeholder="https://…" value={socialForm.href} onChange={(e) => setSocialForm({ ...socialForm, href: e.target.value })} />
              <select className="field" value={socialForm.icon} onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}>
                {['github', 'linkedin', 'facebook', 'gmail', 'twitter', 'instagram', 'globe'].map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <input className="field" type="number" placeholder="Sort order" value={socialForm.sort_order} onChange={(e) => setSocialForm({ ...socialForm, sort_order: e.target.value })} />
              <div className="flex gap-2 sm:col-span-2">
                <button className="btn-primary rounded-full px-5 py-2.5 text-xs font-semibold">{editingSocial ? 'UPDATE' : 'ADD'}</button>
                {editingSocial && <button type="button" onClick={() => { setEditingSocial(null); setSocialForm({ label: '', href: '', icon: 'github', sort_order: 0, is_visible: true }) }} className="btn-ghost rounded-full px-5 py-2.5 text-xs font-semibold">CANCEL</button>}
                {!editingSocial && <button type="button" onClick={() => setEditingSocial('new')} className="btn-ghost rounded-full px-5 py-2.5 text-xs font-semibold">+ NEW (clear)</button>}
              </div>
            </form>
            <div className="grid gap-2">
              {socials.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-(--card-border) px-3 py-2 text-sm">
                  <span className="font-mono text-[11px] text-(--primary)">{s.icon}</span>
                  <span className="font-semibold">{s.label}</span>
                  <span className="truncate font-mono text-[11px] text-(--text-secondary)">{s.href}</span>
                  <span className="ml-auto flex gap-2">
                    <button onClick={() => { setEditingSocial(s.id); setSocialForm(s) }} className="btn-ghost rounded-full px-3 py-1.5 text-xs">EDIT</button>
                    <button onClick={() => deleteSocial(s.id)} className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300">DEL</button>
                  </span>
                </div>
              ))}
            </div>
          </Shell>
        )}

        {tab === 'messages' && (
          <Shell title={`Inbox (${messages.length})`} subtitle="Contact-form submissions land here (and still open the visitor's mail app as fallback).">
            <div className="grid gap-3">
              {messages.map((m) => (
                <div key={m.id} className={`rounded-2xl border p-4 ${m.is_read ? 'border-(--card-border) opacity-80' : 'border-(--border-primary)'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{m.name}</p>
                    <a href={`mailto:${m.email}`} className="font-mono text-[11px] text-(--primary)">{m.email}</a>
                    <span className="ml-auto font-mono text-[10px] text-(--text-secondary)">{new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{m.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setRead(m.id, !m.is_read)} className="btn-ghost rounded-full px-3 py-1.5 text-xs">{m.is_read ? 'MARK UNREAD' : 'MARK READ'}</button>
                    <button onClick={() => deleteMessage(m.id)} className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300">DELETE</button>
                  </div>
                </div>
              ))}
              {!messages.length && <p className="text-sm text-(--text-secondary)">No messages yet.</p>}
            </div>
          </Shell>
        )}

        {tab === 'setup' && (
          <Shell title="Setup guide" subtitle="One-time checklist to go live with Supabase.">
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-(--text-secondary)">
              <li>Create project at supabase.com → copy <code>Project URL</code> + <code>anon public key</code> (Settings → API).</li>
              <li>Create <code>.env</code> from <code>.env.example</code> and restart <code>npm run dev</code>.</li>
              <li>SQL Editor → paste + run <code>supabase/schema.sql</code> (creates tables, RLS, seed data).</li>
              <li>Authentication → Users → Add user (your admin email + password). Sign in at <code>/admin/login</code>.</li>
              <li>Storage → New bucket <code>portfolio-images</code> → Public ON (enables dashboard image uploads).</li>
              <li>Deploy: set the same two env vars on Vercel/Netlify and redeploy.</li>
            </ol>
          </Shell>
        )}
      </main>
    </div>
  )
}
