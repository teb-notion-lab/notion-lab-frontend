'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getProjects, createProject } from '@/utils/api'
import Cookies from 'js-cookie'
import SnapshotCard from '@/components/SnapshotCard'
import ProgressCharts from '@/components/ProgressCharts'
import ProjectListSidebar from '@/components/ProjectListSidebar'
import ProjectModal from '@/components/ProjectModal'
import { useRouter } from 'next/router'

export default function OrganizationDashboard({ orgName }) {
    const router = useRouter()
    const { id } = router.query

    const [orgId, setOrgId] = useState(null)
    const [projects, setProjects] = useState([])
    const [projectModalOpen, setProjectModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Set orgId when router is ready
    useEffect(() => {
        if (id) {
            setOrgId(Number(id))
        }
    }, [id])

    // Fetch projects for this organization
    useEffect(() => {
        const token = Cookies.get('nl_token')
        if (!token || !orgId) return

        const fetchProjects = async () => {
            try {
                setLoading(true)
                const res = await getProjects(token)
                const filtered = res.filter((p) => p.organization === orgId)
                setProjects(filtered)
            } catch (err) {
                console.error('Error fetching projects:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [orgId])

    // Create project handler
    const handleCreateProject = async (data) => {
        const token = Cookies.get('nl_token')

        try {
            const res = await createProject(token, {
                ...data,
                organization: orgId
            })

            setProjects((prev) => [...prev, res])
            setProjectModalOpen(false)
        } catch (err) {
            console.error('Failed to create project:', err)
            alert('❌ Failed to create project')
        }
    }

    const stats = [
        { title: 'Projects', value: projects.length, color: 'bg-blue-500' },
        { title: 'Features', value: 10, color: 'bg-yellow-400' },
        { title: 'Work Items', value: 35, color: 'bg-gray-600' },
        { title: 'Bugs', value: 4, color: 'bg-red-500' },
    ]

    return (
        <div className="flex gap-6">
            <ProjectListSidebar
                orgName={orgName}
                projects={projects}
                onNewProject={() => setProjectModalOpen(true)}
            />

            <div className="flex-1 space-y-8">
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((s, idx) => (
                        <SnapshotCard key={idx} {...s} />
                    ))}
                </div>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="font-semibold text-lg mb-4">Progress</h2>
                        <ProgressCharts />
                    </CardContent>
                </Card>
            </div>

            <ProjectModal
                open={projectModalOpen}
                setOpen={setProjectModalOpen}
                onSubmit={handleCreateProject}
                organizations={[]}
            />
        </div>
    )
}
