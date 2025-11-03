import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']

const mockData = [
    { name: 'Open', value: 8 },
    { name: 'Active', value: 5 },
    { name: 'Completed', value: 10 },
    { name: 'In-review', value: 3 },
    { name: 'Closed', value: 4 },
]

export default function ProgressCharts() {
    const charts = ['Projects', 'Features', 'Work items', 'Bugs']

    return (
        <div className="grid grid-cols-4 gap-4">
            {charts.map((title) => (
                <div key={title} className="flex flex-col items-center">
                    <h3 className="text-sm mb-2">{title}</h3>
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie
                                data={mockData}
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {mockData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    )
}
