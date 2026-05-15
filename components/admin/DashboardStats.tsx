'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'
import { BookOpen, Tag, Users, Eye } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalBlogs: number
    totalCategories: number
    totalUsers: number
    totalViews: number
  }
}

const items = [
  {
    label: 'Total Blogs',
    key: 'totalBlogs' as const,
    icon: BookOpen,
    accent: '#38bdf8',
    accentBg: 'rgba(56,189,248,0.10)',
    bar: 72,
  },
  {
    label: 'Categories',
    key: 'totalCategories' as const,
    icon: Tag,
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.10)',
    bar: 45,
  },
  {
    label: 'Users',
    key: 'totalUsers' as const,
    icon: Users,
    accent: '#34d399',
    accentBg: 'rgba(52,211,153,0.10)',
    bar: 60,
  },
  {
    label: 'Total Views',
    key: 'totalViews' as const,
    icon: Eye,
    accent: '#fb923c',
    accentBg: 'rgba(251,146,60,0.10)',
    bar: 88,
  },
]

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const { isDark } = useTheme()

  const card = isDark
    ? 'bg-[#0f1117] border border-white/[0.06]'
    : 'bg-white border border-slate-200/80 shadow-sm shadow-slate-100'
  const labelColor = isDark ? 'text-slate-500' : 'text-slate-400'
  const valueColor = isDark ? 'text-white' : 'text-slate-900'
  const trackColor = isDark ? 'bg-white/5' : 'bg-slate-100'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
          className={`relative rounded-xl p-4 flex flex-col gap-3 ${card}`}
          style={{ fontFamily: "'DM Mono', 'Fira Mono', monospace" }}
        >
          {/* Top row: icon + label */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: item.accentBg }}
            >
              <item.icon size={14} style={{ color: item.accent }} />
            </div>
            <span className={`text-[11px] font-medium uppercase tracking-widest ${labelColor}`}>
              {item.label}
            </span>
          </div>

          {/* Value */}
          <span className={`text-2xl font-bold leading-none ${valueColor}`}>
            {stats[item.key].toLocaleString()}
          </span>

          {/* Progress bar */}
          <div className={`h-[3px] w-full rounded-full ${trackColor} overflow-hidden`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.bar}%` }}
              transition={{ delay: i * 0.07 + 0.3, duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: item.accent }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}