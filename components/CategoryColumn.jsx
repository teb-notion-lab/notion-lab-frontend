'use client'
import TaskCard from '@/components/TaskCard'

export default function CategoryColumn({ title, tasks, onTaskClick }) {
    return (
        <div className="flex flex-col bg-gray-50 rounded-lg p-3 w-72 min-w-[18rem] shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
            <div className="space-y-2 overflow-y-auto max-h-[70vh]">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No tasks yet</p>
                )}
            </div>
        </div>
    )
}
