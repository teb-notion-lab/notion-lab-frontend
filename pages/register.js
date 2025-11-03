"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/`,
                form
            );
            if (res.status === 201) {
                alert("Registration successful! Please log in.");
                router.push("/login");
            } else {
                setError("Registration failed.");
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            setError("Registration failed. Check your details.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md w-96"
            >
                <h1 className="text-2xl font-bold mb-4">Create Account</h1>

                <input
                    type="text"
                    placeholder="First Name"
                    className="border rounded w-full p-2 mb-3"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />

                <input
                    type="text"
                    placeholder="Surname"
                    className="border rounded w-full p-2 mb-3"
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.target.value })}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="border rounded w-full p-2 mb-3"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border rounded w-full p-2 mb-3"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
