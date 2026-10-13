import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { emptySkill } from '../../components/admin/constants'

export function useSkillsCrud({ pushToast, logActivity, loadAll, setBusy, setConfirm }) {
  const [editingSkill, setEditingSkill] = useState(null)
  const [skillForm, setSkillForm] = useState(emptySkill)

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
    if (!payload.title) {
      pushToast('Skill title is required.', 'error')
      return
    }
    setBusy(true)
    const res =
      editingSkill === 'new'
        ? await supabase.from('skills').insert([payload]).select()
        : await supabase.from('skills').update(payload).eq('id', editingSkill).select()
    setBusy(false)
    if (res.error) {
      pushToast(res.error.message, 'error')
      return
    }
    setEditingSkill(null)
    setSkillForm(emptySkill)
    logActivity(`Saved skill “${payload.title}”`)
    pushToast('Skill saved.', 'success')
    loadAll(true)
  }

  const askDeleteSkill = (id, title) =>
    setConfirm({
      title: 'Delete skill?',
      message: `“${title}” will be removed.`,
      onConfirm: async () => {
        setConfirm(null)
        const { error } = await supabase.from('skills').delete().eq('id', id)
        if (error) pushToast(error.message, 'error')
        else loadAll(true)
      },
    })

  return {
    editingSkill,
    setEditingSkill,
    skillForm,
    setSkillForm,
    startEditSkill,
    saveSkill,
    askDeleteSkill,
  }
}
