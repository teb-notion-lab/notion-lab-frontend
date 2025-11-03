import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Icon = ({ href, children }) => {
    const path = usePathname()
    const isActive = path === href

    return (
        <Link
            href={href}
            className={`p-4 flex items-center justify-center rounded-xl transition 
        ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
            <span className="text-white text-xl">{children}</span>
        </Link>
    )
}

export default function Sidebar() {
    return (
        <nav className="flex flex-col h-full items-center py-6 gap-6 text-white bg-gray-900">
            <Icon href="/dashboard">🏠</Icon>
            <Icon href="/dashboard/projects">📅</Icon>
            <Icon href="/dashboard/organizations">🏢</Icon> {/* 🏢 Organizations */}
            <Icon href="/dashboard/invitations">📩</Icon>
            <Icon href="/dashboard/tasks">📊</Icon>
            <Icon href="/dashboard/new">➕</Icon>
            <div className="mt-auto mb-6 text-sm cursor-pointer hover:opacity-75">⚙️</div>
        </nav>
    )
}
