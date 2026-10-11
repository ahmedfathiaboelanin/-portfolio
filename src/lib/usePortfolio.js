import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'
import FALLBACK_PROJECTS from '../static/constants/projects'

// ── Fallback content (matches previous hard-coded sections) ──
const FALLBACK_FRONTEND = [
  { title: 'HTML', percentage: '95%' },
  { title: 'CSS', percentage: '90%' },
  { title: 'JS', percentage: '90%' },
  { title: 'REACT JS', percentage: '90%' },
  { title: 'TAILWIND CSS', percentage: '90%' },
  { title: 'NEXT JS', percentage: '80%' },
]
const FALLBACK_BACKEND = [
  { title: 'NODE JS', percentage: '85%' },
  { title: 'EXPRESS JS', percentage: '80%' },
  { title: 'MONGODB', percentage: '80%' },
  { title: 'LARAVEL', percentage: '80%' },
  { title: 'MYSQL', percentage: '75%' },
]
const FALLBACK_TOOLS = ['REACT ICONS', 'ZUSTAND', 'MONGOOSE', 'JWT', 'VS CODE', 'POSTMAN', 'XAMPP', 'GIT']

const FALLBACK_PROFILE = {
  full_name: 'Ahmed Fathi',
  role: 'Frontend Developer',
  tagline: "Hello, I'm Ahmed — Frontend Developer",
  hero_title_line1: 'Building the future,',
  hero_title_line2: 'one line at a time',
  hero_description:
    'A passionate Frontend Developer with a knack for crafting engaging, fast and user-friendly web experiences.',
  years_exp: '1+',
  projects_count: '10+',
  clients_count: '3+',
  email: 'ahmedfathiaboelanin@gmail.com',
  resume_url: 'Ahmed_Fathi.pdf',
  github_url: 'https://github.com/ahmedfathiaboelanin',
  linkedin_url: 'https://www.linkedin.com/in/ahmed-fathi-1a4593247/',
}

const FALLBACK_SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmed-fathi-1a4593247/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/ahmedfathiaboelanin', icon: 'github' },
  { label: 'Facebook', href: 'https://www.facebook.com/ahmed.fathi.912811', icon: 'facebook' },
]

function normalizeProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    image: row.image_url ?? '',
    link: row.live_url ?? '',
    code: row.code_url ?? '',
    tech: row.tech ?? [],
    featured: !!row.featured,
    sort_order: row.sort_order ?? 0,
    is_published: row.is_published ?? true,
  }
}

export function useProfile() {
  const [profile, setProfile] = useState(FALLBACK_PROFILE)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase
      .from('profiles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return
        if (!error && data) setProfile({ ...FALLBACK_PROFILE, ...data })
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return { profile, loading }
}

export function useProjects({ publishedOnly = true } = {}) {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    if (!supabase) return
    let alive = true
    setLoading(true)
    let query = supabase.from('projects').select('*').order('sort_order').order('created_at', { ascending: false })
    if (publishedOnly) query = query.eq('is_published', true)
    query.then(({ data, error }) => {
      if (!alive) return
      if (!error && data && data.length) setProjects(data.map(normalizeProject))
      // keep fallback when table is empty so the site never looks broken
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [publishedOnly, refreshKey])

  return { projects, loading, refresh }
}

export function useSkills() {
  const [state, setState] = useState({ frontend: FALLBACK_FRONTEND, backend: FALLBACK_BACKEND, tools: FALLBACK_TOOLS })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase
      .from('skills')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!alive) return
        if (!error && data && data.length) {
          const frontend = data
            .filter((s) => s.category === 'frontend')
            .map((s) => ({ id: s.id, title: s.title, percentage: `${s.percentage}%` }))
          const backend = data
            .filter((s) => s.category === 'backend')
            .map((s) => ({ id: s.id, title: s.title, percentage: `${s.percentage}%` }))
          const tools = data.filter((s) => s.category === 'tool').map((s) => s.title)
          setState({
            frontend: frontend.length ? frontend : FALLBACK_FRONTEND,
            backend: backend.length ? backend : FALLBACK_BACKEND,
            tools: tools.length ? tools : FALLBACK_TOOLS,
          })
        }
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return { ...state, loading }
}

export function useSocials() {
  const [socials, setSocials] = useState(FALLBACK_SOCIALS)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase
      .from('socials')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!alive) return
        if (!error && data && data.length) setSocials(data)
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return { socials, loading }
}

export async function submitContactMessage({ name, email, message }) {
  if (!supabase) return { ok: false, reason: 'not-configured' }
  const { error } = await supabase.from('messages').insert([{ name, email, message }])
  if (error) return { ok: false, reason: error.message }
  return { ok: true }
}
