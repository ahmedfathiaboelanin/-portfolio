import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { emptySocial } from '../../components/admin/constants'

export function useSocialsCrud({ pushToast, loadAll, setConfirm }) {
  const [socialForm, setSocialForm] = useState(emptySocial)
  const [editingSocial, setEditingSocial] = useState(null)

  const startNewSocial = () => {
    setEditingSocial('new')
    setSocialForm(emptySocial)
  }

  const startEditSocial = (row) => {
    setEditingSocial(row.id)
    setSocialForm(row)
  }

  const saveSocial = async (e) => {
    e.preventDefault()
    const payload = { ...socialForm, sort_order: Number(socialForm.sort_order) || 0 }
    if (!payload.label || !payload.href) {
      pushToast('Social label + URL required.', 'error')
      return
    }
    const res =
      editingSocial === 'new'
        ? await supabase.from('socials').insert([payload]).select()
        : await supabase.from('socials').update(payload).eq('id', editingSocial).select()
    if (res.error) {
      pushToast(res.error.message, 'error')
      return
    }
    setEditingSocial(null)
    setSocialForm(emptySocial)
    pushToast('Social link saved.', 'success')
    loadAll(true)
  }

  const askDeleteSocial = (id, label) =>
    setConfirm({
      title: 'Delete social link?',
      message: `“${label}” will be removed from the site footer.`,
      onConfirm: async () => {
        setConfirm(null)
        const { error } = await supabase.from('socials').delete().eq('id', id)
        if (error) pushToast(error.message, 'error')
        else loadAll(true)
      },
    })

  return {
    socialForm,
    setSocialForm,
    editingSocial,
    setEditingSocial,
    startNewSocial,
    startEditSocial,
    saveSocial,
    askDeleteSocial,
  }
}
