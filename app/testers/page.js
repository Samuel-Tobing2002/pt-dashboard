"use client"

import { useEffect, useState, useMemo } from "react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Users, User, Clock, TrendingUp, Award, Target, Activity, Search, Mail, Phone, Calendar } from "lucide-react"
import Sidebar from "@/components/sidebar"

export default function TestersPage() {
    const [engineersData, setEngineersData] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    const [data, setData] = useState([])

    const [engineers, setEngineers] = useState([]);

    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                const res = await fetch("/api/engineers");
                const result = await res.json();
                if (Array.isArray(result)) {
                    setEngineers(result);
                } else {
                    console.error("Engineers data is not an array:", result);
                }
            } catch (error) {
                console.error("Failed to fetch engineers:", error);
            }
        };

        fetchEngineers();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/projects")
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

    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/engineers")
                const result = await res.json()
                if (Array.isArray(result)) {
                    // Add mock performance data since it's not in database
                    const enrichedData = result.map((engineer) => ({
                        ...engineer,
                        performance: Math.floor(Math.random() * 30) + 70, // Mock performance 70-100
                        efficiency: Math.floor(Math.random() * 25) + 75, // Mock efficiency 75-100
                        total_hours: (engineer.total_projects * (Math.random() * 20 + 10)).toFixed(1), // Mock hours
                    }))
                    setEngineersData(enrichedData)
                } else {
                    console.error("Data is not an array:", result)
                }
            } catch (error) {
                console.error("Failed to fetch engineers:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEngineers()
    }, [])

    const testersWorkload = useMemo(() => {
        const countMap = {}
        data.forEach((row) => {
            if (row.pic_name) {
                countMap[row.pic_name] = (countMap[row.pic_name] || 0) + 1
            }
        })
        return Object.entries(countMap).map(([name, value]) => ({ name, value }))
    }, [data])

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F97316"]


    // Filter engineers based on search and filter
    const filteredEngineers = useMemo(() => {
        return engineersData.filter((engineer) => {
            const matchesSearch =
                engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (engineer.primary_squad && engineer.primary_squad.toLowerCase().includes(searchTerm.toLowerCase()))

            const matchesFilter =
                selectedFilter === "all" ||
                (selectedFilter === "high-performer" && engineer.performance >= 85) ||
                (selectedFilter === "active" && engineer.ongoing_projects > 0) ||
                (selectedFilter === "completed" && engineer.completed_projects > 0) ||
                (selectedFilter === "pic-only" && engineer.total_projects_as_pic > 0) ||
                (selectedFilter === "engineer-only" && engineer.total_projects_as_engineer > 0)

            return matchesSearch && matchesFilter
        })
    }, [engineersData, searchTerm, selectedFilter])

    // Summary statistics
    const summary = useMemo(() => {
        return {
            totalEngineers: engineersData.length,
            activeEngineers: engineersData.filter((e) => e.ongoing_projects > 0).length,
            avgPerformance:
                engineersData.length > 0
                    ? (engineersData.reduce((sum, e) => sum + e.performance, 0) / engineersData.length).toFixed(1)
                    : 0,
            totalProjects: engineersData.reduce((sum, e) => sum + Number.parseInt(e.total_projects), 0),
            totalHours: engineersData.reduce((sum, e) => sum + Number.parseFloat(e.total_hours), 0).toFixed(1),
        }
    }, [engineersData])

    // Performance distribution data for chart
    const performanceDistribution = useMemo(() => {
        const ranges = [
            { range: "90-100", count: 0, color: "#10B981" },
            { range: "80-89", count: 0, color: "#3B82F6" },
            { range: "70-79", count: 0, color: "#F59E0B" },
            { range: "60-69", count: 0, color: "#EF4444" },
        ]

        engineersData.forEach((engineer) => {
            if (engineer.performance >= 90) ranges[0].count++
            else if (engineer.performance >= 80) ranges[1].count++
            else if (engineer.performance >= 70) ranges[2].count++
            else ranges[3].count++
        })

        return ranges
    }, [engineersData])

    // Squad distribution
    const squadDistribution = useMemo(() => {
        const squadCount = {}
        engineersData.forEach((engineer) => {
            const squad = engineer.primary_squad || "No Squad"
            squadCount[squad] = (squadCount[squad] || 0) + 1
        })
        return Object.entries(squadCount).map(([squad, count]) => ({ name: squad, value: count }))
    }, [engineersData])

    const getPerformanceColor = (score) => {
        if (score >= 90) return "text-green-400"
        if (score >= 80) return "text-blue-400"
        if (score >= 70) return "text-yellow-400"
        return "text-red-400"
    }

    const getPerformanceBg = (score) => {
        if (score >= 90) return "bg-green-900"
        if (score >= 80) return "bg-blue-900"
        if (score >= 70) return "bg-yellow-900"
        return "bg-red-900"
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const detail = useMemo(() => {
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);

    const currentEngineers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredEngineers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredEngineers, currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    if (loading) {
        return (
            <div className="flex h-screen bg-gray-900">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
                    <div className="flex items-center justify-center h-full">
                        <div className="text-white text-xl">Loading engineers data...</div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
                <div className="p-6 text-white">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <Users className="w-8 h-8 mr-3 text-blue-400" />
                                Engineers Management
                            </h1>
                            <p className="text-gray-400 mt-2">Monitor and manage engineer performance and workload</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Engineers</p>
                                    <p className="text-3xl font-bold text-white">{summary.totalEngineers}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Active Engineers</p>
                                    <p className="text-3xl font-bold text-green-400">{summary.totalEngineers}</p>
                                </div>
                                <Activity className="w-8 h-8 text-green-400" />
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Projects</p>
                                    <p className="text-3xl font-bold text-purple-400">{detail.total}</p>
                                </div>
                                <Target className="w-8 h-8 text-purple-400" />
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Avg Performance</p>
                                    <p className="text-3xl font-bold text-yellow-400">{summary.avgPerformance}%</p>
                                </div>
                                <Award className="w-8 h-8 text-yellow-400" />
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Hours</p>
                                    <p className="text-3xl font-bold text-cyan-400">{summary.totalHours}h</p>
                                </div>
                                <Clock className="w-8 h-8 text-cyan-400" />
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search engineers, email, or squads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Engineers</option>
                            <option value="high-performer">High Performers (85%+)</option>
                            <option value="active">Active Engineers</option>
                            <option value="completed">With Completed Projects</option>
                            <option value="pic-only">PIC Only</option>
                            <option value="engineer-only">Engineer Only</option>
                        </select>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Performance Distribution */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Performance Distribution
                            </h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={performanceDistribution}>
                                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF" }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#374151",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Squad Distribution */}
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

                    {/* Engineers Table */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Engineers Details ({filteredEngineers.length})
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Engineer</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Contact</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Divisi</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Total Projects</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">As PIC</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">As Engineer</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Completed</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Ongoing</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Performance</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Efficiency</th>
                                        <th className="text-left py-4 px-4 font-medium text-gray-300">Join Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEngineers.map((engineer, idx) => (
                                        <tr
                                            key={engineer.user_ad}
                                            className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {engineer.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .substring(0, 2)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{engineer.name}</p>
                                                        <p className="text-xs text-gray-400">ID: {engineer.user_ad}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-300">{engineer.email || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-300">{engineer.phone || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">
                                                    {engineer.divisi || "No Squad"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-lg font-semibold text-white">{engineer.total_projects}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-purple-400 font-semibold">{engineer.total_projects_as_pic}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-cyan-400 font-semibold">{engineer.total_projects_as_engineer}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-green-400 font-semibold">{engineer.completed_projects}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-yellow-400 font-semibold">{engineer.ongoing_projects}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className={`font-semibold ${getPerformanceColor(engineer.performance)}`}>
                                                        {engineer.performance}%
                                                    </span>
                                                    <div className={`w-2 h-2 rounded-full ${getPerformanceBg(engineer.performance)}`}></div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-orange-400 font-semibold">{engineer.efficiency}%</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-400">{formatDate(engineer.created_at)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center mt-6 px-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm rounded bg-gray-700 text-white disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                <div className="text-sm text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm rounded bg-gray-700 text-white disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>

                        </div>

                        {filteredEngineers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">No engineers found matching your criteria</p>
                                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter settings</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
