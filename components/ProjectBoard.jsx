// components/ProjectBoard.jsx
'use client'
import React, { useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from '@/components/TaskCard'
import api from '@/utils/api' // your axios instance

const STATUS_ORDER = ['planned', 'in_progress', 'done']
const STATUS_LABELS = {
    planned: 'Planned',
    in_progress: 'In Progress',
    done: 'Done',
}

export default function ProjectBoard({ project, onTaskUpdated }) {
    // group tasks by status
    const tasksByStatus = STATUS_ORDER.reduce((acc, s) => {
        acc[s] = project.tasks ? project.tasks.filter(t => t.status === s) : []
        return acc
    }, {})

    const onDragEnd = useCallback(async (result) => {
        const { destination, source, draggableId } = result
        if (!destination) return
        // if dropped into same column and same index -> nothing
        if (destination.droppableId === source.droppableId) return

        const taskId = draggableId.replace('task-', '')
        const newStatus = destination.droppableId // planned/in_progress/done

        try {
            // PATCH the task status
            await api.patch(`/api/tasks/${taskId}/`, { status: newStatus })
            // notify parent to refetch/optimistically update
            if (onTaskUpdated) onTaskUpdated(taskId, newStatus)
        } catch (err) {
            console.error('Failed to update task status', err)
            // optionally show toast
        }
    }, [onTaskUpdated])

    return (
        <div className="border rounded-lg p-4 bg-slate-50">
            <h3 className="text-lg font-semibold mb-4">{project.title}</h3>
            <div className="grid grid-cols-3 gap-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    {STATUS_ORDER.map(status => (
                        <Droppable droppableId={status} key={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[120px] p-2 rounded-md ${snapshot.isDraggingOver ? 'bg-slate-100' : 'bg-white/80'} border`}
                                >
                                    <div className="text-sm font-medium mb-2">{STATUS_LABELS[status]}</div>
                                    <div className="space-y-2">
                                        {(tasksByStatus[status] || []).map((task, idx) => (
                                            <Draggable key={task.id} draggableId={`task-${task.id}`} index={idx}>
                                                {(dragProvided, dragSnapshot) => (
                                                    <div
                                                        ref={dragProvided.innerRef}
                                                        {...dragProvided.draggableProps}
                                                        {...dragProvided.dragHandleProps}
                                                    >
                                                        <TaskCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    )
}
