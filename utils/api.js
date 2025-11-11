import axios from "axios";
import Cookies from "js-cookie";

//const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: '/api', //changed from API
    headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
    const token = Cookies.get("nl_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = (data) => api.post("/auth/register/", data);
export const login = (data) => api.post("/auth/token/", data);
export const getCurrentUser = () => api.get("/auth/user/");

export default api

// --- AUTH ---
// --- PROJECTS ---
export const getProjects = (token) =>
    api.get('/projects/', {
        headers: { Authorization: `Bearer ${token}` },
    });

export const createProject = (token, data) =>
    api.post('/projects/', data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// --- TASKS ---
export const getTasks = (token, projectId) =>
    api.get(`/tasks/?project=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const createTask = async (token, data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tasks/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to create task: ${err}`)
    }

    return await res.json()
}

export async function updateTask(token, id, data) {
    const res = await fetch(`http://localhost:8000/api/tasks/${id}/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Failed to update task: ${err}`)
    }

    return await res.json()
}

export const getOrganizations = (token) =>
    api.get('/organizations/', { headers: { Authorization: `Bearer ${token}` } });

export const createOrganization = (token, data) =>
    api.post('/organizations/', data, { headers: { Authorization: `Bearer ${token}` } });

// --- ORGANIZATIONS ---
export const inviteMember = (token, organization_id, email) =>
    api.post(
        "/invitations/invite/",
        { organization_id, email },
        { headers: { Authorization: `Bearer ${token}` } }
    )

export const getInvitations = (token) =>
    api.get("/invitations/", {
        headers: { Authorization: `Bearer ${token}` },
    })

export const respondToInvitation = (token, action, tokenValue) =>
    api.post(
        `/invitations/${action}/`,
        { token: tokenValue },
        { headers: { Authorization: `Bearer ${token}` } }
    )
