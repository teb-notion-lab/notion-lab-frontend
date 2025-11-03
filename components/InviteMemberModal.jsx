'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function InviteMemberModal({ open, setOpen, onInvite }) {
    const [email, setEmail] = useState('')

    const handleSubmit = () => {
        if (!email) return
        onInvite(email)
        setEmail('')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        placeholder="Enter user’s email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Send Invite</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
