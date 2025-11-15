'use client'
import { useEffect, useState } from 'react'
import { getOrganizations, createOrganization, inviteMember } from '@/utils/api'
import { useAuth } from '@/utils/auth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import OrganizationModal from '@/components/OrganizationModal'
import InviteMemberModal from '@/components/InviteMemberModal'
import { Plus, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function OrganizationsPage() {
    const { user } = useAuth()
    const [orgs, setOrgs] = useState([])
    const [open, setOpen] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState(null)
    const router = useRouter()

    // Fetch organizations
    useEffect(() => {
        getOrganizations()
            .then((res) => setOrgs(res.data))
            .catch((err) => console.error('Error fetching orgs:', err))
    }, [])

    // Create new organization
    const handleCreate = async (name) => {
        const token = localStorage.getItem('nl_token')
        try {
            const res = await createOrganization(token, { name })
            setOrgs((prev) => [...prev, res.data])
            setOpen(false)
        } catch (error) {
            console.error('Error creating organization:', error)
        }
    }

    // Invite a new member
    const handleInvite = async (email) => {
        const token = localStorage.getItem('nl_token')
        if (!selectedOrg) return alert('No organization selected')

        try {
            await inviteMember(token, selectedOrg.id, email)
            alert(`✅ Invitation sent to ${email}`)
        } catch (err) {
            console.error('Error sending invite:', err)
            alert('❌ Failed to send invitation')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Organizations</h1>
                <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                    <Plus size={16} /> Create Organization
                </Button>
            </div>

            {/* Organization list */}
            <div className="grid gap-4">
                {orgs.length > 0 ? (
                    orgs.map((org) => (
                        <Card key={org.id}>
                            <CardHeader>
                                <CardTitle
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => router.push(`/dashboard/organization/${org.id}`)}
                                >
                                    {org.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <p className="mb-2">
                                    <strong>Owner:</strong> {org.owner?.name} {org.owner?.surname}
                                </p>
                                <p className="mb-3">
                                    <strong>Members:</strong>{' '}
                                    {org.members && org.members.length > 0
                                        ? org.members.map((m) => `${m.name} ${m.surname}`).join(', ')
                                        : 'No members yet'}
                                </p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                        setSelectedOrg(org)
                                        setInviteOpen(true)
                                    }}
                                >
                                    <UserPlus size={14} /> Invite Member
                                </Button>
                                {user.id === org.owner.id && (
                                    <button
                                        onClick={() => router.push(`/dashboard/manage/${org.id}`)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Manage this organization
                                    </button>
                                )}

                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No organizations yet. Create one to get started!</p>
                )}
            </div>

            {/* Modals */}
            <OrganizationModal open={open} setOpen={setOpen} onSubmit={handleCreate} />
            <InviteMemberModal open={inviteOpen} setOpen={setInviteOpen} onInvite={handleInvite} />
        </div>
    )
}