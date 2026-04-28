import React from 'react'

export default function ServicesCard({title, description, icon: Icon, bgText}) {
    return (
        <div className="flex flex-col justify-center border-(--muted) border shadow-2xl p-10 rounded gap-2 relative bg-(--muted)/15 backdrop-blur-xl">
            <Icon className='text-2xl relative z-10' />
            <h2 className='text-2xl relative z-10'>{title}</h2>
            <p className="text-(--text-secondary) w-full relative z-10">{description}</p>
            <h1 className='text-9xl text-(--muted) absolute right-4 top-4 z-0'>{bgText}</h1>
        </div>
    )
}
