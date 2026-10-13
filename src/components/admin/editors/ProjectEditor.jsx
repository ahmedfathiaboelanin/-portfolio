import { FaEye, FaEyeSlash, FaRegStar, FaStar } from 'react-icons/fa'
import ModalSheet from '../ui/ModalSheet'
import { cx } from '../utils'

const TOGGLES = [
  { k: 'featured', label: 'Featured', icon: FaStar, off: FaRegStar },
  { k: 'is_published', label: 'Published', icon: FaEye, off: FaEyeSlash },
]

export default function ProjectEditor({
  open,
  isNew,
  form,
  setForm,
  busy,
  uploading,
  dragOver,
  setDragOver,
  fileRef,
  onSave,
  onClose,
  onUpload,
}) {
  if (!open) return null

  return (
    <ModalSheet
      wide
      title={isNew ? 'New project' : 'Edit project'}
      subtitle="Changes go live instantly when published."
      onClose={onClose}
    >
      <form onSubmit={onSave} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
          <input
            className="field"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="field"
            placeholder="Order (0 first)"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
        </div>
        <textarea
          className="field min-h-24"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <p className="text-right font-mono text-[10px] text-(--text-secondary)">
          {String(form.description || '').length} chars
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="field"
            placeholder="Live URL https://…"
            inputMode="url"
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
          />
          <input
            className="field"
            placeholder="Code URL https://github.com/…"
            inputMode="url"
            value={form.code_url}
            onChange={(e) => setForm({ ...form, code_url: e.target.value })}
          />
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            onUpload(e.dataTransfer.files?.[0])
          }}
          className={cx(
            'grid gap-3 rounded-2xl border border-dashed p-3 transition-colors sm:grid-cols-[1fr_auto]',
            dragOver ? 'border-(--primary) bg-(--primary-soft)' : 'border-(--card-border)',
          )}
        >
          <input
            className="field"
            placeholder="Image URL or upload →"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-ghost rounded-full px-4 py-2.5 text-xs font-semibold disabled:opacity-60"
          >
            {uploading ? 'UPLOADING…' : 'UPLOAD / DROP'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
          {form.image_url && (
            <div className="relative sm:col-span-2">
              <img
                src={form.image_url}
                alt="preview"
                className="aspect-video w-full rounded-xl border border-(--card-border) object-cover"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, image_url: '' })}
                className="absolute top-2 right-2 rounded-full bg-black/70 px-3 py-1.5 text-[11px] text-white"
              >
                REMOVE
              </button>
            </div>
          )}
        </div>
        <input
          className="field"
          placeholder="Tech (comma separated): React, Tailwind, Laravel"
          value={form.tech}
          onChange={(e) => setForm({ ...form, tech: e.target.value })}
        />
        <div className="flex flex-wrap gap-2">
          {TOGGLES.map((t) => {
            const on = !!form[t.k]
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => setForm({ ...form, [t.k]: !on })}
                aria-pressed={on}
                className={cx(
                  'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold',
                  on ? 'border-(--border-primary) bg-(--primary-soft)' : 'border-(--card-border) text-(--text-secondary)',
                )}
              >
                {on ? <t.icon /> : <t.off />} {t.label.toUpperCase()}
              </button>
            )
          })}
        </div>
        <div className="sticky bottom-0 flex gap-2 bg-(--surface)/90 pt-2 pb-1 backdrop-blur">
          <button disabled={busy} className="btn-primary flex-1 rounded-full px-5 py-3 text-xs font-semibold disabled:opacity-60">
            SAVE PROJECT
          </button>
          <button type="button" onClick={onClose} className="btn-ghost rounded-full px-5 py-3 text-xs font-semibold">
            CANCEL
          </button>
        </div>
      </form>
    </ModalSheet>
  )
}
