"use client"

import { useState } from "react"
import {
  Home,
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  Bell,
  Calendar,
  FileText,
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  User,
} from "lucide-react"

export default function Sidebar({ isOpen, onToggle }) {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
    // { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
    { id: "testers", label: "Testers", icon: Users, href: "/testers" },
    {
      id: "projects",
      label: "Projects",
      icon: FolderOpen,
      href: "/projects",
      hasSubmenu: true,
      submenu: [
        { id: "ongoing", label: "On Going", href: "/projects/ongoing" },
        { id: "completed", label: "Completed", href: "/projects/completed" },
        { id: "alerts", label: "Alert Projects", href: "/projects/alerts" },
      ],
    },
    // { id: "reports", label: "Reports", icon: FileText, href: "/reports" },
    // { id: "calendar", label: "Calendar", icon: Calendar, href: "/calendar" },
    // { id: "trends", label: "Trends", icon: TrendingUp, href: "/trends" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/notifications" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-16"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">MonitorHub</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* User Profile */}
        {isOpen && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Team</p>
                <p className="text-xs text-gray-400 truncate">Performance Testers</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  setActiveItem(item.id)
                  if (item.hasSubmenu) {
                    setIsProjectsExpanded(!isProjectsExpanded)
                  } else {
                    // Handle navigation
                    if (item.id === "testers") {
                      window.location.href = "/testers"
                    } else if (item.id === "dashboard") {
                      window.location.href = "/"
                    }
                    // Add more navigation logic as needed
                  }
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isProjectsExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {item.hasSubmenu && isProjectsExpanded && isOpen && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveItem(subItem.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${
                          activeItem === subItem.id
                            ? "bg-blue-500 text-white"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }
                      `}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">Performance Tester 2025</div>
          </div>
        )}
      </div>
    </>
  )
}
