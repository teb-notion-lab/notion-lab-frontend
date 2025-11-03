import React, { useMemo } from 'react'
import { differenceInDays, parseISO, startOfMonth, addMonths, format, isWithinInterval } from 'date-fns'

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

export default function GanttChart({ tasks }) {
  const [startMonth, endMonth] = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      const s = startOfMonth(new Date())
      return [s, addMonths(s, 5)]
    }
    const dates = tasks.flatMap(t => [parseISO(t.start_date), parseISO(t.end_date)])
    const min = startOfMonth(dates.reduce((a,b)=> a<b? a:b))
    const max = addMonths(startOfMonth(dates.reduce((a,b)=> a>b? a:b)), 1)
    return [min, addMonths(max, 1)]
  }, [tasks])

  const months = useMemo(() => {
    const m = []
    let cur = startOfMonth(startMonth)
    while (cur <= endMonth) {
      m.push(cur)
      cur = addMonths(cur, 1)
    }
    return m
  }, [startMonth, endMonth])

  const totalDays = differenceInDays(addMonths(endMonth, 1), startMonth)
  const today = new Date()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">Project overview / Market research 2024 / <span className="text-slate-900">Gantt chart</span></h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="grid grid-cols-[240px_1fr]">
          <div className="p-4 border-r">
            <div className="text-sm text-slate-500">Task name</div>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-12 gap-4">
              {months.map((m, i) => (
                <div key={i} className="text-center text-sm font-medium text-slate-600">{format(m, 'MMMM')}</div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {tasks.map((task) => {
            const s = parseISO(task.start_date)
            const e = parseISO(task.end_date)
            const offsetDays = differenceInDays(s, startMonth)
            const durationDays = Math.max(1, differenceInDays(e, s))
            const left = clamp((offsetDays / totalDays) * 100, 0, 100)
            const width = clamp((durationDays / totalDays) * 100, 2, 100)
            const isTodayIn = isWithinInterval(today, { start: s, end: e })
            return (
              <div key={task.id} className="grid grid-cols-[240px_1fr] items-center border-t">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded" style={{background: task.color}}></div>
                    <div className="text-sm font-medium">{task.name}</div>
                  </div>
                </div>
                <div className="p-4 relative h-20">
                  <div className="absolute inset-y-0 left-0 right-0 grid grid-cols-12">
                    {months.map((m, i) => (
                      <div key={i} className="border-l border-dashed border-slate-100" />
                    ))}
                  </div>

                  <div className="absolute inset-0">
                    <div className="relative h-full">
                      <div className="absolute bottom-6 left-0 right-0 h-10">
                        <div className="relative h-full">
                          <div className="absolute rounded-full h-10 shadow" style={{ left: `${left}%`, width: `${width}%`, background: task.color }} />
                          {task.assignee?.avatar && (
                            <img src={task.assignee.avatar} className="absolute -top-3 w-9 h-9 rounded-full border-2 border-white shadow" style={{ left: `calc(${left + width - 4}% )` }} />
                          )}
                        </div>
                      </div>

                      {isTodayIn && (
                        <div className="absolute inset-y-0" style={{ left: `${clamp((differenceInDays(today, startMonth) / totalDays) * 100, 0, 100)}%` }}>
                          <div className="w-0.5 h-full bg-slate-800" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
