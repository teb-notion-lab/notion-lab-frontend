export default function SnapshotCard({ title, value, color }) {
    return (
        <div className={`rounded-lg shadow p-4 text-white ${color}`}>
            <p className="text-sm opacity-80">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
        </div>
    )
}
