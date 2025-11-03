'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function OrganizationModal({ open, setOpen, onSubmit }) {
    const [name, setName] = useState('')

    const handleSubmit = () => {
        if (!name.trim()) return
        onSubmit(name)
        setName('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Organization name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <DialogFooter>
                    <Button onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
