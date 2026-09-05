import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { GovernmentTopBar } from './GovernmentTopBar'
import { Header } from './Header'
import { NotificationBanner } from './NotificationBanner'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans antialiased text-slate-800">
      {/* Official Government of India Top Bar */}
      <GovernmentTopBar />

      {/* Official Ministry Header */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Official Orange Notification Banner */}
      <NotificationBanner />

      {/* Main Container: Sidebar + Page Content */}
      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        {/* Left Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 bg-[#f8fafc] p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </main>
      </div>

      {/* Official Footer with Samajik Sahayak */}
      <Footer />
    </div>
  )
}
