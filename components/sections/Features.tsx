'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const features = [
  {
    title: 'AI Writing Assistant',
    description: 'Get intelligent suggestions and improvements for your blog posts',
    icon: '✍️',
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Grammar and style improvements',
      'SEO optimization suggestions',
      'Content structure recommendations',
      'Readability analysis'
    ]
  },
  {
    title: 'Smart Publishing',
    description: 'Schedule and publish your blogs with advanced features',
    icon: '📅',
    color: 'from-green-500 to-emerald-500',
    details: [
      'Auto-scheduling posts',
      'Multi-platform publishing',
      'Draft version control',
      'Collaborative editing'
    ]
  },
  {
    title: 'Reader Engagement',
    description: 'Tools to increase reader interaction and retention',
    icon: '👥',
    color: 'from-purple-500 to-pink-500',
    details: [
      'Reading time estimates',
      'Related posts suggestions',
      'Comment moderation tools',
      'Newsletter integration'
    ]
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your blog performance and reader insights',
    icon: '📊',
    color: 'from-orange-500 to-yellow-500',
    details: [
      'Visitor statistics',
      'Popular content tracking',
      'Reader demographics',
      'Engagement metrics'
    ]
  }
]

const Features = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  return (
    <section id="features" className="relative py-20">
      {/* Fixed Background Container - Only for this section */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900/90"></div>
      </div>

      {/* Content */}
      <div className="max-w-5xl min-h-[600px] h-auto mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Blogging Made </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Simple & Powerful</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to create, manage, and grow your blog. Upload your content and let our platform handle the rest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group h-full"
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              {/* Feature card */}
              <div className="relative bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-6 group-hover:scale-105 transition-transform duration-300`}>
                  <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Details on hover */}
                <div className={`mt-auto transition-all duration-300 overflow-hidden ${activeFeature === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-4 border-t border-gray-700">
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-start text-xs text-gray-300">
                          <span className="mr-2 mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}

export default Features