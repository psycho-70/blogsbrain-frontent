'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

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
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 mb-6"
                >
                    <span className="text-xs font-semibold text-violet-300 tracking-wide">✦ {badge} ✦</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-white">{titlePrefix} </span>
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
                className="text-gray-400 max-w-lg mx-auto text-[15px] leading-relaxed"
            >
                {description}
            </motion.p>
        </div>
    )
}

export default ScrollSectionHeader
