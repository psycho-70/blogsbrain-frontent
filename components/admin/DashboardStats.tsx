'use client'

interface DashboardStatsProps {
  stats: {
    totalBlogs: number
    totalCategories: number
    totalUsers: number
    totalViews: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    { label: 'Total Blogs', value: stats.totalBlogs, icon: '📝' },
    { label: 'Categories', value: stats.totalCategories, icon: '🏷️' },
    { label: 'Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Total Views', value: stats.totalViews, icon: '👁️' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{item.label}</p>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                {item.value.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-700/30 flex items-center justify-center border border-white/5">
              <span className="text-2xl">{item.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
