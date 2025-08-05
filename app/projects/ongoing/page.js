"use client"

import { useEffect, useState, useMemo } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { AlertTriangle, Users, Clock, FileText, Play, CheckCircle, Menu } from "lucide-react"
import Sidebar from "@/components/sidebar"

export default function Home() {
  const [data, setData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/kegiatan")
        const result = await res.json()
        if (Array.isArray(result)) {
          setData(result)
        } else {
          console.error("Data is not an array:", result)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  const summary = useMemo(() => {
    const preparation = data.filter((d) => d.status_name === "Preparation").length
    const execution = data.filter((d) => d.status_name === "Execution").length
    const documentation = data.filter((d) => d.status_name === "Documentation").length
    const uniqueTesters = new Set(data.map((d) => d.pic_name))
    return {
      total: data.length,
      preparation,
      execution,
      documentation,
      activeTesters: uniqueTesters.size,
    }
  }, [data])

  const testersWorkload = useMemo(() => {
    const countMap = {}
    data.forEach((row) => {
      if (row.pic_name) {
        countMap[row.pic_name] = (countMap[row.pic_name] || 0) + 1
      }
    })
    return Object.entries(countMap).map(([name, value]) => ({ name, value }))
  }, [data])

  const workingHours = useMemo(() => {
    const appHours = {}
    data.forEach((row) => {
      const appName = row.project_app
      const hours = Number(row.working_hours) || 0
      if (appName) {
        appHours[appName] = (appHours[appName] || 0) + hours
      }
    })
    return Object.entries(appHours).map(([name, hours]) => ({ name, hours }))
  }, [data])

  const weeklyIntakeData = [
    { name: "Correct This Week", value: 10, color: "#3B82F6" },
    { name: "Circulate This Week", value: 6, color: "#06B6D4" },
  ]

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]

  const CircularProgress = ({ value, max, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const progress = (value / max) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EF4444"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        <div className="p-6 text-white">
          {/* Add mobile menu button */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-gray-800 text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
            <div></div>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center hidden lg:block">Monitoring Dashboard</h1>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            {/* On Going Projects with Circular Progress */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-700">
              <CircularProgress value={summary.total} max={100} />
              <span className="mt-3 text-sm text-gray-400 text-center">On Going Projects</span>
            </div>

            {/* Status Cards */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-700">
              <FileText className="w-6 h-6 text-yellow-500 mb-2" />
              <span className="text-3xl font-bold text-yellow-500">{summary.preparation}</span>
              <span className="text-sm text-gray-400">Preparation</span>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-700">
              <Play className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-3xl font-bold text-blue-500">{summary.execution}</span>
              <span className="text-sm text-gray-400">Execution</span>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-700">
              <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
              <span className="text-3xl font-bold text-green-500">{summary.documentation}</span>
              <span className="text-sm text-gray-400">Documentation</span>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-700">
              <Users className="w-6 h-6 text-green-400 mb-2" />
              <span className="text-3xl font-bold text-green-400">{summary.activeTesters}</span>
              <span className="text-sm text-gray-400">Active Testers</span>
            </div>

            {/* Weekly Intake */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-center">Weekly Intake</h3>
              <div className="space-y-3">
                {weeklyIntakeData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">{item.name}</span>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.value / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* On Going Projects Table */}
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                On Going Projects
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Regist Code</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Project App</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">PIC</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">PIC Squad</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Tanggal Migrasi</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Complexity</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Total BP</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Scenario</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 8).map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-2 text-blue-400">{row.register_code}</td>
                        <td className="py-3 px-2">{row.project_app}</td>
                        <td className="py-3 px-2">{row.pic_name}</td>
                        <td className="py-3 px-2">{row.pic_squad}</td>
                        <td className="py-3 px-2">{row.tanggal_migrasi}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              row.status_name === "Execution"
                                ? "bg-blue-900 text-blue-300"
                                : row.status_name === "Preparation"
                                  ? "bg-yellow-900 text-yellow-300"
                                  : "bg-green-900 text-green-300"
                            }`}
                          >
                            {row.status_name}
                          </span>
                        </td>
                        <td className="py-3 px-2">{row.complexity_level}</td>
                        <td className="py-3 px-2">2/2 Scripted</td>
                        <td className="py-3 px-2">3/3 Executed</td>
                        <td className="py-3 px-2">N/A</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Testers Workload */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Testers Workload
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={testersWorkload}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {testersWorkload.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Working Hours Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                90th Percentile Overall Working Hours (Monthly)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workingHours} layout="vertical" margin={{ left: 100 }}>
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#374151",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="hours" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Alert Projects */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-red-400">
                <AlertTriangle className="w-5 h-5 mr-2" />🚨 Alert Projects 🚨
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Regist Code</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Project App</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">PIC</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">PIC Squad</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Tanggal Migrasi</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .filter((row) => row.status_name === "Preparation" || row.status_name === "Documentation")
                      .slice(0, 8)
                      .map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-red-900/20 transition-colors">
                          <td className="py-3 px-2 text-red-400">{row.register_code}</td>
                          <td className="py-3 px-2">{row.project_app}</td>
                          <td className="py-3 px-2">{row.pic_name}</td>
                          <td className="py-3 px-2">{row.pic_squad}</td>
                          <td className="py-3 px-2">{row.tanggal_migrasi}</td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
                              {row.status_name}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
