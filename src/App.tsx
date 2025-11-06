import { useState, useEffect } from 'react'
import { Zap, Plus, Calendar, Activity, Star } from 'lucide-react'

interface EnergyLog {
  id: string
  date: string
  time: string
  level: number
  note?: string
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

const getEnergyColor = (level: number) => {
  if (level <= 1) return 'bg-red-500'
  if (level <= 2) return 'bg-orange-500'
  if (level <= 3) return 'bg-yellow-500'
  if (level <= 4) return 'bg-green-500'
  return 'bg-emerald-500'
}

function App() {
  const [logs, setLogs] = useState<EnergyLog[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState(new Date().getHours().toString())
  const [selectedLevel, setSelectedLevel] = useState(3)
  const [note, setNote] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('energy-logs')
    if (saved) setLogs(JSON.parse(saved))
  }, [])

  const saveLogs = (newLogs: EnergyLog[]) => {
    setLogs(newLogs)
    localStorage.setItem('energy-logs', JSON.stringify(newLogs))
  }

  const addLog = () => {
    const newLog: EnergyLog = {
      id: Date.now().toString(),
      date: selectedDate,
      time: selectedTime,
      level: selectedLevel,
      note: note || undefined
    }
    saveLogs([...logs, newLog])
    setNote('')
  }

  const getWeekDays = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date.toISOString().split('T')[0]
    })
  }

  const weekDays = getWeekDays()

  const getLogForDateTime = (date: string, hour: number) => {
    return logs.find(log => log.date === date && parseInt(log.time) === hour)
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-12 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="animate-glow">
              <Zap className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">Energy Mapper</h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto text-lg drop-shadow">Track your daily energy levels and discover your productivity peaks with our interactive energy heatmap</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Star className="w-4 h-4 text-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-white/80 text-sm ml-2">Optimize your productivity</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-slideIn">
            <div className="glass rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Weekly Energy Heatmap</h2>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div></div>
                    {DAYS.map((day, index) => (
                      <div
                        key={day}
                        className="text-sm font-bold text-gray-700 text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {HOURS.map(hour => (
                    <div key={hour} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="text-sm font-medium text-gray-600 p-3 text-right bg-gray-50 rounded-lg flex items-center justify-end">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      {weekDays.map(date => {
                        const log = getLogForDateTime(date, hour)
                        return (
                          <div
                            key={`${date}-${hour}`}
                            className={`h-10 rounded-xl ${log ? getEnergyColor(log.level) : 'bg-gray-100 border-2 border-dashed border-gray-300'} flex items-center justify-center cursor-pointer energy-cell shadow-sm`}
                            title={log ? `${log.level}/5 - ${log.note || ''}` : 'Click to add energy level'}
                          >
                            {log && <span className="text-white text-sm font-bold drop-shadow">{log.level}</span>}
                            {!log && <Plus className="w-4 h-4 text-gray-400" />}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mt-8">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Energy Scale</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-red-500 shadow-md animate-pulse-custom"></div>
                    <span className="text-sm font-medium">1 - Drained</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-orange-500 shadow-md"></div>
                    <span className="text-sm font-medium">2 - Low</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-yellow-500 shadow-md"></div>
                    <span className="text-sm font-medium">3 - Neutral</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-green-500 shadow-md"></div>
                    <span className="text-sm font-medium">4 - High</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 shadow-md animate-pulse-custom"></div>
                    <span className="text-sm font-medium">5 - Energized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="glass rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Log Energy</h2>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-purple-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-purple-300"
                  >
                    {HOURS.map(hour => (
                      <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Energy Level</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`w-14 h-14 rounded-xl border-3 transition-all duration-300 transform ${
                          selectedLevel === level
                            ? 'border-white shadow-2xl scale-110 ring-4 ring-purple-200'
                            : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                        } ${getEnergyColor(level)} text-white font-bold shadow-lg hover:shadow-xl`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Note (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="How are you feeling? What's affecting your energy?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-purple-300 resize-none"
                    rows={3}
                  />
                </div>

                <button
                  onClick={addLog}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Energy Log
                  </div>
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Recent Logs</h3>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                {logs.slice(-5).reverse().map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/60 to-white/40 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 animate-slideIn backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${getEnergyColor(log.level)} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {log.level}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{log.date} at {log.time.padStart(2, '0')}:00</div>
                      {log.note && <div className="text-xs text-gray-600 mt-1 italic">"{log.note}"</div>}
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No energy logs yet</p>
                    <p className="text-gray-400 text-sm">Start tracking your energy levels!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
