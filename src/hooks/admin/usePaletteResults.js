import { useMemo } from 'react'
import { FaCheckDouble, FaCode, FaEnvelope, FaFolderOpen, FaPlus, FaSync } from 'react-icons/fa'
import { TABS } from '../../components/admin/constants'

export function usePaletteResults({ query, projects, skills, messages, unread, actions }) {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = []
    const match = (s) => !q || s.toLowerCase().includes(q)

    TABS.forEach((t) => {
      if (match(`go to ${t.label} open ${t.label}`)) {
        out.push({
          key: `tab-${t.id}`,
          type: 'Go to',
          label: `Open ${t.label}`,
          hint: `Switch to ${t.label} tab`,
          icon: t.icon,
          run: () => actions.goToTab(t.id),
        })
      }
    })
    if (match('new project add project')) {
      out.push({ key: 'new-project', type: 'Action', label: 'New project', hint: 'Create a portfolio project', icon: FaPlus, run: actions.newProject })
    }
    if (match('new skill add skill')) {
      out.push({ key: 'new-skill', type: 'Action', label: 'New skill', hint: 'Add a skill or tool', icon: FaPlus, run: actions.newSkill })
    }
    if (match('mark all read inbox')) {
      out.push({ key: 'read-all', type: 'Action', label: 'Mark all messages read', hint: `${unread} unread`, icon: FaCheckDouble, run: actions.markAllRead })
    }
    if (match('refresh reload sync')) {
      out.push({ key: 'refresh', type: 'Action', label: 'Refresh data', hint: 'Reload from Supabase', icon: FaSync, run: actions.refresh })
    }
    projects
      .filter((p) => match(p.title))
      .slice(0, 4)
      .forEach((p) =>
        out.push({
          key: `p-${p.id}`,
          type: 'Project',
          label: p.title,
          hint: `Edit project · ${p.is_published ? 'published' : 'draft'}`,
          icon: FaFolderOpen,
          run: () => actions.editProject(p),
        }),
      )
    skills
      .filter((s) => match(s.title))
      .slice(0, 3)
      .forEach((s) =>
        out.push({
          key: `s-${s.id}`,
          type: 'Skill',
          label: s.title,
          hint: `Edit skill · ${s.category} ${s.percentage}%`,
          icon: FaCode,
          run: () => actions.editSkill(s),
        }),
      )
    messages
      .filter((m) => match(`${m.name} ${m.message}`))
      .slice(0, 3)
      .forEach((m) =>
        out.push({
          key: `m-${m.id}`,
          type: 'Message',
          label: `${m.name} — ${m.message.slice(0, 42)}`,
          hint: m.email,
          icon: FaEnvelope,
          run: () => actions.goToTab('messages'),
        }),
      )
    return out.slice(0, 12)
  }, [query, projects, skills, messages, unread, actions])
}
