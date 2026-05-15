'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface ScrollSectionHeaderProps {
    badge: string
    titlePrefix: string
    titleHighlight: string
    description: string
}

const ScrollSectionHeader = ({
    badge,
    titlePrefix,
    titleHighlight,
    description
}: ScrollSectionHeaderProps) => {
    const targetRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end']
    })
    const { isDark } = useTheme()

    const titleScale = useTransform(scrollYProgress, [0, 1], [1.15, 0.82])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.9, 0.8, 0.6])

    return (
        <div ref={targetRef} className="relative text-center mb-14">
            <motion.div style={{ scale: titleScale, opacity: titleOpacity }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border mb-6 ${
                        isDark 
                            ? 'bg-violet-500/10 border-violet-500/25' 
                            : 'bg-violet-100/80 border-violet-300/50'
                    }`}
                >
                    <span className={`text-xs font-semibold tracking-wide ${
                        isDark ? 'text-violet-300' : 'text-violet-700'
                    }`}>
                        ✦ {badge} ✦
                    </span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {titlePrefix}{' '}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400">
                        {titleHighlight}
                    </span>
                </h2>

                <motion.div
                    className="h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full mx-auto mb-6"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    style={{ width: 64 }}
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className={`max-w-lg mx-auto text-[15px] leading-relaxed ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
            >
                {description}
            </motion.p>
        </div>
    )
}

export default ScrollSectionHeader