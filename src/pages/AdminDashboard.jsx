import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { TABS } from '../components/admin/constants'
import { buildBackup, copyText, cx, downloadFile, toCSV } from '../components/admin/utils'
import { useToasts } from '../hooks/admin/useToasts'
import { useActivityLog } from '../hooks/admin/useActivityLog'
import { useAdminData } from '../hooks/admin/useAdminData'
import { useProjectsCrud } from '../hooks/admin/useProjectsCrud'
import { useSkillsCrud } from '../hooks/admin/useSkillsCrud'
import { useSocialsCrud } from '../hooks/admin/useSocialsCrud'
import { useMessagesActions } from '../hooks/admin/useMessagesActions'
import { usePaletteResults } from '../hooks/admin/usePaletteResults'
import Toasts from '../components/admin/ui/Toasts'
import ConfirmDialog from '../components/admin/ui/ConfirmDialog'
import CommandPalette from '../components/admin/ui/CommandPalette'
import { DashboardSkeleton } from '../components/admin/ui/Skeleton'
import Sidebar from '../components/admin/layout/Sidebar'
import MobileDrawer from '../components/admin/layout/MobileDrawer'
import Topbar from '../components/admin/layout/Topbar'
import BottomNav from '../components/admin/layout/BottomNav'
import StatusStrip from '../components/admin/layout/StatusStrip'
import SupabaseMissing from '../components/admin/layout/SupabaseMissing'
import OverviewTab from '../components/admin/tabs/OverviewTab'
import ProjectsTab from '../components/admin/tabs/ProjectsTab'
import SkillsTab from '../components/admin/tabs/SkillsTab'
import ProfileTab from '../components/admin/tabs/ProfileTab'
import SocialsTab from '../components/admin/tabs/SocialsTab'
import MessagesTab from '../components/admin/tabs/MessagesTab'
import SetupTab from '../components/admin/tabs/SetupTab'
import ProjectEditor from '../components/admin/editors/ProjectEditor'
import SkillEditor from '../components/admin/editors/SkillEditor'
import SocialEditor from '../components/admin/editors/SocialEditor'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // ── session + chrome state ──
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState(() => localStorage.getItem('admin-tab') || 'overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('admin-sb') === 'collapsed')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLight, setIsLight] = useState(() => document.body.classList.contains('light-mode'))
  const [confirm, setConfirm] = useState(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')

  // ── shared hooks ──
  const { toasts, pushToast, dismissToast } = useToasts()
  const { activity, logActivity } = useActivityLog()
  const data = useAdminData(pushToast)
  const {
    projects, skills, socials, messages, setMessages,
    profile, profileForm, setProfileForm,
    busy, setBusy, initialLoading, lastSynced, loadAll,
    stats, completeness, weekActivity, maxWeek, skillDist, publishedPct,
  } = data

  const projectsCrud = useProjectsCrud({ pushToast, logActivity, loadAll, setBusy, setConfirm })
  const skillsCrud = useSkillsCrud({ pushToast, logActivity, loadAll, setBusy, setConfirm })
  const socialsCrud = useSocialsCrud({ pushToast, loadAll, setConfirm })
  const msgActions = useMessagesActions({ messages, setMessages, pushToast, setConfirm })

  // ── auth guard ──
  useEffect(() => {
    if (!supabase) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data: d }) => {
      if (!d.session) navigate('/admin/login', { replace: true })
      else setSession(d.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate('/admin/login', { replace: true })
      else setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (session) loadAll()
  }, [session, loadAll])

  useEffect(() => {
    localStorage.setItem('admin-tab', tab)
    setDrawerOpen(false)
  }, [tab])

  useEffect(() => {
    localStorage.setItem('admin-sb', sidebarCollapsed ? 'collapsed' : 'open')
  }, [sidebarCollapsed])

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLight)
  }, [isLight])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setDrawerOpen(false)
        setConfirm(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const locked =
      drawerOpen || paletteOpen || confirm || projectsCrud.editingProject || skillsCrud.editingSkill || socialsCrud.editingSocial
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, paletteOpen, confirm, projectsCrud.editingProject, skillsCrud.editingSkill, socialsCrud.editingSocial])

  // ── page-level actions ──
  const signOut = useCallback(async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }, [navigate])

  const openPalette = useCallback(() => {
    setPaletteQuery('')
    setPaletteOpen(true)
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    setBusy(true)
    const payload = { ...profileForm }
    delete payload.id
    delete payload.created_at
    const res = profile?.id
      ? await supabase.from('profiles').update(payload).eq('id', profile.id).select()
      : await supabase.from('profiles').insert([payload]).select()
    setBusy(false)
    if (res.error) pushToast(res.error.message, 'error')
    else {
      logActivity('Updated profile / hero')
      pushToast('Profile saved — refresh the homepage to see it.', 'success')
      loadAll(true)
    }
  }

  const exportBackup = useCallback(() => {
    downloadFile(`portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`, buildBackup({ projects, skills, socials, profile }))
    pushToast('Backup JSON downloaded.', 'success')
    logActivity('Exported JSON backup')
  }, [projects, skills, socials, profile, pushToast, logActivity])

  const exportMessagesCSV = useCallback(
    (rows) => {
      const csv = toCSV([['name', 'email', 'message', 'is_read', 'created_at'], ...rows.map((m) => [m.name, m.email, m.message, m.is_read, m.created_at])])
      downloadFile(`messages-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv')
      pushToast('Messages CSV downloaded.', 'success')
    },
    [pushToast],
  )

  const handleCopy = useCallback(
    async (text, label) => {
      const ok = await copyText(text)
      pushToast(ok ? `${label} copied.` : 'Copy failed — select the text manually.', ok ? 'success' : 'error')
    },
    [pushToast],
  )

  const paletteActions = useMemo(
    () => ({
      goToTab: (id) => setTab(id),
      newProject: () => {
        setTab('projects')
        projectsCrud.startEditProject(null)
      },
      newSkill: () => {
        setTab('skills')
        skillsCrud.startEditSkill(null)
      },
      markAllRead: () => msgActions.markAllRead(),
      refresh: () => loadAll(),
      editProject: (p) => {
        setTab('projects')
        projectsCrud.startEditProject(p)
      },
      editSkill: (s) => {
        setTab('skills')
        skillsCrud.startEditSkill(s)
      },
    }),
    [projectsCrud, skillsCrud, msgActions, loadAll],
  )

  const paletteResults = usePaletteResults({
    query: paletteQuery,
    projects,
    skills,
    messages,
    unread: stats.unread,
    actions: paletteActions,
  })

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0]

  if (checking) {
    return <main className="grid min-h-screen place-items-center bg-(--neutral) text-(--text-secondary)">Checking session…</main>
  }
  if (!isSupabaseConfigured) return <SupabaseMissing />

  return (
    <div className="min-h-screen bg-(--neutral) text-(--text-primary)">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        email={session?.user?.email}
        lastSynced={lastSynced}
        isLight={isLight}
        onToggleTheme={() => setIsLight((v) => !v)}
        onSignOut={signOut}
        onOpenPalette={openPalette}
        onExportBackup={exportBackup}
        activeTab={tab}
        onSelectTab={setTab}
        stats={stats}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        email={session?.user?.email}
        activeTab={tab}
        onSelectTab={setTab}
        stats={stats}
        isLight={isLight}
        onToggleTheme={() => setIsLight((v) => !v)}
        onRefresh={() => loadAll()}
        busy={busy}
        onSignOut={signOut}
        onOpenPalette={() => {
          setDrawerOpen(false)
          openPalette()
        }}
      />

      <div className={cx(sidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[264px]')}>
        <Topbar
          activeTab={activeTab}
          onSelectTab={setTab}
          busy={busy}
          unread={stats.unread}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenPalette={openPalette}
          onRefresh={() => loadAll()}
          onSignOut={signOut}
        />

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-5 pb-28 sm:px-5 sm:py-7 lg:pb-10">
          <StatusStrip lastSynced={lastSynced} unread={stats.unread} onOpenInbox={() => setTab('messages')} />

          {initialLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {tab === 'overview' && (
                <OverviewTab
                  stats={stats}
                  publishedPct={publishedPct}
                  skillDist={skillDist}
                  weekActivity={weekActivity}
                  maxWeek={maxWeek}
                  completeness={completeness}
                  messages={messages}
                  activity={activity}
                  onSelectTab={setTab}
                  onNewProject={() => {
                    setTab('projects')
                    projectsCrud.startEditProject(null)
                  }}
                  onNewSkill={() => {
                    setTab('skills')
                    skillsCrud.startEditSkill(null)
                  }}
                  onExportBackup={exportBackup}
                  onOpenPalette={openPalette}
                  onMarkAllRead={msgActions.markAllRead}
                />
              )}

              {tab === 'projects' && (
                <ProjectsTab
                  projects={projects}
                  onNew={() => projectsCrud.startEditProject(null)}
                  onEdit={projectsCrud.startEditProject}
                  onTogglePublish={projectsCrud.togglePublish}
                  onDuplicate={projectsCrud.duplicateProject}
                  onDelete={projectsCrud.askDeleteProject}
                />
              )}

              {tab === 'skills' && (
                <SkillsTab
                  skills={skills}
                  onNew={() => skillsCrud.startEditSkill(null)}
                  onEdit={skillsCrud.startEditSkill}
                  onDelete={skillsCrud.askDeleteSkill}
                />
              )}

              {tab === 'profile' && (
                <ProfileTab
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  completeness={completeness}
                  busy={busy}
                  onSave={saveProfile}
                  onExportBackup={exportBackup}
                />
              )}

              {tab === 'socials' && (
                <SocialsTab
                  socials={socials}
                  onNew={socialsCrud.startNewSocial}
                  onEdit={socialsCrud.startEditSocial}
                  onDelete={socialsCrud.askDeleteSocial}
                />
              )}

              {tab === 'messages' && (
                <MessagesTab
                  messages={messages}
                  unread={stats.unread}
                  onToggleRead={msgActions.setRead}
                  onDelete={msgActions.askDeleteMessage}
                  onCopy={(email) => handleCopy(email, 'Email')}
                  onMarkAllRead={msgActions.markAllRead}
                  onDeleteRead={msgActions.deleteRead}
                  onExportCSV={exportMessagesCSV}
                />
              )}

              {tab === 'setup' && (
                <SetupTab
                  counts={[
                    ['Projects', projects.length],
                    ['Skills', skills.length],
                    ['Socials', socials.length],
                    ['Messages', messages.length],
                  ]}
                  onCopySchemaPath={() => handleCopy('supabase/schema.sql', 'Schema path')}
                  onExportBackup={exportBackup}
                  onDeleteRead={msgActions.deleteRead}
                />
              )}
            </>
          )}
        </main>

        <BottomNav
          activeTabId={tab}
          unread={stats.unread}
          onSelectTab={setTab}
          onOpenMenu={() => setDrawerOpen(true)}
        />
      </div>

      <CommandPalette
        open={paletteOpen}
        query={paletteQuery}
        setQuery={setPaletteQuery}
        results={paletteResults}
        onClose={() => setPaletteOpen(false)}
        onPick={(r) => {
          setPaletteOpen(false)
          setPaletteQuery('')
          r.run()
        }}
      />
      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={() => confirm?.onConfirm?.()} />
      <Toasts toasts={toasts} dismiss={dismissToast} />

      <ProjectEditor
        open={!!projectsCrud.editingProject}
        isNew={projectsCrud.editingProject === 'new'}
        form={projectsCrud.projectForm}
        setForm={projectsCrud.setProjectForm}
        busy={busy}
        uploading={projectsCrud.uploading}
        dragOver={projectsCrud.dragOver}
        setDragOver={projectsCrud.setDragOver}
        fileRef={projectsCrud.fileRef}
        onSave={projectsCrud.saveProject}
        onClose={projectsCrud.closeEditor}
        onUpload={projectsCrud.uploadImageFile}
      />

      <SkillEditor
        open={!!skillsCrud.editingSkill}
        isNew={skillsCrud.editingSkill === 'new'}
        form={skillsCrud.skillForm}
        setForm={skillsCrud.setSkillForm}
        onSave={skillsCrud.saveSkill}
        onClose={() => skillsCrud.setEditingSkill(null)}
      />

      <SocialEditor
        open={!!socialsCrud.editingSocial}
        isNew={socialsCrud.editingSocial === 'new'}
        form={socialsCrud.socialForm}
        setForm={socialsCrud.setSocialForm}
        onSave={socialsCrud.saveSocial}
        onClose={() => socialsCrud.setEditingSocial(null)}
      />
    </div>
  )
}
