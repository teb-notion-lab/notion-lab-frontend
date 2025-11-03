import React from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 p-8">
            <div className="w-16 rounded-l-2xl overflow-hidden shadow-lg bg-slate-900">
                <Sidebar />
            </div>
            <div className="flex-1 ml-6 bg-white rounded-2xl shadow-xl p-8">
                {children}
            </div>
        </div>
    )
}
