import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { useAuth } from '@/utils/auth'

export default function ManageOrganizationPage() {
    const router = useRouter()
    const { id } = router.query
    const { user } = useAuth()
    const [organization, setOrganization] = useState(null)
    const [members, setMembers] = useState([])

    useEffect(() => {
        if (!id) return
        api.get(`/organizations/${id}/`).then(res => {
            setOrganization(res.data)
            setMembers(res.data.members)
        })
    }, [id])

    const deleteOrg = async () => {
        if (confirm("Are you sure you want to delete this organization?")) {
            await api.delete(`/organizations/${id}/`)
            router.push('/dashboard/organizations')
        }
    }

    const changeOwner = async (newOwnerId) => {
        await api.post(`/organizations/${id}/change-owner/`, { new_owner_id: newOwnerId })
        alert('Owner changed successfully!')
        router.reload()
    }

    const removeMember = async (memberId) => {
        await api.post(`/organizations/${id}/remove-member/`, { member_id: memberId })
        setMembers(members.filter(m => m.id !== memberId))
    }

    if (!organization) return <div className="p-6">Loading...</div>

    const isOwner = user?.id === organization.owner.id

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{organization.name}</h1>
            <p className="text-gray-600 mb-6">Manage your organization</p>

            {isOwner ? (
                <>
                    <h2 className="text-xl font-semibold mb-2">Members</h2>
                    <ul className="mb-4">
                        {members.map(m => (
                            <li key={m.id} className="flex justify-between border-b py-2">
                                <span>{m.name} {m.surname}</span>
                                {m.id !== organization.owner.id && (
                                    <button
                                        onClick={() => removeMember(m.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-4">
                        <button
                            onClick={deleteOrg}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Delete Organization
                        </button>

                        <select
                            onChange={(e) => changeOwner(e.target.value)}
                            className="border p-2 rounded-md"
                            defaultValue=""
                        >
                            <option value="" disabled>Change Owner...</option>
                            {members
                                .filter(m => m.id !== organization.owner.id)
                                .map(m => (
                                    <option key={m.id} value={m.id}>{m.name} {m.surname}</option>
                                ))}
                        </select>
                    </div>
                </>
            ) : (
                <p className="text-red-500">You are not the owner of this organization.</p>
            )}
        </div>
    )
}
