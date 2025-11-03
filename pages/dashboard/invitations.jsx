'use client'
import { useEffect, useState } from 'react'
import { getInvitations, respondToInvitation } from '@/utils/api'
import { useAuth } from '@/utils/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function InvitationsPage() {
    const { user } = useAuth()
    const [invitations, setInvitations] = useState([])

    useEffect(() => {
        if (!user) return
        const fetchInvites = async () => {
            const token = localStorage.getItem('nl_token')
            const res = await getInvitations(token)
            setInvitations(res.data)
        }
        fetchInvites()
    }, [user])

    const handleRespond = async (action, token) => {
        try {
            const jwt = localStorage.getItem('nl_token')
            await respondToInvitation(jwt, action, token)
            alert(`Invitation ${action}ed successfully!`)
            setInvitations((prev) => prev.filter((i) => i.token !== token))
        } catch (err) {
            console.error(err)
            alert('Failed to update invitation.')
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Invitations</h1>
            {invitations.length === 0 ? (
                <p>No pending invitations.</p>
            ) : (
                <div className="grid gap-4">
                    {invitations.map((inv) => (
                        <Card key={inv.id}>
                            <CardHeader>
                                <CardTitle>{inv.organization.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Invited by: {inv.invited_by.email}</p>
                                <div className="flex gap-2 mt-2">
                                    <Button onClick={() => handleRespond('accept', inv.token)}>
                                        Accept
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRespond('decline', inv.token)}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
