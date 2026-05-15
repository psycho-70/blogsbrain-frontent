'use client'

import React from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { TrendingUp, Globe, FileText, FolderTree, MousePointer, Activity } from 'lucide-react'

interface ChartData {
    dailyActivity: { date: string; count: number }[]
    dailyLeads: { date: string; count: number }[]
    topPages: { url: string; views: number }[]
    referrers: { name: string; count: number }[]
    categoryDistribution?: { category: string; count: number }[]
    ctaStats?: { buttonId: string; clickCount: number }[]
}

interface DashboardChartsProps {
    data: ChartData
}

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#ef4444']

export default function DashboardCharts({ data }: DashboardChartsProps) {
    const { isDark } = useTheme()

    // Process dual data for trend chart
    const trendData = data.dailyActivity.map(activity => {
        const lead = data.dailyLeads.find(l => l.date === activity.date)
        return {
            date: new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            views: activity.count,
            leads: lead ? lead.count : 0
        }
    })

    const chartBg = isDark ? '#1f2937' : '#ffffff'
    const chartBorder = isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
    const textColor = isDark ? '#94a3b8' : '#64748b'
    const gridColor = isDark ? '#374151' : '#e2e8f0'
    const cardBg = isDark ? 'bg-gray-800/20 backdrop-blur-md border-white/5' : 'bg-white/60 backdrop-blur-md border-slate-200/50 shadow-sm'
    const textPrimary = isDark ? 'text-white' : 'text-slate-900'

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`rounded-xl p-3 shadow-xl border ${isDark ? 'bg-gray-800 border-purple-500/30' : 'bg-white border-purple-200 shadow-purple-100'}`}>
                    <p className={`text-sm font-semibold mb-2 ${textPrimary}`}>{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} className="text-xs" style={{ color: p.color }}>
                            {p.name}: {p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
            {/* 1. Growth Trend (Daily Views & Leads) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 lg:p-6 transition-all duration-300 ${cardBg} hover:border-purple-500/30`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg lg:text-xl font-bold flex items-center gap-2 ${textPrimary}`}>
                        <Activity size={22} className="text-purple-500" />
                        Growth Trend
                    </h3>
                    <div className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        Last 7 days
                    </div>
                </div>
                <div className="h-[280px] lg:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.3 : 0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={isDark ? 0.3 : 0.2} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke={textColor}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke={textColor}
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                iconType="circle"
                            />
                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorViews)"
                                name="Page Views"
                            />
                            <Area
                                type="monotone"
                                dataKey="leads"
                                stroke="#8b5cf6"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorLeads)"
                                name="Leads"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 2. Referrer Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl border p-5 lg:p-6 transition-all duration-300 ${cardBg} hover:border-purple-500/30`}
            >
                <h3 className={`text-lg lg:text-xl font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
                    <Globe size={22} className="text-purple-500" />
                    Traffic Sources
                </h3>
                <div className="h-[280px] lg:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.referrers}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                fill="#8884d8"
                                paddingAngle={4}
                                dataKey="count"
                                nameKey="name"
                            >
                                {data.referrers.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                wrapperStyle={{ fontSize: '11px' }}
                                iconType="circle"
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 3. Top Pages */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl border p-5 lg:p-6 transition-all duration-300 ${cardBg} hover:border-purple-500/30`}
            >
                <h3 className={`text-lg lg:text-xl font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
                    <FileText size={22} className="text-purple-500" />
                    Popular Content
                </h3>
                <div className="h-[280px] lg:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={data.topPages.slice(0, 5)}
                            margin={{ left: 70, right: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                            <XAxis type="number" stroke={textColor} fontSize={11} />
                            <YAxis
                                dataKey="url"
                                type="category"
                                stroke={textColor}
                                fontSize={10}
                                width={70}
                                tickFormatter={(val) => val.length > 15 ? val.substring(0, 12) + '...' : val}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="views" 
                                radius={[0, 8, 8, 0]}
                                fill="url(#barGradient)"
                            >
                                {data.topPages.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 4. Category Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl border p-5 lg:p-6 transition-all duration-300 ${cardBg} hover:border-purple-500/30`}
            >
                <h3 className={`text-lg lg:text-xl font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
                    <FolderTree size={22} className="text-purple-500" />
                    Content Mix
                </h3>
                <div className="h-[280px] lg:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.categoryDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis 
                                dataKey="category" 
                                stroke={textColor} 
                                fontSize={11}
                                tick={{ fill: textColor }}
                            />
                            <YAxis stroke={textColor} fontSize={11} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="count" 
                                fill="#ec4899" 
                                radius={[8, 8, 0, 0]}
                                fillOpacity={isDark ? 0.8 : 0.7}
                            >
                                {data.categoryDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* 5. CTA Clicks Bar Chart */}
            {data.ctaStats && data.ctaStats.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`lg:col-span-2 rounded-2xl border p-5 lg:p-6 transition-all duration-300 ${cardBg} hover:border-purple-500/30`}
                >
                    <h3 className={`text-lg lg:text-xl font-bold mb-6 flex items-center gap-2 ${textPrimary}`}>
                        <MousePointer size={22} className="text-purple-500" />
                        Call-to-Action Performance
                    </h3>
                    <div className="h-[280px] lg:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.ctaStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis 
                                    dataKey="buttonId" 
                                    stroke={textColor} 
                                    fontSize={11}
                                    tick={{ fill: textColor }}
                                />
                                <YAxis stroke={textColor} fontSize={11} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="clickCount" 
                                    fill="#10b981" 
                                    radius={[8, 8, 0, 0]}
                                    fillOpacity={isDark ? 0.8 : 0.7}
                                    name="Total Clicks"
                                >
                                    {data.ctaStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {/* No Data State */}
            {(!data.dailyActivity.length && !data.referrers.length) && (
                <div className={`lg:col-span-2 text-center py-12 rounded-2xl border ${cardBg}`}>
                    <TrendingUp size={48} className={`mx-auto mb-3 opacity-30 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
                    <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>No analytics data available yet</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>Start publishing content to see your stats grow!</p>
                </div>
            )}
        </div>
    )
}