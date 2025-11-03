import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault(); setError(null)
    try {
      await login(email, password)
      router.push('/')
    } catch (err) { setError(err.response?.data?.message || 'Login failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded" />
          {error && <div className="text-red-500">{error}</div>}
          <button className="w-full p-3 bg-slate-900 text-white rounded">Sign in</button>
        </form>
        <div className="mt-4 text-sm text-center">Don't have an account? <a className="text-blue-600" href="/register">Register</a></div>
      </div>
    </div>
  )
}
