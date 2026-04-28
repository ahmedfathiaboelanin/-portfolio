import React from 'react'

export default function ToolTag({ title }) {
    return (
        <div className="flex items-center gap-3 border border-(--border-secondary) w-max px-4 py-2 rounded">
            <span className="h-2 w-2 rounded-full bg-(--primary)"></span>
            <span className="text-sm text-(--text-secondary)">{title}</span>
        </div>
    )
}
