import { useCallback, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PROFILE_FIELDS } from '../../components/admin/constants'

export function useAdminData(pushToast) {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [socials, setSocials] = useState([])
  const [messages, setMessages] = useState([])
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [lastSynced, setLastSynced] = useState(null)

  const loadAll = useCallback(
    async (silent) => {
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
        if (pr.data) {
          setProfile(pr.data)
          setProfileForm(pr.data)
        }
        setLastSynced(new Date())
        if (p.error || s.error || m.error) {
          pushToast('Some tables failed to load — did you run supabase/schema.sql?', 'error')
        }
      } catch (e) {
        pushToast(String(e.message ?? e), 'error')
      } finally {
        setBusy(false)
        setInitialLoading(false)
      }
    },
    [pushToast],
  )

  const stats = useMemo(
    () => ({
      projects: projects.length,
      published: projects.filter((p) => p.is_published).length,
      drafts: projects.filter((p) => !p.is_published).length,
      featured: projects.filter((p) => p.featured).length,
      skills: skills.length,
      unread: messages.filter((m) => !m.is_read).length,
    }),
    [projects, skills, messages],
  )

  const completeness = useMemo(() => {
    if (!profileForm) return 0
    const keys = [...PROFILE_FIELDS.map(([k]) => k), 'hero_description']
    const filled = keys.filter((k) => String(profileForm[k] ?? '').trim() !== '').length
    return Math.round((filled / keys.length) * 100)
  }, [profileForm])

  const weekActivity = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      return d
    })
    return days.map((d) => {
      const next = new Date(d)
      next.setDate(d.getDate() + 1)
      const count = messages.filter((m) => {
        const t = new Date(m.created_at)
        return t >= d && t < next
      }).length
      return {
        label: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        count,
        full: d.toLocaleDateString(),
      }
    })
  }, [messages])

  const maxWeek = useMemo(() => Math.max(1, ...weekActivity.map((d) => d.count)), [weekActivity])

  const skillDist = useMemo(() => {
    const cats = ['frontend', 'backend', 'tool']
    return cats.map((c) => {
      const rows = skills.filter((s) => s.category === c)
      const avg = rows.length
        ? Math.round(rows.reduce((a, s) => a + Number(s.percentage || 0), 0) / rows.length)
        : 0
      return { cat: c, count: rows.length, avg }
    })
  }, [skills])

  const publishedPct = stats.projects ? Math.round((stats.published / stats.projects) * 100) : 0

  return {
    projects,
    setProjects,
    skills,
    setSkills,
    socials,
    setSocials,
    messages,
    setMessages,
    profile,
    setProfile,
    profileForm,
    setProfileForm,
    busy,
    setBusy,
    initialLoading,
    setInitialLoading,
    lastSynced,
    loadAll,
    stats,
    completeness,
    weekActivity,
    maxWeek,
    skillDist,
    publishedPct,
  }
}
