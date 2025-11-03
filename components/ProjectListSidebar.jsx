import { Button } from '@/components/ui/button'

export default function ProjectListSidebar({ orgName, projects, onNewProject }) {
    return (
        <div className="w-64 bg-white shadow-md rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-lg">{orgName}</h1>
                <Button size="sm" onClick={onNewProject}>
                    + New
                </Button>
            </div>

            <div className="space-y-2">
                {projects.map((p) => (
                    <div
                        key={p.id}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                    >
                        {p.title}
                    </div>
                ))}
            </div>
        </div>
    )
}
