import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import GanttChart from '../components/GanttChart'
import api from '../utils/api'
import { useAuth } from '../utils/auth'
import { useRouter } from 'next/router'
import ProjectSelector from '../components/ProjectSelector'
import TaskModal from '../components/TaskModal'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [activeProject, setActiveProject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/projects/')
        setProjects(res.data || [])
        const projectId = (res.data && res.data[0] && res.data[0].id) || null
        setActiveProject(projectId)
      } catch (err) {
        console.error(err)
      } finally { setLoadingData(false) }
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeProject) return
    const loadTasks = async () => {
      setLoadingData(true)
      try {
        const t = await api.get(`/projects/${activeProject}/tasks`)
        setTasks(t.data || [])
      } catch (err) { console.error(err) } finally { setLoadingData(false) }
    }
    loadTasks()
  }, [activeProject])

  const openCreate = () => { setEditingTask(null); setModalOpen(true) }
  const onSaved = () => {
    // reload tasks
    if (!activeProject) return
    api.get(`/projects/${activeProject}/tasks`).then(r=>setTasks(r.data||[]))
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <ProjectSelector projects={projects} selectedId={activeProject} onChange={setActiveProject} />
          <button className="px-3 py-2 border rounded" onClick={openCreate}>New task</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500">{user?.name}</div>
          <img src={user?.avatar || '/avatar-placeholder.png'} className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {loadingData ? <div>Loading...</div> : <GanttChart tasks={tasks} />}
      <TaskModal open={modalOpen} onClose={()=>setModalOpen(false)} projectId={activeProject} task={editingTask} onSaved={onSaved} />
    </Layout>
  )
}
