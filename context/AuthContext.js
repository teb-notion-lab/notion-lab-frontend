'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, login as apiLogin, register as apiRegister, getCurrentUser } from '@/utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // ✅ Reapply token on page load
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('nl_token') : null
        if (!token) {
            setLoading(false)
            return
        }

        // Ensure axios has the token after refresh
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        getCurrentUser(token)
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem('nl_token')
                setUser(null)
            })
            .finally(() => setLoading(false))
    }, [])

    const login = async (email, password) => {
        const res = await apiLogin({ email, password })
        const { access } = res.data

        localStorage.setItem('nl_token', access)
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`

        const userRes = await getCurrentUser(access)
        setUser(userRes.data)
    }

    const register = async (data) => {
        const res = await apiRegister(data)
        const { access } = res.data

        localStorage.setItem('nl_token', access)
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`

        const userRes = await getCurrentUser(access)
        setUser(userRes.data)
    }

    const logout = () => {
        localStorage.removeItem('nl_token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
