import ModalSheet from '../ui/ModalSheet'
import { SKILL_CATEGORIES } from '../constants'

export default function SkillEditor({ open, isNew, form, setForm, onSave, onClose }) {
  if (!open) return null

  return (
    <ModalSheet title={isNew ? 'New skill' : 'Edit skill'} onClose={onClose}>
      <form onSubmit={onSave} className="grid gap-3">
        <input
          className="field"
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-widest text-(--text-secondary)">LEVEL {form.percentage}%</span>
            <input
              className="field"
              type="number"
              min="0"
              max="100"
              value={form.percentage}
              onChange={(e) => setForm({ ...form, percentage: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-widest text-(--text-secondary)">CATEGORY</span>
            <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <input
          className="field accent-(--primary)"
          type="range"
          min="0"
          max="100"
          value={form.percentage}
          onChange={(e) => setForm({ ...form, percentage: e.target.value })}
          aria-label="Skill level"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="field"
            type="number"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={form.is_visible}
              onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
              className="h-4 w-4 accent-(--primary)"
            />
            Visible on site
          </label>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1 rounded-full px-5 py-3 text-xs font-semibold">SAVE SKILL</button>
          <button type="button" onClick={onClose} className="btn-ghost rounded-full px-5 py-3 text-xs font-semibold">
            CANCEL
          </button>
        </div>
      </form>
    </ModalSheet>
  )
}
