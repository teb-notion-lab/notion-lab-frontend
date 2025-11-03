'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import api from './api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load user from cookie on mount
    useEffect(() => {
        const token = Cookies.get('nl_token')
        if (!token) {
            setLoading(false)
            return
        }

        api
            .get('/auth/user/')
            .then((res) => setUser(res.data))
            .catch(() => {
                Cookies.remove('nl_token')
                setUser(null)
            })
            .finally(() => setLoading(false))
    }, [])

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/token/', { email, password })
            const { access } = res.data

            if (!access) throw new Error('No access token returned')

            // Store JWT securely in cookie
            Cookies.set('nl_token', access, { expires: 7, secure: true, sameSite: 'strict' })
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`

            const userRes = await api.get('/auth/user/')
            setUser(userRes.data)

            return userRes.data
        } catch (err) {
            console.error('Login failed:', err.response?.data || err.message)
            throw err
        }
    }

    const register = async (payload) => {
        await api.post('/auth/register/', payload)
        return await login(payload.email, payload.password)
    }

    const logout = () => {
        Cookies.remove('nl_token')
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
