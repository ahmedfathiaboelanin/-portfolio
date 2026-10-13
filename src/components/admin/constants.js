import {
  FaThLarge,
  FaFolderOpen,
  FaCode,
  FaUser,
  FaShareAlt,
  FaInbox,
  FaCog,
} from 'react-icons/fa'

export const TABS = [
  { id: 'overview', label: 'Overview', short: 'Home', icon: FaThLarge },
  { id: 'projects', label: 'Projects', short: 'Work', icon: FaFolderOpen },
  { id: 'skills', label: 'Skills', short: 'Skills', icon: FaCode },
  { id: 'profile', label: 'Profile', short: 'You', icon: FaUser },
  { id: 'socials', label: 'Socials', short: 'Links', icon: FaShareAlt },
  { id: 'messages', label: 'Inbox', short: 'Inbox', icon: FaInbox },
  { id: 'setup', label: 'Setup', short: 'Setup', icon: FaCog },
]

export const PROFILE_FIELDS = [
  ['full_name', 'Full name'],
  ['role', 'Role'],
  ['tagline', 'Tag pill'],
  ['hero_title_line1', 'Hero line 1'],
  ['hero_title_line2', 'Hero line 2'],
  ['email', 'Email'],
  ['resume_url', 'Resume URL'],
  ['github_url', 'GitHub URL'],
  ['linkedin_url', 'LinkedIn URL'],
  ['years_exp', 'Years exp'],
  ['projects_count', 'Projects count'],
  ['clients_count', 'Clients count'],
]

export const SOCIAL_ICONS = ['github', 'linkedin', 'facebook', 'gmail', 'twitter', 'instagram', 'globe']

export const SKILL_CATEGORIES = ['frontend', 'backend', 'tool']

export const emptyProject = {
  title: '',
  description: '',
  image_url: '',
  live_url: '',
  code_url: '',
  tech: '',
  featured: false,
  is_published: true,
  sort_order: 0,
}

export const emptySkill = {
  title: '',
  percentage: 80,
  category: 'frontend',
  sort_order: 0,
  is_visible: true,
}

export const emptySocial = {
  label: '',
  href: '',
  icon: 'github',
  sort_order: 0,
  is_visible: true,
}
