// components/TaskCard.jsx
'use client'
import React from 'react'

export default function TaskCard({ task }) {
    return (
        <div className="bg-white rounded-md p-3 shadow-sm border">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className="font-medium text-sm">{task.title}</div>
                    {task.assignee_details ? (
                        <div className="text-xs text-gray-500">{task.assignee_details.name} {task.assignee_details.surname}</div>
                    ) : (
                        <div className="text-xs text-gray-400">Unassigned</div>
                    )}
                </div>
                <div className="text-xs">{/* optional due date */}</div>
            </div>
            {task.description ? <p className="text-xs text-gray-600 mt-2">{task.description}</p> : null}
        </div>
    )
}
