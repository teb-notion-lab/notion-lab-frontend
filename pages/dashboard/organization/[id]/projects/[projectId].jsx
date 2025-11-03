'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import {
    getOrganizations,
    getProjects,
    getTasks,
    createTask,
    updateTask
} from '@/utils/api'
import { Button } from '@/components/ui/button'
import TaskModal from '@/components/TaskModal'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function ProjectDashboardPage() {
    const router = useRouter()
    const { id: orgId, projectId } = router.query

    const [org, setOrg] = useState(null)
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTask, setSelectedTask] = useState(null)
    const [taskModalOpen, setTaskModalOpen] = useState(false)

    useEffect(() => {
        if (!router.isReady || !orgId || !projectId) return
        const token = Cookies.get('nl_token')
        if (!token) {
            router.push('/login')
            return
        }

        const fetchData = async () => {
            try {
                const [orgsRes, projectsRes, tasksRes] = await Promise.all([
                    getOrganizations(token),
                    getProjects(token),
                    getTasks(token, projectId)
                ])

                const orgFound = orgsRes.data.find(o => o.id === parseInt(orgId))
                const projFound = projectsRes.find(p => p.id === parseInt(projectId))

                if (!orgFound || !projFound || projFound.organization !== orgFound.id) {
                    router.push('/dashboard/organizations')
                    return
                }

                setOrg(orgFound)
                setProject(projFound)
                setTasks(tasksRes)
            } catch (err) {
                console.error('❌ Error loading project:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router.isReady, orgId, projectId])

    if (loading) return <p className="text-center py-8">Loading...</p>

    const columns = [
        { key: 'todo', title: 'Planned' },
        { key: 'in_progress', title: 'In Progress' },
        { key: 'done', title: 'Done' },
    ]

    const getTasksByStatus = (status) => tasks.filter((t) => t.status === status)

    // 🪄 Handle drag and drop
    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result
        if (!destination) return

        // If position didn’t change
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return

        const newStatus = destination.droppableId

        // Update local UI instantly
        setTasks((prev) =>
            prev.map((t) =>
                t.id.toString() === draggableId ? { ...t, status: newStatus } : t
            )
        )

        // Sync with backend
        const token = Cookies.get('nl_token')
        try {
            await updateTask(token, draggableId, { status: newStatus })
        } catch (err) {
            console.error('❌ Failed to update task status:', err)
        }
    }

    // ✅ Handle creating a new task
    const handleCreateTask = async (data) => {
        const token = Cookies.get('nl_token')
        try {
            const newTask = await createTask(token, {
                ...data,
                project: parseInt(projectId),
            })
            setTasks((prev) => [...prev, newTask])
            setTaskModalOpen(false)
        } catch (err) {
            console.error('❌ Failed to create task:', err)
            alert('Failed to create task')
        }
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{project?.title}</h1>
                    <p className="text-gray-500">{org?.name}</p>
                </div>
                <Button onClick={() => setTaskModalOpen(true)}>+ New Task</Button>
            </header>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((col) => (
                        <Droppable droppableId={col.key} key={col.key}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 border min-h-[400px]"
                                >
                                    <h2 className="font-semibold text-lg mb-2">{col.title}</h2>
                                    {getTasksByStatus(col.key).length > 0 ? (
                                        getTasksByStatus(col.key).map((task, index) => (
                                            <Draggable
                                                draggableId={task.id.toString()}
                                                index={index}
                                                key={task.id}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => setSelectedTask(task)}
                                                        className="p-3 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100"
                                                    >
                                                        <h3 className="font-medium text-gray-800">
                                                            {task.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {task.description || 'No description'}
                                                        </p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">
                                            You have no tasks yet, create it now!
                                        </p>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {/* Task modal for creating new task */}
            <TaskModal
                open={taskModalOpen}
                setOpen={setTaskModalOpen}
                onSubmit={handleCreateTask}
            />

            {/* Optional: show task details modal */}
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    open={!!selectedTask}
                    setOpen={() => setSelectedTask(null)}
                    readOnly
                />
            )}
        </div>
    )
}
