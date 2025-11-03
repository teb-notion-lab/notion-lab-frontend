import React from 'react'

export default function ProjectSelector({ projects, selectedId, onChange }) {
  return (
    <select value={selectedId || ''} onChange={e => onChange(e.target.value)} className="p-2 border rounded">
      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
    </select>
  )
}
