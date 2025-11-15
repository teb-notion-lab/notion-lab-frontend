'use client'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { getProjects, createProject } from '@/utils/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProjectModal from '@/components/ProjectModal'
import { useRouter } from 'next/router'

export default function OrganizationProjectsPage() {
    const router = useRouter()
    const { id } = router.query
    const [projects, setProjects] = useState([])
    const [open, setOpen] = useState(false)
    if(!id) return null
    const orgId = Number(id)

    useEffect(() => {
        const token = Cookies.get('nl_token')
        if (!token) return

        const fetchProjects = async () => {
            try {
                const res = await getProjects(token)
                const allProjects = res.data || res  // support both axios and fetch return types
                const filtered = allProjects.filter((p) => p.organization === parseInt(orgId))
                setProjects(filtered)
            } catch (err) {
                console.error('Error fetching projects:', err)
            }
        }

        fetchProjects()
    }, [orgId])

    const handleCreate = async (data) => {
        const token = Cookies.get('nl_token')
        console.log('📦 Creating project with data:', { ...data, organization: parseInt(orgId) })
        try {
            // ✅ Explicitly attach orgId here
            const newProject = await createProject(token, { ...data, organization: parseInt(orgId) })
            setProjects((prev) => [...prev, newProject])
            setOpen(false)
        } catch (err) {
            console.error('Error creating project:', err)
            alert('Failed to create project')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Organization Projects</h1>
                <Button onClick={() => setOpen(true)}>Create Project</Button>
            </div>

            {/* Project List */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="cursor-pointer hover:shadow-md transition"
                            onClick={() =>
                                router.push(`/dashboard/organization/${orgId}/projects/${project.id}`)
                            }
                        >
                            <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-600">
                    <p className="mb-4">No projects yet for this organization.</p>
                    <Button onClick={() => setOpen(true)}>Create your first project</Button>
                </div>
            )}

            {/* Project creation modal */}
            <ProjectModal open={open} setOpen={setOpen} onSubmit={handleCreate} />
        </div>
    )
}
