import React from 'react'


export default function Tag({ title }) {
    return (
        <p className="flex items-center gap-3 my-5 border border-(--border-secondary) w-max px-4 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-(--primary)"></span>
            <span className="text-sm text-(--text-secondary)">{title}</span>
        </p>
    )
}
