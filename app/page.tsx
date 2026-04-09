import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import BlogsSection from '@/components/sections/BlogsSection'
import Stats from '@/components/sections/Stats'
import InteractiveAI from '@/components/sections/InteractiveAI'
import CategorySlider from '@/components/sections/CategorySlider'
import AffiliateSection from '@/components/sections/AffiliateSection'

import GlobeStarsBackground from '@/components/ui/GlobeStarsBackground'

export default function Home() {
  return (
    <main className="relative min-h-screen z-10 overflow-hidden">
      <div className="fixed  ">
        <GlobeStarsBackground />
      </div>

      <div className="relative">
        <Hero />
        <Features />

        {/* Lower sections with shared background */}
        {/* <div
        className="relative"
        style={{
          backgroundImage: "url('/bottomsection.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      > */}
        <InteractiveAI />

        <CategorySlider
          autoScrollSpeed={2000} // Faster scrolling (2 seconds)
          pauseOnHover={false}   // Never pause on hover
          showControls={true}    // Show navigation buttons
          showDots={false}       // Hide dot indicators
        />


        {/* <BlogsSection /> */}
        <Stats />
        <AffiliateSection />
        {/* </div> */}
      </div>
    </main>
  )
}