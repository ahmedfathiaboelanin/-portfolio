import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { emptyProject } from '../../components/admin/constants'

export function useProjectsCrud({ pushToast, logActivity, loadAll, setBusy, setConfirm }) {
  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const startEditProject = (row) => {
    setEditingProject(row?.id ?? 'new')
    setProjectForm(row ? { ...emptyProject, ...row, tech: (row.tech ?? []).join(', ') } : emptyProject)
  }

  const closeEditor = () => {
    setEditingProject(null)
    setProjectForm(emptyProject)
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
    if (!payload.title) {
      pushToast('Project title is required.', 'error')
      return
    }
    setBusy(true)
    const res =
      editingProject === 'new'
        ? await supabase.from('projects').insert([payload]).select()
        : await supabase.from('projects').update(payload).eq('id', editingProject).select()
    setBusy(false)
    if (res.error) {
      pushToast(res.error.message, 'error')
      return
    }
    closeEditor()
    logActivity(`${editingProject === 'new' ? 'Created' : 'Updated'} project “${payload.title}”`)
    pushToast('Project saved.', 'success')
    loadAll(true)
  }

  const askDeleteProject = (id, title) =>
    setConfirm({
      title: 'Delete project?',
      message: `“${title}” will be permanently removed from the portfolio.`,
      onConfirm: async () => {
        setConfirm(null)
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) pushToast(error.message, 'error')
        else {
          logActivity(`Deleted project “${title}”`)
          pushToast('Project deleted.', 'success')
          loadAll(true)
        }
      },
    })

  const togglePublish = async (p) => {
    const { error } = await supabase.from('projects').update({ is_published: !p.is_published }).eq('id', p.id)
    if (error) pushToast(error.message, 'error')
    else {
      logActivity(`${p.is_published ? 'Unpublished' : 'Published'} “${p.title}”`)
      loadAll(true)
    }
  }

  const duplicateProject = async (p) => {
    const { id: _id, created_at: _created, ...rest } = p
    const { error } = await supabase
      .from('projects')
      .insert([{ ...rest, title: `${p.title} (copy)`, is_published: false }])
      .select()
    if (error) pushToast(error.message, 'error')
    else {
      logActivity(`Duplicated “${p.title}”`)
      pushToast('Project duplicated as draft.', 'success')
      loadAll(true)
    }
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

  return {
    editingProject,
    projectForm,
    setProjectForm,
    uploading,
    dragOver,
    setDragOver,
    fileRef,
    startEditProject,
    closeEditor,
    saveProject,
    askDeleteProject,
    togglePublish,
    duplicateProject,
    uploadImageFile,
  }
}
