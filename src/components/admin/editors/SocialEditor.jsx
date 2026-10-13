import ModalSheet from '../ui/ModalSheet'
import { SOCIAL_ICONS } from '../constants'

export default function SocialEditor({ open, isNew, form, setForm, onSave, onClose }) {
  if (!open) return null

  return (
    <ModalSheet title={isNew ? 'New social link' : 'Edit social link'} onClose={onClose}>
      <form onSubmit={onSave} className="grid gap-3">
        <input
          className="field"
          placeholder="Label * (e.g. GitHub)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="field"
          placeholder="https://…"
          inputMode="url"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <select className="field" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {SOCIAL_ICONS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <input
            className="field"
            type="number"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={!!form.is_visible}
            onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
            className="h-4 w-4 accent-(--primary)"
          />
          Visible on site
        </label>
        <div className="flex gap-2">
          <button className="btn-primary flex-1 rounded-full px-5 py-3 text-xs font-semibold">
            {isNew ? 'ADD LINK' : 'UPDATE LINK'}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost rounded-full px-5 py-3 text-xs font-semibold">
            CANCEL
          </button>
        </div>
      </form>
    </ModalSheet>
  )
}
