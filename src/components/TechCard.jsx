import React from 'react'

export default function TechCard({title, percentage}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap w-full justify-between">
                <h4 className='text-(--text-primary)'>{title}</h4>
                <span className='text-(--text-secondary)'>{percentage}</span>
            </div>
            <div className="w-full h-1 bg-(--muted) rounded-full mt-1">
                <div className={`h-full bg-(--secondary) rounded-full`}
                    style={{ width: percentage }}
                ></div>
            </div>
        </div>
    )
}
